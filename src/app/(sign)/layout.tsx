'use client';

export default function SignLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  // this will wrap sign-in and sign-up pages
  return <div className="bg-white">{children}</div>;
}
