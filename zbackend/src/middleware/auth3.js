const jwt = require('jsonwebtoken');
const User = require('../models/User'); // Adjust path

const protect = async (req, res, next) => {
    try {
        let token = req.header("Authorization");

        if (!token || !token.startsWith("Bearer ")) {
            return res.status(401).json({ error: "No token provided, authorization denied" });
        }

        token = token.split(" ")[1]; // Extract token after 'Bearer'
        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        req.user = await User.findById(decoded.id).select("-password");

        if (!req.user) {
            return res.status(404).json({ error: "User not found" });
        }

        next();
    } catch (error) {
        console.error("Auth Error:", error);
        res.status(401).json({ error: "Invalid token, authorization denied" });
    }
};

module.exports = protect;
