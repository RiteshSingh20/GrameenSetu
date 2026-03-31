const CropListing = require('../models/CropListing');
const Offer = require('../models/Offer');
const Farmer = require('../models/Farmer');

/**
 * VENDOR PROFILE STATISTICS - COMPREHENSIVE
 * GET /api/vendor/profile/stats
 * Returns all categorized offer data for profile section
 * 
 * Categories:
 * 1. SENT OFFERS: Pending/Negotiating (not yet accepted by farmer)
 * 2. ACCEPTED OFFERS: Accepted but pickup NOT arranged (delivery.confirmed = false)
 * 3. ACTIVE DEALS: Accepted + Pickup arranged (delivery.confirmed = true) + Payment NOT done
 * 4. COMPLETED DEALS: Payment done (payment.status = 'Paid') + Crop delivered + Status = Completed
 * 5. REJECTED OFFERS: Farmer rejected the offer
 */
exports.getVendorProfileStats = async (req, res) => {
  try {
    const vendorId = req.userDoc?._id || req.user.id;

    // 1. SENT OFFERS - Offers sent but not yet accepted/rejected by farmer
    // Shows offers that are Pending/Negotiating and whether farmer has seen them
    const sentOffers = await Offer.find({
      vendorId,
      status: { $in: ['Pending', 'Negotiating'] }
    })
      .select('_id cropId status offeredPrice finalPrice createdAt seenByFarmer seenAt')
      .populate('cropId', 'cropName quantity unit')
      .sort({ createdAt: -1 });

    // 2. ACCEPTED OFFERS - Farmer accepted but pickup not yet arranged
    const acceptedOffers = await Offer.find({
      vendorId,
      status: 'Accepted',
      'delivery.confirmed': false
    })
      .select('_id cropId status offeredPrice finalPrice quantity createdAt seenByFarmer')
      .populate('cropId', 'cropName quantity unit')
      .sort({ createdAt: -1 });

    // 3. ACTIVE DEALS - Pickup arranged, awaiting payment or crop delivery
    // These are deals where vendor has arranged pickup but payment/delivery not complete
    const activeDeals = await Offer.find({
      vendorId,
      status: 'Accepted',
      'delivery.confirmed': true,
      $or: [
        { 'payment.status': 'Pending' },
        { 'payment.status': { $exists: false } }
      ]
    })
      .select('_id cropId status finalPrice delivery payment createdAt seenByFarmer')
      .populate('cropId', 'cropName quantity unit')
      .sort({ createdAt: -1 });

    // 4. COMPLETED DEALS - Payment done and crop delivered (status = Completed)
    const completedDeals = await Offer.find({
      vendorId,
      status: 'Completed',
      'payment.status': 'Paid'
    })
      .select('_id cropId status finalPrice delivery payment createdAt')
      .populate('cropId', 'cropName quantity unit')
      .sort({ createdAt: -1 });

    // Calculate totals from completed deals
    const completedStats = completedDeals.reduce(
      (acc, offer) => {
        acc.totalAmount += Number(offer.finalPrice) || 0;
        acc.totalQuantity += Number(offer.cropId?.quantity) || 0;
        return acc;
      },
      { totalQuantity: 0, totalAmount: 0 }
    );

    // 5. REJECTED OFFERS - Farmer rejected the offer
    const rejectedOffers = await Offer.find({
      vendorId,
      status: 'Rejected'
    })
      .select('_id cropId status offeredPrice createdAt')
      .populate('cropId', 'cropName')
      .sort({ createdAt: -1 });

    res.json({
      success: true,
      stats: {
        sentOffers: {
          count: sentOffers.length,
          seenCount: sentOffers.filter(o => o.seenByFarmer).length,
          unreadCount: sentOffers.filter(o => !o.seenByFarmer).length,
          data: sentOffers.map(offer => ({
            id: offer._id,
            cropName: offer.cropId?.cropName || 'Crop',
            offeredPrice: offer.offeredPrice || offer.finalPrice,
            status: offer.status,
            seenByFarmer: offer.seenByFarmer,
            seenAt: offer.seenAt,
            createdAt: offer.createdAt
          }))
        },
        acceptedOffers: {
          count: acceptedOffers.length,
          data: acceptedOffers.map(offer => ({
            id: offer._id,
            cropName: offer.cropId?.cropName || 'Crop',
            offeredPrice: offer.offeredPrice || offer.finalPrice,
            quantity: offer.cropId?.quantity || 0,
            unit: offer.cropId?.unit || 'kg',
            status: offer.status,
            seenByFarmer: offer.seenByFarmer,
            createdAt: offer.createdAt
          }))
        },
        activeDeals: {
          count: activeDeals.length,
          data: activeDeals.map(offer => ({
            id: offer._id,
            cropName: offer.cropId?.cropName || 'Crop',
            finalPrice: offer.finalPrice,
            quantity: offer.cropId?.quantity || 0,
            unit: offer.cropId?.unit || 'kg',
            status: offer.status,
            deliveryConfirmed: offer.delivery?.confirmed || false,
            vehicleType: offer.delivery?.vehicleType || 'N/A',
            paymentStatus: offer.payment?.status || 'Pending',
            seenByFarmer: offer.seenByFarmer,
            createdAt: offer.createdAt
          }))
        },
        completedDeals: {
          count: completedDeals.length,
          totalQuantity: completedStats.totalQuantity,
          totalAmount: completedStats.totalAmount,
          data: completedDeals.map(offer => ({
            id: offer._id,
            cropName: offer.cropId?.cropName || 'Crop',
            finalPrice: offer.finalPrice,
            quantity: offer.cropId?.quantity || 0,
            unit: offer.cropId?.unit || 'kg',
            status: offer.status,
            paymentStatus: offer.payment?.status || 'Pending',
            deliveryConfirmed: offer.delivery?.confirmed || false,
            paidAt: offer.payment?.paidAt,
            createdAt: offer.createdAt
          }))
        },
        rejectedOffers: {
          count: rejectedOffers.length,
          data: rejectedOffers.map(offer => ({
            id: offer._id,
            cropName: offer.cropId?.cropName || 'Crop',
            offeredPrice: offer.offeredPrice,
            status: offer.status,
            createdAt: offer.createdAt
          }))
        }
      }
    });
  } catch (err) {
    console.error('Profile stats error:', err);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch profile statistics'
    });
  }
};

