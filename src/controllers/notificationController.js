const Notification = require('../models/Notification');

exports.getFarmerNotifications = async (req, res) => {
  try {
    const farmerId = req.user.id;
    const items = await Notification.find({ farmerId }).sort({ createdAt: -1 }).limit(50);
    res.json({ count: items.length, notifications: items });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Failed to fetch notifications' });
  }
};

exports.markAllRead = async (req, res) => {
  try {
    const farmerId = req.user.id;
    await Notification.updateMany({ farmerId, read: false }, { $set: { read: true } });
    res.json({ message: 'Notifications marked as read' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Failed to update notifications' });
  }
};
