const express = require('express');
const { getAllUsers, getUserById, updateUser, createUser ,deleteUser} = require('../controllers/user.controller'); 

const router = express.Router();


router.get('/user', getAllUsers); 
router.get('/user/:id', getUserById);  
router.put('/user/:id', updateUser);
router.post('/user', createUser); 

router.delete('/delete/:id', deleteUser); 

module.exports = router;
