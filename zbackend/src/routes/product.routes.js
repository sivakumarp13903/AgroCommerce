const express = require('express');
const { createProduct, getAllProducts, getProductById, updateProduct, deleteProduct } = require('../controllers/product.controller');
const multer = require('multer');
const path = require('path');

// Set up multer storage for product images
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'uploads/'); // Directory for image uploads
    },
    filename: (req, file, cb) => {
        cb(null, Date.now() + '-' + file.originalname); // Avoid filename conflicts
    }
});

const upload = multer({ storage: storage });

const router = express.Router();

// Routes for product operations
router.post('/product', upload.single('image'), createProduct); // 'image' is the form-data field name
router.get('/products', getAllProducts);
router.get('/product/:id', getProductById);
router.put('/product/:id', updateProduct);
router.delete('/product/:id', deleteProduct);

// Route to serve product image
router.get('/uploads/:image', (req, res) => {
    res.sendFile(path.join(__dirname, '../uploads', req.params.image));
});

module.exports = router;
