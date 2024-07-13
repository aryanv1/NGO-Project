const mailTransporter = require("./setup");

const sendRegistrationMail = async (volunteer) => {
    try {
      let mailDetails = {
        from: ' Food Donation NGO',
        to: volunteer.email_address,
        subject: 'Registration Confirmation',
        text: `Dear ${volunteer.full_name},
  
  Thank you for registering with Food Donation NGO! We are excited to have you on board. Your registration has been successfully completed. Here are your details:
  
  Full Name: ${volunteer.full_name}
  Date of Birth: ${volunteer.date_of_birth.toDateString()}
  Email Address: ${volunteer.email_address}
  Phone Number: ${volunteer.phone_number}
  Current Work Status: ${volunteer.current_work_status}
  Home Address:
    Address Line 1: ${volunteer.home_address.address_line_1}
    Address Line 2: ${volunteer.home_address.address_line_2 ? volunteer.home_address.address_line_2 : ''}
    City: ${volunteer.home_address.city}
    State: ${volunteer.home_address.state}
    Zip Code: ${volunteer.home_address.zip_code}
    Location: https://www.google.com/maps?q=${volunteer.home_address.geo_location.latitude},${volunteer.home_address.geo_location.latitude}
  
  We will contact you shortly to verify your registration details. In the meantime, please be patient and feel free to reach out to us if you have any questions.
  
  Thank you for joining our mission to reduce food waste and help those in need.
  
  Best regards,
  Food Donation NGO`
      };
  
      await mailTransporter.sendMail(mailDetails);
      console.log('Confirmation email sent successfully to:', volunteer.email_address);
    } catch (error) {
      console.log('Error sending confirmation email:', error);
    }
  };
  

  module.exports = sendRegistrationMail;