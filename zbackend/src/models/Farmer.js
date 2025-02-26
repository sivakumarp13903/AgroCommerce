const mongoose = require("mongoose");

const FarmerSchema = new mongoose.Schema({
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    phone: { type: String, required: true },
    gpayNumber: { type: String } // Optional GPay number for online payments
});

module.exports = mongoose.model("Farmer", FarmerSchema);
