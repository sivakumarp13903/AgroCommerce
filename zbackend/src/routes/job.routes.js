const express = require('express');
const router = express.Router();
const { postJob, getJobs, applyForJob, getApplications } = require('../controllers/job.controller');
const auth = require('../middleware/auth');
const roleCheck = require('../middleware/roleCheck');

const jobController = require("../controllers/job.controller"); // ✅ Correct way

router.post('/post', auth, roleCheck(['farmer']), jobController.postJob);
router.get('/', jobController.getJobs);
router.post('/apply/:jobId', auth, roleCheck(['worker']), jobController.applyForJob);
router.get('/applications/:jobId', auth, roleCheck(['farmer']), jobController.getApplications);


module.exports = router;
