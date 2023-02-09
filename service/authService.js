import User from "../models/User.js";
import bcrypt from 'bcryptjs';
import tokenService from "./tokenService.js";
import { AuthDto } from "../dtos/authDto.js";
import ApiError from "../errors/apiError.js";
import Company from "../models/Company.js";
import Todo from "../models/Todo.js";

class AuthService {
  async registration(data, role) {
    // const { data, role } = newUser;
    const {
      firstName,
      patronymic,
      surname,
      birthday,
      mail,
      phone,
      password
    } = data;

    const alreadyExists = await User.findOne({ 'data.mail': mail });

    if (alreadyExists) {
      throw ApiError.BadRequest('User with such email already exists');
    }

    if (!['manager', 'salesman'].includes(role)) {
      throw ApiError.BadRequest('Incorrect role');
    }
    
    const hashedPassword = bcrypt.hashSync(password, 5);

    const user = await User.create({data: {
      firstName,
      patronymic,
      surname,
      birthday,
      mail,
      phone,
      password: hashedPassword
    }, role });
    // const authDto = new AuthDto(user);
    // const tokens = await tokenService.generateTokens({ ...authDto });
    // await tokenService.updateToken(authDto._id, tokens.refreshToken);
    // return { ...tokens, user: authDto };
    return { registration: true, user: { mail, password }};
  }

  async login(mail, password, oldRefreshToken) {
    console.log(oldRefreshToken);
    const user = await User.findOne({ 'data.mail': mail });
    if (!user) {
      throw ApiError.BadRequest('User with such email was not found');
    }
    const passwordIsValid = bcrypt.compare(password, user.data.password);
    if (!passwordIsValid) {
      throw ApiError.BadRequest('Incorrect password');
    }
    const authDto = new AuthDto(user);
    const tokens = await tokenService.generateTokens({ ...authDto });
    await tokenService.updateToken(authDto._id, tokens.refreshToken, oldRefreshToken);
    console.log(tokens);
    return { ...tokens, user: authDto };
  }

  async logout(refreshToken) {
    const token = await tokenService.deleteToken(refreshToken);
    return token;
  }

  async refresh(refreshToken) {
    if (!refreshToken) {
      throw ApiError.UnauthorizedError();
    }
    const userData = tokenService.validateToken(refreshToken, 'refreshToken');
    const dbToken = await tokenService.findToken(refreshToken);
    if (!userData || !dbToken) {
      throw ApiError.UnauthorizedError();
    }
    const user = await User.findById(userData._id);
    const authDto = new AuthDto(user);
    const tokens = await tokenService.generateTokens({ ...authDto });
    await tokenService.updateToken(authDto._id, tokens.refreshToken, refreshToken);
    return { ...tokens, user: authDto };
  }

  async getUsers() {
    const users = await User.find({}, { "data.firstName": 1, "data.patronymic": 1, "data.surname": 1, "data.birthday": 1, "data.mail": 1, "data.phone": 1, "role": 1 }).populate('companies').populate('todos');
    return users;
  }
  async addCompany(company) {
    // const { firstName, patronymic, surname, birthday, mail, phone } = workers;

    // const alreadyExists = await User.findOne({ 'data.mail': mail });

    // if (alreadyExists) {
    //   throw ApiError.BadRequest('User with such email already exists');
    // }

    const companyData = await Company.create(company);
    return { addCompany: true, companyData};
  }

  async getCompanies() {
    const companies = await Company.find().populate({ path: 'users', select: 'data.surname data.mail role' }).populate('todos');
    return companies;
  }

  async addTodo(todo) {
    // const { firstName, patronymic, surname, birthday, mail, phone } = workers;

    // const alreadyExists = await User.findOne({ 'data.mail': mail });

    // if (alreadyExists) {
    //   throw ApiError.BadRequest('User with such email already exists');
    // }
    const [ year, month, rest ] = todo.data.startTime.split('-');
    const [ day ] = rest.split('T');

    const todoData = await Todo.create({
      ...todo,
      extra: { year, month, day },
    });
    return { addTodo: true, todoData};
  }

  async getTodos(queryParams) {
    let [ year, month, day ] = queryParams.date ? queryParams.date.split('-') : '';

    if (queryParams.range === 'month') {
      const today = new Date();
      year = year || today.getFullYear().toString();
      month = month || (today.getMonth() + 1).toString().padStart(2, '0');
      const dayToday = today.getDate().toString().padStart(2, '0');
      const todos = await Todo.aggregate([
        { $match: { 'extra.year': year, 'extra.month': month } },
        { $group: {_id: { day: '$extra.day', isDone: '$isDone' }, count: { $sum: 1 } } },
      ]);
      const daysInThisMonth = new Date(year, month, 0).getDate();
      const todosByDays = Array(daysInThisMonth).fill().map((_) => {
        return { complete: 0, future: 0, missed: 0 };
      });
      todos.forEach((todo) => {
        if (todo._id.isDone) {
          todosByDays[todo._id.day - 1].complete = todo.count;
          return;
        }
        if (+todo._id.day < +dayToday) {
          todosByDays[todo._id.day - 1].missed = todo.count;
          return;
        }
        todosByDays[todo._id.day - 1].future = todo.count;
        return;
      });
      return todosByDays;
    }

    const todos = await Todo.find({}, { data: 1, isDone: 1 })
    .populate({ path: 'users', select: 'data.surname data.mail role' })
    .populate({ path: 'company', select: 'data.companyName contacts.workers.firstName contacts.workers.patronymic contacts.workers.surname' });
    return todos;
  }
}

const authService = new AuthService();

export default authService;
