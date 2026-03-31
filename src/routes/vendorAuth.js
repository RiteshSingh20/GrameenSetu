const express = require('express');
const router = express.Router();
const vendorAuthController = require('../controllers/vendorAuthController');

/**
 * LOGIN
 * POST /api/vendor/auth/login
 */
router.post('/login', vendorAuthController.login);

/**
 * REFRESH ACCESS TOKEN
 * POST /api/vendor/auth/refresh-token
 */
router.post('/refresh-token', vendorAuthController.refreshToken);

/**
 * LOGOUT
 * POST /api/vendor/auth/logout
 */
router.post('/logout', vendorAuthController.logout);

module.exports = router;
