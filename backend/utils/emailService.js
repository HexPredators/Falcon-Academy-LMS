const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransporter({
  host: process.env.EMAIL_HOST || 'smtp.gmail.com',
  port: process.env.EMAIL_PORT || 587,
  secure: false,
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASSWORD,
  },
});

const sendOTPEmail = async (email, otp, name) => {
  try {
    const mailOptions = {
      from: process.env.EMAIL_FROM,
      to: email,
      subject: 'Falcon Academy - Email Verification OTP',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #2563eb; text-align: center;">Falcon Academy DLMS</h2>
          <div style="background: #f8fafc; padding: 20px; border-radius: 8px;">
            <h3 style="color: #1e293b;">Hello ${name},</h3>
            <p style="color: #475569; font-size: 16px;">
              Thank you for registering with Falcon Academy. Use the OTP below to verify your email address:
            </p>
            <div style="text-align: center; margin: 30px 0;">
              <span style="background: #2563eb; color: white; padding: 15px 30px; 
                         font-size: 24px; font-weight: bold; border-radius: 6px; 
                         letter-spacing: 5px;">
                ${otp}
              </span>
            </div>
            <p style="color: #64748b; font-size: 14px;">
              This OTP will expire in 10 minutes. If you didn't request this, please ignore this email.
            </p>
          </div>
          <p style="text-align: center; color: #94a3b8; font-size: 12px; margin-top: 20px;">
            © 2025 Falcon Academy. All rights reserved.
          </p>
        </div>
      `
    };

    await transporter.sendMail(mailOptions);
    console.log(`OTP email sent to ${email}`);
    return true;
  } catch (error) {
    console.error('Error sending OTP email:', error);
    throw new Error('Failed to send OTP email');
  }
};

const sendParentLinkEmail = async (parentEmail, studentName, linkCode) => {
  try {
    const mailOptions = {
      from: process.env.EMAIL_FROM,
      to: parentEmail,
      subject: `Falcon Academy - Parent Link Request for ${studentName}`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #2563eb; text-align: center;">Falcon Academy DLMS</h2>
          <div style="background: #f8fafc; padding: 20px; border-radius: 8px;">
            <h3 style="color: #1e293b;">Parent Link Request</h3>
            <p style="color: #475569; font-size: 16px;">
              You have requested to link with ${studentName}'s account. 
              Use the following link code in your parent dashboard:
            </p>
            <div style="text-align: center; margin: 30px 0;">
              <span style="background: #059669; color: white; padding: 12px 24px; 
                         font-size: 18px; font-weight: bold; border-radius: 6px;">
                ${linkCode}
              </span>
            </div>
            <p style="color: #64748b; font-size: 14px;">
              The student will need to approve this link request in their account.
            </p>
          </div>
        </div>
      `
    };

    await transporter.sendMail(mailOptions);
    return true;
  } catch (error) {
    console.error('Error sending parent link email:', error);
    throw error;
  }
};

module.exports = {
  sendOTPEmail,
  sendParentLinkEmail,
  transporter
};