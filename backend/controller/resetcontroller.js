const {NGO} = require("../models/ngo");
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

const createReset = async (req, res)=> {
    const { ngo_email } = req.body;
    
    try {
        const user = await NGO.findOne({ "primary_contact.email" : ngo_email });
        if (!user) return res.status(400).json({ message: "NGO not found" });
        console.log(user);
        const email = user.primary_contact.email;
        const otp = generateOTP();
        const reset = await Reset.create({ userId: user._id, otp });
        
        await transporter.sendMail({
            from: process.env.SMTP_EMAIL,
            to: email,
            subject: "Password Reset",
            html: `<p>Use this OTP to reset your password: <b>${otp}</b></p>
                   <p>This OTP will expire in 1 hour</p>`
        });
        
        return res.status(200).json({ message: "OTP sent to email", resetId: reset._id });
    } catch (error) {
        if (error.code === 11000) {
            return res.status(400).json({ message: "Reset request already exists" });
        } else {
            return res.status(500).json({ message: "Error creating reset request", error: error.message });
        }
    }
}

const applyReset = async (req, res)=> {
    const { otp, resetId, password } = req.body;
    
    try {
        const reset = await Reset.findById(resetId);
        if (!reset) return res.status(400).json({ message: "OTP expired" });
        
        if (reset.otp !== otp) return res.status(400).json({ message: "OTP is incorrect" });
        
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);
        
        const user = await NGO.findByIdAndUpdate(reset.userId, { password: hashedPassword }, { new: true });
        if (!user) return res.status(400).json({ message: "NGO not found" });
        
        await Reset.findByIdAndDelete(resetId);
        
        return res.status(200).json({ message: "Password reset successfully", user });
    } catch (error) {
        return res.status(500).json({ message: "Error applying reset", error: error.message });
    }
}

module.exports = {
    createReset,
    applyReset,
};
