const express = require('express');
const router = express.Router();
const farmerController = require('../controllers/farmerController');
const authController = require('../controllers/authController');

router.post('/signup', farmerController.registerFarmer);

// Farmer login routes
router.post('/login/otp/request', authController.requestOtpForFarmerLogin);
router.post('/login/otp/verify', authController.verifyOtpForFarmerLogin);

module.exports = router;
