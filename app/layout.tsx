import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Providers from "@/lib/providers";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-sans",
});

export const metadata: Metadata = {
  title: {
    default: "Safarni — Travel Marketplace",
    template: "%s | Safarni",
  },
  description:
    "Book tours, hotels, car rentals, and flights worldwide. Curated packages for every traveler.",
  keywords: [
    "travel",
    "hotels",
    "tours",
    "flights",
    "car rental",
    "vacation packages",
    "booking",
  ],
  openGraph: {
    type: "website",
    locale: "en_US",
    siteName: "Safarni",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={inter.variable}>
      <body className="font-sans antialiased">
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}