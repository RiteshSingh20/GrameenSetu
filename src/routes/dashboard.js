const express = require('express');
const router = express.Router();
const dashboardController = require('../controllers/dashboardController');
const auth = require('../middleware/auth');

// 👨‍🌾 Farmer dashboard
router.get(
  '/farmer',
  auth(['farmer']),
  dashboardController.getFarmerDashboard
);

// 🏢 Vendor dashboard
router.get(
  '/vendor',
  auth(['vendor']),
  dashboardController.getVendorDashboard
);

module.exports = router;
