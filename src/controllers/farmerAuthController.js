const jwt = require('jsonwebtoken');
const Farmer = require('../models/Farmer');
const Otp = require('../models/Otp');
const { generateOtp } = require('../utils/otpHelper');
const { sendOtpEmail } = require('../utils/sendEmail');


exports.requestOtp = async (req, res) => {
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({ message: 'Email is required' });
    }

    const farmer = await Farmer.findOne({ email });
    if (!farmer) {
      return res.status(404).json({ message: 'Farmer not found' });
    }

    const otp = generateOtp();

    await Otp.create({
  email,
  code: otp,
  expiresAt: new Date(Date.now() + 10 * 60 * 1000)
});

    // 📧 Send OTP to farmer email
    await sendOtpEmail(email, otp);

    res.json({ message: 'OTP sent to registered email' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Failed to send OTP' });
  }
};


exports.verifyOtp = async (req, res) => {
  try {
    const { email, code } = req.body;

    const otpRecord = await Otp.findOne({ email, code });
    if (!otpRecord || otpRecord.expiresAt < new Date()) {
      return res.status(400).json({ message: 'Invalid or expired OTP' });
    }

    const farmer = await Farmer.findOne({ email });
    if (!farmer) {
      return res.status(404).json({ message: 'Farmer not found' });
    }

    const token = jwt.sign(
      { id: farmer._id, type: 'farmer' },
      process.env.JWT_SECRET,
      { expiresIn: '7d' }
    );

    await Otp.deleteMany({ email });

    res.json({
      message: 'Farmer login successful',
      token,
      farmerId: farmer._id
    });
  } catch (err) {
    res.status(500).json({ message: 'OTP verification failed' });
  }
};
