const express = require('express');
const router = express.Router();
const cropFeedController = require('../controllers/cropFeedController');
const auth = require('../middleware/auth');

/**
 * Vendor-only crop feed
 */
router.get('/all', auth(['vendor']), cropFeedController.getAllCrops);

module.exports = router;
