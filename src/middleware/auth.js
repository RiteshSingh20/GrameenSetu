const jwt = require('jsonwebtoken');
const Farmer = require('../models/Farmer');
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

      // 🔐 Verify JWT
      const payload = jwt.verify(token, process.env.JWT_SECRET);
      req.user = payload;

      // 🚫 Authorization check (if route is restricted)
      if (allowedTypes.length && !allowedTypes.includes(payload.type)) {
        return res.status(403).json({ message: 'Access denied' });
      }

      // 🔎 Fetch actual user from DB
      let userDoc = null;

      if (payload.type === 'farmer') {
        userDoc = await Farmer.findById(payload.id);
      } else if (payload.type === 'vendor') {
        userDoc = await Vendor.findById(payload.id);
      }

      if (!userDoc) {
        return res.status(401).json({ message: 'Invalid token user' });
      }

      // attach full document if needed
      req.userDoc = userDoc;

      next();
    } catch (err) {
      console.error('Auth error:', err.message);
      return res.status(401).json({ message: 'Invalid or expired token' });
    }
  };
};
