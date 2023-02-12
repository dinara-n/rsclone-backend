// import jwt from "jsonwebtoken";
import ApiError from "../errors/apiError.js";
// import tokenService from "../service/tokenService.js";

export default function (roles) {
  return async function (req, res, next) {
    if (req.method === 'OPTIONS') {
      next();
    }
    try {
      // const [, token] = req.headers.authorization.split(' ');
      // if (!token) {
      //   return next(ApiError.UnauthorizedError('User is not authentificated'));
      // }
      // const decodedData = tokenService.validateToken(token, 'accessToken');
      if (!roles.some((role) => req.user.role === role)) {
        return next(ApiError.ForbiddenError('Access denied'));
      }
      next();
    } catch (err) {
      console.log(err);
      return next(ApiError.UnauthorizedError('User is not authorized'));
    }
  }
};
