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
  title: "Tonal — AI-Powered Inline Tone Adjustment Chrome Extension",
  description: "Adjust the tone of your text directly inside any input field. No copying, no pasting, no extra tabs. Instant inline rewrites powered by Groq & Llama 3.3.",
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
