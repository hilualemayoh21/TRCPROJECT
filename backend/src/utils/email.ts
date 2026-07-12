import { Resend } from 'resend';
import nodemailer from 'nodemailer';
import logger from './logger';

export type EmailSendResult = {
  sent: boolean;
  provider?: 'resend' | 'smtp' | 'console';
  hint?: string;
};

let resendClient: Resend | null = null;

function getResendClient(): Resend {
  const apiKey = process.env.RESEND_API_KEY?.trim();
  if (!apiKey) {
    throw new Error('RESEND_API_KEY is not configured');
  }
  if (!resendClient) {
    resendClient = new Resend(apiKey);
  }
  return resendClient;
}

function getFromAddress(): string {
  return (
    process.env.RESEND_FROM_EMAIL?.trim() ||
    process.env.SMTP_FROM?.trim() ||
    'TRC <onboarding@resend.dev>'
  );
}

function isResendSandboxFrom(from: string): boolean {
  return from.includes('onboarding@resend.dev');
}

function buildOtpEmailContent(otp: string, type: 'verification' | 'reset') {
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

  return { subject, html };
}

function logOtpToConsole(email: string, otp: string, type: 'verification' | 'reset', reason: string) {
  logger.warn({ email, type, reason }, 'OTP logged to server output only');
  console.log('\n' + '='.repeat(40));
  console.log(`✉️  [EMAIL NOT SENT] To: ${email}`);
  console.log(`🔑  [OTP] Type: ${type} | Code: ${otp}`);
  console.log(`ℹ️  Reason: ${reason}`);
  console.log('='.repeat(40) + '\n');
}

function getSmtpTransport() {
  const host = process.env.SMTP_HOST?.trim();
  const user = process.env.SMTP_USER?.trim();
  const pass = process.env.SMTP_PASS?.trim();
  if (!host || !user || !pass) return null;

  return nodemailer.createTransport({
    host,
    port: Number(process.env.SMTP_PORT || 587),
    secure: String(process.env.SMTP_SECURE || 'false').toLowerCase() === 'true',
    auth: { user, pass },
  });
}

export function getEmailProviderStatus() {
  const resendConfigured = Boolean(process.env.RESEND_API_KEY?.trim());
  const smtpConfigured = Boolean(
    process.env.SMTP_HOST?.trim() &&
    process.env.SMTP_USER?.trim() &&
    process.env.SMTP_PASS?.trim()
  );
  const from = getFromAddress();

  return {
    configured: resendConfigured || smtpConfigured,
    provider: resendConfigured ? 'resend' : smtpConfigured ? 'smtp' : 'none',
    from,
    sandboxMode: resendConfigured && isResendSandboxFrom(from),
    sandboxHint: resendConfigured && isResendSandboxFrom(from)
      ? 'With onboarding@resend.dev, Resend only delivers to the email address used for your Resend account.'
      : undefined,
  };
}

export class EmailService {
  /** Generic internal send helper — tries Resend, then SMTP, then console fallback */
  private static async sendHtml(
    email: string,
    subject: string,
    html: string
  ): Promise<EmailSendResult> {
    const from = getFromAddress();
    const resendKey = process.env.RESEND_API_KEY?.trim();
    const smtpTransport = getSmtpTransport();

    if (resendKey) {
      try {
        const { data, error } = await getResendClient().emails.send({ from, to: email, subject, html });
        if (error) {
          const hint = String(error.message || JSON.stringify(error));
          if (smtpTransport) {
            try {
              await smtpTransport.sendMail({ from, to: email, subject, html });
              return { sent: true, provider: 'smtp' };
            } catch {}
          }
          logger.warn({ email, subject, hint }, 'Resend failed to send email, falling back to console');
          console.log('\n' + '='.repeat(40));
          console.log(`✉️  [EMAIL NOT SENT] To: ${email} | Subject: ${subject}`);
          console.log('='.repeat(40) + '\n');
          return { sent: false, provider: 'console', hint };
        }
        logger.info({ email, subject, messageId: data?.id }, 'Resend delivered email');
        return { sent: true, provider: 'resend' };
      } catch (err: any) {
        logger.error({ email, subject, error: err?.message }, 'Resend exception');
      }
    }

    if (smtpTransport) {
      try {
        await smtpTransport.sendMail({ from, to: email, subject, html });
        return { sent: true, provider: 'smtp' };
      } catch (err: any) {
        logger.error({ email, subject, error: err?.message }, 'SMTP failed');
      }
    }

    console.log('\n' + '='.repeat(40));
    console.log(`✉️  [EMAIL NOT SENT] To: ${email} | Subject: ${subject}`);
    console.log('='.repeat(40) + '\n');
    return { sent: false, provider: 'console', hint: 'No email provider configured' };
  }

