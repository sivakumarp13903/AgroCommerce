const Job = require("../models/Job");
const Application = require("../models/Application");
const mongoose = require("mongoose");

// ✅ Post a Job (Only Farmers)
exports.postJob = async (req, res) => {
    try {
        const { title, description, location, salary } = req.body;
        const farmerId = req.user.id; // Extract farmer ID from authenticated user
        const job = new Job({ title, description, farmerId, location, salary });
        await job.save();
        res.status(201).json({ message: "Job posted successfully", job });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

// ✅ Get All Job Postings
exports.getJobs = async (req, res) => {
    try {
        const jobs = await Job.find().populate("farmerId", "name email");
        res.json(jobs);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

// ✅ Apply for a Job (Only Workers)
exports.applyForJob = async (req, res) => {
    try {
        const workerId = req.user.id; // Get the authenticated worker's ID
        const { jobId } = req.params;

        // Check if the job exists
        const job = await Job.findById(jobId);
        if (!job) return res.status(404).json({ message: "Job not found" });

        // Check if the worker already applied
        const existingApplication = await Application.findOne({ jobId, workerId });
        if (existingApplication) return res.status(400).json({ message: "You have already applied for this job" });

        // Create a new application
        const application = new Application({ jobId, workerId });
        await application.save();

        res.status(201).json({ message: "Job application submitted successfully", application });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

// ✅ Get Applications for a Job (Only Farmers)
exports.getApplications = async (req, res) => {
    try {
        const { jobId } = req.params;
        console.log(`job Id ${jobId}`);
        
        // Check if the job exists and belongs to the logged-in farmer
        const job = await Job.findById(jobId);
        if (!job) return res.status(404).json({ message: "Job not found" });

        if (job.farmerId.toString() !== req.user.id) {
            return res.status(403).json({ message: "Unauthorized to view applications for this job" });
        }

        // Retrieve applications
        const applications = await Application.find({ jobId }).populate("workerId", "name email");
        res.json(applications);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

exports.getFarmerJobs = async (req, res) => {
    try {
        const { farmerId } = req.params; // Get farmerId from URL parameter

        if (!farmerId) {
            return res.status(400).json({ error: "Farmer ID is required" });
        }

        const jobs = await Job.find({ farmerId }).populate("farmerId", "name email");

        if (jobs.length === 0) {
            return res.status(404).json({ message: "No jobs found for this farmer" });
        }

        res.status(200).json(jobs);
    } catch (err) {
        console.error("Error fetching farmer's jobs:", err);
        res.status(500).json({ error: "Server error" });
    }
};

exports.updateJob = async (req, res) => {
    try {
        const { title, description, location, salary } = req.body;
        const job = await Job.findById(req.params.id);

        if (!job) {
            return res.status(404).json({ message: "Job not found" });
        }

        // Ensure only the farmer who posted it can update
        if (job.farmer.toString() !== req.user._id.toString()) {
            return res.status(403).json({ message: "Unauthorized" });
        }

        job.title = title || job.title;
        job.description = description || job.description;
        job.location = location || job.location;
        job.salary = salary || job.salary;

        const updatedJob = await job.save();
        res.json(updatedJob);
    } catch (error) {
        console.error("Error updating job:", error.message);
        res.status(500).json({ message: "Internal Server Error" });
    }
};

exports.deleteJob = async (req, res) => {
    try {
        const jobId = req.params.id;
        const deletedJob = await Job.findByIdAndDelete(jobId);

        if (!deletedJob) {
            return res.status(404).json({ message: "Job not found" });
        }

        res.json({ message: "Job deleted successfully" });
        
    } catch (error) {
        res.status(500).json({ message: "Error deleting job" });
    }
};


exports.getMyJobs = async (req, res) => {
    try {
        const farmerId = req.user._id; // Ensure user is authenticated

        if (!farmerId) {
            return res.status(401).json({ error: "Unauthorized. No farmer ID found." });
        }

        const jobs = await Job.find({ farmerId: farmerId });

        res.json(jobs);
    } catch (error) {
        console.error("Error fetching farmer's jobs:", error);
        res.status(500).json({ error: "Server error" });
    }
};