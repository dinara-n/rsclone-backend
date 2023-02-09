import { Router } from "express";
const router = new Router();
import authController from "../authController.js";
import { body } from "express-validator";
// import authMiddleware from "../middleware/authMiddleware.js";
import roleMiddleware from "../middleware/roleMiddleware.js";

router.post('/auth/registration', [
  body('data.mail', 'Email was not entered').notEmpty(),
  body('data.mail', 'Email is not correct').isEmail(),
  body('data.password', 'Password should have 8 symbols or more').isLength({ min: 8 })

], authController.registration);
router.post('/auth/login', authController.login);
router.post('/auth/logout', authController.logout);
router.get('/auth/refresh', authController.refresh);
// router.get('/users', roleMiddleware(['admin', 'manager']), authController.getUsers);
router.get('/users', authController.getUsers);
router.post('/add-company', authController.addCompany);
router.get('/companies', authController.getCompanies);
router.post('/todos', authController.addTodo);
router.get('/todos', authController.getTodos);

export default router;
