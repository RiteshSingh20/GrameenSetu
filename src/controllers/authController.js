const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { v4: uuidv4 } = require('uuid');
const moment = require('moment');

const Vendor = require('../models/Vendor');
const Farmer = require('../models/Farmer');
const Otp = require('../models/Otp');
const { vendorSignupSchema, vendorLoginSchema, mobileSchema, otpSchema } = require('../utils/validators');

const OTP_TTL_MINUTES = Number(process.env.OTP_TTL_MINUTES || 10);
const JWT_SECRET = process.env.JWT_SECRET || 'change_this_secret';

const generateOtpCode = () => Math.floor(100000 + Math.random() * 900000).toString();

exports.requestOtp = async (req, res, next) => {
  try {
    const { mobile, purpose = 'signup' } = req.body;
    if (!mobile) return res.status(400).json({ message: 'Mobile required' });

    // generate code
    const code = generateOtpCode();
    // calculate expiry
    const expiresAt = moment().add(OTP_TTL_MINUTES, 'minutes').toDate();

    // persist OTP - in prod hash the code
    await Otp.create({ mobile, code, purpose, expiresAt });

    // TODO: integrate with SMS provider (Twilio/MSG91/Razorpay)
    console.log(`OTP for ${mobile}: ${code} (DEV ONLY)`);
    return res.json({ message: 'OTP sent (dev console)', mobile });
  } catch (err) {
    next(err);
  }
};

exports.verifyOtp = async (req, res, next) => {
  try {
    const { mobile, code, purpose = 'signup' } = req.body;
    if (!mobile || !code) return res.status(400).json({ message: 'Mobile and code required' });

    const record = await Otp.findOne({ mobile, purpose }).sort({ createdAt: -1 });
    if (!record) return res.status(400).json({ message: 'OTP not found or expired' });

    if (new Date() > record.expiresAt) return res.status(400).json({ message: 'OTP expired' });

    if (record.code !== code) {
      record.attempts += 1;
      await record.save();
      return res.status(400).json({ message: 'Invalid OTP' });
    }

    // OTP success — create a short-lived token so client can proceed to create account (optional)
    const token = jwt.sign({ mobile, purpose }, JWT_SECRET, { expiresIn: '15m' });

    return res.json({ message: 'OTP verified', token });
  } catch (err) {
    next(err);
  }
};

exports.registerVendor = async (req, res, next) => {
try {
  // handle uploads: registrationDoc uploaded with field name 'registrationDoc'
  const body = req.body;

  // flatten nested objects if present
  if (body.basic) {
    Object.assign(body, body.basic);
    delete body.basic;
  }
  if (body.business) {
    Object.assign(body, body.business);
    delete body.business;
  }
  if (body.location) {
    Object.assign(body, body.location);
    delete body.location;
  }

  // parse procurementRadius if sent as string
  if (body.procurementRadiusKm) body.procurementRadiusKm = Number(body.procurementRadiusKm);

    // validate body
    const { error, value } = vendorSignupSchema.validate(body);
    if (error) return res.status(400).json({ message: error.details[0].message });

    // mobile uniqueness check
    let vendor = await Vendor.findOne({ mobile: value.mobile });
    if (vendor) return res.status(409).json({ message: 'Vendor with this mobile already exists' });

    // hash password if provided
    let passwordHash = null;
    if (value.password) {
      const salt = await bcrypt.genSalt(10);
      passwordHash = await bcrypt.hash(value.password, salt);
    }

    // registration document url (if uploaded)
    let registrationDocUrl = null;
    if (req.file) {
      registrationDocUrl = `${process.env.BASE_URL || ''}/${req.file.path}`;
    }

    const newVendor = new Vendor({
      fullName: value.fullName,
      mobile: value.mobile,
      email: value.email,
      passwordHash,
      preferredLanguage: value.preferredLanguage,
      businessName: value.businessName,
      businessType: value.businessType,
      gstNumber: value.gstNumber,
      panNumber: value.panNumber,
      registrationDocUrl,
      address: value.address,
      district: value.district,
      state: value.state,
      pincode: value.pincode,
      procurementRadiusKm: value.procurementRadiusKm || 50
    });

    await newVendor.save();

    
    const token = jwt.sign({ id: newVendor._id, role: 'vendor' }, JWT_SECRET, { expiresIn: process.env.JWT_EXPIRES_IN || '7d' });
    return res.status(201).json({ message: 'Vendor created', vendorId: newVendor._id, token });
   } catch (err) {
    next(err);
   }
};

exports.loginVendor = async (req, res, next) => {
   try {
     const { mobile, password } = req.body;

     // validate input
     const { error, value } = vendorLoginSchema.validate({ mobile, password });
     if (error) return res.status(400).json({ message: error.details[0].message });

     // find vendor by mobile
     const vendor = await Vendor.findOne({ mobile: value.mobile });
     if (!vendor) return res.status(401).json({ message: 'Invalid mobile or password' });

     // check if password is set
     if (!vendor.passwordHash) return res.status(401).json({ message: 'Password not set for this account' });

     // verify password
     const isMatch = await bcrypt.compare(value.password, vendor.passwordHash);
     if (!isMatch) return res.status(401).json({ message: 'Invalid mobile or password' });

     // generate token
     const token = jwt.sign({ id: vendor._id, role: 'vendor' }, JWT_SECRET, { expiresIn: process.env.JWT_EXPIRES_IN || '7d' });

     return res.json({ message: 'Login successful', vendorId: vendor._id, token });
   } catch (err) {
     next(err);
   }
 };

// Farmer login functions
exports.requestOtpForFarmerLogin = async (req, res, next) => {
  try {
    const { error, value } = mobileSchema.validate(req.body);
    if (error) return res.status(400).json({ message: error.details[0].message });

    const { mobile } = value;

    // Check if farmer exists
    const farmer = await Farmer.findOne({ mobile });
    if (!farmer) return res.status(404).json({ message: 'Farmer not found with this mobile number' });

    // generate code
    const code = generateOtpCode();
    // calculate expiry
    const expiresAt = moment().add(OTP_TTL_MINUTES, 'minutes').toDate();

    // persist OTP
    await Otp.create({ mobile, code, purpose: 'login', expiresAt });

    // TODO: integrate with SMS provider (Twilio/MSG91/Razorpay)
    console.log(`OTP for farmer login ${mobile}: ${code} (DEV ONLY)`);
    return res.json({ message: 'OTP sent (dev console)', mobile });
  } catch (err) {
    next(err);
  }
};

exports.verifyOtpForFarmerLogin = async (req, res, next) => {
  try {
    const { error, value } = otpSchema.validate(req.body);
    if (error) return res.status(400).json({ message: error.details[0].message });

    const { mobile, code } = value;

    const record = await Otp.findOne({ mobile, purpose: 'login' }).sort({ createdAt: -1 });
    if (!record) return res.status(400).json({ message: 'OTP not found or expired' });

    if (new Date() > record.expiresAt) return res.status(400).json({ message: 'OTP expired' });

    if (record.code !== code) {
      record.attempts += 1;
      await record.save();
      return res.status(400).json({ message: 'Invalid OTP' });
    }

    // Find farmer
    const farmer = await Farmer.findOne({ mobile });
    if (!farmer) return res.status(404).json({ message: 'Farmer not found' });

    // Generate JWT token
    const token = jwt.sign({ id: farmer._id, role: 'farmer' }, JWT_SECRET, { expiresIn: process.env.JWT_EXPIRES_IN || '7d' });

    return res.json({ message: 'Login successful', farmerId: farmer._id, token });
  } catch (err) {
    next(err);
  }
};
