const Payment = require("../models/Payment");

// ✅ Create Payment when Farmer Verifies Work
exports.createPayment = async (req, res) => {
    try {
        const { jobId, farmerId, workerId } = req.body;
        if (!jobId || !farmerId || !workerId) {
            return res.status(400).json({ message: "Missing required fields" });
        }
        
        const newPayment = new Payment({ jobId, farmerId, workerId, paymentStatus: "pending" });
        await newPayment.save();

        res.status(201).json({ message: "Payment created successfully", newPayment });
    } catch (error) {
        console.error("Error creating payment:", error);
        res.status(500).json({ message: "Server error", error: error.message });
    }
};

// ✅ Fetch All Payments for a Worker
exports.getWorkerPayments = async (req, res) => {
    try {
        const { workerId } = req.params;
        if (!workerId) return res.status(400).json({ message: "Worker ID is required" });

        const payments = await Payment.find({ workerId }).populate("jobId farmerId");
        res.status(200).json(payments);
    } catch (error) {
        console.error("Error fetching worker payments:", error);
        res.status(500).json({ message: "Internal server error" });
    }
};

// ✅ Fetch All Payments for a Farmer
exports.getFarmerPayments = async (req, res) => {
    try {
        const { farmerId } = req.params;
        if (!farmerId) return res.status(400).json({ message: "Farmer ID is required" });

        const payments = await Payment.find({ farmerId }).populate("jobId workerId");
        res.status(200).json(payments);
    } catch (error) {
        console.error("Error fetching farmer payments:", error);
        res.status(500).json({ message: "Internal server error" });
    }
};

// ✅ Update Payment Status (Pending → Sent or Verified)
exports.updatePaymentStatus = async (req, res) => {
    try {
        const { id } = req.params;
        const { paymentStatus } = req.body;

        if (!paymentStatus || !["pending", "sent", "verified"].includes(paymentStatus)) {
            return res.status(400).json({ message: "Invalid or missing payment status" });
        }

        const payment = await Payment.findByIdAndUpdate(id, { paymentStatus }, { new: true });
        if (!payment) return res.status(404).json({ message: "Payment record not found" });

        res.status(200).json({ message: "Payment status updated successfully", payment });
    } catch (error) {
        console.error("Error updating payment status:", error);
        res.status(500).json({ message: "Internal server error" });
    }
};

// ✅ Worker verifies payment received
exports.verifyWorkerPayment = async (req, res) => {
    try {
        const { id } = req.params;
        
        const payment = await Payment.findById(id);
        if (!payment) return res.status(404).json({ message: "Payment record not found" });

        if (payment.paymentStatus !== "sent") {
            return res.status(400).json({ message: "Payment must be in 'sent' status before verification" });
        }

        payment.paymentStatus = "verified";
        await payment.save();

        res.status(200).json({ message: "Worker payment verified successfully", payment });
    } catch (error) {
        console.error("Error verifying worker payment:", error);
        res.status(500).json({ message: "Internal server error" });
    }
};