  static async sendResearcherApprovalEmail(
    email: string,
    name: string
  ): Promise<EmailSendResult> {
    const subject = '🎉 Your TRC Researcher Account Has Been Approved!';
    const html = `
      <div style="font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; max-width: 600px; margin: 0 auto; padding: 40px; background-color: #f9f9fb; border-radius: 16px;">
        <div style="text-align: center; margin-bottom: 30px;">
          <h1 style="color: #6C2BD9; margin: 0; font-size: 28px;">TRC</h1>
          <p style="color: #6b7280; font-size: 14px; margin-top: 5px;">Tigray Resources Center</p>
        </div>
        <div style="background-color: #ffffff; padding: 30px; border-radius: 12px; box-shadow: 0 4px 6px rgba(0,0,0,0.05);">
          <div style="text-align: center; margin-bottom: 20px;">
            <div style="width: 64px; height: 64px; background: #ecfdf5; border-radius: 50%; display: inline-flex; align-items: center; justify-content: center; font-size: 32px;">✅</div>
          </div>
          <h2 style="color: #111827; margin-top: 0; font-size: 22px; text-align: center;">Welcome aboard, ${name}!</h2>
          <p style="color: #4b5563; line-height: 1.7; text-align: center;">
            Great news! Your researcher account at the <strong>Tigray Resources Center</strong> has been <strong style="color: #059669;">approved</strong> by our admin team.
          </p>
          <div style="background: linear-gradient(135deg, #f5f3ff 0%, #ede9fe 100%); border-radius: 12px; padding: 20px; margin: 24px 0; border-left: 4px solid #6C2BD9;">
            <p style="margin: 0; color: #4c1d95; font-weight: 600;">You now have full researcher access to:</p>
            <ul style="margin: 10px 0 0 0; padding-left: 20px; color: #5b21b6; line-height: 1.8;">
              <li>Upload and manage research resources</li>
              <li>Access the full research repository</li>
              <li>Collaborate with other researchers</li>
            </ul>
          </div>
          <div style="text-align: center; margin-top: 24px;">
            <a href="${process.env.FRONTEND_URL || 'http://localhost:5173'}/login"
               style="display: inline-block; background: #6C2BD9; color: #ffffff; padding: 14px 32px; border-radius: 10px; text-decoration: none; font-weight: 700; font-size: 15px;">
              Log In to Your Dashboard →
            </a>
          </div>
        </div>
        <div style="text-align: center; margin-top: 30px; color: #9ca3af; font-size: 12px;">
          <p>© 2024 Tigray Resources Center. All rights reserved.</p>
        </div>
      </div>
    `;
    return this.sendHtml(email, subject, html);
  }

