const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
  host: process.env.NOTIFY_EMAIL_HOST || 'smtp.gmail.com',
  port: process.env.NOTIFY_EMAIL_PORT ? Number(process.env.NOTIFY_EMAIL_PORT) : 465,
  secure: process.env.NOTIFY_EMAIL_SECURE
    ? process.env.NOTIFY_EMAIL_SECURE === 'true'
    : true,
  auth: {
    user: process.env.NOTIFY_EMAIL,
    pass: process.env.NOTIFY_EMAIL_PASS
  },
  connectionTimeout: 10000,
  greetingTimeout: 10000,
  socketTimeout: 20000
});

exports.sendOtpEmail = async (toEmail, otp) => {
  if (!process.env.NOTIFY_EMAIL || !process.env.NOTIFY_EMAIL_PASS) {
    throw new Error('Email credentials not configured');
  }
  await transporter.sendMail({
    from: `"GrameenSetu" <${process.env.NOTIFY_EMAIL}>`,
    to: toEmail,
    subject: 'GrameenSetu Login OTP',
    html: `
      <h2>GrameenSetu Login</h2>
      <h2>Dear Farmer</h2>
      <h3>Do not Share with anyone!</h3>
      <p>Your OTP is:</p>
      <h1>${otp}</h1>
      <p>Valid for 10 minutes</p>
    `
  });
};

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
    console.error('Email send error:', err);
  }
};
