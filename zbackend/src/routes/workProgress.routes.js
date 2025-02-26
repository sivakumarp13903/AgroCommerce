const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const {
    createWorkProgress,
    updateWorkerStatus,
    verifyWorkProgress,
    updatePaymentStatus,
    getWorkProgressByFarmer,
    updateWorkProgressStatus,
    getWorkProgressByWorker
    
} = require('../controllers/workProgress.controller');

// Route to create work progress
router.post('/create', auth, createWorkProgress);

router.get('/work-progress/:farmerId',getWorkProgressByFarmer);

// Update work progress status (e.g., Accepted, Rejected, etc.)
router.patch("/work-progress/update/:id", updateWorkProgressStatus);


// Route to update worker status
router.put('/update/worker/:workProgressId', auth, updateWorkerStatus);

router.get('/work-progress/worker/:workerId', getWorkProgressByWorker);
// Route to verify work progress by farmer
router.put('/verify/:workProgressId', auth, verifyWorkProgress);

// Route to update payment status
router.put('/update/payment/:workProgressId', auth, updatePaymentStatus);


module.exports = router;
