const mongoose = require('mongoose');

const OfferSchema = new mongoose.Schema({
  cropId: { type: mongoose.Schema.Types.ObjectId, ref: 'CropListing', required: true },
  farmerId: { type: mongoose.Schema.Types.ObjectId, ref: 'Farmer', required: true },
  vendorId: { type: mongoose.Schema.Types.ObjectId, ref: 'Vendor', required: true },

  offeredPrice: { type: Number }, // optional bid
  finalPrice: { type: Number },

  status: {
    type: String,
    enum: ['Pending', 'Accepted', 'Rejected', 'Negotiating', 'Completed'],
    default: 'Pending'
  },

  seenByFarmer: { type: Boolean, default: false },
  seenAt: { type: Date },

  delivery: {
    vehicleType: String,
    distanceKm: Number,
    estimatedTimeHr: Number,
    estimatedFare: Number,
    confirmed: { type: Boolean, default: false }
  },

  payment: {
    status: { type: String, enum: ['Pending', 'Paid'], default: 'Pending' },
    method: { type: String },
    amount: { type: Number },
    paidAt: { type: Date },
    upiId: { type: String },
    txnRef: { type: String }
  }
}, { timestamps: true });

module.exports = mongoose.model('Offer', OfferSchema);
