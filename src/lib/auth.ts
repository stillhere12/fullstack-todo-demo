import prisma from '@/lib/prisma';
import { betterAuth } from 'better-auth';
import { prismaAdapter } from 'better-auth/adapters/prisma';

export const auth = betterAuth({
  database: prismaAdapter(prisma, {
    provider: 'postgresql',
  }),
  emailAndPassword: {
    enabled: true,
  },
  trustedOrigins: [
    'http://localhost:3000',
    'http://localhost:3001',
    process.env.BETTER_AUTH_URL || '',
  ].filter(Boolean),
});

// Export the Session type inferred from your auth config
// this is useful for typing session objects throughout your app
// e.g., in API route handlers or server-side functions request
export type Session = typeof auth.$Infer.Session;
