import express from 'express';
import { registerUser, loginUser, userCredits } from "../controllers/userController.js"
import authMiddleware  from '../middleware/auth.js';



const userRouter = express.Router();


userRouter.post("/register", registerUser);
userRouter.post("/login", loginUser);
userRouter.get('/credits',authMiddleware,  userCredits);


export default userRouter