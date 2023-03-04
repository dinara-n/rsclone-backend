// import User from "../models/User.js";
// import bcrypt from 'bcryptjs';
// import jwt from 'jsonwebtoken';
import { validationResult } from 'express-validator';
import usersService from "../service/usersService.js";
import ApiError from "../errors/apiError.js";
import emitter from '../emitter/emitter.js';

const handleValidationErrors = (req, next, message) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return next(ApiError.BadRequest(message, errors.array()));
  }
};

const emitUsersUpdate = async () => {
  const users = await usersService.getUsers();
  emitter.emit('update', JSON.stringify({ users }));
};

const emitProfileUpdate = async (id) => {
  const profile = await usersService.getProfile(id);
  emitter.emit('update', JSON.stringify({ profile }));
};

class UsersController {
  async addUser(req, res, next) {
    try {
      handleValidationErrors(req, next, 'Registration error');
      const user = req.body;
      const userData = await usersService.addUser(user);
      emitUsersUpdate();
      return res.status(201).json(userData);
    } catch (err) {
      console.log('err');
      next(err);
    }
  }

  async updateUser(req, res, next) {
    try {
      handleValidationErrors(req, next, 'Update error');
      const user = req.body;
      const id = req.params.id;
      const userData = await usersService.updateUser(user, id);
      emitUsersUpdate();
      // emitProfileUpdate(id);
      return res.json(userData);
    } catch (err) {
      console.log('err');
      next(err);
    }
  }

  async deleteUser(req, res, next) {
    try {
      handleValidationErrors(req, next, 'Deletion error');
      const id = req.params.id;
      const userData = await usersService.deleteUser(id);
      emitUsersUpdate();
      return res.json(userData);
    } catch (err) {
      console.log('err');
      next(err);
    }
  }

  async undeleteUser(req, res, next) {
    try {
      handleValidationErrors(req, next, 'User restoration error');
      const id = req.params.id;
      const user = req.body;
      const userData = await usersService.undeleteUser(id, user);
      emitUsersUpdate();
      return res.json(userData);
    } catch (err) {
      console.log('err');
      next(err);
    }
  }

  async getUsers(req, res, next) {
    try {
      const archived = req.query.archived;
      const users = await usersService.getUsers(archived);
      // res.json(users);
      res.status(200).json(users);
    } catch (err) {
      console.log(err);
      // next(err);
      res.status(err.statusCode).json(err);
    }
  }

  async getProfile(req, res, next) {
    try {
      const { _id } = req.user;
      const userData = await usersService.getProfile(_id);
      res.json(userData);
    } catch (err) {
      console.log(err);
      next(err);
    }
  }

  async updateProfile(req, res, next) {
    try {
      handleValidationErrors(req, next, 'Update error');
      const user = req.body;
      // const id = req.params.id;
      const { _id, role } = req.user;
      const userData = await usersService.updateProfile(user, _id, role);
      emitUsersUpdate();
      // emitProfileUpdate(_id);
      return res.json(userData);
    } catch (err) {
      console.log('err');
      next(err);
    }
  }
}

const usersController = new UsersController();

export default usersController;
