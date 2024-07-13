const mailTransporter = require("./setup");

const sendRestaurantRegistrationMail = async (restaurant) => {
  try {
    let mailDetails = {
      from: 'Food Donation NGO',
      to: restaurant.primary_contact_email,
      subject: 'Restaurant Registration Confirmation',
      text: `Dear ${restaurant.manager_name},

Thank you for registering your restaurant with Food Donation NGO! We are excited to have you on board. Your registration has been successfully completed. Here are your restaurant's details:

Restaurant Name: ${restaurant.name}
Username: ${restaurant.username}
Type: ${restaurant.type}
Business License Number: ${restaurant.business_license_number}
Website URL: ${restaurant.website_url ? restaurant.website_url : 'Not provided'}

Primary Contact:
  Manager Name: ${restaurant.manager_name}
  Email: ${restaurant.primary_contact_email}
  Phone: ${restaurant.primary_contact_phone}
  
Physical Address:
  Address Line 1: ${restaurant.physical_address.address_line_1}
  Address Line 2: ${restaurant.physical_address.address_line_2 ? restaurant.physical_address.address_line_2 : 'Not Provided'}
  City: ${restaurant.physical_address.city}
  State: ${restaurant.physical_address.state}
  Zip Code: ${restaurant.physical_address.zip_code}
  Location: https://www.google.com/maps?q=${restaurant.physical_address.geo_location.latitude},${restaurant.physical_address.geo_location.longitude}

Documents:
  Food Handler's Permit: ${restaurant.food_handlers_permit}

We will contact you shortly to verify your registration details. In the meantime, please be patient and feel free to reach out to us if you have any questions.

Thank you for joining our mission to reduce food waste and help those in need.

Best regards,
Food Donation NGO`
    };

    await mailTransporter.sendMail(mailDetails);
    console.log('Confirmation email sent successfully to:', restaurant.primary_contact_email);
  } catch (error) {
    console.log('Error sending confirmation email:', error);
  }
};

module.exports = sendRestaurantRegistrationMail;
