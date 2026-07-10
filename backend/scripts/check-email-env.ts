import dotenv from 'dotenv';
import { getEmailProviderStatus, EmailService } from '../src/utils/email';

dotenv.config();

async function main() {
  const status = getEmailProviderStatus();
  const testEmail = process.argv[2];

  console.log('\nEmail provider status:');
  console.log(JSON.stringify(status, null, 2));

  if (!status.configured) {
    console.error('\nNo email provider configured.');
    console.error('Set RESEND_API_KEY on Render, or SMTP_HOST/SMTP_USER/SMTP_PASS locally.');
    process.exit(1);
  }

  if (!testEmail) {
    console.log('\nProvider looks configured. To send a test OTP, run:');
    console.log('  npx tsx scripts/check-email-env.ts your@email.com');
    return;
  }

  const otp = '123456';
  const result = await EmailService.sendOTP(testEmail, otp, 'verification');

  console.log('\nTest send result:');
  console.log(JSON.stringify(result, null, 2));

  if (!result.sent) {
    console.error('\nEmail was NOT delivered.');
    if (result.hint) console.error(`Hint: ${result.hint}`);
    process.exit(1);
  }

  console.log('\nTest email sent successfully.');
}

main().catch((error) => {
  console.error('Email check failed:', error);
  process.exit(1);
});
