import prisma from '@/lib/prisma';
import { betterAuth } from 'better-auth';
import { prismaAdapter } from 'better-auth/adapters/prisma';

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
});

export type Session = typeof auth.$Infer.Session;
