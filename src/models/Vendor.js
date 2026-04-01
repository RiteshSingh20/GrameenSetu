const mongoose = require('mongoose');

const VendorSchema = new mongoose.Schema({
  fullName: { type: String, required: true, trim: true },
  mobile: { type: String, required: true, unique: true }, 
  email: { type: String, trim: true, lowercase: true },
  passwordHash: { type: String }, // optional if OTP-only
  preferredLanguage: { type: String, default: 'en' },

  // Business details
  businessName: { type: String },
  businessType: { 
    type: String, 
    enum: ['Wholesaler','Retailer','Exporter','Food Processor','Institutional Buyer'],
    default: 'Wholesaler'
  },
  gstNumber: { type: String, trim: true },
  panNumber: { type: String, trim: true },

  // Documents
  registrationDocUrl: { type: String },

  // Location
  address: { type: String },
  district: { type: String },
  state: { type: String },
  pincode: { type: String },
  location: { // optional geo coordinates
    type: { type: String, enum: ['Point'] },
    coordinates: [Number]
  },
  procurementRadiusKm: { type: Number, default: 50 },

  // audit
  isKycVerified: { type: Boolean, default: false },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

// create 2dsphere if using geo queries
VendorSchema.index({ location: '2dsphere' });

module.exports = mongoose.model('Vendor', VendorSchema);
