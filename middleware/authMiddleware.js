import jwt from "jsonwebtoken";
import secretAccessKey from "../config.js";

export default function (req, res, next) {
  if (req.method === 'OPTIONS') {
    next();
  }
  try {
    const [, token] = req.headers.authorization.split(' ');
    if (!token) {
      return res.status(403).json({ message: 'User is not authentificated' });
    }
    const decodedData = jwt.verify(token, secretAccessKey);
    req.user = decodedData;
    next();
  } catch (err) {
    console.log(err);
    return res.status(403).json({ message: 'User is not authorized' });
  }
};
