const {Restaurant , Unverified_Restaurants} = require("../models/restaurant");
const docsUpload = require("../blob/docsUpload");
const mongoose = require("mongoose");
const jwt = require("jsonwebtoken");

const registerRestaurant = async (req, res) => {
  try {
    const {
      name,
      username,
      password,
      type,
      business_license_number,
      website_url,
      manager_name,
      primary_contact_email,
      primary_contact_phone,
      physical_address,
    } = req.body;

    console.log(req.body);

    // Parse physical address from JSON string
    const parsed_physical_address = JSON.parse(physical_address);

    const file = req.files.food_handlers_permit;

    const url = await docsUpload(file.tempFilePath,"docs","");

    const newRestaurant = new Unverified_Restaurants({
      name,
      username,
      password,
      type,
      business_license_number,
      website_url,
      manager_name,
      primary_contact_email,
      primary_contact_phone,
      physical_address: parsed_physical_address,
      food_handlers_permit: url,
    });

    // console.log(newRestaurant);
    
    // Check for duplicates
    const temp = await Restaurant.findOne({
      $or: [
        { username : newRestaurant.username },
        { primary_contact_email: newRestaurant.primary_contact_email },
        { primary_contact_phone: newRestaurant.primary_contact_phone }
      ]
    });

    if (temp) {
      return res.status(400).json({
        message: 'Duplicate entry detected for username, email, or phone number',
      });
    }
    
    // Save the new Restaurant record
    await newRestaurant.save();

    // Respond with success message and the registered Restaurant details
    res.status(201).json({
      message: "Restaurant registered successfully",
      restaurant: newRestaurant,
    });
  } catch (error) {
    // Handle potential duplicate key error or other errors
    if (error.code === 11000) {
      const dup = Object.keys(error.keyValue)[0];
      res.status(400).json({
        message: `Duplicate entry detected for ${dup}`,
      });
    } else {
      res.status(400).json({
        message: "Error registering Restaurant",
        error: error.message,
      });
    }
  }
};

const loginRestaurant = async (req, res) => {
  const { email, password } = req.body;
  try {
    const restaurant = await Restaurant.findOne({ "username" : email });

    if (!restaurant) {
      return res.status(404).json({ message: "Restaurant not found" });
    }

    const isMatch = await restaurant.comparePassword(password);

    if (!isMatch) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    const token = jwt.sign({ id: restaurant._id }, process.env.JWT_SECRET_Rest, { expiresIn: '5d' });

    res.status(200).json({
      message: "Login successful",
      token,
    });
  } catch (error) {
    console.log("Error at restaurant login");
    res.status(500).json({ message: error.message });
  }
};


const getRestaurantById = async (req, res) => {
  const restaurantId = req.user.id;

  if (!mongoose.isValidObjectId(restaurantId)) {
    console.log("Invalid restaurant ID.");
    return res.status(400).json({ message: "Invalid restaurant ID format" });
  }

  try {
    const restaurant = await Restaurant.findOne({ _id: restaurantId });

    if (!restaurant) {
      return res
        .status(404)
        .json({ message: `No restaurant found with ID : ${restaurantId}` });
    }

    res.status(200).json(restaurant);
  } catch (error) {
    console.error("Error fetching restaurant:", error);
    return res
      .status(500)
      .json({ message: "An error occurred while fetching the restaurant" });
  }
};

const getAllRestaurants = async (req, res) => {
  try {
    const restaurants = await Restaurant.find();
    res.status(200).json({ restaurants });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const updateRestaurantDetails = async (req,res)=> {

  const restaurantId = req.user.id;
  
  if (!mongoose.isValidObjectId(restaurantId)) {
    console.log("Invalid restaurant ID.");
    return res.status(400).json({ message: "Invalid restaurant ID format" });
  }

  try {
    const {name,type,website_url,manager_name,primary_contact_email,primary_contact_phone,physical_address,} = req.body;
    console.log(req.body);
    // const parsed_physical_address = JSON.parse(physical_address);
    const parsed_physical_address = physical_address;
    console.log(parsed_physical_address);
    await Restaurant.updateOne({_id:restaurantId}, { name,type,website_url,manager_name,primary_contact_email,primary_contact_phone,physical_address: parsed_physical_address},);
    res.status(200).send("success!!");
  } catch (error) {
    if (error.code == 11000) {
      const dup = Object.keys(error.keyValue)[0];
      res.status(400).json({ message: `Duplicate entry detected for ${dup}`});
    } else {
      res.status(500).json({ message: "Error registering Restaurant", error: error.message });
    }
  }
};

const deleteRestaurant = async (req, res) => {

  const {restaurantId} = req.user.id;
  
  // Check if the ID is a valid ObjectId
  if (!mongoose.isValidObjectId(restaurantId)) {
    console.log("Invalid restaurant ID format.");
    return res.status(400).json({ message: "Invalid restaurant ID format" });
  }

  try {
    const deletedRestaurant = await Restaurant.findByIdAndDelete(restaurantId);
    if (!deletedRestaurant) {
      return res.status(404).json({ message: "Restaurant not found" });
    }
    res.status(200).json({ message: "Restaurant deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  registerRestaurant,
  getRestaurantById,
  getAllRestaurants,
  updateRestaurantDetails,
  deleteRestaurant,
  loginRestaurant,
};
