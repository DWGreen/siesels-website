import type { Metadata } from "next";
import {
  CartProvider
} from "@/context/CartContext";
import { Oswald, Open_Sans, Playfair_Display, Barlow_Condensed, Zilla_Slab } from "next/font/google";
import "./globals.css";

const oswald = Oswald({
  subsets: ["latin"],
  variable: "--font-oswald",
  display: "swap",
});

const openSans = Open_Sans({
  subsets: ["latin"],
  variable: "--font-open-sans",
  display: "swap",
});

const playfairDisplay = Playfair_Display({
  subsets: ["latin"],
  variable: "--font-playfair",
  display: "swap",
});

const barlowCondensed = Barlow_Condensed({
  subsets: ["latin"],
  weight: ["400", "600", "700"],
  variable: "--font-barlow-condensed",
  display: "swap",
});

const zillaSlab = Zilla_Slab({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  variable: "--font-zilla-slab",
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL("https://www.bestmeatssandiego.com"),
  title:
    "Iowa Meat Farms & Siesel's Meats | Expert Butcher Shop in San Diego Since 1968",
  description:
    "San Diego's premier butcher shops since 1968. Fresh-cut meats, deli sandwiches, weekly specials & more. Two locations: Iowa Meat Farms and Siesel's Meats.",
  openGraph: {
    title:
      "Iowa Meat Farms & Siesel's Meats | Expert Butcher Shop in San Diego Since 1968",
    description:
      "San Diego's premier butcher shops since 1968. Fresh-cut meats, deli sandwiches, weekly specials & more. Two locations: Iowa Meat Farms and Siesel's Meats.",
    url: "https://www.bestmeatssandiego.com",
    siteName: "Siesel's Meats",
    locale: "en_US",
    type: "website",
    images: [
      {
        url: "/images/og-image.jpg",
        width: 1200,
        height: 630,
        alt: "Iowa Meat Farms & Siesel's Meats — San Diego's Expert Butcher Shops Since 1968",
      },
    ],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" data-scroll-behavior="smooth" className={`${oswald.variable} ${openSans.variable} ${playfairDisplay.variable} ${barlowCondensed.variable} ${zillaSlab.variable}`}>
      <body className="mx-auto max-w-[1440px] font-body antialiased">
        <a
          href="#main-content"
          className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[100] focus:rounded focus:bg-brand-black focus:px-4 focus:py-2 focus:text-brand-white"
        >
          Skip to main content
        </a>
        <CartProvider>
          {children}
        </CartProvider>
      </body>
    </html>
  );
}
