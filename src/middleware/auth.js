const jwt = require('jsonwebtoken');
const Farmer = require('../models/farmer');
const Vendor = require('../models/Vendor');

/**
 * AUTH MIDDLEWARE
 * @param {Array} allowedTypes - ['farmer'], ['vendor'], or [] for both
 */
module.exports = (allowedTypes = []) => {
  return async (req, res, next) => {
    try {
      const authHeader = req.headers.authorization;

      if (!authHeader) {
        return res.status(401).json({ message: 'Missing Authorization header' });
      }

      const token = authHeader.split(' ')[1];
      if (!token) {
        return res.status(401).json({ message: 'Invalid Authorization format' });
      }

      const payload = jwt.verify(token, process.env.JWT_SECRET);

      // Support both token shapes: { id, type } and { id, role }.
      const userType = payload.type || payload.role;
      const userId = payload.id || payload.userId;
      req.user = { ...payload, type: userType, id: userId };

      if (allowedTypes.length && !allowedTypes.includes(userType)) {
        return res.status(403).json({ message: 'Access denied' });
      }

      let userDoc = null;

      if (userType === 'farmer') {
        userDoc = await Farmer.findById(userId);
      } else if (userType === 'vendor') {
        userDoc = await Vendor.findById(userId);
      }

      if (!userDoc) {
        return res.status(401).json({ message: 'Invalid token user' });
      }

      req.userDoc = userDoc;
      next();
    } catch (err) {
      console.error('Auth error:', err.message);
      return res.status(401).json({ message: 'Invalid or expired token' });
    }
  };
};
