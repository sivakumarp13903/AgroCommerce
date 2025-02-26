const mongoose = require("mongoose");

const orderSchema = new mongoose.Schema({
    userId: { type: String, required: true },
    items: { type: Array, required: true },
    amount: { type: Number, required: true },
    address: { type: Object, required: true },
    status: { type: String, default: "Order Processing" },
    date: { type: Date, default: Date.now },
    payment: { type: Boolean, default: false }
});

const OrderModel = mongoose.models.order || mongoose.model("CommodityOrder", orderSchema);

module.exports = OrderModel;
