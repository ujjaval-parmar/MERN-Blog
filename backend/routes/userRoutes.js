import express from 'express';
import { adminDeleteUser, deleteUser, getUser, getUsers, signOut, updateUser } from '../controllers/userController.js';
import { verifyToken } from '../utils/verifyUser.js';


const userRouter = express.Router();




userRouter.get('/', verifyToken, getUsers);
userRouter.get('/:id', getUser);
userRouter.put('/update/:userId', verifyToken, updateUser);
userRouter.delete('/delete/:userId', verifyToken, deleteUser);
userRouter.delete('/admin-delete/:userId', verifyToken, adminDeleteUser);

userRouter.post('/signout', signOut);




export default userRouter;