const mailTransporter = require("./setup");

const sendRegistrationMail = async (ngo) => {
  try {
    let mailDetails = {
      from: 'Food Donation NGO',
      to: ngo.primary_contact.email,
      subject: 'NGO Registration Confirmation',
      text: `Dear ${ngo.primary_contact.name},

Thank you for registering your organization with Food Donation NGO! We are excited to have you on board. Your registration has been successfully completed. Here are your organization's details:

Organization Name: ${ngo.organization_name}
Registration Number: ${ngo.registration_number}
Tax ID/EIN: ${ngo.tax_id_ein}
Website URL: ${ngo.website_url ? ngo.website_url : 'Not provided'}

Documents:
  Registration Certificate: ${ngo.registration_certificate}
  Tax Exemption Certificate: ${ngo.tax_exemption_certificate}
  Recent Annual Report: ${ngo.recent_annual_report ? ngo.recent_annual_report : 'Not Provided'}

Primary Contact:
  Name: ${ngo.primary_contact.name}
  Email: ${ngo.primary_contact.email}
  Phone: ${ngo.primary_contact.phone}
  
Physical Address:
  Address Line 1: ${ngo.physical_addresses.address_line_1}
  Address Line 2: ${ngo.physical_addresses.address_line_2 ? ngo.physical_addresses.address_line_2 : ''}
  City: ${ngo.physical_addresses.city}
  State: ${ngo.physical_addresses.state}
  Zip Code: ${ngo.physical_addresses.zip_code}
  Country: ${ngo.physical_addresses.country}
  Location: https://www.google.com/maps?q=${ngo.physical_addresses.geo_location.latitude},${ngo.physical_addresses.geo_location.longitude}

We will contact you shortly to verify your registration details. In the meantime, please be patient and feel free to reach out to us if you have any questions.

Thank you for joining our mission to reduce food waste and help those in need.

Best regards,
Food Donation NGO`
    };

    await mailTransporter.sendMail(mailDetails);
    console.log('Confirmation email sent successfully to:', ngo.primary_contact.email);
  } catch (error) {
    console.log('Error sending confirmation email:', error);
  }
};

module.exports = sendRegistrationMail;
