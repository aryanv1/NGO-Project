# Food Redistribution System - Backend

## Technologies Used
- **Node.js**: JavaScript runtime for server-side development.
- **Express.js**: Web framework for building APIs and web applications.
- **Azure Blob Storage**: Cloud storage solution for large amounts of unstructured data.
- **MongoDB**: NoSQL database for storing application data.
- **JSON Web Tokens (JWT)**: Standard for securely transmitting information between parties.
- **Nodemailer**: Library for sending emails from Node.js applications.
- **dotenv**: Module for loading environment variables from a `.env` file.
- **cors**: Middleware for enabling Cross-Origin Resource Sharing.
- **express-fileupload**: Middleware for handling file uploads in Express applications.
- **bcryptjs**: Library for hashing passwords.

## Installation

1. Clone the repository:
    ```sh
    git clone https://github.com/nisarg281/SRI_NGO_Project.git
    ```
2. Navigate to the project directory:
    ```sh
    cd SRI_NGO_Project/backend
    ```
3. Install the dependencies:
    ```sh
    npm install
    ```
## Configuration
1. **Create a `.env` file in the root directory and add the following environment variables:**
    ```plaintext
    MONGO_URI=<your-mongodb-connection-string>
    AZURE_STORAGE_CONNECTION_STRING=<your-azure-storage-connection-string>
    SMTP_EMAIL=<your-smtp-email>
    SMTP_PASS=<your-smtp-password>
    JWT_SECRET=<your_jwt_secret for Admin>
    JWT_SECRET_NGO = <your_jwt_secret for NGO>
    JWT_SECRET_Rest = <your_jwt_secret for Restaurant>
    JWT_SECRET_Vol = <your_jwt_secret for Volunteer>
    DOCS_BLOB = "docs"
    PHOTO_BLOB = "photos"
    ```

## Running the Application

1. Start the server:
    ```sh
    npm start
    ```
2. **Access the application:**
  - The server will run on `http://localhost:3000`.
  - update the CORS policy accordingly.

## Project Modules

### Database Connection

- `DB/azurBlob.js`: Azure Blob storage configuration and connection.
- `DB/connect.js`: MongoDB connection setup.

### SMTP Setup

- `SMTP/foodrequest.js`: Handles food request email notifications.
- `SMTP/registration_individual.js`: Handles individual registration email notifications.
- `SMTP/registration_ngo.js`: Handles NGO registration email notifications.
- `SMTP/registration_restaurant.js`: Handles restaurant registration email notifications.
- `SMTP/setup.js`: SMTP configuration setup.

### Controllers

- `controller/admin.js`: Admin related operations.
- `controller/foodTransaction.js`: Food transaction management.
- `controller/ngo.js`: NGO related operations.
- `controller/resetcontroller.js`: Password reset operations.
- `controller/restaurant.js`: Restaurant related operations.
- `controller/volunteer.js`: Volunteer related operations.

### Middleware

- `middleware/auth.js`: Authentication middleware.
- `middleware/not-found.js`: Middleware for handling 404 errors.

### Models

- `models/admin.js`: Admin schema.
- `models/foodTransaction.js`: Food transaction schema.
- `models/foodTransactionLogs.js`: Food transaction logs schema.
- `models/individual.js`: Individual schema.
- `models/ngo.js`: NGO schema.
- `models/resetModel.js`: Password reset schema.
- `models/restaurant.js`: Restaurant schema.

### Routes

- `routes/admin.js`: Routes for admin operations.
- `routes/foodTransaction.js`: Routes for food transactions.
- `routes/ngo.js`: Routes for NGO operations.
- `routes/reset.js`: Routes for password reset.
- `routes/restaurants.js`: Routes for restaurant operations.
- `routes/volunteer.js`: Routes for volunteer operations.

## Project Structure

```
└── 📁backend
    └── .DS_Store
    └── .env
    └── .gitignore
    └── 📁DB
        └── azurBlob.js
        └── connect.js
    └── 📁SMTP
        └── foodrequest.js
        └── registration_individual.js
        └── registration_ngo.js
        └── registration_restaurant.js
        └── setup.js
    └── app.js
    └── 📁blob
        └── docsUpload.js
    └── 📁controller
        └── admin.js
        └── foodTransaction.js
        └── ngo.js
        └── resetcontroller.js
        └── restaurant.js
        └── volunteer.js
    └── 📁middleware
        └── auth.js
        └── not-found.js
    └── 📁models
        └── admin.js
        └── foodTransaction.js
        └── foodTrasnactionLogs.js
        └── individual.js
        └── ngo.js
        └── resetModel.js
        └── restaurant.js
    └── package-lock.json
    └── package.json
    └── 📁routes
        └── admin.js
        └── foodTransaction.js
        └── ngo.js
        └── reset.js
        └── restaurants.js
        └── volunteer.js
```
---
