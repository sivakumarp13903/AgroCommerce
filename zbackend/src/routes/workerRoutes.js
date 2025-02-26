const express = require('express');
const router = express.Router();
const Job = require('../models/Job');
const JobApplication = require('../models/JobApplication');
const WorkSlot = require('../models/WorkSlot');
const Payment = require('../models/Payment');
const { protect, workerAuth } = require('../middleware/authMiddleware'); 

// Get all available jobs
router.get('/jobs', protect, workerAuth, async (req, res) => {
    try {
        const jobs = await Job.find({ status: 'Open' });
        res.json(jobs);
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
});

// Apply for a job
router.post('/apply/:jobId', protect, workerAuth, async (req, res) => {
    try {
        const { jobId } = req.params;
        const workerId = req.user._id;

        const existingApplication = await JobApplication.findOne({ jobId, workerId });
        if (existingApplication) return res.status(400).json({ message: 'Already applied for this job' });

        const job = await Job.findById(jobId);
        if (!job) return res.status(404).json({ message: 'Job not found' });

        const application = new JobApplication({ jobId, workerId, farmerId: job.farmerId });
        await application.save();

        res.json({ message: 'Job application submitted' });
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
});

// Get applied jobs
router.get('/applied-jobs', protect, workerAuth, async (req, res) => {
    try {
        const appliedJobs = await JobApplication.find({ workerId: req.user._id }).populate('jobId');
        res.json(appliedJobs);
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
});

// Get accepted jobs
router.get('/accepted-jobs', protect, workerAuth, async (req, res) => {
    try {
        const workSlots = await WorkSlot.find({ workerId: req.user._id }).populate('jobId');
        res.json(workSlots);
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
});

// Get payment status
router.get('/payments', protect, workerAuth, async (req, res) => {
    try {
        const payments = await Payment.find({ workerId: req.user._id }).populate('jobId');
        res.json(payments);
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
});

module.exports = router;
