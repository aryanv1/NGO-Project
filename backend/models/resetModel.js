const mongoose = require("mongoose");

const EXPIRATION_TIME = 60 * 60;

const ResetSchema = new mongoose.Schema({
    otp: {
        type: String,
        required: [true, "Code is required"],
        maxlength: 255,
    },
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        unique: true,
    },
    createdAt: {
        type: Date,
        default: Date.now,
        expires: EXPIRATION_TIME,
    },
});

module.exports = mongoose.model("resetPassword", ResetSchema);