const express = require("express");
const {
    applyJob,
    getApplicationsForFarmer,
    getApplicationsForWorker,
    updateApplicationStatus,
    deleteApplication
} = require("../controllers/jobApplication.controller");

const router = express.Router();

// ✅ Apply for a Job (Worker)
router.post("/apply", applyJob);

// ✅ Farmer views job applications
router.get("/farmer/:farmerId", getApplicationsForFarmer);

// ✅ Worker views their applied jobs
router.get("/worker/:workerId", getApplicationsForWorker);

// ✅ Farmer updates application status
router.put("/update/:applicationId", updateApplicationStatus);

// ✅ Worker deletes an application
router.delete("/delete/:applicationId", deleteApplication);

module.exports = router;
