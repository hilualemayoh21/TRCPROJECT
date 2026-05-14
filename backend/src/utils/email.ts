import nodemailer from 'nodemailer';
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
});

export class EmailService {
  static async sendOTP(email: string, otp: string) {
    if (!process.env.SMTP_USER || !process.env.SMTP_PASS) {
      console.log('\n' + '='.repeat(40));
      console.log(`✉️  [MOCK EMAIL] To: ${email}`);
      console.log(`🔑  [MOCK EMAIL] Verification Code: ${otp}`);
      console.log('='.repeat(40) + '\n');
      return;
    }

    try {
      await transporter.sendMail({
        from: `"TRC Admin Portal" <${process.env.SMTP_USER}>`,
        to: email,
        subject: 'Your Verification Code',
        html: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
            <h2 style="color: #6C2BD9;">Welcome to TRC</h2>
            <p>Your verification code is:</p>
            <div style="background-color: #f3f4f6; padding: 16px; border-radius: 8px; text-align: center; margin: 24px 0;">
              <span style="font-size: 32px; font-weight: bold; letter-spacing: 4px; color: #111827;">${otp}</span>
            </div>
            <p style="color: #6b7280; font-size: 14px;">This code will expire in 15 minutes.</p>
          </div>
        `,
      });
      console.log(`[Email Sent] OTP successfully sent to ${email}`);
    } catch (error) {
      console.error('[Email Error] Failed to send real email. Falling back to console log.');
      console.log('\n' + '!'.repeat(40));
      console.log(`✉️  [FALLBACK EMAIL] To: ${email}`);
      console.log(`🔑  [FALLBACK EMAIL] Verification Code: ${otp}`);
      console.log('!'.repeat(40) + '\n');
    }
  }
}
