import doctorModel from "../models/doctorModel.js";
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import appointmentModel from "../models/appointmentModel.js";

const changeAvailability = async (req, res) => {

    try {
        
        const { doctorId, date, slot, available } = req.body;

        const doctorData = await doctorModel.findById(doctorId);
        await doctorModel.findByIdAndUpdate(doctorId, {available: !doctorData.available});
        res.json({ success: true, message: 'Doctor availability updated successfully' });

    } catch (error) {
        console.log('Error in changeAvailability:', error);
        res.json({ success: false, message: error.message});
    }

}

const doctorList = async (req, res) => {
    try {
        
        const doctors = await doctorModel.find({}).select(["-password", "-email",]);
        res.json({ success: true, doctors });

    } catch (error) {
        console.log('Error in doctorList:', error);
        res.json({ success: false, message: error.message});
    }
}

// API for doctor Login
const doctorLogin = async (req, res) => {

    try {
        const { email, password } = req.body;
        const doctor = await doctorModel.findOne({ email });

        if (!doctor) {
            return res.json({ success: false, message: 'Invalid email or password' });
        }

        const isMatch = await bcrypt.compare(password, doctor.password);
        if (isMatch) {

            const token = jwt.sign({ id: doctor._id }, process.env.JWT_SECRET);
            res.json({ success: true, message: 'Doctor login successful',token });
            
        } else {
            res.json({ success: false, message: 'Invalid email or password' });
        }

    } catch (error) {
        console.log('Error in doctorLogin:', error);
        res.json({ success: false, message: error.message });
    }

}

// API to get doctor appointments for doctor panel
const getDoctorAppointments = async (req, res) => {
    try {

        const { docId } = req.body;
        const appointments = await appointmentModel.find({docId});
        res.json({ success: true, appointments });

    } catch (error) {
        console.log('Error in getDoctorAppointments:', error);
        res.json({ success: false, message: error.message });
    }
}

// API for appointment cancellation by doctor
const cancelDoctorAppointment = async (req, res) => {

    try {
        
        const { docId, appointmentId } = req.body;
        const appointmentData = await appointmentModel.findById(appointmentId);

        if(appointmentData && appointmentData.docId === docId){
            await appointmentModel.findByIdAndUpdate(appointmentId, {cancelled: true});
            return res.json({ success: true, message: 'Appointment Cancelled Successfully' });
        }else{
            return res.json({ success: false, message: 'Appointment not found or unauthorized' });
        }

    } catch (error) {
        console.log('Error in cancelling doctor appointment:', error);
        res.json({ success: false, message: error.message});
    }

}

// API for appointment completion by doctor
const completeDoctorAppointment = async (req, res) => {

    try {

        const { docId, appointmentId } = req.body;
        const appointmentData = await appointmentModel.findById(appointmentId);

        if(appointmentData && appointmentData.docId === docId){
            await appointmentModel.findByIdAndUpdate(appointmentId, {isCompleted: true});
            return res.json({ success: true, message: 'Appointment marked as completed' });
        }else{
            return res.json({ success: false, message: 'Appointment not found or unauthorized' });
        }
        
    } catch (error) {
        console.log('Error in completing doctor appointment:', error);
        res.json({ success: false, message: error.message});
    }
}

// API for doctor dashboard data
const doctorDashboard = async (req, res) => {

    try {

        const { docId } = req.body;
        const appointments = await appointmentModel.find({ docId });

        let earnings = 0;
        appointments.map((appointment) => {
            if(appointment.isCompleted || !appointment.payment){
                earnings += appointment.amount;
            }
        });

        let patients = [];
        appointments.map((appointment) => {
            if(!patients.includes(appointment.userId)){
                patients.push(appointment.userId);
            }
        });

        const dashboardData = {
            earnings,
            appointments: appointments.length,
            patients: patients.length,
            latestAppointments: appointments.reverse().slice(0,5),
        };

        res.json({ success: true, dashboardData });

    } catch (error) {
        console.log('Error in doctorDashboard:', error);
        res.json({ success: false, message: error.message });
    }

}

// API to get doctor profile data
const doctorProfile = async (req, res) => {

    try {

        const {docId} = req.body;
        const profileData = await doctorModel.findById(docId).select('-password');

        res.json({ success: true, profileData });
        
    } catch (error) {
        console.log('Error in getting user data:', error);
        res.json({ success: false, message: error.message});
    }

}

// API to update doctor profile data
const updateDoctorProfile = async (req, res) => {
    // Update profile logic here
    try {

        const {docId, fees, address, available } = req.body;

        await doctorModel.findByIdAndUpdate(docId, {fees, address, available});

        res.json({ success: true, message: 'Profile updated successfully' });
        
    } catch (error) {
        console.log('Error in updating user profile:', error);
        res.json({ success: false, message: error.message});
    }
}



export { changeAvailability, doctorList, doctorLogin, getDoctorAppointments, cancelDoctorAppointment, completeDoctorAppointment, doctorDashboard, doctorProfile, updateDoctorProfile };