const multer = require('multer');
const path = require('path');

// Set destination folder for image uploads
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'uploads/products');
    },
    filename: (req, file, cb) => {
        cb(null, Date.now() + path.extname(file.originalname)); // Add timestamp to avoid overwriting files
    }
});

// Filter for image files only (optional)
const fileFilter = (req, file, cb) => {
    const allowedTypes = ['image/jpeg', 'image/png', 'image/jpg'];
    if (!allowedTypes.includes(file.mimetype)) {
        return cb(new Error('Invalid image type, only JPEG, PNG, and JPG allowed'), false);
    }
    cb(null, true);
};

// Set up the upload middleware
const upload = multer({
    storage,
    fileFilter,
    limits: { fileSize: 5 * 1024 * 1024 }, // Max file size of 5MB
}).single('image'); // Only a single image per product

module.exports = { upload };
