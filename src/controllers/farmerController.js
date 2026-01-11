const Farmer = require('../models/farmer');
const { farmerSignupSchema } = require('../utils/validators');


exports.registerFarmer = async (req, res, next) => {
  try {
    console.log('🌾 Farmer signup hit');

    const { error, value } = farmerSignupSchema.validate(req.body);
    if (error) {
      return res.status(400).json({ message: error.details[0].message });
    }

    const { basic, location, farming, selling, consent } = value;

    const exists = await Farmer.findOne({ mobile: basic.mobile });
    if (exists) {
      return res.status(409).json({ message: 'Farmer already registered' });
    }

    
    if (location.farmLocation && !location.farmLocation.coordinates) {
      delete location.farmLocation;
    }

    const farmer = new Farmer({
      ...basic,
      ...location,
      ...farming,
      ...selling,
      ...consent
    });

    await farmer.save();

    res.status(201).json({
      message: 'Farmer registered successfully',
      farmerId: farmer._id
    });
  } catch (err) {
    next(err);
  }
};
