const nodemailer = require('nodemailer');

const mailTransporter = nodemailer.createTransport({
    host: 'smtp.gmail.com',
    service: 'gmail',
    port: '587',
    secure:'true', 
    auth: {
        user: process.env.SMTP_EMAIL,
        pass: process.env.SMTP_PASSWORD
    }
});

mailTransporter.verify((error, success) => {
    if (error) console.log(error);
    console.log("SMTP Server is ready");
});


module.exports = mailTransporter;