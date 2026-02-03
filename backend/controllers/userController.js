import validator from 'validator';
import bcrypt from 'bcrypt';
import userModel from '../models/userModel.js';
import jwt from 'jsonwebtoken';
import {v2 as cloudinary} from 'cloudinary';
import doctorModel from '../models/doctorModel.js';
import appointmentModel from '../models/appointmentModel.js';

// API to register a new user
const registerUser = async (req, res) => {
    // Registration logic here
    try {
        const { name, email, password } = req.body;

        // check if all fields are provided
        if (!name || !password || !email) {
            return res.json({ success: false, message: 'All fields are required' });
        }

        // validate email
        if (!validator.isEmail(email)) {
            return res.json({ success: false, message: 'Enter a valid email' });
        }
        
        // validate strong password
        if (!validator.isStrongPassword(password)) {
            return res.json({ success: false, message: 'Password is not strong enough. It should be at least 8 characters long and include uppercase letters, lowercase letters, numbers, and symbols.' });
        }

        // hash password
        const salt = await bcrypt.genSalt(10);
        const hashedpassword = await bcrypt.hash(password, salt);

        // prepare user data
        const userData = {
            name,
            email,
            password: hashedpassword,
        };

        // save user data to database
        const newUser = new userModel(userData);
        const user = await newUser.save();

        const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET );

        res.json({ success: true,token});

    } catch (error) {
        console.log('Error in add user to db:', error);
        res.json({ success: false, message: error.message});
    }
    res.json({ success: true, message: 'User registered successfully' });
}

// API for user login
const loginUser = async (req, res) => {
    try {

        const { email, password } = req.body;
        const user = await userModel.findOne({ email });

        if (!user) {
            return res.json({ success: false, message: 'User not found' });
        }
        
        const isMatch =  await bcrypt.compare(password, user.password);

        if (isMatch) {
            const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET );
            res.json({ success: true, token });
        }else{
             res.json({ success: false, message: 'Invalid credentials' });
        }
        
    } catch (error) {
        console.log('Error in user login:', error);
        res.json({ success: false, message: error.message});
    }
}

// API to get user profile data
const getUserProfile = async (req, res) => {

    try {

        const {userId} = req.body;
        const userData = await userModel.findById(userId).select('-password');

        res.json({ success: true, userData });
        
    } catch (error) {
        console.log('Error in getting user data:', error);
        res.json({ success: false, message: error.message});
    }

}

// API to update user profile data
const updateUserProfile = async (req, res) => {
    // Update profile logic here
    try {

        const {userId, name, phone, dob, gender, address, } = req.body;
        const imageFile = req.file;

        if (!name || !phone || !dob || !gender) {
            return res.json({ success: false, message: 'data Missing' });
        }

        await userModel.findByIdAndUpdate(userId, {name, phone, address:JSON.parse(address), dob, gender});

        if (imageFile) {
            // upload image to cloudinary
            const imageUploadResponse = await cloudinary.uploader.upload(imageFile.path, { resource_type: 'image'});
            const imageUrl = imageUploadResponse.secure_url;

            await userModel.findByIdAndUpdate(userId, { image: imageUrl });
        }

        res.json({ success: true, message: 'Profile updated successfully' });
        
    } catch (error) {
        console.log('Error in updating user profile:', error);
        res.json({ success: false, message: error.message});
    }
}

// API to book an appointment
const bookAppointment = async (req, res) => {
    // Booking logic here
    try {
        
        const { userId, docId, slotDate, slotTime } = req.body;

        const docData = await doctorModel.findById(docId).select('-password');

        if (!docData.available) {
            return res.json({ success: false, message: 'Doctor not available' });
        }

        let slots_booked = docData.slots_booked || {};

        // check for slots availability
        if (slots_booked[slotDate]){
            if( slots_booked[slotDate].includes(slotTime)) {
            return res.json({ success: false, message: 'Slot not available' });
            }else{
                slots_booked[slotDate].push(slotTime);
            }
        }else{
            slots_booked[slotDate] = [];
            slots_booked[slotDate].push(slotTime);
        }

        const userData = await userModel.findById(userId).select('-password');

        delete docData.slots_booked;

        const appointmentData = {
            userId,
            docId,
            slotDate,
            slotTime,
            userData,
            docData,
            amount:docData.fees,
            date: Date.now(),
        };

        const newAppointment = new appointmentModel(appointmentData);
        await newAppointment.save();

        // save new slots_booked to doctor data
        await doctorModel.findByIdAndUpdate(docId, { slots_booked });

        res.json({ success: true, message: 'Appointment booked successfully' });

    } catch (error) {
        console.log('Error in creating the appointment:', error);
        res.json({ success: false, message: error.message});
    }
}

// API to get user appointments for my appointments page

const getUserAppointments = async (req, res) => {

    try {
        const { userId } = req.body;
        const appointments = await appointmentModel.find({ userId });

        res.json({ success: true, appointments });
    } catch (error) {
        console.log('Error in fetching user appointments:', error);
        res.json({ success: false, message: error.message});
    }

}

// API to cancel user appointment
const cancelUserAppointment = async (req, res) => {

    try {
        const { appointmentId, userId} = req.body;

        const appointmentData = await appointmentModel.findById(appointmentId);

        // verify if appointment belongs to user
        if (appointmentData.userId !== userId) {
            return res.json({ success: false, message: 'Unauthorized action' });
        }

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


export { registerUser, loginUser, getUserProfile, updateUserProfile, bookAppointment, getUserAppointments, cancelUserAppointment };