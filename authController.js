import User from "./models/User.js";
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { validationResult } from 'express-validator';
import secretAccessKey from './config.js';

const generateAccessToken = (id, role) => {
  const payload = { id, role };
  return jwt.sign(payload, secretAccessKey, { expiresIn: '24h' });
}

class AuthController {
  async registration(req, res) {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ message: 'Registration error', errors});
      }
      const { data, role } = req.body;
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
        return res.status(400).json({ message: 'User with such email already exists'});
      }
      const hashedPassword = bcrypt.hashSync(password, 5);
      if (role !== 'admin' && role!== 'manager' && role !== 'salesman') {
        throw new Error('Incorrect role');
      }
      const user = new User({data: {
        firstName,
        patronymic,
        surname,
        birthday,
        mail,
        phone,
        password: hashedPassword
      }, role });
      console.log(user);
      await user.save();
      return res.json({ authorization: true });
    } catch (err) {
      console.log('err');
      res.status(400).json({ message: 'Registration error'});
    }
  }
  async login(req, res) {
    try {
      const { mail, password } = req.body;
      const user = await User.findOne({ 'data.mail': mail });
      if (!user) {
        return res.status(400).json({ message: 'User with such email is not found'});
      }
      const passwordIsValid = bcrypt.compareSync(password, user.data.password);
      if (!passwordIsValid) {
        return res.status(400).json({ message: 'Password is incorrect'});
      }
      const token = generateAccessToken(user._id, user.role);
      return res.json({ token });
    } catch (err) {
      console.log(err);
      res.status(400).json({ message: 'Login error'});
    }
  }
  async getUsers(req, res) {
    try {
      const users = await User.find();
      res.json(users);
    } catch (err) {
      console.log(err);
    }
  }
}

const authController = new AuthController();

export default authController;
