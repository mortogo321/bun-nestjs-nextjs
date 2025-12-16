import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'Bun + NestJS + Next.js POC',
  description: 'A POC ecosystem running on Bun runtime',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
