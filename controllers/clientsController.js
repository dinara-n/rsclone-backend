import User from "../models/User.js";
// import bcrypt from 'bcryptjs';
// import jwt from 'jsonwebtoken';
import { validationResult } from 'express-validator';
import clientsService from "../service/clientsService.js";
import ApiError from "../errors/apiError.js";

// const handleValidationErrors = (req, next, message) => {
//   const errors = validationResult(req);
//   if (!errors.isEmpty()) {
//     return next(ApiError.BadRequest(message, errors.array()));
//   }
// };

class ClientsController {

  async addClient(req, res, next) {
    try {
      const { contact, companyId } = req.body;
      const companyData = await clientsService.addClient(contact, companyId);
      return res.status(201).json(companyData);
    } catch (err) {
      console.log('err');
      next(err);
    }
  }

  async updateClient(req, res, next) {
    try {
      const contact = req.body;
      const id = req.params.id;
      const companyData = await clientsService.updateClient(contact, id);
      return res.json(companyData);
    } catch (err) {
      console.log('err');
      next(err);
    }
  }

  async deleteClient(req, res, next) {
    try {
      const id = req.params.id;
      const companyData = await clientsService.deleteClient(id);
      return res.json(companyData);
    } catch (err) {
      console.log('err');
      next(err);
    }
  }

  async getClients(req, res, next) {
    try {
      const { _id, role } = req.user;
      const companies = await clientsService.getClients(_id, role);
      res.json(companies);
    } catch (err) {
      console.log(err);
      next(err);
    }
  }
  
}

const clientsController = new ClientsController();

export default clientsController;
