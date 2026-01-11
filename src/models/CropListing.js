const mongoose = require('mongoose');

const CropListingSchema = new mongoose.Schema(
  {
    // 🔗 Relation
    farmerId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Farmer',
      required: true,
      index: true
    },

    /* =====================
       🌾 CROP DETAILS
    ===================== */
    cropName: { type: String, required: true },
    quantity: { type: Number, required: true },
    unit: {
      type: String,
      enum: ['Kg', 'Quintal', 'Ton'],
      required: true
    },

    expectedPrice: { type: Number }, // optional
    harvestDate: { type: Date },

    qualityGrade: {
      type: String,
      enum: ['A', 'B', 'C']
    },

    isOrganic: { type: Boolean, default: false },

    /* =====================
       📍 LOCATION (FROM FARMER)
    ===================== */
    village: { type: String, required: true },
    district: { type: String, required: true },
    state: { type: String, required: true },
    pincode: { type: String },

    farmLocation: {
      type: {
        type: String,
        enum: ['Point']
      },
      coordinates: {
        type: [Number] // [lng, lat]
      }
    },

   
    pickupType: {
      type: String,
      enum: ['Farm Pickup', 'Market Drop'],
      default: 'Farm Pickup'
    },

    photos: {
      type: [String],
      default: []
    },

    
    status: {
      type: String,
      enum: ['Active', 'Sold', 'Expired'],
      default: 'Active'
    }
  },
  { timestamps: true }
);

// Geo index (only when coordinates exist)
CropListingSchema.index(
  { farmLocation: '2dsphere' },
  { partialFilterExpression: { 'farmLocation.coordinates': { $exists: true } } }
);

module.exports = mongoose.model('CropListing', CropListingSchema);
