// const mongoose = require('mongoose');

// const ProductSchema = new mongoose.Schema({
//     name: { type: String, required: true },
//     description: { type: String, required: true },
//     price: { type: Number, required: true },
//     stock: { type: Number, required: true },
//     image: { type: String }, // For product image if needed
//     createdAt: { type: Date, default: Date.now },
// });

// module.exports = mongoose.model('Product', ProductSchema);



const mongoose = require('mongoose');

const ProductSchema = new mongoose.Schema({
    name: { 
        type: String, 
        required: true 
    },
    description: { 
        type: String, 
        required: true 
    },
    price: { 
        type: Number, 
        required: true 
    },
    stock: { 
        type: Number, 
        required: true, 
        min: [0, 'Stock cannot be negative'] // Prevent stock from going below zero
    },
    image: { 
        type: String // For product image if needed
    },
    status: { 
        type: String, 
        enum: ['In Stock', 'Out of Stock'], 
        default: 'In Stock' // Track the stock status
    },
    createdAt: { 
        type: Date, 
        default: Date.now 
    },
});

// Middleware to automatically update the product status when stock reaches 0
ProductSchema.pre('save', function(next) {
    if (this.stock === 0) {
        this.status = 'Out of Stock';
    }
    next();
});

module.exports = mongoose.model('Product', ProductSchema);
    