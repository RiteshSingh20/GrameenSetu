const router = require('express').Router();
const auth = require('../middleware/auth');
const notificationController = require('../controllers/notificationController');

router.get('/farmer', auth(['farmer']), notificationController.getFarmerNotifications);
router.post('/farmer/read', auth(['farmer']), notificationController.markAllRead);

module.exports = router;
