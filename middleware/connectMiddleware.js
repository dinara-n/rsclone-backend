import ApiError from "../errors/apiError.js";
import tokenService from "../service/tokenService.js";

export default function () {
  return async function (req, res, next) {
    if (req.method === 'OPTIONS') {
      next();
    }
    try {
      const token = req.query?.id;
      if (!token) {
        return next(ApiError.UnauthorizedError('User is not authentificated'));
      }
      const decodedData = tokenService.validateToken(token, 'accessToken');
      console.log(decodedData);
      if (!decodedData) {
        return next(ApiError.UnauthorizedError('User is not authentificated'));
      }
      req.user = decodedData;
      next();
    } catch (err) {
      console.log(err);
      return next(ApiError.UnauthorizedError('User is not authorized'));
    }
  }
};
