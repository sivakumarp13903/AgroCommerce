const express = require("express");
const orderModel = require("../models/Order"); // Import your order schema
const userModel = require("../models/User");   // Import your user schema

const router = express.Router();

// 📌 Route to fetch dashboard statistics
router.get("/stats", async (req, res) => {
  try {
    const totalUsers = await userModel.countDocuments(); // Total users
    const totalOrders = await orderModel.countDocuments(); // Total orders
    const totalRevenue = await orderModel.aggregate([
      { $match: { payment: true } }, // Only count paid orders
      { $group: { _id: null, total: { $sum: "₹amount" } } },
    ]);

    res.json({
      success: true,
      data: {
        totalUsers,
        totalOrders,
        totalRevenue: totalRevenue.length > 0 ? totalRevenue[0].total : 0,
      },
    });
  } catch (error) {
    console.error("Error fetching dashboard stats:", error);
    res.status(500).json({ success: false, message: "Error fetching stats." });
  }
});

// 📌 Route to fetch recent activities
router.get("/activities", async (req, res) => {
    try {
      const recentOrders = await orderModel
        .find({ payment: true }) // Filter only paid orders
        .sort({ createdAt: -1 }) // Sort by newest orders first
        .limit(5); // Get only the latest 5 paid orders
  
      res.json({ success: true, data: recentOrders });
    } catch (error) {
      console.error("Error fetching recent activities:", error);
      res.status(500).json({ success: false, message: "Error fetching activities." });
    }
  });
  

module.exports = router;
