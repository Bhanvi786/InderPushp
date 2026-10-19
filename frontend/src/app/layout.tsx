import type { Metadata } from "next";
import { Inter, Playfair_Display } from "next/font/google";
import "./globals.css";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

const playfair = Playfair_Display({
  variable: "--font-playfair",
  subsets: ["latin"],
});

import { CartProvider } from "@/context/CartContext";
import CartToast from "@/components/CartToast";

export const metadata: Metadata = {
  title: "InderPushp - House of Art | Luxury Mosaics",
  description: "Handcrafted mosaic art that brings colour, texture and meaningful stories into your spaces.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${inter.variable} ${playfair.variable} h-full antialiased scroll-smooth`}>
      <body className="min-h-full flex flex-col bg-ivory text-navy-text">
        <CartProvider>
          {children}
          <CartToast />
        </CartProvider>
      </body>
    </html>
  );
}
