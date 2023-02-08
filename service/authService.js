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

    const todoData = await Todo.create(todo);
    return { addTodo: true, todoData};
  }

  async getTodos() {
    const todos = await Todo.find().populate({ path: 'users', select: 'data.surname data.mail role' }).populate({ path: 'company', select: 'data.companyName contacts.workers' });
    return todos;
  }
}

const authService = new AuthService();

export default authService;
