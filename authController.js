import User from "./models/User.js";
// import bcrypt from 'bcryptjs';
// import jwt from 'jsonwebtoken';
import { validationResult } from 'express-validator';
// import secretAccessKey from './config.js';
import authService from "./service/authService.js";
import ApiError from "./errors/apiError.js";

// const generateAccessToken = (id, role) => {
//   const payload = { id, role };
//   return jwt.sign(payload, secretAccessKey, { expiresIn: '24h' });
// }
const fifteenDaysInMs = 15 * 24 * 60 * 60 * 1000;

class AuthController {
  async registration(req, res, next) {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        // return res.status(400).json({ message: 'Registration error', errors});
        return next(ApiError.BadRequest('Registration error', errors.array()));
      }
      const { data, role } = req.body;
      const userData = await authService.registration(data, role);
      // res.cookie('refreshToken', userData.refreshToken, { maxAge: fifteenDaysInMs, httpOnly: true });
      return res.json(userData);
    } catch (err) {
      console.log('err');
      // res.status(400).json({ message: 'Registration error'});
      next(err);
    }
  }

  async login(req, res, next) {
    try {
      const { mail, password } = req.body;
      const oldRefreshToken = req.cookies.refreshToken;
      console.log(oldRefreshToken);
      const userData = await authService.login(mail, password, oldRefreshToken);
      res.cookie('refreshToken', userData.refreshToken, { maxAge: fifteenDaysInMs, httpOnly: true });
      return res.json(userData);
    } catch (err) {
      console.log(err);
      res.status(400).json({ message: 'Login error'});
    }
  }

  async logout(req, res, next) {
    try {
      const { refreshToken } = req.cookies;
      await authService.logout(refreshToken);
      res.clearCookie('refreshToken');
      return res.json({ logout: true });
    } catch (err) {
      console.log(err);
      next(err);
    }
  }

  async refresh(req, res, next) {
    try {
      const { refreshToken } = req.cookies;
      const userData = await authService.refresh(refreshToken);
      res.cookie('refreshToken', userData.refreshToken, { maxAge: fifteenDaysInMs, httpOnly: true });
      return res.json(userData);
    } catch (err) {
      console.log(err);
      next(err);
    }
  }

  async getUsers(req, res, next) {
    try {
      const users = await authService.getUsers();
      res.json(users);
    } catch (err) {
      console.log(err);
      next(err);
    }
  }

  async addCompany(req, res, next) {
    try {
      // const errors = validationResult(req);
      // if (!errors.isEmpty()) {
      //   return next(ApiError.BadRequest('Registration error', errors.array()));
      // }
      const company = req.body;
      const companyData = await authService.addCompany(company);
      return res.json(companyData);
    } catch (err) {
      console.log('err');
      next(err);
    }
  }

  async getCompanies(req, res, next) {
    try {
      const companies = await authService.getCompanies();
      res.json(companies);
    } catch (err) {
      console.log(err);
      next(err);
    }
  }

  async addTodo(req, res, next) {
    try {
      // const errors = validationResult(req);
      // if (!errors.isEmpty()) {
      //   return next(ApiError.BadRequest('Registration error', errors.array()));
      // }
      const todo = req.body;
      const todoData = await authService.addTodo(todo);
      return res.json(todoData);
    } catch (err) {
      console.log('err');
      next(err);
    }
  }

  async getTodos(req, res, next) {
    try {
      const queryParams = req.query;
      const todos = await authService.getTodos(queryParams);
      res.json(todos);
    } catch (err) {
      console.log(err);
      next(err);
    }
  }
}

const authController = new AuthController();

export default authController;
