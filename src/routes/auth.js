const express = require('express');
const router = express.Router();
const upload = require('../utils/upload');
const authController = require('../controllers/authController');

// OTP endpoints
router.post('/otp/request', authController.requestOtp);
router.post('/otp/verify', authController.verifyOtp);

// Vendor registration: expects multipart/form-data with optional registrationDoc file
router.post('/vendor/signup', upload.single('registrationDoc'), authController.registerVendor);

// Vendor login
router.post('/vendor/login', authController.loginVendor);

module.exports = router;
