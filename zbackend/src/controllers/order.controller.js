const orderModel = require("../models/Order");
const userModel = require("../models/User");
const Stripe = require("stripe");

// Initialize Stripe with environment validation
if (!process.env.STRIPE_SECRET_KEY) {
    console.error("STRIPE_SECRET_KEY is not defined in the environment variables.");
    process.exit(1);
}
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

// Placing user order for frontend
const placeOrder = async (req, res) => {
    const frontend_url = "http://localhost:5174";

    try {
        // Create new order and save to database
        const newOrder = new orderModel({
            userId: req.body.userId,
            items: req.body.items,
            amount: req.body.amount,
            address: req.body.address,
        });
        await newOrder.save();

        // Clear user's cart after order creation
        await userModel.findByIdAndUpdate(req.body.userId, { cartData: {} });

        // Map items to Stripe line_items format
        const line_items = req.body.items.map((item) => ({
            price_data: {
                currency: "inr",
                product_data: {
                    name: item.name,
                },
                unit_amount: item.price * 100, // Convert price to the smallest currency unit
            },
            quantity: item.quantity,
        }));

        // Add delivery charges as a separate line item
        line_items.push({
            price_data: {
                currency: "inr",
                product_data: {
                    name: "Delivery Charges",
                },
                unit_amount: 200, // Delivery charge in smallest currency unit (200 paise = ₹2)
            },
            quantity: 1,
        });

        // Create Stripe checkout session
        const session = await stripe.checkout.sessions.create({
            line_items: line_items,
            mode: "payment",
            success_url: `${frontend_url}/verify?success=true&orderId=${newOrder._id}`,
        });

        res.json({ success: true, session_url: session.url });
    } catch (error) {
        console.error("Error placing order:", error);
        res.status(500).json({ success: false, message: "Error occurred during order placement." });
    }
};

// Verifying order payment
const verifyOrder = async (req, res) => {
    const { orderId, success } = req.body;

    try {
        if (success === "true") {
            await orderModel.findByIdAndUpdate(orderId, { payment: true });
            res.json({ success: true, message: "Payment verified successfully." });
        } else {
            await orderModel.findByIdAndDelete(orderId);
            res.json({ success: false, message: "Payment not completed, order deleted." });
        }
    } catch (error) {
        console.error("Error verifying order:", error);
        res.status(500).json({ success: false, message: "Error verifying payment." });
    }
};

// Fetching user-specific orders for frontend
const userOrders = async (req, res) => {
    try {
        const orders = await orderModel.find({ userId: req.body.userId });
        res.json({ success: true, data: orders });
    } catch (error) {
        console.error("Error fetching user orders:", error);
        res.status(500).json({ success: false, message: "Error fetching orders." });
    }
};

// Listing all orders for admin panel
const listOrders = async (req, res) => {
    try {
        const orders = await orderModel.find({});
        res.json({ success: true, data: orders });
    } catch (error) {
        console.error("Error listing orders:", error);
        res.status(500).json({ success: false, message: "Error listing orders." });
    }
};

// Updating order status for admin
const updateStatus = async (req, res) => {
    try {
        await orderModel.findByIdAndUpdate(req.body.orderId, { status: req.body.status });
        res.json({ success: true, message: "Order status updated successfully." });
    } catch (error) {
        console.error("Error updating order status:", error);
        res.status(500).json({ success: false, message: "Error updating order status." });
    }
};

module.exports = { placeOrder, verifyOrder, userOrders, listOrders, updateStatus };
