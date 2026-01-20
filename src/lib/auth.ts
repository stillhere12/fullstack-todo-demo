import { sendEmail } from '@/lib/email';
import prisma from '@/lib/prisma';
import { betterAuth } from 'better-auth';
import { prismaAdapter } from 'better-auth/adapters/prisma';
import { emailOTP } from 'better-auth/plugins';

export const auth = betterAuth({
  secret: process.env.BETTER_AUTH_SECRET,
  baseURL: process.env.BETTER_AUTH_URL || 'https://fullstack-todo-demo-mu.vercel.app',
  database: prismaAdapter(prisma, {
    provider: 'postgresql',
  }),
  emailAndPassword: {
    enabled: true,
  },
  trustedOrigins: [
    'http://localhost:3000',
    'http://localhost:3001',
    'https://fullstack-todo-demo-mu.vercel.app',
    process.env.BETTER_AUTH_URL || '',
  ].filter(Boolean),
  plugins: [
    emailOTP({
      otpLength: 8,
      expiresIn: 120, // it is in seconds.
      async sendVerificationOTP({ email, otp, type }) {
        await sendEmail(email, otp, type);
      },
    }),
  ],
});

export type Session = typeof auth.$Infer.Session;
