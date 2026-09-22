import type { Metadata, Viewport } from "next";
import { Inter, Playfair_Display } from "next/font/google";
import { AudioProvider } from "@/context/AudioContext";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

const playfair = Playfair_Display({
  subsets: ["latin"],
  variable: "--font-playfair",
  display: "swap",
});

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
};

export const metadata: Metadata = {
  title: "Birthday Surprise ✨",
  description: "A beautiful interactive birthday experience made with love.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`dark ${inter.variable} ${playfair.variable}`}>
      <body className={`${inter.className} bg-[#030303] text-white antialiased selection:bg-[#ff2a85] selection:text-white`}>
        <AudioProvider>{children}</AudioProvider>
      </body>
    </html>
  );
}