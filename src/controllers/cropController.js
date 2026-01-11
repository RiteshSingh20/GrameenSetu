const CropListing = require('../models/CropListing');
const Farmer = require('../models/Farmer');
const Vendor = require('../models/Vendor'); // ✅ ADD
const { cropListingSchema } = require('../utils/cropValidators');
const { notifyVendors } = require('../utils/notifyVendor'); // ✅ ADD

/**
 * CREATE CROP LISTING + NOTIFY VENDORS (TEMPORARY)
 */
exports.createCropListing = async (req, res, next) => {
  try {
    // ✅ Extract farmerId separately
    const { farmerId, ...cropData } = req.body;

    if (!farmerId) {
      return res.status(400).json({ message: 'farmerId is required' });
    }

    // ✅ Validate ONLY crop fields
    const { error, value } = cropListingSchema.validate(cropData);
    if (error) {
      return res.status(400).json({ message: error.details[0].message });
    }

    // 📍 Fetch farmer
    const farmer = await Farmer.findById(farmerId);
    if (!farmer) {
      return res.status(404).json({ message: 'Farmer not found' });
    }

    // ✅ Create crop listing
    const crop = new CropListing({
      farmerId,
      ...value,

      // 📍 Auto location from farmer profile
      village: farmer.village,
      district: farmer.district,
      state: farmer.state,
      pincode: farmer.pincode,
      farmLocation: farmer.farmLocation
    });

    await crop.save();

    
    const vendors = await Vendor.find({});
    notifyVendors(vendors, crop); 

    res.status(201).json({
      message: 'Crop listed successfully and vendors notified',
      cropId: crop._id
    });
  } catch (err) {
    next(err);
  }
};

/**
 * GET CROPS BY FARMER ID
 */
exports.getCropsByFarmerId = async (req, res, next) => {
  try {
    const { farmerId } = req.params;

    const crops = await CropListing.find({ farmerId })
      .sort({ createdAt: -1 });

    res.status(200).json({
      count: crops.length,
      crops
    });
  } catch (err) {
    next(err);
  }
};
