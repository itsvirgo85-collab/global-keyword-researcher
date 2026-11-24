import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Global Keyword Intelligence Platform | Free-First AI SEO SaaS",
  description: "Worldwide multi-country, multilingual keyword research engine with proprietary KD scoring, AI Content Briefs, and multi-platform intelligence.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <body className="bg-slate-950 text-slate-100 antialiased selection:bg-blue-600 selection:text-white">
        {children}
      </body>
    </html>
  );
}
