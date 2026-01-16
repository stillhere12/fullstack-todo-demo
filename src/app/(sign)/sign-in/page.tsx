'use client';
import { zodResolver } from '@hookform/resolvers/zod';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import * as z from 'zod';
import { authClient } from '../../../lib/auth-client';

const signInSchema = z.object({
  email: z.email('Invalid email address'),
  password: z.string().min(8, 'Password must be at least 8 characters long'),
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
    const res = await authClient.signIn.email({
      email: data.email,
      password: data.password,
    });

    if (res.error) {
      setError(res.error.message || 'Something went wrong.');
      router.push('/sign-up');
    } else {
      router.push('/notes');
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
        <input
          {...register('password')}
          type="password"
          placeholder="Password"
          required
          className="w-full rounded-md bg-secondary border border-border px-3 py-2"
        />
        <button
          type="submit"
          className="w-full bg-primary text-primary-foreground font-medium rounded-md px-4 py-2 hover:opacity-90 hover:cursor-pointer"
        >
          Sign In
        </button>
      </form>
    </main>
  );
}
