import User from "../models/User.js";
import bcrypt from 'bcryptjs';
import tokenService from "./tokenService.js";
import { AuthDto } from "../dtos/authDto.js";
import ApiError from "../errors/apiError.js";

class AuthService {

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
}

const authService = new AuthService();

export default authService;
