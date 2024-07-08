const FoodTransaction = require("../models/foodTransaction");
const FoodTransactionLogs = require('../models/foodTrasnactionLogs');
const {Restaurant} = require("../models/restaurant");
const {NGO} = require("../models/ngo");
const Volunteer = require('../models/individual');
const docsUpload = require("../blob/docsUpload");
const mongoose = require("mongoose");
const sendReport = require('../SMTP/foodrequest');

// Create Food Transaction
const createFoodTransaction = async (req, res) => {
  try {
    const {
      foodItems,
      quantity,
      foodtype,
      packaged,
      pickupLocation,
      contactPerson,
      additionalNotes,
    } = req.body;

    const donor = req.user.id;

    let parsed_pickup_location = {};
    let parsed_contactPerson = {};

    if (contactPerson) {
      parsed_contactPerson = JSON.parse(contactPerson);
    } 
    else{
      const restaurant = await Restaurant.findById(donor);
      parsed_contactPerson = {
        name: restaurant.manager_name,
        phone: restaurant.primary_contact_phone,
      };
    }

    // console.log("-------------  Parsed DATA -------------------");
    // console.log(`Parsed contact  : ${parsed_contactPerson}`);
    // console.log("-------------  Parsed DATA -------------------");

    if (pickupLocation) {
      console.log("Pick up location");
      parsed_pickup_location = JSON.parse(pickupLocation);
    } else if (donor) {
      const restaurant = await Restaurant.findById(donor);
      if (!donor) {
        return res.status(404).json({
          message: "Restaurant not found",
        });
      }

      parsed_pickup_location = {
        address: {
          address_line_1: restaurant.physical_address.address_line_1,
          address_line_2: restaurant.physical_address.address_line_2 || "",
          city: restaurant.physical_address.city,
        },
        geo_location: {
          latitude: restaurant.physical_address.geo_location.latitude,
          longitude: restaurant.physical_address.geo_location.longitude,
        },
      };
    } else {
      return res.status(400).json({
        message:
          "Either pickupLocation and contactPerson or restaurantId must be provided",
      });
    }

    // console.log("-------------  Parsed DATA -------------------");
    // console.log(`Parsed pick-up Location : ${parsed_pickup_location}`);
    // console.log("-------------  Parsed DATA -------------------");

    const photoUrls = [];

    for (const photo of req.files.photos) {
      if (photo) {
        const fileName = photo.mimetype;
        const photoUrl = await docsUpload(
          photo.tempFilePath,
          "photo",
          fileName
        );
        photoUrls.push(photoUrl);
      }
    }

    const foodTransaction = new FoodTransaction({
      donor,
      foodItems,
      quantity,
      foodtype,
      packaged,
      pickupLocation: parsed_pickup_location,
      contactPerson: parsed_contactPerson,
      food_photos: photoUrls,
      additionalNotes,
    });

    await foodTransaction.save();

    const { latitude, longitude } = parsed_pickup_location.geo_location;
    const nearbyNGOs = await NGO.find({
      'physical_addresses.geo_location': {
        $geoWithin: {
          $centerSphere: [[longitude, latitude], 25 / 6378.1] // 25 km radius
        }
      }
    });

    const NGOEmails = nearbyNGOs.map(ngo => ngo.primary_contact.email);
    const restaurant = await Restaurant.findById(donor);
    sendReport(NGOEmails, restaurant.name , restaurant.manager_name, restaurant.primary_contact_phone);

    res.status(201).json({
      message: "Food donation created successfully",
      donation: foodTransaction,
    });
  } catch (error) {
    console.error("Error creating food donation:", error);
    return res.status(500).json({
      message: "Internal server error",
      error: error.message,
    });
  }
};

