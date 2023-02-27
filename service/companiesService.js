import User from "../models/User.js";
import bcrypt from 'bcryptjs';
import tokenService from "./tokenService.js";
import { AuthDto } from "../dtos/authDto.js";
import ApiError from "../errors/apiError.js";
import Company from "../models/Company.js";
import Todo from "../models/Todo.js";

const validateInn = async (inn, id) => {
  const innAlreadyExists = (id) ? await Company.findOne({ 'data.inn': inn, _id: { $ne: id } }) : await Company.findOne({ 'data.inn': inn });
  if (innAlreadyExists) {
    throw ApiError.BadRequest('A company with such an INN already exists');
  }
};

const validateMail = async (mail, id) => {
  const mailAlreadyExists = (id) ? await Company.findOne({ 'contacts.commonMail': mail, _id: { $ne: id } }) : Company.findOne({ 'contacts.commonMail': mail });
  if (mailAlreadyExists) {
    throw ApiError.BadRequest('A company with such an email already exists');
  }
};

class CompaniesService {

  async addCompany(company, userId, role) {

    if (!company?.contacts?.commonPhone) {
      throw ApiError.BadRequest('Company\'s phone number is required');
    }

    if (company?.data?.inn) {
      await validateInn(company.data.inn);
    }

    // if (company?.contacts?.commonMail) {
    //   await validateMail(company.contacts.commonMail);
    // }

    // const users = (company?.users) ? company.users.map(async (user) => await User.findById(user)) : [];
    // console.log(users);
    // const hasActiveUsers = users.reduce((activeUsers, user) => {
    //   if (!user.archived) return true;
    // });
    // if (users.length === 0 || !hasActiveUsers) {
    //   throw ApiError.BadRequest('No active users specified');
    // }
    if (!company.users && role !== 'admin') {
      company.users = [userId];
    }

    if (!company.users && role === 'admin') {
      throw ApiError.BadRequest('Admin cannot be appointed to a company. Please add a user to work with the company');
    }

    const companyData = await Company.create({ ...company, archived: false });
    return { newCompany: companyData };
  }

  async updateCompany(company, id, userRole) {
    const { data, contacts, users } = company;

    let updateTodos = false;

    const oldCompany = await Company.findById(id);
    if (!oldCompany) {
      throw ApiError.NotFoundError('Company not found');
    }
    if (data?.inn) {
      await validateInn(data.inn, id);
    }
    if (contacts?.commonMail) {
      await validateMail(contacts.commonMail, id);
    }
    if (data?.companyName) oldCompany.data.companyName = data.companyName;
    if (data && data.inn !== undefined) oldCompany.data.inn = data.inn;
    if (data && data.address !== undefined) oldCompany.data.address = data.address;
    if (contacts && contacts.commonPhone !== undefined) oldCompany.contacts.commonPhone = contacts.commonPhone;
    if (contacts && contacts.commonMail !== undefined) oldCompany.contacts.commonMail = contacts.commonMail;
    contacts?.workers?.forEach((worker, index) => {
      if (worker) {
        if (worker.firstName !== undefined) oldCompany.contacts.workers[index].firstName = worker.firstName;
        if (worker.patronymic !== undefined) oldCompany.contacts.workers[index].patronymic = worker.patronymic;
        if (worker.surname !== undefined) oldCompany.contacts.workers[index].surname = worker.surname;
        if (worker.birthday !== undefined) oldCompany.contacts.workers[index].birthday = worker.birthday;
        if (worker.mail !== undefined) oldCompany.contacts.workers[index].mail = worker.mail;
        if (worker.phone !== undefined) oldCompany.contacts.workers[index].phone = worker.phone;
      }
    });
    if (users) {
      if (!['admin', 'manager'].includes(userRole)) {
        throw ApiError.ForbiddenError('Salesman cannot assign users to companies');
      }
      oldCompany.users = users;
      updateTodos = true;
    }
    
    await oldCompany.save();
    if (updateTodos) {
      await Todo.updateMany({ company: id }, { $set: { users: oldCompany.users } });
    }
    return { updatedData: company };
  }

  async deleteCompany(id) {
    const deletedCompany = await Company.findByIdAndUpdate(id, { $set: { archived: true } });
    // const deletedTodos = await Todo.findOneAndDelete({ company: id });
    if (!deletedCompany) {
      throw ApiError.NotFoundError('Company not found');
    }
    return { deletedCompany };
  }

  async undeleteCompany(id, company) {
    if (company.archived) {
      return { undeleteCompany: false, company };
    }
    const undeleteCompany = await Company.findByIdAndUpdate(id, { $set: { archived: false } });
    if (!undeleteCompany) {
      throw ApiError.NotFoundError('Company not found');
    }
    return { undeleteCompany };
  }

  async getCompanies(queryArchived, _id, role) {
    const archived = (queryArchived === 'true') ? true : false;
    const companies = (role === 'admin' || role === 'manager')
      ? await Company.find({ archived }, { archived: 0 })
        .populate({ path: 'users', select: 'data.surname data.mail role', match: { archived: false } })
        .populate('todos')
      : await Company.find({ users: _id, archived }, { archived: 0 })
      .populate({ path: 'users', select: 'data.surname data.mail role', match: { archived: false } })
      .populate({ path: 'todos' });
    return companies;
  }

}

const companiesService = new CompaniesService();

export default companiesService;
