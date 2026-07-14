import type { Metadata } from "next";
import "./globals.css";

import { DM_Sans, Lora } from 'next/font/google';

const dmSans = DM_Sans({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-sans',
});

const lora = Lora({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-serif',
});

export const metadata: Metadata = {
  title: "Tonal",
  description: "Inline Tone Adjustment Chrome Extension",
  icons: {
    icon: "/icons/icon48.png",
    shortcut: "/icons/icon16.png",
    apple: "/icons/icon128.png",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${dmSans.variable} ${lora.variable}`}>
      <body>
        {children}
      </body>
    </html>
  );
}
