const Offer = require('../models/Offer');
const CropListing = require('../models/CropListing');
const Farmer = require('../models/Farmer');
const Notification = require('../models/Notification');
const { sendEmail } = require('../utils/sendEmail');

/**
 * VENDOR PROCEEDS TO PAYMENT
 */
exports.proceedToPayment = async (req, res) => {
  try {
    const vendorId = req.user.id;
    const { offerId } = req.params;

    const offer = await Offer.findOne({
      _id: offerId,
      vendorId,
      status: 'Accepted'
    });

    if (!offer) {
      return res.status(400).json({
        message: 'Payment not allowed for this offer'
      });
    }

    res.json({
      dealId: offer._id,
      amount: offer.finalPrice,
      message: 'Proceed to payment gateway'
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Failed to proceed to payment' });
  }
};

/**
 * VENDOR CONFIRMS PAYMENT (DUMMY)
 * POST /api/payment/confirm/:offerId
 */
exports.confirmPayment = async (req, res) => {
  try {
    const vendorId = req.user.id;
    const { offerId } = req.params;
    const { method = 'upi', upiId = '', txnRef = '' } = req.body || {};

    const offer = await Offer.findOne({
      _id: offerId,
      vendorId
    }).populate('cropId').populate('farmerId');

    if (!offer) {
      return res.status(404).json({ message: 'Offer not found' });
    }

    if (offer.status !== 'Accepted') {
      return res.status(400).json({ message: 'Payment not allowed for this offer. Offer must be in Accepted status.' });
    }

    if (!offer.delivery?.confirmed) {
      return res.status(400).json({ message: 'Delivery must be confirmed before payment. Please arrange pickup first.' });
    }

    if (offer.status === 'Completed' || offer.payment?.status === 'Paid') {
      return res.json({ message: 'Payment already completed' });
    }

    const crop = await CropListing.findById(offer.cropId?._id || offer.cropId);
    if (!crop) return res.status(404).json({ message: 'Crop not found' });

    const amount = Number(offer.finalPrice) || 0;

    offer.payment = {
      status: 'Paid',
      method,
      amount,
      paidAt: new Date(),
      upiId,
      txnRef
    };
    offer.status = 'Completed';
    await offer.save();

    crop.status = 'Sold';
    crop.finalPrice = amount;
    crop.soldAt = new Date();
    await crop.save();

    const farmer = offer.farmerId ? await Farmer.findById(offer.farmerId) : null;
    if (farmer) {
      const title = 'Payment Received';
      const message = `Your crop deal payment of ₹${amount} has been credited successfully.`;
      await Notification.create({
        farmerId: farmer._id,
        title,
        message,
        type: 'payment'
      });

      if (farmer.email) {
        const cropName = crop.cropName || 'your crop';
        const qty = crop.quantity ? `${crop.quantity} ${crop.unit || ''}`.trim() : '';
        const emailMessage = `
          <strong>Payment Successful!</strong><br/><br/>
          Dear ${farmer.fullName},<br/>
          We have successfully credited <strong>₹${amount}</strong> for ${cropName}${qty ? ` (${qty})` : ''}.<br/>
          Deal ID: ${offer._id}<br/><br/>
          Thank you for selling with GrameenSetu. We are excited to help you reach better buyers and prices.<br/>
        `;
        await sendEmail(farmer.email, 'Payment Credited - GrameenSetu', emailMessage);
      }
    }

    return res.json({
      message: 'Payment completed',
      amount,
      offerId: offer._id
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Failed to confirm payment' });
  }
};
