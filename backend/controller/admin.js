const admin = require("../models/admin");
const { NGO, Unverified_NGOs } = require("../models/ngo");
const { Volunteer, Unverified_Individuals } = require("../models/individual");
const { Restaurant, Unverified_Restaurants } = require("../models/restaurant");
const FoodTransactionLogs = require('../models/foodTrasnactionLogs');
const jwt = require("jsonwebtoken");

const adminlogin = async (req, res) => {
  try {
    const { email, password } = req.body;

    const admin_detail = await admin.findOne({ username: email });
    if (!admin_detail) {
      return res.status(400).json({ message: "Invalid username." });
    }

    const isMatch = await admin_detail.comparePassword(password);
    if (!isMatch) {
      return res.status(400).json({ message: "Invalid password" });
    }

    const token = jwt.sign({ id: admin_detail._id }, process.env.JWT_SECRET, {
      expiresIn: "5d",
    });

    res.status(200).json({
      message: "Admin login successful",
      token,
    });
  } catch (error) {
    console.error("Error during admin login:", error);
    res.status(500).json({
      message: "Internal server error",
      error: error.message,
    });
  }
};

const verifyngo = async (req, res) => {
  try {
    const { ngo_id } = req.body;

    const ngo_data = await Unverified_NGOs.findOne({ _id: ngo_id });
    // console.log(ngo_data);
    const data = new NGO({
      organization_name: ngo_data.organization_name,
      registration_number: ngo_data.registration_number,
      tax_id_ein: ngo_data.tax_id_ein,
      website_url: ngo_data.website_url,
      physical_addresses: ngo_data.physical_addresses,
      primary_contact: ngo_data.primary_contact,
      password: ngo_data.password,
      secondary_contact: ngo_data.secondary_contact,
      registration_certificate: ngo_data.registration_certificate,
      tax_exemption_certificate: ngo_data.tax_exemption_certificate,
      recent_annual_report: ngo_data.recent_annual_report,
      ngo_photos: ngo_data.ngo_photos,
    });
    await data.save();

    await Unverified_NGOs.deleteOne({ _id: ngo_id });

    res.status(201).send();
  } catch (error) {
    if (error.code == 11000) {
      const dup = Object.keys(error.keyValue)[0];
      res.status(400).json({
        message: `Duplicate entry detected for ${dup}`,
      });
    } else {
      res.status(400).json({
        message: "Error while verifying data of NGO",
        error: error.message,
      });
    }
  }
};

const verifyVolunteer = async (req, res) => {
  try {
    const { vol_id } = req.body;
    const vol_data = await Unverified_Individuals.findOne({ _id: vol_id });
    if (!vol_data) {
      return res.status(404).json({ message: "Volunteer not found" });
    }
    const data = new Volunteer({
      full_name: vol_data.full_name,
      date_of_birth: vol_data.date_of_birth,
      email_address: vol_data.email_address,
      password: vol_data.password,
      phone_number: vol_data.phone_number,
      current_work_status: vol_data.current_work_status,
      home_address: vol_data.home_address,
    });

    await data.save();

    await Unverified_Individuals.deleteOne({ _id : vol_id });

    return res.status(201).send();
  } catch (error) {
    if (error.code == 11000) {
      const dup = Object.keys(error.keyValue)[0];
      res.status(400).json({
        message: `Duplicate entry detected for ${dup}`,
      });
    } else {
      res.status(400).json({
        message: "Error verifying volunteer",
        error: error.message,
      });
    }
  }
};

const verifyRestaurant = async (req, res) => {
  try {
    const { rest_id } = req.body;

    const rest_data = await Unverified_Restaurants.findOne({ _id: rest_id });
    
    const data = new Restaurant({
      name: rest_data.name,
      username: rest_data.username,
      password: rest_data.password,
      type: rest_data.type,
      business_license_number: rest_data.business_license_number,
      website_url: rest_data.website_url,
      manager_name: rest_data.manager_name,
      primary_contact_email: rest_data.primary_contact_email,
      primary_contact_phone: rest_data.primary_contact_phone,
      physical_address: rest_data.physical_address,
      food_handlers_permit: rest_data.food_handlers_permit,
    });

    await data.save();

    await Unverified_Restaurants.deleteOne({ _id: rest_id });

    res.status(201).send();
  } catch (error) {
    if (error.code == 11000) {
      const dup = Object.keys(error.keyValue)[0];
      res.status(400).json({
        message: `Duplicate entry detected for ${dup}`,
      });
    } else {
      res.status(400).json({
        message: "Error verifying restaurant",
        error: error.message,
      });
    }
  }
};

