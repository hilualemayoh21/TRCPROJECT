import { prisma } from '../prisma/client';

const OTP_TTL_MS = 15 * 60 * 1000;

type OtpUser = {
  id: string;
  verificationCode: string | null;
  verificationCodeExpires: Date | null;
};

export class OtpService {
  static generate(): string {
    return Math.floor(100000 + Math.random() * 900000).toString();
  }

  static async saveForUser(userId: string, otp: string) {
    await prisma.user.update({
      where: { id: userId },
      data: {
        verificationCode: otp,
        verificationCodeExpires: new Date(Date.now() + OTP_TTL_MS),
      },
    });
  }

  static isValid(user: OtpUser, submittedOtp: string): boolean {
    if (!user.verificationCode || !user.verificationCodeExpires) return false;
    if (user.verificationCodeExpires < new Date()) return false;
    return user.verificationCode === submittedOtp;
  }

  static async clearForUser(userId: string) {
    await prisma.user.update({
      where: { id: userId },
      data: {
        verificationCode: null,
        verificationCodeExpires: null,
      },
    });
  }
}
