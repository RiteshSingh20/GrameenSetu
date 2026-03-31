const express = require('express');
const router = express.Router();
const marketController = require('../controllers/marketController');

// GET /api/market/prices
router.get('/prices', marketController.getMarketPrices);

module.exports = router;
