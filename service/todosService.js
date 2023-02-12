import Company from "../models/Company.js";
import bcrypt from 'bcryptjs';
import tokenService from "./tokenService.js";
import { AuthDto } from "../dtos/authDto.js";
import ApiError from "../errors/apiError.js";
import Todo from "../models/Todo.js";

class TodosService {

  async addTodo(todo) {
    const company = await Company.findOne({ _id: todo.company });
    if (!company) {
      throw ApiError.BadRequest('Wrong company id');
    }

    const [ year, month, rest ] = todo.data.startTime.split('-');
    const [ day ] = rest.split('T');

    const todoData = await Todo.create({
      ...todo,
      users: company.users,
      extra: { year, month, day },
    });
    return { newTodo: todoData};
  }

  async updateTodo(todo, id) {
    const { data, isDone, company } = todo;

    const oldTodo = await Todo.findById(id);
    if (!oldTodo) {
      throw ApiError.NotFoundError('Todo not found');
    }

    if (data?.type) oldTodo.data.type = data.type;
    if (data?.startTime) {
      oldTodo.data.startTime = data.startTime;
      const [ year, month, rest ] = todo.data.startTime.split('-');
      const [ day ] = rest.split('T');
      oldTodo.extra = { year, month, day };
    }
    if (data?.endTime) oldTodo.data.endTime = data.endTime;
    if (data?.title) oldTodo.data.title = data.title;
    if (data?.text) oldTodo.data.text = data.text;
    if (isDone) oldTodo.isDone = isDone;
    if (company) {
      oldTodo.company = company;
      const companyData = await Company.findOne({ id: company });
      oldTodo.users = companyData.users;
    }
    
    await oldTodo.save();
    return { updatedData: todo };
  }

  // async deleteTodo(id) {
  //   // if (!id) {
  //   //   throw ApiError.BadRequest('Needs id to delete todo');
  //   // }

  //   const todo = await Todo.findById(id);
  //   if (!todo) {
  //     throw ApiError.NotFoundError('Todo not found');
  //   }
  //   const now = new Date();
  //   const todoEndDate = new Date(todo.data.endTime);
  //   if (todoEndDate < now) {
  //     throw ApiError.BadRequest('Cannot delete past todo');
  //   }
  //   const deletedTodo = await Todo.findByIdAndDelete(id);
  //   return { deletedTodo };
  // }

  async getTodos(queryParams) {
    let [ year, month, day ] = queryParams.date ? queryParams.date.split('-') : '';

    if (month && !(month > 0 && month <= 12) || year && isNaN(year)) {
      throw ApiError.BadRequest('Incorrect date');
    }

    if (queryParams.range === 'month') {
      const now = new Date();
      if (!month || !year) {
        year = now.getFullYear().toString();
        month = (now.getMonth() + 1).toString().padStart(2, '0');
      }
      const dayToday = now.getDate();
      const monthToday = now.getMonth() + 1;
      const yearToday = now.getFullYear();
      const todos = await Todo.aggregate([
        { $match: { 'extra.year': year, 'extra.month': month } },
        { $group: {_id: { day: '$extra.day', isDone: '$isDone' }, count: { $sum: 1 } } },
      ]);
      const daysInMonth = new Date(year, month, 0).getDate();
      const todosByDays = Array(daysInMonth).fill().map((_) => {
        return { complete: 0, future: 0, missed: 0 };
      });
      todos.forEach((todo) => {
        const day = +todo._id.day;
        if (todo._id.isDone) {
          todosByDays[day - 1].complete = todo.count;
          return;
        }
        if ((year == yearToday && month == monthToday && day < dayToday)
          || (year == yearToday && month < monthToday)
          || (year < yearToday)) {
          todosByDays[day - 1].missed = todo.count;
          return;
        }
        todosByDays[day - 1].future = todo.count;
        return;
      });
      return todosByDays;
    }

    if (queryParams.range === 'day') {
      const daysInMonth = new Date(year, month, 0).getDate();
  
      if (day && !(day > 0 && day <= daysInMonth)) {
        throw ApiError.BadRequest('Incorrect date');
      }
      if (!day || !month || !year) {
        const now = new Date();
        day = now.getDate().toString();
        year = now.getFullYear().toString();
        month = (now.getMonth() + 1).toString().padStart(2, '0');
      }

      const todosFormDB = await Todo.find({ 'extra.day': day, 'extra.month': month, 'extra.year': year }, { data: 1, isDone: 1 })
        .populate({ path: 'users', select: 'data.surname data.mail role' })
        .populate({ path: 'company', select: 'data.companyName contacts.workers.firstName contacts.workers.patronymic contacts.workers.surname contacts.workers._id' });

      const todos = todosFormDB.map((todo) => {
        const start = new Date(todo.data.startTime).getTime();
        const end = new Date(todo.data.endTime).getTime();
        // return { data: todo.data, isDone: todo.isDone, start, end, users: todo.users, company: todo.company };
        return { _id: todo._id, start, end };
      });

      const sortedTodos = todos.sort((a, b) => {
        if (a.start === b.start) {
          return a.end - b.end;
        }
        return a.start - b.start;
      });

      const columns = [];
      let columnsNumber = 0;
      let maxColumnsNumber = 0;

      sortedTodos.forEach((todo) => {
        const prevTodosComplete = columns.length && columns.every((item) => item.end <= todo.start);
        if (prevTodosComplete) {
          columns.length = 0;
          columnsNumber = 1;
          columns.push({ end: todo.end, column: columnsNumber });
          todo.column = columnsNumber;
          return;
        }

        columns.sort((a, b) => {
          if (a.end !== b.end) {
            return a.end - b.end;
          }
          return a.column - b.column;
        });

        const freeColumnIndex = columns.findIndex((item) => item.end <= todo.start);
        if (freeColumnIndex !== -1) {
          columns[freeColumnIndex].end = todo.end;
          todo.column = columns[freeColumnIndex].column;
          return;
        } else {
          columnsNumber += 1;
          maxColumnsNumber = (columnsNumber > maxColumnsNumber) ? columnsNumber : maxColumnsNumber;
          columns.push({ end: todo.end, column: columnsNumber });
          todo.column = columnsNumber;
          return;
        }
      });
      return { todos: todosFormDB, todosPlacement: sortedTodos, columnsNumber: maxColumnsNumber };
    }

    const todos = await Todo.find({}, { data: 1, isDone: 1 })
    .populate({ path: 'users', select: 'data.surname data.mail role' })
    .populate({ path: 'company', select: 'data.companyName contacts.workers.firstName contacts.workers.patronymic contacts.workers.surname' });
    return todos;
  }
}

const todosService = new TodosService();

export default todosService;
