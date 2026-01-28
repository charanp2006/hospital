import validator from 'validator';
import bcrypt from 'bcrypt';
import userModel from '../models/userModel.js';
import jwt from 'jsonwebtoken';
import { json } from 'express';
import {v2 as cloudinary} from 'cloudinary';

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


export { registerUser, loginUser, getUserProfile, updateUserProfile };