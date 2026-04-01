const nodemailer = require('nodemailer');

// ✅ Create transporter (Gmail SMTP - correct config)
const transporter = nodemailer.createTransport({
  host: 'smtp.gmail.com',
  port: 587,          // ✅ correct for Gmail
  secure: false,      // ✅ must be false for 587
  auth: {
    user: process.env.NOTIFY_EMAIL,
    pass: process.env.NOTIFY_EMAIL_PASS, // ⚠️ no spaces in app password
  },
});

// ✅ Debug SMTP connection (VERY IMPORTANT)
transporter.verify((err, success) => {
  if (err) {
    console.error("❌ SMTP ERROR:", err);
  } else {
    console.log("✅ SMTP READY");
  }
});

// ✅ Send OTP Email
exports.sendOtpEmail = async (toEmail, otp) => {
  if (!process.env.NOTIFY_EMAIL || !process.env.NOTIFY_EMAIL_PASS) {
    throw new Error('Email credentials not configured');
  }

  await transporter.sendMail({
    from: `"GrameenSetu" <${process.env.NOTIFY_EMAIL}>`,
    to: toEmail,
    subject: 'GrameenSetu Login OTP',
    html: `
      <div style="font-family: Arial, sans-serif; padding: 20px;">
        <h2>GrameenSetu Login</h2>
        <h3>Dear Farmer 👨‍🌾</h3>
        <p><strong>Do not share this OTP with anyone</strong></p>
        <p>Your OTP is:</p>
        <h1 style="color: #2e7d32;">${otp}</h1>
        <p>Valid for 10 minutes</p>
      </div>
    `
  });
};

// ✅ General Email Sender
exports.sendEmail = async (toEmail, subject, message) => {
  try {
    await transporter.sendMail({
      from: `"GrameenSetu" <${process.env.NOTIFY_EMAIL}>`,
      to: toEmail,
      subject: subject,
      html: `
        <div style="font-family: Arial, sans-serif; padding: 20px;">
          <h2>GrameenSetu</h2>
          <p>${message}</p>
          <p>Best regards,<br/>GrameenSetu Team</p>
        </div>
      `
    });
  } catch (err) {
    console.error('❌ Email send error:', err);
  }
};