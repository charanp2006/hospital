import validator from 'validator';
import bcrypt from 'bcrypt';
import {v2 as cloudinary} from 'cloudinary'
import doctorModel from '../models/doctorModel.js';
import jwt from 'jsonwebtoken';
import appointmentModel from '../models/appointmentModel.js';
import userModel from '../models/userModel.js';

// API for adding doctor

const addDoctor = async (req, res) => {

    try {
        const { name, email, password, speciality, experience, degree, about, fees, address } = req.body;
        const imageFile = req.file;
        
        // checking for all data to add doctor
        if (!name || !email || !password || !speciality || !experience || !degree || !about || !fees || !address) {
            return res.json({success:false, message:'All fields are required'});
        }

        if (!validator.isEmail(email)) {
            return res.json({ success: false, message: 'Invalid email address' });
        }

        // validate strong password
        if (!validator.isStrongPassword(password)) {
            return res.json({ success: false, message: 'Password is not strong enough. It should be at least 8 characters long and include uppercase letters, lowercase letters, numbers, and symbols.' });
        }

        // hash password
        const salt = await bcrypt.genSalt(10);
        const hashedpassword = await bcrypt.hash(password, salt);

        // upload image to cloudinary
        const imageUpload = await cloudinary.uploader.upload(imageFile.path, {resource_type: 'image'});
        const imageUrl = imageUpload.secure_url;

        // prepare doctor data
        const doctorData = {
            name,
            email,
            password: hashedpassword,
            image: imageUrl,
            speciality,
            experience,
            degree,
            about,
            // available,
            fees,
            address: JSON.parse(address),
            date: Date.now(),
            slots_booked: {}
        };

        // save doctor data to database
        const newDoctor = new doctorModel(doctorData);
        await newDoctor.save();

        res.json({ success: true, message: 'Doctor added successfully' });

    } catch (error) {
        console.log('Error in addDoctor:', error);
        res.json({ success: false, message: error.message});
    }
}

// API for admin login
const loginAdmin = async (req, res) => {
    try {

        const { email, password } = req.body;

        if (email === process.env.ADMIN_EMAIL && password === process.env.ADMIN_PW) {
            
            // generate JWT token
            // const token = jwt.sign(
            //     { email: process.env.ADMIN_EMAIL },
            //     process.env.JWT_SECRET,
            //     { expiresIn: '1h' }
            // );
            const token = jwt.sign(email+password, process.env.JWT_SECRET)
            res.json({ success: true, token });

        }else{
            res.json({ success: false, message: 'Invalid admin credentials' });
        }
        
    } catch (error) {
        console.log('Error in login admin:', error);
        res.json({ success: false, message: error.message});
    }
}

// API for getting all doctors for admin dashboard
const allDoctors = async (req, res) => {

    try {

        const doctors = await doctorModel.find({}).select('-password');
        res.json({ success: true, doctors });
        
    } catch (error) {
        console.log('Error in fetching all doctors:', error);
        res.json({ success: false, message: error.message});
    }

}

// API to get all appointments list for admin dashboard
const appointmentsAdmin = async (req, res) => {

    try {

        const appointments = await appointmentModel.find({});
        res.json({ success: true, appointments });
        
    } catch (error) {
        console.log('Error in admin appaointments:', error);
        res.json({ success: false, message: error.message});
    }

}

// API for cancelling appointment by admin
const appointmentCancel = async (req, res) => {

    try {
        const { appointmentId } = req.body;

        const appointmentData = await appointmentModel.findById(appointmentId);

        await appointmentModel.findByIdAndUpdate(appointmentId, {cancelled: true});

        // Restore slot in doctor's slots_booked
        const { docId, slotDate, slotTime } = appointmentData;
        const docData = await doctorModel.findById(docId);
        let slots_booked = docData.slots_booked;
        slots_booked[slotDate] = slots_booked[slotDate].filter(time => time !== slotTime);
        await doctorModel.findByIdAndUpdate(docId, { slots_booked });

        res.json({ success: true, message: 'Appointment cancled successfully' });

    } catch (error) {
        console.log('Error in cancelling user appointment:', error);
        res.json({ success: false, message: error.message});
    }

}

// API to get dashboard stats for admin
const adminDashboard = async (req, res) => {

    try {

        const doctors = await doctorModel.find({});
        const users = await userModel.find({});
        const appointments = await appointmentModel.find({});

        const dashboardData = {
            doctors: doctors.length,
            patients: users.length,
            appointments: appointments.length,
            latestAppointments: appointments.slice(-5),
        };

        res.json({ success: true, dashboardData });
        
    } catch (error) {
        console.log('Error in admin Dashboard:', error);
        res.json({ success: false, message: error.message});
    }

}

export { addDoctor, loginAdmin, allDoctors, appointmentsAdmin, appointmentCancel, adminDashboard };