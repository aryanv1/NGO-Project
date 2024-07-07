const nodemailer = require('nodemailer');
const hbs = require('nodemailer-express-handlebars');

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

// const handlebarOptions = {
//     viewEngine: {
//         extName: '.hbs',
//         partialsDir: '../backen/hbsTemplates/',
//         layoutsDir: '../backEND/hbsTemplates/',
//         defaultLayout: false,
//     }, viewPath: '../backEND/hbsTemplates/', extName: '.hbs'
// }

// mailTransporter.use('compile', hbs(handlebarOptions));

mailTransporter.verify((error, success) => {
    if (error) console.log(error);
    console.log("SMTP Server is ready");
});


module.exports = mailTransporter;