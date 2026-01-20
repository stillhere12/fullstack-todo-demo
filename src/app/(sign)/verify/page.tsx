'use client';

// this is built to handle emails and stuff.......

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { authClient } from '@/lib/auth-client';
import { useRouter, useSearchParams } from 'next/navigation';
import { ChangeEvent, Suspense, useEffect, useState } from 'react';

function VerifyComponent() {
  const searchParams = useSearchParams();
  const email = searchParams.get('email');
  const type = searchParams.get('type') || 'email-verification';
  const [otp, setOtp] = useState('');
  const [verifyError, setVerifyError] = useState<string | null>(null);
  const router = useRouter();
  function handleChange(event: ChangeEvent<HTMLInputElement>) {
    setOtp(event.target.value);
  }
  useEffect(() => {
    if (!email) {
      router.push('/sign-up');
    }
  }, [email, router]);
  if (!email) {
    return null;
  }
  return (
    <main className="w-full h-screen flex flex-col items-center justify-center gap-3">
      <Card className="w-full max-w-sm">
        <CardHeader>
          <CardTitle>{type === 'sign-in' ? 'Check your email' : 'Verify your email'}</CardTitle>
          <CardDescription>Enter the 6-digit code sent to you at {email}.</CardDescription>
        </CardHeader>
        <CardContent className="grid gap-4">
          {verifyError && <p className="text-destructive text-sm text-center">{verifyError}</p>}
          <Input
            type="text"
            autoComplete="one-time-code"
            inputMode="numeric"
            pattern="\d{6}"
            maxLength={8}
            required
            onChange={handleChange}
            value={otp}
          />
          <Button
            onClick={async () => {
              setVerifyError(null); // Clear previous errors
              try {
                const response = await authClient.emailOtp.verifyEmail({
                  email,
                  otp,
                });

                if (response.error) {
                  setVerifyError(response.error.message || 'Verification failed.');
                } else if (response.data) {
                  router.push('/notes');
                }
              } catch (error) {
                console.error(error);
                setVerifyError('An unexpected error occurred during verification.');
              }
            }}
            className="w-full hover:cursor-pointer"
            variant="bluish"
          >
            Verify
          </Button>
          <Button
            onClick={async () => {
              setVerifyError(null); // Clear previous errors when resending
              await authClient.emailOtp.sendVerificationOtp({
                email,
                type: type as 'sign-in' | 'email-verification',
              });
              // Optionally, show a success message after resending
            }}
            className="w-full"
            variant="secondary"
          >
            Resend OTP
          </Button>
        </CardContent>
      </Card>
    </main>
  );
}

export default function Verify() {
  return (
    <Suspense>
      <VerifyComponent />
    </Suspense>
  );
}
