import type { Metadata } from "next";
import { Libre_Baskerville, Space_Mono, Inter } from "next/font/google";
import "./globals.css";
import { AuthProvider } from "@/contexts/DemoAuthContext";

const libreBaskerville = Libre_Baskerville({
  weight: ["400", "700"],
  variable: "--font-serif",
  subsets: ["latin"],
});

const spaceMono = Space_Mono({
  weight: ["400", "700"],
  variable: "--font-mono",
  subsets: ["latin"],
});

const inter = Inter({
  variable: "--font-sans",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "PetPass - One passport for every paw",
  description: "Create a portable, digital identity for pets that consolidates vital, medical, and fun data into one QR-shareable profile.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${libreBaskerville.variable} ${spaceMono.variable} ${inter.variable} antialiased`}
      >
        <AuthProvider>{children}</AuthProvider>
      </body>
    </html>
  );
}
