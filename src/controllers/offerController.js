const Offer = require('../models/Offer');
const CropListing = require('../models/CropListing');
const Vendor = require('../models/Vendor');
const Farmer = require('../models/farmer');
const { calculateDelivery } = require('../utils/deliveryCalculator');
const { sendEmail } = require('../utils/sendEmail');

/**
 * VENDOR SEND OFFER (BID OPTIONAL)
 */
exports.sendOffer = async (req, res) => {
  try {
    const vendorId = req.user.id;
    const { cropId, offeredPrice } = req.body;

    if (!cropId) {
      return res.status(400).json({ message: 'cropId is required' });
    }

    const crop = await CropListing.findById(cropId);
    if (!crop) {
      return res.status(404).json({ message: 'Crop not found' });
    }

    if (crop.status !== 'Active') {
      return res.status(400).json({ message: 'Crop is not available for offers' });
    }

    const existingOffer = await Offer.findOne({
      cropId,
      vendorId
    });

    if (existingOffer) {
      return res.status(400).json({
        message: 'You have already sent an offer for this crop'
      });
    }

    const finalPrice = offeredPrice
      ? Number(offeredPrice)
      : crop.expectedPrice;

    const offer = await Offer.create({
      cropId,
      farmerId: crop.farmerId,
      vendorId,
      offeredPrice: offeredPrice || null,
      finalPrice,
      status: 'Pending'
    });

    // Notify farmer
    const farmer = await Farmer.findById(crop.farmerId);
    const vendor = await Vendor.findById(vendorId);
    if (farmer && farmer.email) {
      sendEmail(
        farmer.email,
        'New Offer on Your Crop',
        `${vendor?.businessName || 'A vendor'} from ${vendor?.location || 'nearby'} wants to buy your crop at ₹${finalPrice}`
      );
    }

    return res.status(201).json({
      message: 'Offer sent successfully',
      offerId: offer._id,
      finalPrice
    });
  } catch (err) {
    console.error('Send offer error:', err);
    return res.status(500).json({
      message: 'Failed to send offer'
    });
  }
};

/**
 * FARMER RESPONDS TO OFFER
 * ACCEPT / REJECT / NEGOTIATE
 */
