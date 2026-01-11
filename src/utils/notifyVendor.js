const nodemailer = require('nodemailer');

/**
 * TEMP EMAIL TRANSPORT (Gmail / App Password)
 */
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.NOTIFY_EMAIL,
    pass: process.env.NOTIFY_EMAIL_PASS
  }
});

exports.notifyVendors = async (vendors, crop) => {
  for (const vendor of vendors) {
    // 📧 Email notification
    if (vendor.email) {
      await transporter.sendMail({
        from: `"GrameenSetu" <${process.env.NOTIFY_EMAIL}>`,
        to: vendor.email,
        subject: '🌾 New Crop Available on GrameenSetu',
        html: `
          <h3>New Crop Listed</h3>
          <p><strong>Crop:</strong> ${crop.cropName}</p>
          <p><strong>Quantity:</strong> ${crop.quantity} ${crop.unit}</p>
          <p><strong>Location:</strong> ${crop.district}, ${crop.state}</p>
          <p><strong>Expected Price:</strong> ₹${crop.expectedPrice || 'Not specified'}</p>
          <p>Login to GrameenSetu to send your offer.</p>
        `
      });
    }

    // 📱 WhatsApp MOCK (for now)
    console.log(`📲 WhatsApp MOCK to ${vendor.mobile}`);
    console.log(
      `New Crop: ${crop.cropName}, Qty: ${crop.quantity} ${crop.unit}, Location: ${crop.district}`
    );
  }
};
