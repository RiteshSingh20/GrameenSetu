exports.selectDelivery = async (req, res) => {
  const vendorId = req.user.id;
  const { offerId, vehicleType, distanceKm } = req.body;

  const offer = await Offer.findOne({ _id: offerId, vendorId });
  if (!offer) return res.status(404).json({ message: 'Offer not found' });

  const calc = calculateDelivery(distanceKm, vehicleType);

  offer.delivery = {
    vehicleType,
    distanceKm,
    ...calc,
    confirmed: true
  };

  await offer.save();
  notifyFarmerPickupReady(offer.farmerId, offer);

  res.json({ message: 'Delivery confirmed', delivery: offer.delivery });
};
