const { Resend } = require('resend');

let resendClient = null;

const getResendClient = () => {
  if (!resendClient) {
    resendClient = new Resend(process.env.RESEND_API_KEY);
  }
  return resendClient;
};

const getFromAddress = () => {
  return process.env.RESEND_FROM || process.env.NOTIFY_EMAIL;
};

const ensureResendConfigured = () => {
  if (!process.env.RESEND_API_KEY) {
    throw new Error('Resend API key not configured');
  }
  if (!getFromAddress()) {
    throw new Error('Resend from address not configured');
  }
};

exports.sendOtpEmail = async (toEmail, otp) => {
  ensureResendConfigured();
  const resend = getResendClient();
  await resend.emails.send({
    from: `"GrameenSetu" <${getFromAddress()}>`,
    to: [toEmail],
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
    ensureResendConfigured();
    const resend = getResendClient();
    await resend.emails.send({
      from: `"GrameenSetu" <${getFromAddress()}>`,
      to: [toEmail],
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
