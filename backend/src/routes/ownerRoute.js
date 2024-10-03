import express from 'express'
import { ownerLogin, ownerLogout, registerOwner } from '../controller/ownerController.js';

const ownerRouter = express.Router();

ownerRouter.post('/register', registerOwner);
ownerRouter.get('/login', ownerLogin);
ownerRouter.post('/login', ownerLogout);






export default ownerRouter