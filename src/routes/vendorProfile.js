const express = require('express');
const router = express.Router();
const vendorProfileController = require('../controllers/vendorProfileController');
const auth = require('../middleware/auth');

// Get vendor profile statistics (detailed)
router.get(
  '/profile/stats',
  auth(['vendor']),
  vendorProfileController.getVendorProfileStats
);

// Get vendor profile summary (quick counts)
router.get(
  '/profile/summary',
  auth(['vendor']),
  vendorProfileController.getVendorProfileSummary
);

module.exports = router;
