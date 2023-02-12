import User from "../models/User.js";
import bcrypt from 'bcryptjs';
import tokenService from "./tokenService.js";
import { AuthDto } from "../dtos/authDto.js";
import ApiError from "../errors/apiError.js";
import Company from "../models/Company.js";
import Todo from "../models/Todo.js";

// const validateInn = async (inn) => {
//   const innAlreadyExists = await Company.findOne({ 'data.inn': inn });
//   if (innAlreadyExists) {
//     throw ApiError.BadRequest('A company with such an INN already exists');
//   }
// };

// const validateMail = async (mail) => {
//   const mailAlreadyExists = await Company.findOne({ 'contacts.commonMail': mail });
//   if (mailAlreadyExists) {
//     throw ApiError.BadRequest('A company with such an email already exists');
//   }
// };

class ClientsService {

  async addClient(client, companyId) {
    const company = await Company.findById(companyId);
    if (!company) {
      throw ApiError.NotFoundError('Company not found');
    }
    company.contacts.workers.push(client);
    company.save();
    return { newClient: client };
  }

  async updateClient(client, id) {
    const company = await Company.findOne({ 'contacts.workers.*._id': id });
    if (!company) {
      throw ApiError.NotFoundError('Client not found');
    }
    const worker = company.contacts.workers.filter((worker) => worker._id.toString() === id)[0];
    const updatedWorker = {
      firstName: worker.firstName,
      patronymic: worker.patronymic,
      surname: worker.surname,
      birthday: worker.birthday,
      mail: worker.mail,
      phone: worker.phone,
      _id: worker._id,
      ...client,
    };
    company.contacts.workers = company.contacts.workers.filter((worker) => worker._id.toString() !== id);
    company.contacts.workers.push(updatedWorker);
    company.save();
    return { updatedWorker };
  }

  async deleteClient(id) {
    const company = await Company.findOne({ 'contacts.workers.*._id': id });
    if (!company) {
      throw ApiError.NotFoundError('Client not found');
    }
    const deletedWorker = company.contacts.workers.filter((worker) => worker._id.toString() === id);
    company.contacts.workers = company.contacts.workers.filter((worker) => worker._id.toString() !== id);
    company.save();
    return { deletedWorker };
  }

  async getClients(_id, role) {
    const companies = (role === 'admin' || role === 'manager')
      ? await Company.find({ archived: false }, { archived: 0 })
        .populate({ path: 'users', select: 'data.surname data.mail' })
      : await Company.find({ users: _id, archived: false }, { archived: 0 })
        .populate({ path: 'users', select: 'data.surname data.mail' });

    const clients = [];
    companies.forEach((company) => {
      company.contacts.workers.forEach((worker) => {
        clients.push({
          firstName: worker.firstName,
          patronymic: worker.patronymic,
          surname: worker.surname,
          birthday: worker.birthday,
          mail: worker.mail,
          phone: worker.phone,
          _id: worker._id,
          companyName: company.data.companyName,
          companyId: company._id,
          users: company.users,
        });
      });
    });
    clients.sort((a, b) => a.surname - b.surname);
    return clients;
  }

}

const clientsService = new ClientsService();

export default clientsService;
