const JobApplication = require("../models/JobApplication");
const Job = require("../models/Job");
const User = require("../models/User");

// ✅ Worker applies for a job
const applyJob = async (req, res) => {
    try {
        const { jobId, workerId, farmerId, modeOfPayment, gpayNumber } = req.body;

        // Validate required fields
        if (!jobId || !workerId || !farmerId || !modeOfPayment) {
            return res.status(400).json({ message: "All fields are required!" });
        }

        // Ensure Gpay number is provided if Gpay is selected
        if (modeOfPayment === "Gpay" && !gpayNumber) {
            return res.status(400).json({ message: "Gpay number is required when modeOfPayment is Gpay" });
        }

        // Create a new job application
        const newApplication = new JobApplication({
            jobId,
            workerId,
            farmerId,
            modeOfPayment,
            gpayNumber: modeOfPayment === "Gpay" ? gpayNumber : undefined,
            status: "Pending"
        });

        await newApplication.save();
        res.status(201).json({ message: "Job application submitted successfully", application: newApplication });

    } catch (error) {
        console.error("Error applying for job:", error);
        res.status(500).json({ message: "Internal Server Error" });
    }
};

// ✅ Farmer views applications for their job posts
const getApplicationsForFarmer = async (req, res) => {
    try {
        const { farmerId } = req.params;

        // Find all job applications where the farmerId matches
        const applications = await JobApplication.find({ farmerId })
            .populate("jobId", "title description") // Populate job details
            .populate("workerId", "name email phone"); // Populate worker details

        if (!applications.length) {
            return res.status(404).json({ message: "No job applications found for this farmer" });
        }

        res.status(200).json(applications);
    } catch (error) {
        console.error("Error fetching applications for farmer:", error);
        res.status(500).json({ message: "Internal Server Error" });
    }
};

// ✅ Worker views their applied jobs
const getApplicationsForWorker = async (req, res) => {
    try {
        const { workerId } = req.params;

        if (!workerId) {
            return res.status(400).json({ message: "Worker ID is required." });
        }

        // Fetch job applications applied by the worker
        const applications = await JobApplication.find({ workerId })
            .populate({
                path: "jobId",
                select: "title location salary description", // Fetch only necessary job fields
            })
            .populate({
                path: "farmerId",
                select: "name email", // Fetch farmer details
            });

        if (!applications.length) {
            return res.status(404).json({ message: "No applications found for this worker." });
        }

        res.status(200).json(applications);
    } catch (error) {
        console.error("Error fetching applications:", error);
        res.status(500).json({ message: "Internal server error. Please try again later." });
    }
};
// ✅ Farmer updates application status (Accept/Reject)
const updateApplicationStatus = async (req, res) => {
    try {
        const { applicationId } = req.params;
        const { status } = req.body;

        const application = await JobApplication.findById(applicationId);
        if (!application) {
            return res.status(404).json({ message: "Application not found" });
        }

        if (status === "Accepted") {
            // Generate slot allocation (Example: "Slot-12345")
            const allocatedSlot = `Slot-${Math.floor(1000 + Math.random() * 9000)}`;

            // Update status and slot
            application.status = "Accepted";
            application.allocatedSlot = allocatedSlot;
            await application.save();

            return res.status(200).json({ message: "Application accepted", allocatedSlot, application });

        } else if (status === "Rejected") {
            application.status = "Rejected";
            application.allocatedSlot = null;
            await application.save();

            return res.status(200).json({ message: "Application rejected", application });
        }

        res.status(400).json({ message: "Invalid status" });

    } catch (error) {
        console.error("Error updating application status:", error);
        res.status(500).json({ message: "Server error" });
    }
};
// ✅ Worker deletes their application
const deleteApplication = async (req, res) => {
    try {
        const { applicationId } = req.params;
        await JobApplication.findByIdAndDelete(applicationId);
        res.status(200).json({ message: "Application deleted successfully" });
    } catch (error) {
        console.error("Error deleting application:", error);
        res.status(500).json({ message: "Server error" });
    }
};

module.exports = {
    applyJob,
    getApplicationsForFarmer,
    getApplicationsForWorker,
    updateApplicationStatus,
    deleteApplication
};
