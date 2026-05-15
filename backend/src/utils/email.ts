import sgMail from '@sendgrid/mail';

/**
 * Email Service (Production - Option B)
 * 
 * Uses SendGrid for reliable delivery.
 * Requires SENDGRID_API_KEY and SENDGRID_FROM_EMAIL environment variables.
 */

if (process.env.SENDGRID_API_KEY) {
  sgMail.setApiKey(process.env.SENDGRID_API_KEY);
}

export class EmailService {
  /**
   * Sends a 6-digit OTP to the specified email.
   */
  static async sendOTP(email: string, otp: string, type: 'verification' | 'reset' = 'verification') {
    const isReset = type === 'reset';
    const subject = isReset 
      ? `${otp} is your TRC password reset code` 
      : `${otp} is your TRC verification code`;
      
    const title = isReset ? 'Reset your password' : 'Verify your email address';
    const description = isReset 
      ? 'We received a request to reset your TRC password. Enter the code below to proceed:'
      : 'Welcome to TRC. To complete your registration, please enter the following verification code:';

    const html = `
      <div style="font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; max-width: 600px; margin: 0 auto; padding: 40px; background-color: #f9f9fb; border-radius: 16px;">
        <div style="text-align: center; margin-bottom: 30px;">
          <h1 style="color: #6C2BD9; margin: 0; font-size: 28px;">TRC</h1>
          <p style="color: #6b7280; font-size: 14px; margin-top: 5px;">Tigray Resources Center</p>
        </div>
        
        <div style="background-color: #ffffff; padding: 30px; border-radius: 12px; box-shadow: 0 4px 6px rgba(0,0,0,0.05);">
          <h2 style="color: #111827; margin-top: 0; font-size: 20px;">${title}</h2>
          <p style="color: #4b5563; line-height: 1.6;">${description}</p>
          
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
    `;

    if (!process.env.SENDGRID_API_KEY) {
      console.log('\n' + '='.repeat(40));
      console.log(`✉️  [MOCK EMAIL - SENDGRID MISSING] To: ${email}`);
      console.log(`🔑  [MOCK EMAIL] Type: ${type} | Code: ${otp}`);
      console.log('='.repeat(40) + '\n');
      return;
    }

    try {
      await sgMail.send({
        to: email,
        from: process.env.SENDGRID_FROM_EMAIL || 'noreply@trc.local', // Must be verified in SendGrid
        subject,
        html,
      });
      console.log(`[SendGrid Success] ${type} OTP delivered to ${email}`);
    } catch (error: any) {
      console.error('[SendGrid Failure] Error:', error.response?.body || error.message);
      // Fallback log
      console.log(`\n🔑 [EMERGENCY LOG] ${type} OTP for ${email}: ${otp}\n`);
    }
  }
}
