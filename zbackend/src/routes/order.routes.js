const express = require("express");
const authMiddleware = require("../middleware/auth2.js");
const { listOrders, placeOrder, updateStatus, userOrders, verifyOrder } = require("../controllers/order.controller.js");

const orderRouter = express.Router();

orderRouter.post("/place", authMiddleware, placeOrder);
orderRouter.post("/verify", verifyOrder);
orderRouter.post("/userorders", authMiddleware, userOrders);
orderRouter.get("/list", listOrders);
orderRouter.post("/status", updateStatus);

module.exports = orderRouter;
