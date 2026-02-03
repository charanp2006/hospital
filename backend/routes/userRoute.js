import express from "express";
import { registerUser, loginUser, getUserProfile, updateUserProfile, bookAppointment, getUserAppointments, cancelUserAppointment } from "../controllers/userController.js";
import authUser from "../middlewares/authUser.js";
import upload from "../middlewares/multer.js";

const userRouter = express.Router();

// Route for user registration
userRouter.post('/register', registerUser);
userRouter.post('/login', loginUser);

userRouter.get('/get-profile', authUser ,getUserProfile);
userRouter.post('/update-profile' , upload.single('image') , authUser , updateUserProfile);
userRouter.post('/book-appointment', authUser, bookAppointment);
userRouter.get('/appointments', authUser, getUserAppointments);
userRouter.post('/cancel-appointment', authUser, cancelUserAppointment);


export default userRouter;