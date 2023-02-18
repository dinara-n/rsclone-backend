import User from "../models/User.js";
// import bcrypt from 'bcryptjs';
// import jwt from 'jsonwebtoken';
import { validationResult } from 'express-validator';
// import secretAccessKey from './config.js';
import authService from "../service/authService.js";
import ApiError from "../errors/apiError.js";

// const generateAccessToken = (id, role) => {
//   const payload = { id, role };
//   return jwt.sign(payload, secretAccessKey, { expiresIn: '24h' });
// }
const fifteenDaysInMs = 15 * 24 * 60 * 60 * 1000;

class AuthController {

  async login(req, res, next) {
    try {
      const { mail, password } = req.body;
      const oldRefreshToken = req.cookies.refreshToken;
      console.log(oldRefreshToken);
      const userData = await authService.login(mail, password, oldRefreshToken);
      res.cookie('refreshToken', userData.refreshToken, { maxAge: fifteenDaysInMs, httpOnly: true, sameSite: 'none', secure: true });
      return res.json(userData);
    } catch (err) {
      console.log(err);
      // res.status(400).json({ message: 'Login error'});
      next(err);
    }
  }

  async logout(req, res, next) {
    try {
      const { all } = req.query?.all;
      const { refreshToken } = req.cookies;
      await authService.logout(refreshToken, all);
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
      res.cookie('refreshToken', userData.refreshToken, { maxAge: fifteenDaysInMs, httpOnly: true, sameSite: 'none', secure: true });
      return res.json(userData);
    } catch (err) {
      console.log(err);
      next(err);
    }
  }
}

const authController = new AuthController();

export default authController;
