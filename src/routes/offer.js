const express = require('express');
const router = express.Router();

const auth = require('../middleware/auth');
const {
  sendOffer,
  respondToOffer,
  selectDelivery,
  proceedToPayment,
  getFarmerOffers,
  getVendorOffers,
  completeOffer,
  markOfferSeen
} = require('../controllers/offerController');

/**
 * ================================
 * OFFER ROUTES
 * ================================
 */

/**
 * 🏢 Vendor sends offer on a crop
 * POST /api/offers/send
 */
router.post(
  '/send',
  auth(['vendor']),
  sendOffer
);

/**
 * 👨🌾 Farmer responds to offer
 * ACCEPT / REJECT / NEGOTIATE
 * POST /api/offers/respond
 */
router.post(
  '/respond',
  auth(['farmer']),
  respondToOffer
);

/**
 * 🚚 Vendor selects delivery option
 * POST /api/offers/delivery
 */
router.post(
  '/delivery',
  auth(['vendor']),
  selectDelivery
);

/**
 * 💳 Vendor proceeds to payment (MVP)
 * GET /api/offers/payment/:offerId
 */
router.get(
  '/payment/:offerId',
  auth(['vendor']),
  proceedToPayment
);

/**
 * 👨🌾 Farmer get all offers
 * GET /api/offers/farmer
 */
router.get(
  '/farmer',
  auth(['farmer']),
  getFarmerOffers
);

/**
 * 🏢 Vendor get all sent offers
 * GET /api/offers/vendor
 */
router.get(
  '/vendor',
  auth(['vendor']),
  getVendorOffers
);

/**
 * 👨🌾 Farmer mark offer as seen
 * POST /api/offers/:offerId/mark-seen
 */
router.post(
  '/:offerId/mark-seen',
  auth(['farmer']),
  markOfferSeen
);

/**
 * Farmer confirms payment / complete deal
 * POST /api/offers/complete
 */
router.post(
  '/complete',
  auth(['farmer']),
  completeOffer
);

module.exports = router;
