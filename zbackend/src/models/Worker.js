const mongoose = require("mongoose");

const WorkerSchema = new mongoose.Schema({
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    phone: { type: String, required: true },
    assignedSlot: { type: mongoose.Schema.Types.ObjectId, ref: "Slot", default: null }
});

module.exports = mongoose.model("Worker", WorkerSchema);
