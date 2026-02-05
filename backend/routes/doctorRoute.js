import express from "express";
import { cancelDoctorAppointment, completeDoctorAppointment, doctorDashboard, doctorList, doctorLogin, getDoctorAppointments, doctorProfile, updateDoctorProfile } from "../controllers/doctorController.js";
import authDoctor from "../middlewares/authDoctor.js";

const doctorRouter = express.Router();

// Route for doctor login
doctorRouter.post('/login', doctorLogin);

// Route for getting the list of doctors
doctorRouter.get('/list', doctorList);

// Route for getting doctor appointments for doctor panel
doctorRouter.get('/appointments', authDoctor ,getDoctorAppointments);

// Route for doctor appointment update by doctor
doctorRouter.post('/complete-appointment', authDoctor, completeDoctorAppointment);
doctorRouter.post('/cancel-appointment', authDoctor, cancelDoctorAppointment);

// Route for getting doctor dashboard data
doctorRouter.get('/dashboard', authDoctor, doctorDashboard);

// Route for getting and updating doctor profile
doctorRouter.get('/profile', authDoctor ,doctorProfile);
doctorRouter.post('/update-profile' , authDoctor , updateDoctorProfile);

export default doctorRouter;