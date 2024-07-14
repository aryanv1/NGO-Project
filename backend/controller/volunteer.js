const mongoose = require("mongoose");
const {Volunteer,Unverified_Individuals} = require("../models/individual");
const {NGO} = require('../models/ngo');
const jwt = require("jsonwebtoken");
const bcrypt = require('bcryptjs');
const sendRegistrationMail = require('../SMTP/registration_individual');

const createVolunteer = async (req, res) => {
  try {
    const {
      full_name,
      date_of_birth,
      email_address,
      password,
      phone_number,
      current_work_status,
      home_address,
    } = req.body;

    const parsed_dob = new Date(date_of_birth);

    if (isNaN(parsed_dob.getTime())) {
      return res
        .status(400)
        .json({ message: "Invalid date format for date_of_birth" });
    }

    const parsed_home_address =JSON.parse(home_address);

    const newVolunteer = new Unverified_Individuals({
      full_name,
      date_of_birth: parsed_dob,
      email_address,
      password,
      phone_number,
      current_work_status,
      home_address: parsed_home_address,
    });

    const temp = await Volunteer.findOne({
      $or: [
        { email_address : newVolunteer.email_address },
        { phone_number: newVolunteer.phone_number },
      ]
    });

    if (temp) {
      return res.status(400).json({
        message: 'Duplicate entry detected for email or phone number',
      });
    }

    await newVolunteer.save();
    sendRegistrationMail(newVolunteer);
    res.status(201).send();
  } catch (error) {
    if (error.code == 11000) {
      const dup = Object.keys(error.keyValue)[0];
      res.status(400).json({
        message: `Duplicate entry detected for ${dup}`,
      });
    } else {
      res.status(400).json({
        message: "Error registering volunteer",
        error: error.message,
      });
      console.log(error);
    }
  }
};

const getAllVolunteers = async (req, res) => {
  try {
    const volunteers = await Volunteer.find();
    res.status(200).json(volunteers);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


const getAvailableVolunteers = async (req, res) => {
  try {
    const ngo = await NGO.findById(req.user.id);

    if (!ngo) {
      return res.status(404).json({ message: 'NGO not found' });
    }

    const { latitude, longitude } = ngo.physical_addresses.geo_location;
    const maxDistance = 25; 

    const availableVolunteers = await Volunteer.find({
      "home_address.geo_location": {
        $geoWithin: {
          $centerSphere: [[latitude, longitude], maxDistance / 6378.1] // 25 km radius
        }
      },
      'availability_mode' : 'true',
    })
    .select('full_name email_address phone_number');

    res.status(200).json(availableVolunteers);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getVolunteerById = async (req, res, next) => {
  const vol_id = req.user.id;

  if (!mongoose.isValidObjectId(vol_id)) {
    console.log("Received invalid ID:");
    return res.status(400).json({ message: "Invalid volunteer ID format" });
  }

  try {
    const volunteer = await Volunteer.findOne({ _id: vol_id });
    if (!volunteer) {
      console.log("No volunteer found with ID:", vol_id);
      return res
        .status(404)
        .json({ message: `No volunteer with id : ${vol_id}` });
    }
    res.status(200).json(volunteer);
  } catch (error) {
    console.error("Error fetching volunteer:", error);
    return res
      .status(500)
      .json({ message: "An error occurred while fetching the volunteer" });
  }
};

// Function to update a volunteer by ID
const updateVolunteerById = async (req, res) => {
  const vol_id = req.user.id;

  if (!mongoose.isValidObjectId(vol_id)) {
    console.log("Received invalid ID:");
    return res.status(400).json({ message: "Invalid volunteer ID format" });
  }
  try {
    const {
      full_name,
      phone_number,
      current_work_status,
      home_address,
    } = req.body;

    const duplicateVolunteer = await Volunteer.findOne({
      phone_number: phone_number,
      _id: { $ne: vol_id }
    });

    if (duplicateVolunteer) {
      return res.status(400).json({ message: "Duplicate phone number detected." });
    }
    
    await Volunteer.updateOne(
      {_id: vol_id},
      {
        full_name,
        phone_number,
        current_work_status,
        home_address,
      }
    );
    res.status(200).send();
  } catch (error) {
    if (error.code == 11000) {
      const dup = Object.keys(error.keyValue)[0];
      res.status(400).json({
        message: `Duplicate entry detected for ${dup}`,
      });
    } else {
      res.status(500).json({
        message: "Error registering volunteer",
        error: error.message,
      });
    }
  }
};

// Function to update availability status of volunteer.
const updateVolunteerAvailability = async(req,res)=> {
  try {
    const vol_id = req.user.id;
    const {availability_mode } = req.body;
    await Volunteer.updateOne(
      {_id: vol_id},
      {
        availability_mode,
      }
    );
    res.status(200).send();

  } catch (error) {
    res.status(500).json({
      message: "Error changing volunteer availability mode",
      error: error.message,
    });
  }
}

// Function to delete a volunteer by ID 
// To check.
const deleteVolunteerById = async (req, res) => {
  try {
    const deletedVolunteer = await Volunteer.findByIdAndDelete(req.user.id);
    if (!deletedVolunteer) {
      return res.status(404).json({ message: "Volunteer not found" });
    }
    res.status(200).json({ message: "Volunteer deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


const loginVolunteer = async (req, res) => {
  try {
    const { email, password } = req.body;

    const volunteer = await Volunteer.findOne({ email_address : email });
    if (!volunteer) {
      return res.status(400).json({ message: "Invalid email" });
    }
    
    const isMatch = await bcrypt.compare(password, volunteer.password);
    if (!isMatch) {
      return res.status(400).json({ message: "Invalid password" });
    }

    const token = jwt.sign({ id: volunteer._id }, process.env.JWT_SECRET_Vol, {
      expiresIn: "5d",
    });

    res.status(200).json({ message: "Login successful", token });
  } catch (error) {
    console.log("Error at volunteer login");
    res.status(500).json({ message: error.message });
  }
};


module.exports = {
  createVolunteer,
  getAllVolunteers,
  getVolunteerById,
  updateVolunteerById,
  updateVolunteerAvailability,
  deleteVolunteerById,
  loginVolunteer,
  getAvailableVolunteers,
};
