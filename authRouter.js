import { Router } from "express";
const authRouter = new Router();
import authController from "./authController.js";
import { check } from "express-validator";
// import authMiddleware from "./middleware/authMiddleware.js";
import roleMiddleware from "./middleware/roleMiddleware.js";

authRouter.post('/registration', [
  check('data.mail', 'Email was not entered').notEmpty(),
  check('data.mail', 'Email is not correct').isEmail(),
  check('data.password', 'Password should have 8 symbols or more').isLength({ min: 8 })

], authController.registration);
authRouter.post('/login', authController.login);
authRouter.get('/users', roleMiddleware(['admin', 'manager']), authController.getUsers);

export default authRouter;
