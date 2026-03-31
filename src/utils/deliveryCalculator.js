exports.calculateDelivery = (distanceKm, vehicleType) => {
  const speedMap = {
    truck: 40,
    tempo: 50,
    rickshaw: 30
  };

  const rateMap = {
    truck: 25,
    tempo: 18,
    rickshaw: 12
  };

  const estimatedTimeHr = distanceKm / speedMap[vehicleType];
  const estimatedFare = distanceKm * rateMap[vehicleType];

  return {
    estimatedTimeHr: Number(estimatedTimeHr.toFixed(1)),
    estimatedFare
  };
};
