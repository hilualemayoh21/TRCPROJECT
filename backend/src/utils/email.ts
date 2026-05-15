import nodemailer from 'nodemailer';

/**
 * Email Service
 * 
 * Handles real-time OTP delivery via SMTP.
 * For production (Render), ensure SMTP_USER and SMTP_PASS are set.
 */

const transporter = nodemailer.createTransport({
  host: 'smtp.gmail.com',
  port: 465,
  secure: true, // Use SSL/TLS
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS, // This MUST be an App Password for Gmail
  },
  pool: true, // Use a connection pool for better performance
  maxConnections: 5,
  maxMessages: 100
});

export class EmailService {
  /**
   * Sends a 6-digit OTP to the specified email.
   */
  static async sendOTP(email: string, otp: string) {
    if (!process.env.SMTP_USER || !process.env.SMTP_PASS) {
      console.log('\n' + '='.repeat(40));
      console.log(`✉️  [MOCK EMAIL] To: ${email}`);
      console.log(`🔑  [MOCK EMAIL] Verification Code: ${otp}`);
      console.log('💡  [INFO] Set SMTP_USER and SMTP_PASS on Render to send real emails.');
      console.log('='.repeat(40) + '\n');
      return;
    }

    try {
      await transporter.sendMail({
        from: `"TRC Tigray Resources Center" <${process.env.SMTP_USER}>`,
        to: email,
        subject: `${otp} is your TRC verification code`,
        html: `
          <div style="font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; max-width: 600px; margin: 0 auto; padding: 40px; background-color: #f9f9fb; border-radius: 16px;">
            <div style="text-align: center; margin-bottom: 30px;">
              <h1 style="color: #6C2BD9; margin: 0; font-size: 28px;">TRC</h1>
              <p style="color: #6b7280; font-size: 14px; margin-top: 5px;">Tigray Resources Center</p>
            </div>
            
            <div style="background-color: #ffffff; padding: 30px; border-radius: 12px; box-shadow: 0 4px 6px rgba(0,0,0,0.05);">
              <h2 style="color: #111827; margin-top: 0; font-size: 20px;">Verify your email address</h2>
              <p style="color: #4b5563; line-height: 1.6;">Welcome to TRC. To complete your registration, please enter the following verification code:</p>
              
              <div style="background-color: #f3f4f6; padding: 20px; border-radius: 12px; text-align: center; margin: 30px 0; border: 1px dashed #d1d5db;">
                <span style="font-size: 36px; font-weight: 800; letter-spacing: 6px; color: #6C2BD9; font-family: monospace;">${otp}</span>
              </div>
              
              <p style="color: #6b7280; font-size: 13px; text-align: center;">This code will expire in <strong>15 minutes</strong> for security reasons.</p>
            </div>
            
            <div style="text-align: center; margin-top: 30px; color: #9ca3af; font-size: 12px;">
              <p>If you didn't request this code, you can safely ignore this email.</p>
              <p>&copy; 2024 Tigray Resources Center. All rights reserved.</p>
            </div>
          </div>
        `,
      });
      console.log(`[Email Success] OTP delivered to ${email}`);
    } catch (error: any) {
      console.error('[Email Failure] SMTP Error:', error.message);
      // Fallback to console log so developers can still see the code
      console.log('\n' + '!'.repeat(40));
      console.log(`✉️  [CRITICAL FALLBACK] To: ${email}`);
      console.log(`🔑  [CRITICAL FALLBACK] Code: ${otp}`);
      console.log('!'.repeat(40) + '\n');
    }
  }

  /**
   * Helper to verify SMTP connection health
   */
  static async verifyConnection() {
    try {
      await transporter.verify();
      return { ok: true, message: 'SMTP connection established successfully.' };
    } catch (error: any) {
      return { ok: false, message: error.message };
    }
  }
}
