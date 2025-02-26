const mongoose = require("mongoose");

const PaymentSchema = new mongoose.Schema({
    jobId: { type: mongoose.Schema.Types.ObjectId, ref: "Job", required: true }, // Reference to Job
    farmerId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true }, // Farmer ID
    workerId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true }, // Worker ID
    paymentStatus: {
        type: String,
        enum: ["pending", "sent", "verified"],
        default: "pending" // Default status
    },
    createdAt: { type: Date, default: Date.now } // Timestamp
});

module.exports = mongoose.model("Payment", PaymentSchema);