// Get Available Food Transactions
const getAvailableFoodTransactions = async (req, res) => {
  try {
    const availableTransactions = await FoodTransaction.find({ claimed: false }).populate('donor', 'name');
    res.status(200).json(availableTransactions);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

const getAllFoodLogs = async (req, res) => {
  try {

    const pipe = [{
      $project:{
        ngo:1,
        donor:1,
        _id:0
      }
    }];

    const allFoodLogs = await FoodTransactionLogs.aggregate(pipe);

    res.status(200).json(allFoodLogs);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// for perticular NGO. 
const getLogsofNGO = async (req, res) => {
  try {
    const getLogsofNGO = await FoodTransactionLogs.find({ ngo : req.user.id});
    res.status(200).json(getLogsofNGO);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

const getLogsofRestaurant = async (req, res) => {
  try {
    const getLogsofRestaurant = await FoodTransactionLogs.find({ donor : req.user.id});
    res.status(200).json(getLogsofRestaurant);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};


const getTransactionsOfNGO = async (req, res) => {
  try {
    const getTransactionsOfNGO = await FoodTransaction.find({ngo : req.user.id});
    res.status(200).json(getTransactionsOfNGO);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

const getTransactionsOfRestaurant = async (req, res) => {
  try {
    const getTransactionsOfRestaurant = await FoodTransaction.find({ donor : req.user.id});
    res.status(200).json(getTransactionsOfRestaurant);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};


// Claim Food Transaction
const claimFoodTransaction = async (req, res) => {
  try {
    const { transactionId } = req.body;
    const ngoId = req.user.id;

    if (
      !mongoose.isValidObjectId(transactionId) ||
      !mongoose.isValidObjectId(ngoId)
    ) {
      return res
        .status(400)
        .json({ error: "Invalid transaction or NGO ID format" });
    }

    const transaction = await FoodTransaction.findById(transactionId);
    if (!transaction || transaction.claimed) {
      return res
        .status(400)
        .json({ error: "Transaction not available or already claimed" });
    }

    transaction.claimed = true;
    transaction.ngo = ngoId;
    await transaction.save();

    res.status(200).json(transaction);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// Complete Food Distribution and Create Food Transaction Log
const createFoodTransactionLog = async (req, res) => {
  try {
    const {
      transactionId,
      description,
      peopleServed,
      volunteer,
    } = req.body;

    if (!mongoose.isValidObjectId(transactionId)) {
      return res.status(400).json({ error: "Invalid transaction ID format" });
    }

    const transaction = await FoodTransaction.findById(transactionId);
    if (!transaction) {
      return res.status(400).json({ error: "Transaction not found" });
    }

    let volunteer_id =[];
    for(temp of volunteer)
    {
        const volunteer1 = (await Volunteer.findOne({ phone_number : temp}))._id;
        volunteer_id.push(volunteer1);

    }

    // console.log(volunteer_id);

    const fileName1 = req.files.photo1.mimetype;
    const fileName2 = req.files.photo2.mimetype;
    const fileName3 = req.files.photo3.mimetype;

    const photo_urls = [];
    const photoUrl1 = await docsUpload(
      req.files.photo1.tempFilePath,
      "photo",
      fileName1
    );
    const photoUrl2 = await docsUpload(
      req.files.photo2.tempFilePath,
      "photo",
      fileName2
    );
    const photoUrl3 = await docsUpload(
      req.files.photo3.tempFilePath,
      "photo",
      fileName3
    );
    photo_urls.push(photoUrl1);
    photo_urls.push(photoUrl2);
    photo_urls.push(photoUrl3);

    
    const transactionLog = new FoodTransactionLogs({
      donor: transaction.donor,
      foodItems: transaction.foodItems,
      quantity: transaction.quantity,
      foodtype: transaction.foodtype,
      packaged: transaction.packaged,
      pickupLocation: transaction.pickupLocation,
      contactPerson: transaction.contactPerson,
      food_photos: transaction.photos,
      additionalNotes: transaction.additionalNotes,
      ngo: transaction.ngo,
      distribution_photos : photo_urls,
      description,
      peopleServed,
      volunteer : volunteer_id,
    });

    await transactionLog.save();
    await FoodTransaction.findByIdAndDelete(transactionId);

    res.status(200).json(transactionLog);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

module.exports = {
  createFoodTransaction,
  getAvailableFoodTransactions,
  getAllFoodLogs,
  claimFoodTransaction,
  createFoodTransactionLog,
  getLogsofNGO,
  getLogsofRestaurant,
  getTransactionsOfNGO,
  getTransactionsOfRestaurant,
};
