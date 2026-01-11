const express = require('express');
const router = express.Router();
const cropController = require('../controllers/cropController');

// create crop (using farmerId)
router.post('/list', cropController.createCropListing);

// get crops by farmerId
router.get('/farmer/:farmerId', cropController.getCropsByFarmerId);

module.exports = router;
