const { NGO } = require("../models/ngo");
const { Restaurant } = require('../models/restaurant');
const { Volunteer } = require('../models/individual');
const Reset = require("../models/resetModel");
const bcrypt = require('bcryptjs');
const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
    host: 'smtp.gmail.com',
    service: 'gmail',
    port: 587,
    secure: true,
    auth: {
        user: process.env.SMTP_EMAIL,
        pass: process.env.SMTP_PASSWORD
    }
});

const generateOTP = () => {
    const digits = "0123456789";
    let OTP = "";
    for (let i = 0; i < 6; i++) {
        OTP += digits[Math.floor(Math.random() * 10)];
    }
    return OTP;
};

const createReset = async (req, res) => {
    let { userType, email } = req.body;
    let user;

    try {
        if (userType === 'ngo') {
            user = await NGO.findOne({ "primary_contact.email": email });
        } else if (userType === 'restaurant') {
            user = await Restaurant.findOne({ "username": email });
            email = user.primary_contact_email;
        } else if (userType === 'volunteer') {
            user = await Volunteer.findOne({ "email_address": email });
        }

        if (!user) return res.status(400).json({ message: `${userType.charAt(0).toUpperCase() + userType.slice(1)} not found` });

        await Reset.deleteOne({ userId: user._id });

        const otp = generateOTP();
        await Reset.create({ userId: user._id, otp });

        transporter.sendMail({
            from: process.env.SMTP_EMAIL,
            to: email,
            subject: "Password Reset",
            html: `<p>Use this OTP to reset your password: <b>${otp}</b></p>
                   <p>This OTP will expire in 1 hour</p>`
        });

        return res.status(200).json({ message: "OTP sent to email"});
    } catch (error) {
        return res.status(500).json({message: "Error creating reset request", error: error.message });
    }
};

const verifyReset = async (req, res) => {
    const { userType, otp, email } = req.body;
    let user;

    try {
        if (userType === 'ngo') {
            user = await NGO.findOne({ "primary_contact.email": email });
        } else if (userType === 'restaurant') {
            user = await Restaurant.findOne({ "username": email });
        } else if (userType === 'volunteer') {
            user = await Volunteer.findOne({ "email_address": email });
        }

        if (!user) return res.status(400).json({ success: false, message: `${userType.charAt(0).toUpperCase() + userType.slice(1)} not found` });

        const reset = await Reset.findOne({ userId: user._id, otp });
        if (!reset) return res.status(400).json({ message: "Invalid OTP" });

        return res.status(200).json({ message: "OTP verified", resetId: reset._id });
    } catch (error) {
        return res.status(500).json({ message: "Error verifying OTP", error: error.message });
    }
};

const applyReset = async (req, res) => {
    const { userType, resetId, password } = req.body;
    let user;

    try {
        const reset = await Reset.findById(resetId);
        if (!reset) return res.status(400).json({ message: "OTP expired" });

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);
        
        if (userType === 'ngo') {
            user = await NGO.findByIdAndUpdate(reset.userId, { password: hashedPassword }, { new: true });
        } else if (userType === 'restaurant') {
            user = await Restaurant.findByIdAndUpdate(reset.userId, { password: hashedPassword }, { new: true });
        } else if (userType === 'volunteer') {
            user = await Volunteer.findByIdAndUpdate(reset.userId, { password: hashedPassword }, { new: true });
        }
        if (!user) return res.status(400).json({message: `${userType.charAt(0).toUpperCase() + userType.slice(1)} not found` });

        await Reset.findByIdAndDelete(resetId);
        return res.status(200).json({ success: true, message: "Password reset successfully" });
    } catch (error) {
        return res.status(500).json({ success: false, message: "Error applying reset", error: error.message });
    }
};

module.exports = {
    createReset,
    verifyReset,
    applyReset
};
