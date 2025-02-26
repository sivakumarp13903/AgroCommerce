const mongoose = require('mongoose');

const WorkProgressSchema = new mongoose.Schema({
    jobId: { type: mongoose.Schema.Types.ObjectId, ref: 'Job', required: true }, // Reference to Job
    workerId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true }, // Reference to Worker
    farmerId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true }, // Reference to Farmer
    workerStatus: {
        type: String,
        enum: ['arrived', 'work in progress', 'completed'],
        default: 'arrived' // Default is 'arrived' when work progress is created
    },
    farmerStatus: {
        type: String,
        enum: ['pending', 'verified'],
        default: 'pending' // Farmer status starts as 'pending' and becomes 'verified' when work is confirmed
    },
    paymentStatus: {
        type: String,
        enum: ['pending', 'sent', 'verified'],
        default: 'pending' // Payment starts as 'pending' and is updated to 'sent' or 'verified'
    },
    createdAt: { type: Date, default: Date.now } // Timestamp for when work progress is created
});

module.exports = mongoose.model('WorkProgress', WorkProgressSchema);
