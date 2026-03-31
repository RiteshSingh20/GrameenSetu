const CropListing = require('../models/CropListing');


exports.getAllCrops = async (req, res, next) => {
  try {
    const crops = await CropListing.find(
      { status: 'Active' }, 
      {
        cropName: 1,
        quantity: 1,
        unit: 1,
        expectedPrice: 1,
        qualityGrade: 1,
        isOrganic: 1,
        harvestDate: 1,
        photos: 1,

        
        village: 1,
        district: 1,
        state: 1,

        createdAt: 1
      }
    )
      .sort({ createdAt: -1 });

    res.status(200).json({
      count: crops.length,
      crops
    });
  } catch (err) {
    next(err);
  }
};
exports.getAllCropsForVendor = async (req, res) => {
  const crops = await CropListing.find({ status: 'Active' })
    .populate('farmerId', 'fullName village district state')
    .select('cropName quantity unit expectedPrice qualityGrade village district state');

  res.json({ crops });
};

exports.searchCrops = async (req, res, next) => {
  try {
    const {
      q,
      location,
      cropType,
      minPrice,
      maxPrice
    } = req.query;

    const filter = { status: 'Active' };
    const andFilters = [];

    if (q) {
      const regex = new RegExp(q, 'i');
      andFilters.push({ cropName: regex });
    }

    if (cropType && cropType !== 'All') {
      const regex = new RegExp(cropType, 'i');
      andFilters.push({ cropName: regex });
    }

    if (location) {
      const loc = new RegExp(location, 'i');
      andFilters.push({ $or: [{ district: loc }, { state: loc }, { village: loc }] });
    }

    if (minPrice || maxPrice) {
      const price = {};
      if (minPrice) price.$gte = Number(minPrice);
      if (maxPrice) price.$lte = Number(maxPrice);
      andFilters.push({ expectedPrice: price });
    }

    if (andFilters.length) {
      filter.$and = andFilters;
    }

    const crops = await CropListing.find(
      filter,
      {
        cropName: 1,
        quantity: 1,
        unit: 1,
        expectedPrice: 1,
        qualityGrade: 1,
        isOrganic: 1,
        harvestDate: 1,
        photos: 1,
        village: 1,
        district: 1,
        state: 1,
        createdAt: 1
      }
    ).sort({ createdAt: -1 });

    res.status(200).json({ count: crops.length, crops });
  } catch (err) {
    next(err);
  }
};
