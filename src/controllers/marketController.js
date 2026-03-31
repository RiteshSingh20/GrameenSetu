exports.getMarketPrices = async (req, res) => {
  // Static seed data for MVP; replace with live data source later.
  res.json({
    location: req.query.location || 'Nashik, Maharashtra',
    prices: [
      { crop: 'Wheat', price: 2400, unit: 'Quintal', changePct: 2 },
      { crop: 'Rice', price: 1800, unit: 'Quintal', changePct: -1 },
      { crop: 'Dal', price: 1500, unit: 'Quintal', changePct: 5 }
    ]
  });
};
