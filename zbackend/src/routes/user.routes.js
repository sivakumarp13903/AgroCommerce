const express = require('express');
const { getAllUsers, getUserById, updateUser, createUser } = require('../controllers/user.controller'); 

const router = express.Router();


router.get('/user', getAllUsers); 
router.get('/user/:id', getUserById);  
router.put('/user/:id', updateUser);
router.post('/user', createUser);  

module.exports = router;