  static async sendResearcherRejectionEmail(
    email: string,
    name: string,
    reason: string
  ): Promise<EmailSendResult> {
    const subject = 'Update on Your TRC Researcher Application';
    const html = `
      <div style="font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; max-width: 600px; margin: 0 auto; padding: 40px; background-color: #f9f9fb; border-radius: 16px;">
        <div style="text-align: center; margin-bottom: 30px;">
          <h1 style="color: #6C2BD9; margin: 0; font-size: 28px;">TRC</h1>
          <p style="color: #6b7280; font-size: 14px; margin-top: 5px;">Tigray Resources Center</p>
        </div>
        <div style="background-color: #ffffff; padding: 30px; border-radius: 12px; box-shadow: 0 4px 6px rgba(0,0,0,0.05);">
          <h2 style="color: #111827; margin-top: 0; font-size: 20px;">Dear ${name},</h2>
          <p style="color: #4b5563; line-height: 1.7;">
            Thank you for applying for a researcher account at the Tigray Resources Center. After careful review of your application and submitted documents, we are unable to approve your request at this time.
          </p>
          <div style="background: #fff7ed; border-radius: 12px; padding: 20px; margin: 20px 0; border-left: 4px solid #f97316;">
            <p style="margin: 0 0 8px 0; font-weight: 700; color: #9a3412;">Reason for rejection:</p>
            <p style="margin: 0; color: #7c2d12; line-height: 1.6;">${reason}</p>
          </div>
          <p style="color: #4b5563; line-height: 1.7;">
            If you believe this decision was made in error, or if you have additional documentation that may support your application, please contact our support team.
          </p>
          <p style="color: #6b7280; font-size: 14px; margin-top: 20px;">
            You may continue to use TRC as a standard user. If you wish to re-apply with updated documents, please create a new account or contact support.
          </p>
        </div>
        <div style="text-align: center; margin-top: 30px; color: #9ca3af; font-size: 12px;">
          <p>© 2024 Tigray Resources Center. All rights reserved.</p>
        </div>
      </div>
    `;
    return this.sendHtml(email, subject, html);
  }

  static async sendOTP(
    email: string,
    otp: string,
    type: 'verification' | 'reset' = 'verification'
  ): Promise<EmailSendResult> {
    const { subject, html } = buildOtpEmailContent(otp, type);
    const from = getFromAddress();
    const resendKey = process.env.RESEND_API_KEY?.trim();
    const smtpTransport = getSmtpTransport();

    if (resendKey) {
      try {
        const { data, error } = await getResendClient().emails.send({
          from,
          to: email,
          subject,
          html,
        });

        if (error) {
          logger.error({ email, type, error }, 'Resend failed to deliver OTP email');
          const message = String(error.message || JSON.stringify(error));
          const sandboxHint = message.toLowerCase().includes('testing') || isResendSandboxFrom(from)
            ? 'Resend test mode only allows sending to the email you used to sign up for Resend, or you must verify your own domain.'
            : message;

          if (smtpTransport) {
            return this.sendViaSmtp(smtpTransport, from, email, subject, html, otp, type, sandboxHint);
          }

          logOtpToConsole(email, otp, type, sandboxHint);
          return { sent: false, provider: 'console', hint: sandboxHint };
        }

        logger.info({ email, type, messageId: data?.id }, 'Resend delivered OTP email');
        return { sent: true, provider: 'resend' };
      } catch (error: any) {
        logger.error({ email, type, error: error?.message }, 'Resend exception while sending OTP');
        if (smtpTransport) {
          return this.sendViaSmtp(
            smtpTransport,
            from,
            email,
            subject,
            html,
            otp,
            type,
            error?.message || 'Resend request failed'
          );
        }

        logOtpToConsole(email, otp, type, error?.message || 'Resend request failed');
        return {
          sent: false,
          provider: 'console',
          hint: error?.message || 'Resend request failed',
        };
      }
    }

    if (smtpTransport) {
      return this.sendViaSmtp(smtpTransport, from, email, subject, html, otp, type, 'SMTP fallback');
    }

    const reason = 'Set RESEND_API_KEY or SMTP_HOST/SMTP_USER/SMTP_PASS in your environment.';
    logOtpToConsole(email, otp, type, reason);
    return { sent: false, provider: 'console', hint: reason };
  }

  private static async sendViaSmtp(
    transport: nodemailer.Transporter,
    from: string,
    email: string,
    subject: string,
    html: string,
    otp: string,
    type: 'verification' | 'reset',
    fallbackReason: string
  ): Promise<EmailSendResult> {
    try {
      await transport.sendMail({ from, to: email, subject, html });
      logger.info({ email, type, fallbackReason }, 'SMTP delivered OTP email');
      return { sent: true, provider: 'smtp' };
    } catch (error: any) {
      const hint = error?.message || 'SMTP delivery failed';
      logger.error({ email, type, error: hint, fallbackReason }, 'SMTP failed to deliver OTP email');
      logOtpToConsole(email, otp, type, hint);
      return { sent: false, provider: 'console', hint };
    }
  }
}
