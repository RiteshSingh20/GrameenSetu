const express = require('express');
const router = express.Router();
const vendorAuthController = require('../controllers/vendorAuthController');

router.post('/login', vendorAuthController.login);

module.exports = router;
