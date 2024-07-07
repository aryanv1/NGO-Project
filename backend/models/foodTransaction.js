const mongoose = require('mongoose');

const addressSchema = new mongoose.Schema({
  address_line_1: { type: String, required: true },
  address_line_2: { type: String },
  city: { type: String, required: true },
});

const foodDonationSchema = new mongoose.Schema({
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
  claimed: { type: Boolean, default: false },
  ngo: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'NGO',
  },
}, { timestamps: true });

const FoodTransaction = mongoose.model('FoodTransaction', foodDonationSchema);

module.exports = FoodTransaction;