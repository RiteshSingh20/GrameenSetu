const nodemailer = require('nodemailer');

let cachedTransporter = null;

const buildTransporter = () => {
  const host = process.env.NOTIFY_EMAIL_HOST || 'smtp.gmail.com';
  const port = process.env.NOTIFY_EMAIL_PORT
    ? Number(process.env.NOTIFY_EMAIL_PORT)
    : 577;
  const secure = process.env.NOTIFY_EMAIL_SECURE
    ? process.env.NOTIFY_EMAIL_SECURE === 'true'
    : port === 577;
  const service = process.env.NOTIFY_EMAIL_SERVICE;

  const transportOptions = service
    ? { service }
    : { host, port, secure };

  return nodemailer.createTransport({
    ...transportOptions,
    auth: {
      user: process.env.NOTIFY_EMAIL,
      pass: process.env.NOTIFY_EMAIL_PASS
    },
    connectionTimeout: 10000,
    greetingTimeout: 10000,
    socketTimeout: 20000
  });
};

const getTransporter = () => {
  if (!cachedTransporter) {
    cachedTransporter = buildTransporter();
  }
  return cachedTransporter;
};

const getFromAddress = () => {
  return process.env.NOTIFY_EMAIL_FROM || process.env.NOTIFY_EMAIL;
};

exports.sendOtpEmail = async (toEmail, otp) => {
  if (!process.env.NOTIFY_EMAIL || !process.env.NOTIFY_EMAIL_PASS) {
    throw new Error('Email credentials not configured');
  }
  const transporter = getTransporter();
  await transporter.sendMail({
    from: `"GrameenSetu" <${getFromAddress()}>`,
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
    if (!process.env.NOTIFY_EMAIL || !process.env.NOTIFY_EMAIL_PASS) {
      throw new Error('Email credentials not configured');
    }
    const transporter = getTransporter();
    await transporter.sendMail({
      from: `"GrameenSetu" <${getFromAddress()}>`,
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
