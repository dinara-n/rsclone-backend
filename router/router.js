import { Router } from "express";
const router = new Router();
import authController from "../controllers/authController.js";
import usersController from "../controllers/usersController.js";
import companiesController from "../controllers/companiesController.js";
import clientsController from "../controllers/clientsController.js";
import todosController from "../controllers/todosController.js";
import { body } from "express-validator";
import authMiddleware from "../middleware/authMiddleware.js";
import roleMiddleware from "../middleware/roleMiddleware.js";

router.post('/users', [
  body('data.mail', 'Email is required').notEmpty(),
  body('data.mail', 'Email must be correct email type').isEmail(),
  body('data.password', 'Password must have 8 symbols or more').isLength({ min: 8 }),
  body('data.firstName', 'Name is required').notEmpty(),
  // body('data.patronymic', 'Patronymic is required').notEmpty(),
  body('data.surname', 'Surname is required').notEmpty(),
  body('data.birthday', 'Birthday is required').notEmpty(),
  body('data.phone', 'Phone is required').notEmpty(),
  body('role', 'Role is required').notEmpty(),
], usersController.addUser);

router.patch('/users/:id', [
  body('data.mail', 'Email must be correct email type').if(body('data.mail').notEmpty()).isEmail(),
  body('data.password', 'Password must have 8 symbols or more').if(body('data.password').notEmpty()).isLength({ min: 8 }),
], usersController.updateUser);

router.delete('/users/:id', usersController.deleteUser);
router.patch('/users/archived/:id', usersController.undeleteUser);

// router.get('/users', authMiddleware(), roleMiddleware(['admin', 'manager']), usersController.getUsers);
router.get('/users', usersController.getUsers);

router.get('/profile', authMiddleware(), usersController.getProfile);
router.patch('/profile', authMiddleware(), [
  body('data.mail', 'Email must be correct email type').if(body('data.mail').notEmpty()).isEmail(),
  body('data.password', 'Password must have 8 symbols or more').if(body('data.password').notEmpty()).isLength({ min: 8 }),
], usersController.updateProfile);

router.post('/auth/login', authController.login);
router.post('/auth/logout', authController.logout);
router.get('/auth/refresh', authController.refresh);

router.post('/companies', [
  body('data.companyName', 'Company name is required').notEmpty(),
  // body('contacts.commonPhone', 'Company phones should be passed as an array').isArray(),
  // body('contacts.workers', 'Contacts should be passed as an array').isArray(),
  // body('contacts.workers.*.phone', 'Contacts\' phones should be passed as an array').isArray(),
  // body('users', 'Users\' ids should be passed as an array').isArray(),
], companiesController.addCompany);

router.patch('/companies/:id', companiesController.updateCompany);

router.delete('/companies/:id', companiesController.deleteCompany);
router.patch('/companies/archived/:id', companiesController.undeleteCompany);

router.get('/companies', authMiddleware(), companiesController.getCompanies);
// router.get('/companies/archived', companiesController.getArchivedCompanies);

router.post('/clients', clientsController.addClient);
router.patch('/clients/:id', clientsController.updateClient);
router.delete('/clients/:id', clientsController.deleteClient);
router.get('/clients', authMiddleware(), clientsController.getClients);

router.post('/todos', [
  body('data.type', 'Todo type is required').notEmpty(),
  body('data.startTime', 'Start time is required').notEmpty(),
  body('data.endTime', 'End time is required').notEmpty(),
  body('data.title', 'Title is required').notEmpty(),
  body('isDone', 'isDone field is required').notEmpty(),
  body('company', 'Company is required').notEmpty(),
], todosController.addTodo);

router.patch('/todos/:id', todosController.updateTodo);

// router.delete('/todos/:id', todosController.deleteTodo);

router.get('/todos', authMiddleware(), todosController.getTodos);

export default router;
