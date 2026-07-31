import type { Metadata, Viewport } from "next";
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

export const viewport: Viewport = {
  themeColor: "#0B192C",
  width: "device-width",
  initialScale: 1,
};

export const metadata: Metadata = {
  metadataBase: new URL("https://tonall.vercel.app"),
  title: "tonal — Inline Tone Adjustment Chrome Extension",
  description: "Adjust your writing tone inline on Gmail, Slack, and LinkedIn in one tap. Free & open-source.",
  keywords: ["Chrome Extension", "Tone Adjuster", "AI Writing", "Groq LPU", "Gmail", "Slack", "LinkedIn"],
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

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "SoftwareApplication",
  "name": "tonal",
  "operatingSystem": "Chrome",
  "applicationCategory": "BusinessApplication",
  "offers": {
    "@type": "Offer",
    "price": "0",
    "priceCurrency": "USD"
  },
  "description": "Chrome extension to adjust your writing tone inline across Gmail, Slack, and LinkedIn."
};

interface RootLayoutProps {
  children: React.ReactNode;
}

export const RootLayout: React.FC<RootLayoutProps> = ({ children }) => {
  return (
    <html lang="en" className={`${dmSans.variable} ${lora.variable}`}>
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </head>
      <body className={dmSans.className}>
        {children}
        <Analytics />
      </body>
    </html>
  );
};

export default RootLayout;
