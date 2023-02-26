import { Router } from "express";
const router = new Router();
import emitter from "../emitter/emitter.js";
import authController from "../controllers/authController.js";
import usersController from "../controllers/usersController.js";
import companiesController from "../controllers/companiesController.js";
import clientsController from "../controllers/clientsController.js";
import todosController from "../controllers/todosController.js";
import dataController from "../controllers/dataController.js";
import { body } from "express-validator";
import authMiddleware from "../middleware/authMiddleware.js";
import roleMiddleware from "../middleware/roleMiddleware.js";
import connectMiddleware from "../middleware/connectMiddleware.js";

const sendUpdatedData = (req, res) => {
  res.writeHead(200, {
    'Connection': 'keep-alive',
    'Content-Type': 'text/event-stream',
    'Cache-Control': 'no-cache',
  });
  emitter.on('update', (updatedData) => {
    res.write(`data: ${updatedData} \n\n`);
  })
}

router.get('/connect', connectMiddleware(), sendUpdatedData);

router.get('/all', authMiddleware(), dataController.getData);

router.post('/users', authMiddleware(), roleMiddleware(['admin', 'manager']), [
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

router.patch('/users/:id', authMiddleware(), roleMiddleware(['admin', 'manager']), [
  body('data.mail', 'Email must be correct email type').if(body('data.mail').notEmpty()).isEmail(),
  body('data.password', 'Password must have 8 symbols or more').if(body('data.password').notEmpty()).isLength({ min: 8 }),
], usersController.updateUser);

router.delete('/users/:id', authMiddleware(), roleMiddleware(['admin', 'manager']), usersController.deleteUser);
router.patch('/users/archived/:id', authMiddleware(), roleMiddleware(['admin', 'manager']), usersController.undeleteUser);
router.get('/users', authMiddleware(), roleMiddleware(['admin', 'manager']), usersController.getUsers);

router.get('/profile', authMiddleware(), usersController.getProfile);
router.patch('/profile', authMiddleware(), [
  body('data.mail', 'Email must be correct email type').if(body('data.mail').notEmpty()).isEmail(),
  body('data.password', 'Password must have 8 symbols or more').if(body('data.password').notEmpty()).isLength({ min: 8 }),
], usersController.updateProfile);

router.post('/auth/login', authController.login);
router.post('/auth/logout', authController.logout);
router.get('/auth/refresh', authController.refresh);

router.post('/companies', authMiddleware(), [
  body('data.companyName', 'Company name is required').notEmpty(),
  // body('contacts.commonPhone', 'Company phones should be passed as an array').isArray(),
], companiesController.addCompany);

router.patch('/companies/:id', authMiddleware(), companiesController.updateCompany);

router.delete('/companies/:id', authMiddleware(), roleMiddleware(['admin', 'manager']), companiesController.deleteCompany);
router.patch('/companies/archived/:id', authMiddleware(), roleMiddleware(['admin', 'manager']), companiesController.undeleteCompany);

router.get('/companies', authMiddleware(), companiesController.getCompanies);

router.post('/contacts', authMiddleware(), clientsController.addClient);
router.patch('/contacts/:id', authMiddleware(), clientsController.updateClient);
router.delete('/contacts/:id', authMiddleware(), clientsController.deleteClient);
router.get('/contacts', authMiddleware(), clientsController.getClients);

router.post('/todos', authMiddleware(), [
  body('data.type', 'Todo type is required').notEmpty(),
  body('data.startTime', 'Start time is required').notEmpty(),
  body('data.endTime', 'End time is required').notEmpty(),
  body('data.title', 'Title is required').notEmpty(),
  body('isDone', 'isDone field is required').notEmpty(),
  body('company', 'Company is required').notEmpty(),
], todosController.addTodo);

router.patch('/todos/:id', authMiddleware(), todosController.updateTodo);

// router.delete('/todos/:id', todosController.deleteTodo);

router.get('/todos/:id', authMiddleware(), todosController.getTodo);
router.get('/todos', authMiddleware(), todosController.getTodos);

app.options('*', cors());

export default router;
