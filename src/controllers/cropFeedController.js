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
