import { Resend } from 'resend';

/**
 * Email Service (Production - Resend Integration)
 * 
 * Uses Resend for reliable, fast delivery.
 * Requires RESEND_API_KEY and RESEND_FROM_EMAIL environment variables.
 * For testing without a domain, you can use a verified email or Resend's test domain (onboarding@resend.dev)
 */

const resend = new Resend(process.env.RESEND_API_KEY || 're_dummy_key_for_mock');

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

    if (!process.env.RESEND_API_KEY) {
      console.log('\n' + '='.repeat(40));
      console.log(`✉️  [MOCK EMAIL - RESEND MISSING] To: ${email}`);
      console.log(`🔑  [MOCK EMAIL] Type: ${type} | Code: ${otp}`);
      console.log('='.repeat(40) + '\n');
      return;
    }

    try {
      const fromEmail = process.env.RESEND_FROM_EMAIL || 'TRC <onboarding@resend.dev>';
      
      const { data, error } = await resend.emails.send({
        from: fromEmail,
        to: email,
        subject,
        html,
      });

      if (error) {
        console.error('[Resend Failure] Error from Resend API:', error);
        // Fallback log
        console.log(`\n🔑 [EMERGENCY LOG] ${type} OTP for ${email}: ${otp}\n`);
      } else {
        console.log(`[Resend Success] ${type} OTP delivered to ${email}. ID: ${data?.id}`);
      }
    } catch (error: any) {
      console.error('[Resend Exception] Error:', error.message);
      console.log(`\n🔑 [EMERGENCY LOG] ${type} OTP for ${email}: ${otp}\n`);
    }
  }
}
