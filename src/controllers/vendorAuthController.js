const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const Vendor = require('../models/Vendor');
const { generateAccessToken, generateRefreshToken, saveRefreshToken, verifyRefreshToken, revokeRefreshToken } = require('../utils/tokenUtils');

/**
 * VENDOR LOGIN (EMAIL + PASSWORD)
 */
exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: 'Email and password required' });
    }

    const vendor = await Vendor.findOne({ email });
    if (!vendor) {
      return res.status(404).json({ message: 'Vendor not found' });
    }

    const isMatch = await bcrypt.compare(password, vendor.passwordHash);
    if (!isMatch) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    // Generate tokens
    const accessToken = generateAccessToken(vendor._id, 'vendor');
    const refreshToken = generateRefreshToken(vendor._id, 'vendor');

    // Save refresh token to database
    await saveRefreshToken(vendor._id, 'Vendor', refreshToken);

    res.json({
      message: 'Vendor login successful',
      accessToken,
      refreshToken,
      vendorId: vendor._id,
      expiresIn: 900 // 15 minutes in seconds
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Login failed' });
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
