const userModel = require("../models/User");
const productModel = require("../models/Commodity")

// Add items to user cart
const addToCart = async (req, res) => {
    try {
        const { userId, itemId } = req.body;
        
        if (!userId || !itemId) {
            return res.status(400).json({ success: false, message: "Missing userId or itemId" });
        }

        // Fetch user and product in parallel
        const [userData, productData] = await Promise.all([
            userModel.findById(userId),
            productModel.findById(itemId)
        ]);

        if (!userData) {
            return res.status(404).json({ success: false, message: "User not found" });
        }

        if (!productData) {
            return res.status(404).json({ success: false, message: "Product not found" });
        }

        if (productData.stock <= 0) {
            return res.status(400).json({ success: false, message: "Product is out of stock" });
        }

        let cartData = userData.cartData || {};

        // Check stock limit before adding to cart
        if (cartData[itemId] && cartData[itemId] >= productData.stock) {
            return res.status(400).json({ success: false, message: "Insufficient stock available" });
        }

        cartData[itemId] = (cartData[itemId] || 0) + 1;

        await userModel.findByIdAndUpdate(userId, { cartData });

        res.status(200).json({ success: true, message: "Item added to cart successfully" });

    } catch (error) {
        console.error("Error in addToCart:", error);
        res.status(500).json({ success: false, message: "Internal Server Error", error: error.message });
    }
};


// Remove items from user cart
const removeFromCart = async (req, res) => {
    try {
        let userData = await userModel.findById(req.body.userId);
        let cartData = userData.cartData;

        if (cartData[req.body.itemId] > 0) {
            cartData[req.body.itemId] -= 1;
        }

        await userModel.findByIdAndUpdate(req.body.userId, { cartData });
        res.json({ success: true, message: "Removed From Cart" });
    } catch (error) {
        console.log(error);
        res.json({ success: false, message: "Error" });
    }
};

// Fetch user cart data
const getCart = async (req, res) => {
    try {
        let userData = await userModel.findById(req.body.userId);
        let cartData = userData.cartData;
        res.json({ success: true, cartData });
    } catch (error) {
        console.log(error);
        res.json({ success: false, message: "Error" });
    }
};

module.exports = { addToCart, removeFromCart, getCart };
