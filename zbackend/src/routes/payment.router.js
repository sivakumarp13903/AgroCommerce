const express = require("express");
const router = express.Router();
const paymentController = require("../controllers/payment.controller");

// ✅ Create a new payment (Farmer verifies work)
router.post("/create", paymentController.createPayment);

// ✅ Fetch all payments for a specific worker
router.get("/worker/:workerId", paymentController.getWorkerPayments);

// ✅ Fetch all payments for a specific farmer
router.get("/farmer/:farmerId", paymentController.getFarmerPayments);

// ✅ Update payment status (Pending → Sent or Verified)
router.put("/update/:id", paymentController.updatePaymentStatus);

// ✅ Worker verifies payment received
router.put("/verify-worker/:id", paymentController.verifyWorkerPayment);


module.exports = router;
