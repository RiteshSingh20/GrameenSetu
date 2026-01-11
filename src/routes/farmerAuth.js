const express = require('express');
const router = express.Router();
const farmerAuthController = require('../controllers/farmerAuthController');

router.post('/login/request-otp', farmerAuthController.requestOtp);
router.post('/login/verify-otp', farmerAuthController.verifyOtp);

module.exports = router;
