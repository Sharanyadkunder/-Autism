const express = require('express');
const { signup, login,updateuser,geteuser } = require('../controllers/authController');

const router = express.Router();

// User Signup
router.get('/', ()=>
{
    console.log("Hello");
});
router.post('/signup', signup);

// User Login
router.post('/login', login);
router.post('/users/:id', updateuser);
router.get('/users/:id', geteuser);

module.exports = router;