/**
 * GET VENDOR PROFILE SUMMARY
 * GET /api/vendor/profile/summary
 * Returns quick summary for dashboard cards
 */
exports.getVendorProfileSummary = async (req, res) => {
  try {
    const vendorId = req.userDoc?._id || req.user.id;

    // Count sent offers
    const sentCount = await Offer.countDocuments({
      vendorId,
      status: { $in: ['Pending', 'Negotiating'] }
    });

    // Count accepted offers (not yet pickup arranged)
    const acceptedCount = await Offer.countDocuments({
      vendorId,
      status: 'Accepted',
      'delivery.confirmed': false
    });

    // Count active deals (pickup arranged, payment pending)
    const activeCount = await Offer.countDocuments({
      vendorId,
      status: 'Accepted',
      'delivery.confirmed': true,
      $or: [
        { 'payment.status': 'Pending' },
        { 'payment.status': { $exists: false } }
      ]
    });

    // Get completed deals with totals
    const completedOffers = await Offer.find({
      vendorId,
      status: 'Completed',
      'payment.status': 'Paid'
    }).select('finalPrice cropId').populate('cropId', 'quantity');

    const completedCount = completedOffers.length;

    const totals = completedOffers.reduce(
      (acc, offer) => {
        acc.totalAmount += Number(offer.finalPrice) || 0;
        acc.totalQuantity += Number(offer.cropId?.quantity) || 0;
        return acc;
      },
      { totalAmount: 0, totalQuantity: 0 }
    );

    // Count rejected offers
    const rejectedCount = await Offer.countDocuments({
      vendorId,
      status: 'Rejected'
    });

    // Count unseen sent offers
    const unseenCount = await Offer.countDocuments({
      vendorId,
      status: { $in: ['Pending', 'Negotiating'] },
      seenByFarmer: false
    });

    res.json({
      success: true,
      summary: {
        sentOffers: sentCount,
        unseenOffers: unseenCount,
        acceptedOffers: acceptedCount,
        activeDeals: activeCount,
        completedDeals: completedCount,
        totalAmount: totals.totalAmount,
        totalQuantity: totals.totalQuantity,
        rejectedOffers: rejectedCount
      }
    });
  } catch (err) {
    console.error('Profile summary error:', err);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch profile summary'
    });
  }
};
