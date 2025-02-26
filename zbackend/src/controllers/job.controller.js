const Job = require("../models/Job");
const Application = require("../models/Application");

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
