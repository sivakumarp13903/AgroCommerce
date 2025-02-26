const mongoose = require("mongoose");

const slotSchema = new mongoose.Schema({
    jobId: { type: mongoose.Schema.Types.ObjectId, ref: "Job", required: true },
    workerId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    allottedAt: { type: Date, default: Date.now },
    status: { type: String, enum: ["Allotted", "Completed"], default: "Allotted" }
});

module.exports = mongoose.model("Slot", slotSchema);
