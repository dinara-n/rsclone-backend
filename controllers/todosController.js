// import bcrypt from 'bcryptjs';
// import jwt from 'jsonwebtoken';
import { validationResult } from 'express-validator';
// import secretAccessKey from './config.js';
import todosService from "../service/todosService.js";
import ApiError from "../errors/apiError.js";

class TodosController {

  async addTodo(req, res, next) {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return next(ApiError.BadRequest('Error when adding todo', errors.array()));
      }
      const todo = req.body;
      const todoData = await todosService.addTodo(todo);
      return res.status(201).json(todoData);
    } catch (err) {
      console.log('err');
      next(err);
    }
  }

  async updateTodo(req, res, next) {
    try {
      const todo = req.body;
      const id = req.params.id;
      const todoData = await todosService.updateTodo(todo, id);
      return res.json(todoData);
    } catch (err) {
      console.log('err');
      next(err);
    }
  }

  async getTodo(req, res, next) {
    try {
      const id = req.params.id;
      const todoData = await todosService.getTodo(id);
      return res.json(todoData);
    } catch (err) {
      console.log('err');
      next(err);
    }
  }

  // async deleteTodo(req, res, next) {
  //   try {
  //     const errors = validationResult(req);
  //     if (!errors.isEmpty()) {
  //       return next(ApiError.BadRequest('Error when deleting todo', errors.array()));
  //     }
  //     const id = req.params.id;

  //     const todoData = await todosService.deleteTodo(id);
  //     return res.json(todoData);
  //   } catch (err) {
  //     console.log('err');
  //     next(err);
  //   }
  // }

  async getTodos(req, res, next) {
    try {
      const queryParams = req.query;
      const { _id, role } = req.user;
      const todos = await todosService.getTodos(queryParams, _id, role);
      res.json(todos);
    } catch (err) {
      console.log(err);
      next(err);
    }
  }
}

const todosController = new TodosController();

export default todosController;
