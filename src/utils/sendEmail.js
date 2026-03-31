const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.NOTIFY_EMAIL,
    pass: process.env.NOTIFY_EMAIL_PASS
  }
});

exports.sendOtpEmail = async (toEmail, otp) => {
  await transporter.sendMail({
    from: `"GrameenSetu" <${process.env.NOTIFY_EMAIL}>`,
    to: toEmail,
    subject: '🔐 GrameenSetu Login OTP',
    html: `
      <h2>GrameenSetu Login</h2>
      <h2>Dear Farmer 😊</h2>
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
