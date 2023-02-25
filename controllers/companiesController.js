import User from "../models/User.js";
// import bcrypt from 'bcryptjs';
// import jwt from 'jsonwebtoken';
import { validationResult } from 'express-validator';
import companiesService from "../service/companiesService.js";
import ApiError from "../errors/apiError.js";
import emitter from "../emitter/emitter.js";

const handleValidationErrors = (req, next, message) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return next(ApiError.BadRequest(message, errors.array()));
  }
};

const emitCompaniesUpdate = async (_id, role) => {
  const archived = false;
  const clients = await companiesService.getCompanies(archived, _id, role);
  console.log(clients);
  emitter.emit('update', JSON.stringify({ clients }));
};

class CompaniesController {

  async addCompany(req, res, next) {
    try {
      handleValidationErrors(req, next, 'Error while adding company');
      const company = req.body;
      const userId = req.user?._id || null;
      const { role } = req.user;
      const companyData = await companiesService.addCompany(company, userId);
      emitCompaniesUpdate(userId, role);
      return res.status(201).json(companyData);
    } catch (err) {
      console.log('err');
      next(err);
    }
  }

  async updateCompany(req, res, next) {
    try {
      handleValidationErrors(req, next, 'Error while updating company');
      const company = req.body;
      const id = req.params.id;
      const { role } = req.user;
      const companyData = await companiesService.updateCompany(company, id, role);
      emitCompaniesUpdate(id, role);
      return res.json(companyData);
    } catch (err) {
      console.log('err');
      next(err);
    }
  }

  async deleteCompany(req, res, next) {
    try {
      const id = req.params.id;
      const { role } = req.user;
      const companyData = await companiesService.deleteCompany(id);
      emitCompaniesUpdate(id, role);
      return res.json(companyData);
    } catch (err) {
      console.log('err');
      next(err);
    }
  }

  async undeleteCompany(req, res, next) {
    try {
      const id = req.params.id;
      const { role } = req.user;
      const company = req.body;
      const companyData = await companiesService.undeleteCompany(id, company);
      emitCompaniesUpdate(id, role);
      return res.json(companyData);
    } catch (err) {
      console.log('err');
      next(err);
    }
  }

  async getCompanies(req, res, next) {
    try {
      const archived = req.query.archived;
      const { _id, role } = req.user;
      const companies = await companiesService.getCompanies(archived, _id, role);
      res.json(companies);
    } catch (err) {
      console.log(err);
      next(err);
    }
  }
  
}

const companiesController = new CompaniesController();

export default companiesController;
