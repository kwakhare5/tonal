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
  metadataBase: new URL("https://tonall.vercel.app"),
  title: "Tonal — Inline Tone Adjustment Chrome Extension",
  description: "Adjust your writing tone inline on Gmail, Slack, and LinkedIn in one tap.",
  icons: {
    icon: "/icons/icon48.png",
    shortcut: "/icons/icon16.png",
    apple: "/icons/icon128.png",
  },
  openGraph: {
    title: "Tonal — Inline Tone Adjustment Chrome Extension",
    description: "Adjust your writing tone inline on Gmail, Slack, and LinkedIn in one tap.",
    url: "https://tonall.vercel.app",
    siteName: "Tonal",
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Tonal — Inline Tone Adjustment Chrome Extension",
    description: "Adjust your writing tone inline on Gmail, Slack, and LinkedIn in one tap.",
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
