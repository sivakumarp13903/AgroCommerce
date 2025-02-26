const express = require('express');
const router = express.Router();
const { getAllUsers, deleteUser } = require('../controllers/admin.controller');
const auth = require('../middleware/auth');
const roleCheck = require('../middleware/roleCheck');

router.get('/users', auth, roleCheck(['admin']), getAllUsers); // Get all users (Only Admin)
router.delete('/user/:id', auth, roleCheck(['admin']), deleteUser); // Delete a user (Only Admin)

module.exports = router;
