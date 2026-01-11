const Joi = require('joi');

/* ======================================================
   📱 MOBILE VALIDATION (OTP REQUEST)
   POST /api/auth/otp/request
====================================================== */
const mobileSchema = Joi.object({
  mobile: Joi.string()
    .pattern(/^[0-9]{10}$/)
    .required()
});

/* ======================================================
   🔐 OTP VERIFICATION
   POST /api/auth/otp/verify
====================================================== */
const otpSchema = Joi.object({
  mobile: Joi.string()
    .pattern(/^[0-9]{10}$/)
    .required(),

  code: Joi.string()
    .pattern(/^[0-9]{6}$/)
    .required()
});

/* ======================================================
   🏢 VENDOR SIGNUP (FLAT PAYLOAD)
   POST /api/auth/vendor/signup
====================================================== */
const vendorSignupSchema = Joi.object({
  /* ---------- BASIC ---------- */
  fullName: Joi.string().min(2).max(100).required(),

  mobile: Joi.string()
    .pattern(/^[0-9]{10}$/)
    .required(),

  email: Joi.string().email().optional().allow('', null),

  password: Joi.string().min(6).optional().allow('', null),

  preferredLanguage: Joi.string()
    .valid(
      'en',
      'hi',
      'mr',
      'ta',
      'te',
      'kn',
      'ml',
      'bn',
      'gu',
      'pa',
      'or',
      'bh'
    )
    .optional(),

  /* ---------- BUSINESS ---------- */
  businessName: Joi.string().min(2).max(150).required(),

  businessType: Joi.string()
    .valid(
      'Wholesaler',
      'Retailer',
      'Exporter',
      'Food Processor',
      'Institutional Buyer'
    )
    .required(),

  gstNumber: Joi.string().optional().allow('', null),
  panNumber: Joi.string().optional().allow('', null),

  /* ---------- LOCATION ---------- */
  address: Joi.string().optional().allow('', null),

  district: Joi.string().required(),
  state: Joi.string().required(),
  pincode: Joi.string().length(6).required(),

  procurementRadiusKm: Joi.number()
    .min(1)
    .max(500)
    .optional()
});

/* ======================================================
   🌾 FARMER SIGNUP (NESTED PAYLOAD)
   POST /api/farmer/signup
====================================================== */
const farmerSignupSchema = Joi.object({
  /* ---------- BASIC ---------- */
  basic: Joi.object({
    fullName: Joi.string().min(2).required(),

    mobile: Joi.string()
      .pattern(/^[0-9]{10}$/)
      .required(),

    email: Joi.string().email().optional().allow('', null),

    preferredLanguage: Joi.string()
      .valid(
        'en', // English
        'hi', // Hindi
        'mr', // Marathi
        'ta', // Tamil
        'te', // Telugu
        'kn', // Kannada
        'ml', // Malayalam
        'bn', // Bengali
        'gu', // Gujarati
        'pa', // Punjabi
        'or', // Oriya (Odia)
        'bh'  // Bhojpuri
      )
      .required()
  }).required(),

  /* ---------- LOCATION ---------- */
  location: Joi.object({
    village: Joi.string().required(),
    district: Joi.string().required(),
    state: Joi.string().required(),
    pincode: Joi.string().length(6).required(),

    // GPS optional, but must be complete if present
    farmLocation: Joi.object({
      type: Joi.string().valid('Point').required(),
      coordinates: Joi.array()
        .items(Joi.number())
        .length(2)
        .required()
    }).optional(),

    transportDistanceKm: Joi.number()
      .min(5)
      .max(200)
      .optional()
  }).required(),

  /* ---------- FARMING PROFILE ---------- */
  farming: Joi.object({
    primaryCrops: Joi.array()
      .items(Joi.string())
      .min(1)
      .required(),

    landSize: Joi.object({
      value: Joi.number().positive().required(),
      unit: Joi.string()
        .valid('Acre', 'Hectare')
        .required()
    }).required(),

    farmingType: Joi.string()
      .valid('Conventional', 'Organic', 'Mixed')
      .required(),

    harvestSeason: Joi.string()
      .valid('Kharif', 'Rabi', 'Zaid')
      .required()
  }).required(),

  /* ---------- SELLING (OPTIONAL) ---------- */
  selling: Joi.object({
    preferredQuantityRange: Joi.string().optional().allow('', null),

    qualityGrade: Joi.string()
      .valid('A', 'B', 'C')
      .optional(),

    preferredBuyers: Joi.array()
      .items(Joi.string())
      .optional(),

    harvestFrequency: Joi.string()
      .valid('Weekly', 'Monthly', 'Seasonal')
      .optional()
  }).optional(),

  /* ---------- CONSENT ---------- */
  consent: Joi.object({
    acceptedTerms: Joi.boolean()
      .valid(true)
      .required(),

    consentForNotifications: Joi.boolean()
      .optional()
      .default(true)
  }).required()
});

/* ======================================================
   EXPORTS
====================================================== */
module.exports = {
  mobileSchema,
  otpSchema,
  vendorSignupSchema,
  farmerSignupSchema
};
