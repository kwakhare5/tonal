import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Tonal — AI-Powered Inline Tone Adjustment Chrome Extension",
  description: "Adjust the tone of your text directly inside any input field. No copying, no pasting, no extra tabs. Instant inline rewrites powered by Groq & Llama 3.3.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=DM+Sans:ital,opsz,wght@0,9..40,100..1000;1,9..40,100..1000&display=swap" rel="stylesheet" precedence="default" />
        <link href="https://fonts.googleapis.com/css2?family=Lora:ital,wght@0,400..700;1,400..700&display=swap" rel="stylesheet" precedence="default" />
        {children}
      </body>
    </html>
  );
}
