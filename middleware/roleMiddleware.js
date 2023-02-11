import jwt from "jsonwebtoken";
// import secretAccessKey from "../config.js";
import ApiError from "../errors/apiError.js";
import tokenService from "../service/tokenService.js";

export default function (roles) {
  return async function (req, res, next) {
    if (req.method === 'OPTIONS') {
      next();
    }
    try {
      const [, token] = req.headers.authorization.split(' ');
      if (!token) {
        return next(ApiError.UnauthorizedError());
        // return res.status(403).json({ message: 'User is not authentificated' });
      }
      // const decodedData = jwt.verify(token, process.env.JWT_ACCESS_KEY);
      const decodedData = tokenService.validateToken(token, 'accessToken');
      if (!roles.some((role) => decodedData.role === role)) {
        // return res.status(403).json({ message: 'Access denied' });
        return next(ApiError.ForbiddenError());
      }
      next();
    } catch (err) {
      console.log(err);
      // return res.status(403).json({ message: 'User is not authorized' });
      return next(ApiError.UnauthorizedError());
    }
  }
};
