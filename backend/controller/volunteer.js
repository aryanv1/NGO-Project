const mongoose = require("mongoose");
const {Volunteer,Unverified_Individuals} = require("../models/individual");
const jwt = require("jsonwebtoken");

// Function to create a new volunteer // Working
const createVolunteer = async (req, res) => {
  try {
    // console.log(req.body);
    // console.log(req.headers);
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

    // if (
    //   !full_name ||
    //   !parsed_dob ||
    //   !email_address ||
    //   !phone_number ||
    //   !current_work_status ||
    //   !parsed_home_address
    // ) {
    //   return res
    //     .status(400)
    //     .json({ message: "All required fields must be provided" });
    // }

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

    const savedVolunteer = await newVolunteer.save();
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
    }
  }
};

// Function to get all volunteers
//working
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
    const getAvailableVolunteers = await Volunteer.find({availability_mode : true});
    res.status(200).json(getAvailableVolunteers);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Function to get a single volunteer by ID
//working
const getVolunteerById = async (req, res, next) => {
  const vol_id = req.params.id;
  console.log("Received volunteer ID:", vol_id);

  // Check if ID is a valid ObjectId
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
    console.log("Volunteer found:", volunteer);
    res.status(200).json({ volunteer });
  } catch (error) {
    console.error("Error fetching volunteer:", error);
    return res
      .status(500)
      .json({ message: "An error occurred while fetching the volunteer" });
  }
};

// Function to update a volunteer by ID
const updateVolunteerById = async (req, res) => {
  try {
    const {
      full_name,
      phone_number,
      current_work_status,
    } = req.body;
    // console.log(req.body);

    // Update volunteer in database
    const updatedVolunteer = await Volunteer.updateOne(
      {_id: req.params.id},
      {
        full_name,
        phone_number,
        current_work_status,
      }
    );

    // Send updated volunteer details
    res.status(200).send();

  } catch (error) {
    // Handle errors
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
    const vol_id = req.params.id;
    const {availability_mode } = req.body;
    const updatedVolunteer = await Volunteer.updateOne(
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
const deleteVolunteerById = async (req, res) => {
  try {
    const deletedVolunteer = await Volunteer.findByIdAndDelete(req.params.id);
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

    const isMatch = await volunteer.comparePassword(password);
    if (!isMatch) {
      return res.status(400).json({ message: "Invalid password" });
    }

    const token = jwt.sign({ id: volunteer._id }, process.env.JWT_SECRET, {
      expiresIn: "1h",
    });

    res.status(200).json({ message: "Login successful", token });
  } catch (error) {
    res.status(500).json({ message: "Internal server error", error: error.message });
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
