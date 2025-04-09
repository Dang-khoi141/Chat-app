const express = require('express');
const {login, logout, signup,updateProfile,checkAuth} = require('../controllers/auth.controller');
const protectRoute = require('../middleware/auth.middleware')
const router = express.Router();

router.post('/signup',signup);
router.post('/login',login);
router.post('/logout',logout);

// thong qua protectRoute de check trung gian
router.put("/update-profile",protectRoute,updateProfile);

router.get('/check',protectRoute,checkAuth);

module.exports= router