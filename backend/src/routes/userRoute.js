import express from 'express';
import { deleteUser, getUserProfile, logoutUser, userLogin, userRegister } from '../controller/userController.js';
import authenticateUser from '../middleware/userMiddleware.js';

const userRouter = express.Router();

userRouter.post("/register",userRegister);
userRouter.get('/login', userLogin);
userRouter.post('/logout', logoutUser);
userRouter.get('/get-user',authenticateUser, getUserProfile);
userRouter.delete('delete-user/:userId', authenticateUser, deleteUser);



export default userRouter