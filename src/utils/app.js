const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const connectDB = require('../config/db');
const authRoutes = require('../routes/auth');
const errorHandler = require('../middleware/errorHandler');

require('dotenv').config();

const app = express();
connectDB();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(morgan('dev'));


app.use('/uploads', express.static('uploads'));
app.use('/api/farmer', require('../routes/farmer'));
app.use('/api/crop', require('../routes/crop'));
app.use('/api/farmer/auth', require('../routes/farmerAuth'));
app.use('/api/vendor/auth', require('../routes/vendorAuth'));
app.use('/api/vendor/crops', require('../routes/cropFeed'));







app.get('/', (req, res) => res.send('welcome to server'));


app.use('/api/auth', authRoutes);


app.get('/health', (req, res) => res.json({ status: 'ok' }));


app.use(errorHandler);

module.exports = app;
