const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

const addressSchema = new mongoose.Schema({
  address_line_1: { type: String, required: true },
  address_line_2: { type: String },
  city: { type: String, required: true },
  state: { type: String, required: true },
  zip_code: { type: String, required: true },
  country: { type: String, required: true },
  geo_location: {
    latitude: { type: Number, required: true },
    longitude: { type: Number, required: true },
  },
});

const restObj = {
  name: { type: String, required: true },
  username: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  type: {
    type: String,
    enum: ["Restaurant", "Catering Service", "Community Hall", "Other"],
    required: true,
  },
  business_license_number: { type: String, required: true, unique: true },
  website_url: { type: String },
  manager_name: { type: String, required: true },
  primary_contact_email: { type: String, required: true, unique: true },
  primary_contact_phone: { type: String, required: true, unique: true },
  physical_address: { type: addressSchema, required: true },
  food_handlers_permit: { type: String, required: true },
}

const restaurantSchema = new mongoose.Schema(restObj);
const unverifiedSchema = new mongoose.Schema(restObj);

unverifiedSchema.pre("save", async function (next) {
  if (this.isModified("password") || this.isNew) {
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
  }
  next();
});

// Password hashing middleware for update
restaurantSchema.pre("findOneAndUpdate", async function (next) {
  const update = this.getUpdate();
  if (update.password) {
    const salt = await bcrypt.genSalt(10);
    update.password = await bcrypt.hash(update.password, salt);
  }
  next();
});

// Method to compare password
restaurantSchema.methods.comparePassword = function (password) {
  return bcrypt.compare(password, this.password);
};

unverifiedSchema.methods.comparePassword = function (password) {
  return bcrypt.compare(password, this.password);
};

restaurantSchema.index({ geo_location: "2dsphere" });

const Restaurant = mongoose.model("Restaurant", restaurantSchema);
const Unverified_Restaurants = mongoose.model(
  "Unverified_Restaurants",
  unverifiedSchema
);

module.exports = { Restaurant, Unverified_Restaurants };
