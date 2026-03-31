const mongoose = require('mongoose');

const connectDB = async () => {
  const uri = process.env.MONGO_URI;
  if (!uri) throw new Error('MONGO_URI not set in .env');

  // 🔥 Attach listeners FIRST
  mongoose.connection.on('connected', () => {
    console.log('🔥 CONNECTED TO:', mongoose.connection.host);
    console.log('🔥 DATABASE NAME:', mongoose.connection.name);
  });

  mongoose.connection.on('error', (err) => {
    console.error('❌ MongoDB connection error:', err.message);
  });

  try {
    await mongoose.connect(uri, {
      dbName: 'GrameenSetu',   // 🔥 FORCE DB (CRITICAL)
    });
    console.log('✅ MongoDB connected');
  } catch (err) {
    console.error('❌ MongoDB connection failed:', err.message);
  }
};

module.exports = connectDB;
