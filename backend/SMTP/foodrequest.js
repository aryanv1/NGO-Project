const mailTransporter = require("./setup");

const sendReport = async (emails, restaurant_name, manager_name, phone_number) => {
    try {
        let mailDetails = {
            from: 'fooddonationNGO',
            to: emails,
            subject: `New Food Donation Request`,
            text: `Hello,

There is a new food donation request from ${restaurant_name}. The contact details of the request are as follows:

Manager Name: ${manager_name}
Phone Number: ${phone_number}

For more details, please visit our website.

Thank you,
Food Donation NGO`
        };

        await mailTransporter.sendMail(mailDetails, function (err, data) {
            if (err) {
                console.log('Error sending email:', err);
            } else {
                console.log('Email sent successfully to:', emails.join(', '));
            }
        });

    } catch (error) {
        console.log("Error in sendReport function");
        console.log(error);
    }
}

module.exports = sendReport;
