'use client';
import { zodResolver } from '@hookform/resolvers/zod';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import * as z from 'zod';
import { authClient } from '../../../lib/auth-client';

const signInSchema = z.object({
  email: z.email('Invalid email address'),
});

type signInSchemaType = z.infer<typeof signInSchema>;

export default function SignInPage() {
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);
  const { register, handleSubmit } = useForm({
    resolver: zodResolver(signInSchema),
  });

  async function onSubmit(data: signInSchemaType) {
    setError(null);

    const otpResponse = await authClient.emailOtp.sendVerificationOtp({
      email: data.email,
      type: 'sign-in',
    });
    if (otpResponse.error) {
      setError(otpResponse.error.message || 'Something went wrong.');
    } else {
      router.push(`/verify?email=${data.email}&type=sign-in`);
    }
  }

  return (
    <main className="bg-white max-w-md h-screen flex items-center justify-center flex-col mx-auto p-6 space-y-4 text-foreground">
      <h1 className="text-2xl font-bold border-2 border-white">Sign In</h1>

      {error && <p className="text-destructive">{error}</p>}

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 w-full">
        <input
          {...register('email')}
          type="email"
          placeholder="Email"
          required
          className="w-full rounded-md bg-secondary border border-border px-3 py-2"
        />
        <button
          type="submit"
          className="w-full bg-primary text-primary-foreground font-medium rounded-md px-4 py-2 hover:opacity-90 hover:cursor-pointer"
        >
          Sign In with Email
        </button>
      </form>
    </main>
  );
}
