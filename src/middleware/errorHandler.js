module.exports = (err, req, res, next) => {
  console.error(err);
  const message = err.message || 'Internal server error';
  res.status(err.status || 500).json({ message });
};
