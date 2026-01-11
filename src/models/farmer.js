const mongoose = require('mongoose');

const FarmerSchema = new mongoose.Schema(
  {
    
    fullName: { type: String, required: true, trim: true },
    mobile: {
      type: String,
      required: true,
      unique: true,
      index: true
    },
    email: { type: String, required: true, unique: true },


    preferredLanguage: {
      type: String,
      enum: [
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
      ],
      default: 'hi'
    },

    profilePhotoUrl: { type: String },

   
    farmerType: {
      type: String,
      enum: ['Individual', 'FPO Member'],
      default: 'Individual'
    },

    govtIdType: {
      type: String,
      enum: ['Aadhaar', 'Voter ID', 'Driving License']
    },
    govtIdNumber: { type: String },
    govtIdFrontUrl: { type: String },
    govtIdBackUrl: { type: String },
    isKycVerified: { type: Boolean, default: false },


/*location details*/

    village: { type: String, required: true },
    district: { type: String, required: true },
    state: { type: String, required: true },
    pincode: { type: String, required: true },

    // Optional GPS (only saved when valid)
    farmLocation: {
      type: {
        type: String,
        enum: ['Point']
      },
      coordinates: {
        type: [Number] // [longitude, latitude]
      }
    },

    transportDistanceKm: {
      type: Number,
      default: 20,
      min: 1,
      max: 200
    },

    /* =====================
       🌱 FARMING PROFILE
    ===================== */
    primaryCrops: {
      type: [String],
      required: true
    },
    secondaryCrops: {
      type: [String],
      default: []
    },

    landSize: {
      value: { type: Number, required: true },
      unit: {
        type: String,
        enum: ['Acre', 'Hectare'],
        required: true
      }
    },

    farmingType: {
      type: String,
      enum: ['Conventional', 'Organic', 'Mixed'],
      required: true
    },

    harvestSeason: {
      type: String,
      enum: ['Kharif', 'Rabi', 'Zaid'],
      required: true
    },

    /* =====================
       📦 SELLING PREFERENCES
    ===================== */
    preferredQuantityRange: { type: String },
    qualityGrade: {
      type: String,
      enum: ['A', 'B', 'C']
    },
    preferredBuyers: {
      type: [String],
      default: []
    },
    harvestFrequency: {
      type: String,
      enum: ['Weekly', 'Monthly', 'Seasonal']
    },

    /* =====================
       🔒 CONSENT & FLAGS
    ===================== */
    acceptedTerms: {
      type: Boolean,
      required: true
    },
    consentForNotifications: {
      type: Boolean,
      default: true
    }
  },
  {
    timestamps: true
  }
);

/* =====================
    🌍 GEO INDEX (SAFE)
    Only applies when coordinates exist
===================== */
FarmerSchema.index(
  { farmLocation: '2dsphere' },
  { partialFilterExpression: { 'farmLocation.coordinates': { $exists: true } } }
);

module.exports = mongoose.models.Farmer || mongoose.model('Farmer', FarmerSchema);
