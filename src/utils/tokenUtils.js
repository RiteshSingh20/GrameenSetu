const jwt = require('jsonwebtoken');
const RefreshToken = require('../models/RefreshToken');

/**
 * GENERATE ACCESS TOKEN (Short-lived)
 * Expires in 15 minutes
 */
exports.generateAccessToken = (userId, userType) => {
  return jwt.sign(
    { id: userId, type: userType },
    process.env.JWT_SECRET,
    { expiresIn: '15m' }
  );
};

/**
 * GENERATE REFRESH TOKEN (Long-lived)
 * Expires in 7 days
 */
exports.generateRefreshToken = (userId, userType) => {
  return jwt.sign(
    { id: userId, type: userType },
    process.env.JWT_REFRESH_SECRET || process.env.JWT_SECRET,
    { expiresIn: '7d' }
  );
};

/**
 * SAVE REFRESH TOKEN TO DATABASE
 */
exports.saveRefreshToken = async (userId, userType, refreshToken) => {
  const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000); // 7 days

  await RefreshToken.create({
    userId,
    userType,
    token: refreshToken,
    expiresAt
  });
};

/**
 * VERIFY REFRESH TOKEN
 */
exports.verifyRefreshToken = async (token) => {
  try {
    const payload = jwt.verify(
      token,
      process.env.JWT_REFRESH_SECRET || process.env.JWT_SECRET
    );

    // Check if token exists in database
    const refreshTokenDoc = await RefreshToken.findOne({ token });
    if (!refreshTokenDoc) {
      throw new Error('Refresh token not found in database');
    }

    // Check if token is expired
    if (refreshTokenDoc.expiresAt < new Date()) {
      await RefreshToken.deleteOne({ token });
      throw new Error('Refresh token expired');
    }

    return payload;
  } catch (err) {
    throw new Error(`Invalid refresh token: ${err.message}`);
  }
};

/**
 * REVOKE REFRESH TOKEN (Logout)
 */
exports.revokeRefreshToken = async (token) => {
  await RefreshToken.deleteOne({ token });
};

/**
 * REVOKE ALL REFRESH TOKENS FOR USER (Logout from all devices)
 */
exports.revokeAllRefreshTokens = async (userId) => {
  await RefreshToken.deleteMany({ userId });
};
