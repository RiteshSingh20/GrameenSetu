const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const connectDB = require('../config/db');
const authRoutes = require('../routes/auth');
const errorHandler = require('../middleware/errorHandler');
const { sendOtpEmail } = require('../utils/sendEmail');

require('dotenv').config();

const app = express();
connectDB();

console.log('EMAIL:', process.env.NOTIFY_EMAIL);
console.log('PASS EXISTS:', !!process.env.NOTIFY_EMAIL_PASS);

app.use(cors());
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ extended: true, limit: '40mb' }));
app.use(morgan('dev'));


app.use('/uploads', express.static('uploads'));
app.use('/api/farmer', require('../routes/farmer'));
app.use('/api/crop', require('../routes/crop'));
app.use('/api/farmer/auth', require('../routes/farmerAuth'));
app.use('/api/vendor/auth', require('../routes/vendorAuth'));
app.use('/api/vendor/crops', require('../routes/cropFeed'));
app.use('/api/vendor', require('../routes/vendorProfile'));
app.use('/api/dashboard', require('../routes/dashboard'));
app.use('/api/offers', require('../routes/offer'));
app.use('/api/payment', require('../routes/payment'));
app.use('/api/market', require('../routes/market'));
app.use('/api/notifications', require('../routes/notification'));


app.get('/', (req, res) => res.send('welcome to server'));

app.get('/test-email', async (req, res) => {
  try {
    await sendOtpEmail('your_email@gmail.com', '123456');
    res.send('Email sent');
  } catch (err) {
    console.error(err);
    res.send('Email failed');
  }
});


app.use('/api/auth', authRoutes);


app.get('/health', (req, res) => res.json({ status: 'ok' }));


app.use(errorHandler);

module.exports = app;
