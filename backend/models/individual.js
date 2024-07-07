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

// Main Volunteer Registration Schema
const volunteerSchema = new mongoose.Schema({
  full_name: { type: String, required: true },
  date_of_birth: { type: Date, required: true },
  email_address: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  phone_number: { type: String, required: true, unique: true },
  current_work_status: { type: String, required: true },
  home_address: { type: addressSchema, required: true },
  availability_mode: { type: Boolean, default: false },
});

// Password hashing middleware
volunteerSchema.pre("save", async function (next) {
  if (this.isModified("password") || this.isNew) {
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
  }
  next();
});

// Password hashing middleware for update
volunteerSchema.pre("findOneAndUpdate", async function (next) {
  const update = this.getUpdate();
  if (update.password) {
    const salt = await bcrypt.genSalt(10);
    update.password = await bcrypt.hash(update.password, salt);
  }
  next();
});

// Method to compare password
volunteerSchema.methods.comparePassword = function (password2) {
  return bcrypt.compare(password2, this.password);
};

const Volunteer = mongoose.model("Volunteer", volunteerSchema);
const Unverified_Individuals = mongoose.model(
  "Unverified_Individuals",
  volunteerSchema
);

module.exports = { Volunteer, Unverified_Individuals };
