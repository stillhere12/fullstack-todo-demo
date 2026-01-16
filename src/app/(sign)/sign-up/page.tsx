'use client';
import { zodResolver } from '@hookform/resolvers/zod';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import * as z from 'zod';
import { authClient } from '../../../lib/auth-client';

const signUpSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters long'),
  email: z.email('Invalid email address'),
  password: z.string().min(8, 'Password must be at least 8 characters long'),
});

type signUpSchemaType = z.infer<typeof signUpSchema>;

export default function SignUpPage() {
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);
  const { register, handleSubmit } = useForm<signUpSchemaType>({
    resolver: zodResolver(signUpSchema),
  });

  async function onSubmit(data: signUpSchemaType) {
    setError(null);
    const res = await authClient.signUp.email({
      name: data.name,
      email: data.email,
      password: data.password,
    });
    console.log(res);

    if (res.error) {
      setError(res.error.message || 'An error occurred');
    } else {
      router.push('/notes');
    }
  }

  return (
    <main className="h-screen w-full mx-auto p-6 space-y-4 text-foreground bg-background flex flex-col justify-center items-center">
      <div className="rounded-lg p-6 shadow-lg flex flex-col gap-4 w-full max-w-md">
        <h1 className="text-2xl font-bold text-center">Sign Up</h1>
        {error && <p className="text-destructive text-sm text-center">{error}</p>}
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <input
            {...register('name')}
            placeholder="Full Name"
            required
            className="w-full rounded-md bg-secondary border border-border px-3 py-2"
          />
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
            minLength={8}
            className="w-full rounded-md bg-secondary border border-border px-3 py-2"
          />
          <button
            type="submit"
            className="w-full bg-primary text-primary-foreground font-medium rounded-md px-4 py-2 hover:opacity-90 cursor-pointer"
          >
            Create Account
          </button>
        </form>
      </div>
    </main>
  );
}