const getAllngos = async (req, res) => {
  try {
    const ngos = await NGO.find();
    res.status(200).json(ngos);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getAllUnverifiedNGOs = async (req, res) => {
  try {
    const ngos = await Unverified_NGOs.find();
    res.status(200).json(ngos);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const deleteNGOById = async (req, res) => {
  const {id} = req.params;
  try {
    const deleted = await NGO.findByIdAndDelete(id);
    if (!deleted) {
      return res.status(404).json({ message: "NGO not found" });
    }
    res.status(200).json({ message: "NGO deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const deleteUnverifiedNGOById = async (req, res) => {
  const {id} = req.params;
  try {
    const deleted = await Unverified_NGOs.findByIdAndDelete(id);
    if (!deleted) {
      return res.status(404).json({ message: "NGO not found" });
    }
    res.status(200).json({ message: "Request deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
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

const getAllUnverifiedVolunteers = async (req, res) => {
  try {
    const volunteers = await Unverified_Individuals.find();
    res.status(200).json(volunteers);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const deleteVolunteerById = async (req, res) => {
    const {id} = req.params;
    console.log(id);
    try {
      const deletedVolunteer = await Volunteer.findByIdAndDelete(id);
      if (!deletedVolunteer) {
        return res.status(404).json({ message: "Volunteer not found" });
      }
      res.status(200).json({ message: "Volunteer deleted successfully" });
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
};

const deleteUnverifiedVolunteerById = async (req, res) => {
  const {id} = req.params;
  console.log(id);
  try {
    const deletedVolunteer = await Unverified_Individuals.findByIdAndDelete(id);
    if (!deletedVolunteer) {
      return res.status(404).json({ message: "Volunteer not found" });
    }
    res.status(200).json({ message: "Request deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getAllRestaurants = async (req, res) => {
  try {
    const restaurants = await Restaurant.find();
    res.status(200).json(restaurants);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getAllUnverifiedRestaurants = async (req, res) => {
  try {
    const restaurants = await Unverified_Restaurants.find();
    res.status(200).json(restaurants);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const deleteRestaurantById = async (req, res) => {
  const {id} = req.params;
  try {
    const deleted = await Restaurant.findByIdAndDelete(id);
    if (!deleted) {
      return res.status(404).json({ message: "Restaurant not found" });
    }
    res.status(200).json({ message: "Restaurant deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const deleteUnverifiedRestaurantById = async (req, res) => {
  const {id} = req.params;
  try {
    const deleted = await Unverified_Restaurants.findByIdAndDelete(id);
    if (!deleted) {
      return res.status(404).json({ message: "Restaurant not found" });
    }
    res.status(200).json({ message: "Restaurant deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getAllFoodLogs = async (req, res) => {
  try {
    const allFoodLogs = await FoodTransactionLogs.find();
    // .populate({
    //   path: 'donor',
    //   select: 'name',
    //   model: 'Restaurant'
    // })
    // .populate({
    //   path: 'ngo',
    //   select: 'organization_name',
    //   model: 'NGO'
    // })
    // .populate({
    //   path: 'volunteer',
    //   select: 'phone_number',
    //   model: 'Volunteer'
    // });

    // const formattedLogs = allFoodLogs.map(log => ({
    //   ...log._doc,
    //   donor: log.donor.name,
    //   ngo: log.ngo.organization_name,
    //  volunteer: log.volunteer.map(v => v.phone_number)
    // }));
    console.log(allFoodLogs);
    return res.status(200).json(allFoodLogs);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};
module.exports = {
  adminlogin,
  verifyngo,
  verifyVolunteer,
  verifyRestaurant,
  getAllUnverifiedNGOs,
  getAllUnverifiedVolunteers,
  getAllUnverifiedRestaurants,
  getAllngos,
  getAllVolunteers,
  getAllRestaurants,
  deleteVolunteerById,
  deleteRestaurantById,
  deleteNGOById,
  getAllFoodLogs,
  deleteUnverifiedNGOById,
  deleteUnverifiedVolunteerById,
  deleteUnverifiedRestaurantById,
};
