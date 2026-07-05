import type { Metadata } from "next";

import "./globals.css";

export const metadata: Metadata = {
  title: "Travora",
  description: "Modern travel planning for private trips",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="h-full antialiased">
      <body className="min-h-full flex flex-col font-sans">{children}</body>
    </html>
  );
}
