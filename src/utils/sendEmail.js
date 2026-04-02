const { Resend } = require('resend');

const DEFAULT_FROM = 'onboarding@resend.dev';

let resendClient = null;

const getResendClient = () => {
  if (!resendClient) {
    resendClient = new Resend(process.env.RESEND_API_KEY);
  }
  return resendClient;
};

const getFromAddress = () => {
  return process.env.RESEND_FROM || DEFAULT_FROM;
};

const formatFromAddress = (fromValue) => {
  const value = typeof fromValue === 'string' ? fromValue.trim() : '';
  if (!value) {
    return '';
  }
  // If user already provided "Name <email>" format, use it as-is.
  if (value.includes('<') && value.includes('>')) {
    return value;
  }
  return `"GrameenSetu" <${value}>`;
};

const ensureResendConfigured = () => {
  if (!process.env.RESEND_API_KEY) {
    throw new Error('Resend API key not configured');
  }
};

const normalizeTo = (toEmail) => {
  if (Array.isArray(toEmail)) {
    return toEmail;
  }
  return [toEmail];
};

const requireField = (value, name) => {
  if (!value || (typeof value === 'string' && value.trim().length === 0)) {
    throw new Error(`Missing required field: ${name}`);
  }
};

const sendResendEmail = async ({ to, subject, html }) => {
  ensureResendConfigured();
  requireField(getFromAddress(), 'from');
  requireField(to, 'to');
  requireField(subject, 'subject');
  requireField(html, 'html');

  const resend = getResendClient();
  const { data, error } = await resend.emails.send({
    from: formatFromAddress(getFromAddress()),
    to: normalizeTo(to),
    subject,
    html
  });

  if (error) {
    const resendError = new Error(error.message || 'Resend email error');
    resendError.resend = error;
    throw resendError;
  }

  return data;
};

exports.sendOtpEmail = async (toEmail, otp) => {
  await sendResendEmail({
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
    await sendResendEmail({
      to: toEmail,
      subject,
      html: `
        <div style="font-family: Arial, sans-serif; padding: 20px;">
          <h2>GrameenSetu</h2>
          <p>${message}</p>
          <p>Best regards,<br/>GrameenSetu Team</p>
        </div>
      `
    });
  } catch (err) {
    console.error('Email send error:', {
      message: err?.message,
      resend: err?.resend
    });
    throw err;
  }
};
