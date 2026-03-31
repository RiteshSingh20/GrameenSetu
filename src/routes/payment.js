const router = require('express').Router();
const paymentController = require('../controllers/paymentController');
const auth = require('../middleware/auth');

router.get(
  '/proceed/:offerId',
  auth(['vendor']),
  paymentController.proceedToPayment
);

router.post(
  '/confirm/:offerId',
  auth(['vendor']),
  paymentController.confirmPayment
);

module.exports = router;
