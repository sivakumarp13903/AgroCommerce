const express = require('express');
const { register, login } = require('../controllers/auth.controller'); // Adjust the path if needed

const router = express.Router();

// Register route
router.post('/register', register);

// Login route
router.post('/login', login);

module.exports = router;
