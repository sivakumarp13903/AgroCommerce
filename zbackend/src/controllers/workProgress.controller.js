const WorkProgress = require('../models/WorkProgress');
const mongoose = require('mongoose');

// ✅ Create Work Progress
exports.createWorkProgress = async (req, res) => {
    try {
        const { jobId, workerId, farmerId } = req.body;

        // Validate input fields
        if (!jobId || !workerId || !farmerId) {
            return res.status(400).json({ message: 'Missing required fields' });
        }

        // Create new work progress entry
        const workProgress = new WorkProgress({ jobId, workerId, farmerId });
        await workProgress.save();

        res.status(201).json({ message: 'Work Progress created successfully', workProgress });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

// ✅ Update Worker Status
exports.updateWorkerStatus = async (req, res) => {
    try {
        const { workProgressId } = req.params;
        const { workerStatus } = req.body;

        // Validate worker status
        if (!workerStatus) {
            return res.status(400).json({ message: 'Worker status is required' });
        }

        // Find work progress entry
        const workProgress = await WorkProgress.findById(workProgressId);
        if (!workProgress) {
            return res.status(404).json({ message: 'Work Progress not found' });
        }

        // Check if the user is the worker
        if (req.user.id !== workProgress.workerId.toString()) {
            return res.status(403).json({ message: 'You are not authorized to update this work progress' });
        }

        // Update the worker status
        workProgress.workerStatus = workerStatus;
        await workProgress.save();

        res.status(200).json({ message: 'Worker status updated', workProgress });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

// ✅ Farmer Verification of Work
exports.verifyWorkProgress = async (req, res) => {
    try {
        const { workProgressId } = req.params;

        // Find work progress entry
        const workProgress = await WorkProgress.findById(workProgressId);
        if (!workProgress) {
            return res.status(404).json({ message: 'Work Progress not found' });
        }

        // Ensure the requester is the farmer
        if (req.user.id !== workProgress.farmerId.toString()) {
            return res.status(403).json({ message: 'Only the farmer can verify work progress' });
        }

        // Update farmer status to verified
        workProgress.farmerStatus = 'verified';
        await workProgress.save();

        res.status(200).json({ message: 'Work progress verified', workProgress });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

// ✅ Update Payment Status
exports.updatePaymentStatus = async (req, res) => {
    try {
        const { workProgressId } = req.params;
        const { paymentStatus } = req.body;

        // Validate payment status
        if (!paymentStatus) {
            return res.status(400).json({ message: 'Payment status is required' });
        }

        // Find work progress entry
        const workProgress = await WorkProgress.findById(workProgressId);
        if (!workProgress) {
            return res.status(404).json({ message: 'Work Progress not found' });
        }

        // Check if the user is the worker
        if (req.user.id !== workProgress.workerId.toString()) {
            return res.status(403).json({ message: 'You are not authorized to update this payment status' });
        }

        // Update payment status
        workProgress.paymentStatus = paymentStatus;
        await workProgress.save();

        res.status(200).json({ message: 'Payment status updated', workProgress });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};


exports.getWorkProgressByFarmer = async (req, res) => {
    try {
        const farmerId = req.params.farmerId; // Extract farmer ID from request params

        // Fetch work progress and populate jobId (title) & workerId (name)
        const workProgress = await WorkProgress.find({ farmerId })
            .populate("jobId", "title")  // Fetch job title
            .populate("workerId", "name"); // Fetch worker name

        if (!workProgress || workProgress.length === 0) {
            return res.status(404).json({ message: "No work progress found for this farmer" });
        }

        return res.status(200).json(workProgress);
    } catch (error) {
        console.error("Error fetching work progress:", error);
        return res.status(500).json({ message: "Server error while fetching work progress" });
    }
};


exports.updateWorkProgressStatus = async (req, res) => {
    try {
        const { id } = req.params;
        const { status } = req.body;

        if (!status) {
            return res.status(400).json({ message: "Status is required" });
        }

        const updatedWorkProgress = await WorkProgress.findByIdAndUpdate(
            id,
            { workerStatus: status },  // ✅ Ensure the field matches your MongoDB schema
            { new: true }
        );

        if (!updatedWorkProgress) {
            return res.status(404).json({ message: "Work progress not found" });
        }

        res.status(200).json({ message: "Work status updated successfully", updatedWorkProgress });
    } catch (error) {
        console.error("Error updating work progress:", error);
        res.status(500).json({ message: "Server error", error: error.message });
    }
};


// Controller function to update work progress status (if needed)
// exports.updateWorkProgressStatus = async (req, res) => {
//     try {
//         console.log("🔹 Incoming Request to Update Work Progress"); // Debugging

//         const { id } = req.params; 
//         const { workerStatus, farmerStatus, paymentStatus } = req.body; 

//         console.log("🔹 WorkProgress ID:", id);
//         console.log("🔹 Data to Update:", { workerStatus, farmerStatus, paymentStatus });

//         if (!id) {
//             return res.status(400).json({ message: "WorkProgress ID is required" });
//         }

//         // Prepare update object dynamically
//         const updateData = {};
//         if (workerStatus) updateData.workerStatus = workerStatus;
//         if (farmerStatus) updateData.farmerStatus = farmerStatus;
//         if (paymentStatus) updateData.paymentStatus = paymentStatus;

//         console.log("🔹 Update Data:", updateData); // Debugging

//         const updatedWorkProgress = await WorkProgress.findByIdAndUpdate(
//             id,
//             { $set: updateData },
//             { new: true, runValidators: true }
//         );

//         if (!updatedWorkProgress) {
//             console.log("❌ WorkProgress not found!");
//             return res.status(404).json({ message: "Work progress not found" });
//         }

//         console.log("✅ Work Progress Updated Successfully:", updatedWorkProgress);
//         return res.status(200).json(updatedWorkProgress);
//     } catch (error) {
//         console.error("❌ Error updating work progress:", error.message);
//         return res.status(500).json({ message: "Server error while updating work progress" });
//     }
// };


exports.getWorkProgressByWorker = async (req, res) => {
    try {
        const { workerId } = req.params;
        
        // Populate Job Title and Farmer Name
        const workProgress = await WorkProgress.find({ workerId })
            .populate("jobId", "title")  // Fetch Job Title only
            .populate("farmerId", "name"); // Fetch Farmer Name only

        res.json(workProgress);
    } catch (error) {
        console.error("Error fetching work progress:", error);
        res.status(500).json({ message: "Server error" });
    }
};