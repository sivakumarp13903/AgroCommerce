const express = require('express');
const router = express.Router();
const { postJob, getJobs, applyForJob, getApplications ,getFarmerJobs,updateJob, deleteJob } = require('../controllers/job.controller');
const auth = require('../middleware/auth');
const { protect } = require("../middleware/auth3");

const roleCheck = require('../middleware/roleCheck');

const jobController = require("../controllers/job.controller"); // ✅ Correct way

router.post('/post', auth, roleCheck(['farmer']), jobController.postJob);
router.get('/', jobController.getJobs);
router.post('/apply/:jobId', auth, roleCheck(['worker']), jobController.applyForJob);
router.get('/applications/:jobId', auth, roleCheck(['farmer']), jobController.getApplications);
router.put("/:jobId", auth, roleCheck(["farmer"]), jobController.updateJob); // ✅ Update Job
// router.delete("/:jobId", auth, roleCheck(["farmer"]), jobController.deleteJob); // ✅ Delete Job

// router.get("/farmer", protect, getFarmerJobs);
router.get("/farmer/:farmerId", getFarmerJobs);
router.delete("/:id", jobController.deleteJob);
// // // Route to update a job
// router.put("/:id", protect, updateJob);

// // // Route to delete a job
// router.delete("/:id", protect, deleteJob);


// router.get('/my-jobs', protect, jobController.getMyJobs);



module.exports = router;
