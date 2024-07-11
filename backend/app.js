const express = require('express');
const app = express();
const cors = require('cors');

const  connectDB =require('./DB/connect.js');
const notFound = require('./middleware/not-found');
const ngoRoutes = require('./routes/ngo');
const volunteerRoutes = require('./routes/volunteer.js');
const restaurantRoutes = require('./routes/restaurants.js');
const foodTransaction = require('./routes/foodTransaction.js');
const adminRoutes = require('./routes/admin.js'); 
const resetRoute = require('./routes/reset.js');
const fileUpload = require("express-fileupload");

require('dotenv').config();

let corsOptions = {
    origin : '*',
}
app.use(cors(corsOptions));

app.use(fileUpload({
    fileSize: 10000000,
    useTempFiles:true,
    tempFileDir:'/tmp/'
}))

// these are middlewares
app.use(express.json());
app.use(express.urlencoded({ extended: true}));


app.use('/ngo',ngoRoutes);
app.use('/volunteer', volunteerRoutes);
app.use('/restaurant',restaurantRoutes);
app.use('/foodtransaction',foodTransaction);
app.use('/admin',adminRoutes);
app.use('/reset',resetRoute);

//routes 
app.get('/',(req,res) => {
    res.send('NGO web application .. ')
})

app.use(notFound);
const port = 3000


const start = async() => {
    try {
        await connectDB(process.env.MONGO_URI);
        require("./SMTP/setup.js");
        require("./DB/azurBlob");
        app.listen(port,console.log(`the server is listening on port ${port} ..`));
    } catch (err) {
        console.log(err);
    }
}

start();