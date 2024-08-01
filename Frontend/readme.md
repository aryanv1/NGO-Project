# Food Redistribution System

## Overview
This project is a comprehensive food donation system that connects restaurants, NGOs, and volunteers to facilitate the distribution of surplus food to those in need. The system includes a frontend built with HTML, CSS, and JavaScript, and a backend powered by Node.js and Mongoose.

## Features
- User Authentication: Login and registration for restaurants, NGOs, and volunteers.
- Password Management: Functionality to reset passwords with OTP verification.
- Food Transactions: Record and display food donations and distributions.
- Volunteer Management: Track and manage volunteer availability and locations.
- Dynamic Data Display: Use of modals to display transaction details and other dynamic content.
- Image Uploads: Support for uploading and displaying photos of food donations and distributions.

## Technologies Used
- **Frontend**: HTML, CSS, JavaScript
- **Backend**: Node.js, Express.js, Mongoose
- **Database**: MongoDB
- **Authentication**: JWT for secure authentication
- **Other Libraries**: jQuery, Bootstrap


## Installation and Setup

### Prerequisites
- Node.js
- MongoDB

### Backend Setup
For detailed backend setup instructions, please refer to the [Backend README](../backend/readme.md).

### Frontend Setup
1. Navigate to the Frontend directory:
   ```bash
   cd SRI_NGO_Project/Frontend
   ```

2. Open `index.html` in your preferred browser to view the application.

## Usage

### Authentication
- Users can register and log in as a restaurant, NGO, or volunteer.
- Password reset functionality is available with OTP verification.

### Food Transactions
- Restaurants can log food donations.
- NGOs can view and manage food distributions.
- Volunteers can update their availability and location.

### Dynamic Data Display
- Modals are used to display detailed information about food transactions and other dynamic content.

## File Structure
The project is organized into the following directories and files:

```
Frontend/
    └── .DS_Store
    └── All_Ind_admin.html
    └── All_ngo_admin.html
    └── All_restaurant_admin.html
    └── Available_Volunteers.html
    └── Forgot_Password.html
    └── Ind_register.html
    └── Login.html
    └── Profile_Ind.html
    └── Profile_ngo.html
    └── Profile_restaurant.html
    └── Verification_Ind_admin.html
    └── Verification_ngo_admin.html
    └── Verification_restaurant_admin.html
    └── about.html
    └── about_Ind.html
    └── about_ngo.html
    └── about_restaurant.html
    └── accepted_donations_ngo.html
    └── accepted_donations_restaurant.html
    └── css/
    └── donation_histroy_admin.html
    └── donation_histroy_individual.html
    └── donations_history_ngo.html
    └── donations_history_restaurant.html
    └── fonts/
    └── food_transations_ngo.html
    └── gallery.html
    └── gallery_Ind.html
    └── gallery_ngo.html
    └── gallery_restaurant.html
    └── images/
    └── index.html
    └── index_Ind.html
    └── index_admin.html
    └── index_ngo.html
    └── index_restaurant.html
    └── js/
    └── ngo_register.html
    └── ngolist_Ind.html
    └── ngolist_guest.html
    └── ngolist_ngo.html
    └── ngolist_restaurant.html
    └── package-lock.json
    └── pending_donations_restaurant.html
    └── prepros-6.config
    └── restaurant_donate.html
    └── restaurant_register.html
    └── scss/
```

## Acknowledgements
- All contributors for their efforts and contributions.
- The libraries and tools used in this project for their invaluable support.

For detailed information about the project, please refer to the documentation or contact the project maintainers.
