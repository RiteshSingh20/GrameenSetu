const mongoose = require('mongoose');

const OtpSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
    index: true
  },

  code: {
    type: String,
    required: true
  },

  purpose: {
    type: String,
    default: 'login'
  },

  expiresAt: {
    type: Date,
    required: true
  }
}, { timestamps: true });

module.exports = mongoose.model('Otp', OtpSchema);