exports.respondToOffer = async (req, res) => {
  try {
    const farmerId = req.user.id;
    const { offerId, action, newPrice } = req.body;

    if (!offerId || !action) {
      return res.status(400).json({ message: 'offerId and action are required' });
    }

    const offer = await Offer.findOne({ _id: offerId, farmerId });
    if (!offer) {
      return res.status(404).json({ message: 'Offer not found' });
    }

    if (action === 'ACCEPT') {
      offer.status = 'Accepted';
    }

    if (action === 'REJECT') {
      offer.status = 'Rejected';
    }

    if (action === 'NEGOTIATE') {
      if (!newPrice) {
        return res.status(400).json({ message: 'newPrice is required for negotiation' });
      }
      offer.status = 'Negotiating';
      offer.finalPrice = newPrice;
    }

    await offer.save();

    // Notify vendor
    const vendor = await Vendor.findById(offer.vendorId);
    if (vendor && vendor.email) {
      let emailSubject = '';
      let emailBody = '';

      if (action === 'ACCEPT') {
        emailSubject = 'Offer Accepted';
        emailBody = `Your offer has been accepted. Proceed to delivery selection.`;
      } else if (action === 'REJECT') {
        emailSubject = 'Offer Rejected';
        emailBody = `Your offer has been rejected.`;
      } else if (action === 'NEGOTIATE') {
        emailSubject = 'Offer Negotiated';
        emailBody = `Farmer has negotiated your offer. New price: ₹${newPrice}`;
      }

      sendEmail(vendor.email, emailSubject, emailBody);
    }

    res.json({
      message: `Offer ${action.toLowerCase()} successfully`
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Failed to respond to offer' });
  }
};

/**
 * VENDOR SELECTS DELIVERY OPTION
 */
exports.selectDelivery = async (req, res) => {
  try {
    const vendorId = req.user.id;
    const { offerId, vehicleType, distanceKm } = req.body;

    if (!offerId || !vehicleType || !distanceKm) {
      return res.status(400).json({ message: 'offerId, vehicleType, and distanceKm are required' });
    }

    const offer = await Offer.findOne({ _id: offerId, vendorId });
    if (!offer) return res.status(404).json({ message: 'Offer not found' });

    if (offer.status !== 'Accepted') {
      return res.status(400).json({ message: 'Offer must be accepted before selecting delivery' });
    }

    const delivery = calculateDelivery(distanceKm, vehicleType);

    offer.delivery = {
      vehicleType,
      distanceKm,
      ...delivery,
      confirmed: true,
      confirmedAt: new Date()
    };

    await offer.save();

    // Notify farmer
    const farmer = await Farmer.findById(offer.farmerId);
    if (farmer && farmer.email) {
      sendEmail(
        farmer.email,
        'Vehicle Ready for Pickup',
        `Vehicle (${vehicleType}) is ready to pickup your crop. Estimated time: ${delivery.estimatedTimeHr} hours.`
      );
    }

    res.json({
      message: 'Delivery confirmed',
      delivery: offer.delivery
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Failed to select delivery' });
  }
};

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

    if (!offer.delivery?.confirmed) {
      return res.status(400).json({
        message: 'Delivery must be confirmed before proceeding to payment. Please arrange pickup first.'
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
 * FARMER GET ALL OFFERS
 */
exports.getFarmerOffers = async (req, res) => {
  try {
    const farmerId = req.user.id;

    const offers = await Offer.find({ farmerId })
      .populate('vendorId', 'businessName fullName mobile district state address location')
      .populate('cropId', 'cropName quantity unit photos expectedPrice')
      .sort({ createdAt: -1 });

    res.json({
      count: offers.length,
      offers
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Failed to fetch offers' });
  }
};

/**
 * VENDOR GET ALL SENT OFFERS
 */
exports.getVendorOffers = async (req, res) => {
  try {
    const vendorId = req.user.id;

    const offers = await Offer.find({ vendorId })
      .populate('farmerId', 'fullName village')
      .populate('cropId', 'cropName quantity unit photos expectedPrice')
      .sort({ createdAt: -1 });

    res.json({
      count: offers.length,
      offers
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Failed to fetch offers' });
  }
};

/**
 * FARMER MARK OFFER AS SEEN
 * POST /api/offers/:offerId/mark-seen
 */
exports.markOfferSeen = async (req, res) => {
  try {
    const farmerId = req.user.id;
    const { offerId } = req.params;

    if (!offerId) {
      return res.status(400).json({ message: 'offerId is required' });
    }

    const offer = await Offer.findOne({ _id: offerId, farmerId });
    if (!offer) {
      return res.status(404).json({ message: 'Offer not found' });
    }

    if (!offer.seenByFarmer) {
      offer.seenByFarmer = true;
      offer.seenAt = new Date();
      await offer.save();
    }

    return res.json({
      message: 'Offer marked as seen',
      offerId: offer._id,
      seenAt: offer.seenAt
    });
  } catch (err) {
    console.error('Mark seen error:', err);
    return res.status(500).json({ message: 'Failed to mark offer as seen' });
  }
};

/**
 * FARMER CONFIRMS PAYMENT / COMPLETE DEAL
 * POST /api/offers/complete
 */
exports.completeOffer = async (req, res) => {
  try {
    const farmerId = req.user.id;
    const { offerId } = req.body;

    if (!offerId) {
      return res.status(400).json({ message: 'offerId is required' });
    }

    const offer = await Offer.findOne({ _id: offerId, farmerId });
    if (!offer) return res.status(404).json({ message: 'Offer not found' });

    if (offer.status !== 'Accepted') {
      return res.status(400).json({ message: 'Only accepted offers can be completed' });
    }

    if (!offer.delivery?.confirmed) {
      return res.status(400).json({ message: 'Delivery must be confirmed before completion' });
    }

    const crop = await CropListing.findById(offer.cropId);
    if (!crop) return res.status(404).json({ message: 'Crop not found' });

    crop.status = 'Sold';
    crop.finalPrice = offer.finalPrice;
    crop.soldAt = new Date();
    await crop.save();

    offer.status = 'Completed';
    await offer.save();

    return res.json({
      message: 'Deal completed',
      cropId: crop._id,
      finalPrice: crop.finalPrice
    });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: 'Failed to complete offer' });
  }
};
