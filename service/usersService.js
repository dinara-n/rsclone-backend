import User from "../models/User.js";
import Company from '../models/Company.js';
import bcrypt from 'bcryptjs';
import tokenService from "./tokenService.js";
import { AuthDto } from "../dtos/authDto.js";
import ApiError from "../errors/apiError.js";

const validateMail = async (mail, id) => {
  const alreadyExists = (id) ? await User.findOne({ 'data.mail': mail, _id: { $ne: id } }) : await User.findOne({ 'data.mail': mail });
  if (alreadyExists) {
    throw ApiError.BadRequest('User with such email already exists');
  }
};

const validateRole = (role) => {
  if (!['manager', 'salesman'].includes(role)) {
    throw ApiError.BadRequest(`Incorrect role. Allowed roles are 'manager' and 'salesman'`);
  }
};

class UsersService {

  async addUser(user) {
    const { data, role } = user;
    const { mail, password } = data;

    await validateMail(mail);
    validateRole(role);
    
    const hashedPassword = bcrypt.hashSync(password, 5);

    await User.create({ ...user, 'data.password': hashedPassword, archived: false });
    return { newUser: user };
  }

  async updateUser(user, id) {
    const { data, role, settings } = user;
    const mail = data?.mail ?? undefined;
    const password = data?.password ?? undefined;

    const oldUser = await User.findById(id);
    if (!oldUser) {
      throw ApiError.NotFoundError('User not found');
    }

    if (mail && mail !== oldUser.data.mail) {
      await validateMail(mail, id);
    }

    if (role) {
      validateRole(role);
    }

    if (data?.firstName) oldUser.data.firstName = data.firstName;
    if (data && data.patronymic !== undefined) oldUser.data.patronymic = data.patronymic;
    if (data?.surname) oldUser.data.surname = data.surname;
    if (data?.birthday) oldUser.data.birthday = data.birthday;
    if (data?.mail) oldUser.data.mail = data.mail;
    if (data?.phone) oldUser.data.phone = data.phone;
    if (data?.password) oldUser.data.password = bcrypt.hashSync(password, 5);
    if (role) {
      if (oldUser.role === 'admin') {
        throw ApiError.BadRequest('Incorrect role. Cannot change admin\'s role');
      }
      oldUser.role = role;
    }
    if (settings?.language) oldUser.settings.language = settings.language;
    
    await oldUser.save();
    return { updatedData: { ...user, _id: oldUser._id } };
  }

  async deleteUser(id) {

    const companies = await Company.findOne({ users: id });
    if (companies) {
      throw ApiError.BadRequest('Cannot delete user while he has companies');
    }

    const user = await User.findOne({ _id: id });
    if (user.role === 'admin') {
      throw ApiError.BadRequest('Cannot delete admin');
    }

    const deletedUser = await User.findByIdAndUpdate(id, { $set: { archived: true } });
    if (!deletedUser) {
      throw ApiError.NotFoundError('User not found');
    }
    await tokenService.deleteUserTokens(id);
    return { deletedUser };
  }

  async undeleteUser(id, user) {
    if (user.archived) {
      return { undeleteUser: false, user };
    }
    const undeletedUser = await User.findByIdAndUpdate(id, { $set: { archived: false } });
    if (!undeletedUser) {
      throw ApiError.NotFoundError('User not found');
    }
    return { undeletedUser };
  }

  async getUsers(queryArchived) {
    const archived = (queryArchived === 'true') ? true : false;
    const users = await User
      .find({ archived, role: { $ne: "admin" } }, { "data.firstName": 1, "data.patronymic": 1, "data.surname": 1, "data.birthday": 1, "data.mail": 1, "data.phone": 1, "role": 1 })
      .populate({ path: 'companies', select: '_id users data.companyName workers.*.firstName workers.*.surname workers.*._id' })
      .populate({ path: 'todos', select: '_id isDone company users data extra' });
    return users;
  }

  async getProfile(id) {
    const user = await User.findById(id, { "archived": 0 });
    return {
      data: {
        firstName: user.data.firstName,
        patronymic: user.data.patronymic,
        surname: user.data.surname,
        birthday: user.data.birthday,
        mail: user.data.mail,
        phone: user.data.phone,
      },
      _id: user._id,
      role: user.role,
      settings: user.settings,
    };
  }

  async updateProfile(user, id, confirmedRole) {
    const { data, role, settings } = user;
    const mail = data?.mail ?? undefined;
    const password = data?.password ?? undefined;

    if (confirmedRole === 'salesman' && (role || data?.firstName || data?.patronymic || data?.surname || data?.birthday)) {
      throw ApiError.BadRequest('Salesman is only allowed to change email, phone, password, language');
    }

    if (mail) {
      await validateMail(mail, id);
    }

    if (role) {
      validateRole(role);
    }

    const oldUser = await User.findById(id);
    // if (!oldUser) {
    //   throw ApiError.NotFoundError('User not found');
    // }
    if (data?.firstName) oldUser.data.firstName = data.firstName;
    if (data && data.patronymic !== undefined) oldUser.data.patronymic = data.patronymic;
    if (data?.surname) oldUser.data.surname = data.surname;
    if (data?.birthday) oldUser.data.birthday = data.birthday;
    if (data?.mail) oldUser.data.mail = data.mail;
    if (data?.phone) oldUser.data.phone = data.phone;
    if (data?.password) oldUser.data.password = bcrypt.hashSync(password, 5);
    if (role) {
      if (oldUser.role === 'admin' && role !== 'admin') {
        throw ApiError.BadRequest('Incorrect role. Cannot change admin\'s role');
      }
      oldUser.role = role;
    }
    if (settings?.language) oldUser.settings.language = settings.language;
    
    await oldUser.save();
    return oldUser;
  }
}

const usersService = new UsersService();

export default usersService;
