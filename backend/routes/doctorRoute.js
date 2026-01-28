import express from "express";
import { doctorList } from "../controllers/doctorController.js";
// import authDoctor from "../middlewares/authDoctor.js";

const doctorRouter = express.Router();

// Route for doctor login
// doctorRouter.post('/login', loginDoctor);

// Route for getting the list of doctors
doctorRouter.get('/list', doctorList);

export default doctorRouter;