import type { Metadata } from "next";
import "./globals.css";
import { Analytics } from "@vercel/analytics/react";

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
  title: "tonal — Inline Tone Adjustment Chrome Extension",
  description: "Adjust your writing tone inline on Gmail, Slack, and LinkedIn in one tap.",
  icons: {
    icon: [
      { url: "/icons/icon128.png", sizes: "128x128", type: "image/png" },
      { url: "/icons/icon48.png", sizes: "48x48", type: "image/png" },
      { url: "/icons/icon16.png", sizes: "16x16", type: "image/png" },
    ],
    shortcut: "/icons/icon128.png",
    apple: [
      { url: "/icons/icon128.png", sizes: "128x128", type: "image/png" },
    ],
  },
  openGraph: {
    title: "tonal — Inline Tone Adjustment Chrome Extension",
    description: "Adjust your writing tone inline on Gmail, Slack, and LinkedIn in one tap.",
    url: "https://tonall.vercel.app",
    siteName: "tonal",
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "tonal — Inline Tone Adjustment Chrome Extension",
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
        <Analytics />
      </body>
    </html>
  );
}
