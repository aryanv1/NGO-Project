const FoodTransaction = require("../models/foodTransaction");
const FoodTransactionLogs = require('../models/foodTrasnactionLogs');
const {Restaurant} = require("../models/restaurant");
const {NGO} = require("../models/ngo");
const {Volunteer} = require('../models/individual');
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
const getAvailableFoodTransactions_NGO = async (req, res) => {
  try {
    const availableTransactions = await FoodTransaction.find({ claimed: false }).populate('donor', 'name');
    res.status(200).json(availableTransactions);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

const getAllFoodLogs = async (req, res) => {
  try {

    // const pipe = [{
    //   $project:{
    //     ngo:1,
    //     donor:1,
    //     _id:0
    //   }
    // }];

    // const allFoodLogs = await FoodTransactionLogs.aggregate(pipe);
    const allFoodLogs = await FoodTransactionLogs.find();
    res.status(200).json(allFoodLogs);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// for perticular NGO. 
const getLogsofNGO = async (req, res) => {
  try {
    const logs = await FoodTransactionLogs.find({ ngo: req.user.id })
      .populate({
        path: 'donor',
        select: 'name',
        model: 'Restaurant'
      })
      .populate({
        path: 'ngo',
        select: 'organization_name',
        model: 'NGO'
      })
      .populate({
        path: 'volunteer',
        select: 'phone_number',
        model: 'Volunteer'
      });

    const formattedLogs = logs.map(log => ({
      ...log._doc,
      donor: log.donor.name,
      ngo: log.ngo.organization_name,
      volunteer: log.volunteer.map(v => v.phone_number)
    }));

    res.status(200).json(formattedLogs);
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
    const transactions = await FoodTransaction.find({ ngo: req.user.id }).populate('donor', 'name');
    res.status(200).json(transactions);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

const getTransactionsOfRestaurant = async (req, res) => {
  try {
    const getTransactionsOfRestaurant = await FoodTransaction.find({claimed: true , donor : req.user.id});
    res.status(200).json(getTransactionsOfRestaurant);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

const getPendingFoodTransactions_restaurant = async (req, res) => {
  try {
    const availableTransactions = await FoodTransaction.find({
      claimed: false,
      donor: req.user.id
    });
    res.status(200).json(availableTransactions);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

const deleteFoodRequest = async(req,res) => {
  try {
    const { transactionId } = req.body;
    await FoodTransaction.findByIdAndDelete(transactionId);
    res.status(200).json({ message: 'Donation request deleted successfully' });
  } catch (error) {
      res.status(500).json({ error: 'Failed to delete donation request' });
  }
}
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
    res.status(200).json();
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
      phone_numbers,
    } = req.body;

    console.log(req.body);
    if (!mongoose.isValidObjectId(transactionId)) {
      return res.status(400).json({ error: "Invalid transaction ID format" });
    }
    const transaction = await FoodTransaction.findById(transactionId);
    if (!transaction) {
      return res.status(400).json({ error: "Transaction not found" });
    }

    let volunteer_id =[];
    if(phone_numbers){
      for(phone of phone_numbers)
      {
          const volunteer1 = await Volunteer.findOne({ phone_number : phone});
          if(volunteer1)
            volunteer_id.push(volunteer1._id);
      }
    }

    const photoUrls = [];

    for (const photo of req.files.distribution_photos) {
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
    
    const transactionLog = new FoodTransactionLogs({
      donor: transaction.donor,
      foodItems: transaction.foodItems,
      quantity: transaction.quantity,
      foodtype: transaction.foodtype,
      packaged: transaction.packaged,
      pickupLocation: transaction.pickupLocation,
      contactPerson: transaction.contactPerson,
      food_photos: transaction.food_photos,
      additionalNotes: transaction.additionalNotes,
      ngo: transaction.ngo,
      distribution_photos : photoUrls,
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
  getAvailableFoodTransactions_NGO,
  getAllFoodLogs,
  claimFoodTransaction,
  createFoodTransactionLog,
  getLogsofNGO,
  getLogsofRestaurant,
  getTransactionsOfNGO,
  getTransactionsOfRestaurant,
  deleteFoodRequest,
  getPendingFoodTransactions_restaurant,
};
