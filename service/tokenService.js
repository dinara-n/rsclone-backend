import jwt from 'jsonwebtoken';
import Token from '../models/Token.js';

class TokenService {
  async generateTokens(payload) {
    const accessToken = jwt.sign(payload, process.env.JWT_ACCESS_KEY, { expiresIn: '15m' });
    const refreshToken = jwt.sign(payload, process.env.JWT_REFRESH_KEY, { expiresIn: '15d' });
    return { accessToken, refreshToken };
  }

  async updateToken(_id, refreshToken, oldRefreshToken = null) {
    const tokenData = await Token.findOne({ 'user.userId': _id });
    if (tokenData) {
      if (oldRefreshToken) {
        const oldTokenIndex = tokenData.user.refreshTokens.indexOf(oldRefreshToken);
        tokenData.user.refreshTokens.splice(oldTokenIndex, 1);
      }
      tokenData.user.refreshTokens.push(refreshToken);
      return tokenData.save();
    }
    const newToken = await Token.create({ user: { userId: _id, refreshTokens: [refreshToken]}});
    return newToken;
  }

  async deleteToken(refreshToken) {
    const tokenData = await Token.updateOne({ 'user.refreshTokens': refreshToken }, { $pull: { 'user.refreshTokens': refreshToken } });
    return tokenData;
  }

  async deleteTokens(refreshToken) {
    const tokenData = await Token.deleteOne({ 'user.refreshTokens': refreshToken });
    return tokenData;
  }

  async deleteUserTokens(id) {
    const tokenData = await Token.deleteOne({ 'user.userId': id });
    return tokenData;
  }

  async findToken(refreshToken) {
    const tokenData = await Token.findOne({ 'user.refreshTokens': refreshToken });
    return tokenData;
  }

  validateToken(token, tokenType) {
    try {
      const secretKey = (tokenType === 'accessToken') ? process.env.JWT_ACCESS_KEY : process.env.JWT_REFRESH_KEY;
      return jwt.verify(token, secretKey);
    } catch(err) {
      return null;
    }
  }
}

const tokenService = new TokenService();

export default tokenService;
