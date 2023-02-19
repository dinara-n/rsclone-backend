// import User from "../models/User.js";
// import bcrypt from 'bcryptjs';
// import jwt from 'jsonwebtoken';
import { validationResult } from 'express-validator';
import usersService from "../service/usersService.js";
import ApiError from "../errors/apiError.js";
import companiesService from '../service/companiesService.js';
import clientsService from '../service/clientsService.js';

const handleValidationErrors = (req, next, message) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return next(ApiError.BadRequest(message, errors.array()));
  }
};

class DataController {

  async getData(req, res, next) {
    try {
      const { _id, role } = req.user;
      const archived = false;
      const profile = await usersService.getProfile(_id);
      const companies = await companiesService.getCompanies(archived, _id, role);
      const clients = await clientsService.getClients(_id, role);
      let users = [];
      if (role === 'admin' || role === 'manager') {
        users = await usersService.getUsers();
      }
      res.json({ profile, clients: companies, contacts: clients, users });
    } catch (err) {
      console.log(err);
      next(err);
    }
  }
}

const dataController = new DataController();

export default dataController;
