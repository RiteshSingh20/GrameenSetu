const express = require('express');
const router = express.Router();
const farmerAuthController = require('../controllers/farmerAuthController');

/**
 * REQUEST OTP
 * POST /api/farmer/auth/login/request-otp
 */
router.post('/login/request-otp', farmerAuthController.requestOtp);

/**
 * VERIFY OTP & LOGIN
 * POST /api/farmer/auth/login/verify-otp
 */
router.post('/login/verify-otp', farmerAuthController.verifyOtp);

/**
 * REFRESH ACCESS TOKEN
 * POST /api/farmer/auth/refresh-token
 */
router.post('/refresh-token', farmerAuthController.refreshToken);

/**
 * LOGOUT
 * POST /api/farmer/auth/logout
 */
router.post('/logout', farmerAuthController.logout);

module.exports = router;
