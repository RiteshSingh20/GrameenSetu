const CropListing = require('../models/CropListing');
const Offer = require('../models/Offer');
const Farmer = require('../models/Farmer');

/**
 * FARMER DASHBOARD CARDS
 */
exports.getFarmerDashboard = async (req, res) => {
  try {
    const farmerId = req.user.id;
    const farmer = req.userDoc || (await Farmer.findById(farmerId));
    const farmerName = farmer?.fullName || 'किसान';
    const farmerVillage = farmer?.village || 'Unknown';

    const totalCrops = await CropListing.countDocuments({ farmerId });
    const activeCrops = await CropListing.countDocuments({
      farmerId,
      status: 'Active'
    });
    const soldCrops = await CropListing.countDocuments({
      farmerId,
      status: 'Sold'
    });

    const pendingOfferFilter = { farmerId, status: { $in: ['Pending', 'pending'] } };
    const acceptedOfferFilter = { farmerId, status: { $in: ['Accepted', 'accepted'] } };
    const newOffers = await Offer.countDocuments(pendingOfferFilter);
    const pickupPending = await Offer.countDocuments({
      ...acceptedOfferFilter,
      'delivery.confirmed': { $ne: true }
    });
    const pickupReady = await Offer.countDocuments({
      ...acceptedOfferFilter,
      'delivery.confirmed': true
    });
    const paymentPending = await Offer.countDocuments({
      ...acceptedOfferFilter,
      'delivery.confirmed': true,
      status: { $in: ['Accepted', 'accepted'] }
    });

    const earningsAgg = await CropListing.aggregate([
      { $match: { farmerId, status: 'Sold' } },
      {
        $group: {
          _id: null,
          totalEarnings: { $sum: '$finalPrice' }
        }
      }
    ]);

    const totalEarnings = earningsAgg[0]?.totalEarnings || 0;

    res.json({
      user: {
        id: farmerId,
        fullName: farmerName,
        village: farmerVillage
      },
      profile: {
        fullName: farmerName,
        village: farmerVillage
      },
      greeting: {
        salutation: 'नमस्कार',
        name: farmerName,
        village: farmerVillage
      },
      cards: {
        myCrops: {
          total: totalCrops,
          active: activeCrops,
          sold: soldCrops
        },
        earnings: {
          totalEarnings
        },
        offers: {
          newOffers
        },
        ongoing: {
          pickupPending,
          pickupReady,
          paymentPending
        }
      }
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Failed to load farmer dashboard' });
  }
};

/**
 * VENDOR DASHBOARD CARDS
 */
exports.getVendorDashboard = async (req, res) => {
  try {
    const vendorId = req.userDoc?._id || req.user.id;
    const vendor = req.userDoc;

    // Get today's date range
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);

    // Count new crops added today
    const newCropsToday = await CropListing.countDocuments({
      status: 'Active',
      createdAt: { $gte: today, $lt: tomorrow }
    });

    // Count all offers sent by vendor
    const offersSent = await Offer.countDocuments({ vendorId });

    // Count accepted offers (status = Accepted)
    const offersAccepted = await Offer.countDocuments({
      vendorId,
      status: { $in: ['Accepted', 'accepted'] }
    });

    // Count active deals (accepted but not completed, no delivery confirmed)
    const activeDeals = await Offer.countDocuments({
      vendorId,
      status: { $in: ['Accepted', 'accepted'] },
      'delivery.confirmed': { $ne: true }
    });

    // Count completed deals (status = Completed and payment = Paid)
    const completedDealsData = await Offer.find({
      vendorId,
      status: { $in: ['Completed', 'completed'] },
      'payment.status': { $in: ['Paid', 'paid'] }
    })
      .select('finalPrice cropId quantity')
      .populate('cropId', 'quantity');

    const completedDeals = completedDealsData.length;

    // Calculate total purchases from completed deals
    const purchases = completedDealsData.reduce(
      (acc, offer) => {
        acc.totalAmount += Number(offer.finalPrice) || 0;
        acc.totalQuantity += Number(offer.cropId?.quantity) || 0;
        return acc;
      },
      { totalQuantity: 0, totalAmount: 0 }
    );

    res.json({
      vendor: {
        name: vendor?.fullName || '',
        mobile: vendor?.mobile || '',
        district: vendor?.district || '',
        state: vendor?.state || '',
        address: vendor?.address || '',
        location: vendor?.district && vendor?.state ? `${vendor.district}, ${vendor.state}` : vendor?.district || vendor?.state || ''
      },
      cards: {
        newCropsToday,
        activeDeals,
        completedDeals,
        totalPurchaseQuantity: purchases.totalQuantity,
        totalPurchaseAmount: purchases.totalAmount,
        offersSent,
        offersAccepted
      }
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Failed to load vendor dashboard' });
  }
};
