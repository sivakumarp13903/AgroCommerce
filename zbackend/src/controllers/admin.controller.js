const User = require('../models/User');

// ✅ Get all users (Only for Admins)
exports.getAllUsers = async (req, res) => {
    try {
        const users = await User.find().select('-password'); // Exclude passwords for security
        res.json(users);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

// ✅ Delete a user (Only for Admins)
exports.deleteUser = async (req, res) => {
    try {
        const { id } = req.params;

        // Check if user exists
        const user = await User.findById(id);
        if (!user) return res.status(404).json({ message: "User not found" });

        await User.findByIdAndDelete(id);
        res.json({ message: "User deleted successfully" });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};
