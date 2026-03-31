const jwt = require('jsonwebtoken');
const Farmer = require('../models/Farmer');
const Otp = require('../models/Otp');
const { generateOtp } = require('../utils/otpHelper');
const { sendOtpEmail } = require('../utils/sendEmail');
const { generateAccessToken, generateRefreshToken, saveRefreshToken, verifyRefreshToken, revokeRefreshToken } = require('../utils/tokenUtils');

/**
 * REQUEST OTP FOR LOGIN
 */
exports.requestOtp = async (req, res) => {
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({ message: 'Email is required' });
    }

    const farmer = await Farmer.findOne({ email });
    if (!farmer) {
      return res.status(404).json({ message: 'Farmer not found' });
    }

    const otp = generateOtp();

    await Otp.create({
      email,
      code: otp,
      expiresAt: new Date(Date.now() + 10 * 60 * 1000)
    });

    // 📧 Send OTP to farmer email
    await sendOtpEmail(email, otp);

    res.json({ message: 'OTP sent to registered email' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Failed to send OTP' });
  }
};

/**
 * VERIFY OTP AND LOGIN
 */
exports.verifyOtp = async (req, res) => {
  try {
    const { email, code } = req.body;

    const otpRecord = await Otp.findOne({ email, code });
    if (!otpRecord || otpRecord.expiresAt < new Date()) {
      return res.status(400).json({ message: 'Invalid or expired OTP' });
    }

    const farmer = await Farmer.findOne({ email });
    if (!farmer) {
      return res.status(404).json({ message: 'Farmer not found' });
    }

    // Generate tokens
    const accessToken = generateAccessToken(farmer._id, 'farmer');
    const refreshToken = generateRefreshToken(farmer._id, 'farmer');

    // Save refresh token to database
    await saveRefreshToken(farmer._id, 'Farmer', refreshToken);

    // Delete used OTP
    await Otp.deleteMany({ email });

    res.json({
      message: 'Farmer login successful',
      accessToken,
      refreshToken,
      farmerId: farmer._id,
      expiresIn: 900 // 15 minutes in seconds
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'OTP verification failed' });
  }
};

/**
 * REFRESH ACCESS TOKEN
 */
exports.refreshToken = async (req, res) => {
  try {
    const { refreshToken } = req.body;

    if (!refreshToken) {
      return res.status(400).json({ message: 'Refresh token is required' });
    }

    // Verify refresh token
    const payload = await verifyRefreshToken(refreshToken);

    // Generate new access token
    const newAccessToken = generateAccessToken(payload.id, payload.type);

    res.json({
      accessToken: newAccessToken,
      expiresIn: 900 // 15 minutes in seconds
    });
  } catch (err) {
    console.error(err);
    res.status(401).json({ message: 'Invalid or expired refresh token' });
  }
};

/**
 * LOGOUT (Revoke refresh token)
 */
exports.logout = async (req, res) => {
  try {
    const { refreshToken } = req.body;

    if (!refreshToken) {
      return res.status(400).json({ message: 'Refresh token is required' });
    }

    // Revoke refresh token
    await revokeRefreshToken(refreshToken);

    res.json({ message: 'Logged out successfully' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Logout failed' });
  }
};
