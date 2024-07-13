const mongoose = require('mongoose');

const addressSchema = new mongoose.Schema({
  address_line_1: { type: String, required: true },
  address_line_2: { type: String },
  city: { type: String, required: true },
});

const TransactionLog = new mongoose.Schema({
  donor: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Restaurant',
    required: true,
  },
  foodItems: { type: [String], required: true },
  quantity: { type: Number, required: true },
  foodtype: { type: String, required: true },
  packaged: { type: Boolean, required: true },
  pickupLocation: {
    address: { type: addressSchema, required: true },
    geo_location: {
      latitude: { type: Number, required: true },
      longitude: { type: Number, required: true },
    },
  },
  contactPerson: {
    name: { type: String, required: true },
    phone: { type: String, required: true },
  },
  food_photos: { type: [String], required: true },
  additionalNotes: { type: String },
  // claimed: { type: Boolean, default: false },
  ngo: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'NGO',
    required: true,
  },
  // Below information will be provided by NGO after they distribute the food. 
  distribution_photos: { type: [String], required: true },
  description: { type: String, required: true },
  peopleServed: { type: Number, required: true },
  volunteer : {
    type : [mongoose.Schema.Types.ObjectId],
    ref : 'Volunteer',
  },
  reviewNotes : { type : String },

  // Verification/Rating  can be used to maintain communication between restaurant and NGO. 
  ratings: { type: Number },
}, { timestamps: true });

const FoodTransactionLogs = mongoose.model('FoodTransactionLogs', TransactionLog);

module.exports = FoodTransactionLogs;
