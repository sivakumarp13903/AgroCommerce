const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

const UserSchema = new mongoose.Schema({
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    role: { 
        type: String, 
        enum: ['farmer', 'buyer', 'worker', 'admin'], 
        required: true 
    },
    location: { type: String },
    phone: { type: String },
    createdAt: { type: Date, default: Date.now }
});
UserSchema.pre('save', async function(next) {
    if (this.isModified('password')) {
        const salt = await bcrypt.genSalt(10);  // Generate salt
        this.password = await bcrypt.hash(this.password, salt);  // Hash password
    }
    next();
});

// Method to compare entered password with stored hashed password
UserSchema.methods.matchPassword = async function(enteredPassword) {
    return await bcrypt.compare(enteredPassword, this.password);  // Compare hashed password
};

module.exports = mongoose.model('User', UserSchema);
