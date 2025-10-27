import type { Metadata } from "next";
import { Libre_Baskerville, Space_Mono, Inter } from "next/font/google";
import "./globals.css";
import { AuthProvider } from "@/contexts/AuthContext";

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
  title: "PetPass - Digital Pet Passport & QR Pet ID | One Passport for Every Paw",
  description: "Create a free digital passport for your pet. Store health records, vaccinations, vet contacts, and medical history in one QR-shareable profile. Perfect for dogs, cats, and all pets. Cloud-synced and accessible anywhere.",
  keywords: ["pet passport", "digital pet ID", "pet QR code", "pet health records", "pet vaccination records", "pet medical records", "dog passport", "cat passport", "pet travel documents", "pet identity", "pet profile", "veterinary records"],
  authors: [{ name: "PetPass" }],
  creator: "PetPass",
  publisher: "PetPass",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  metadataBase: new URL('https://petpass-xyz.netlify.app'),
  alternates: {
    canonical: '/',
  },
  openGraph: {
    title: "PetPass - Digital Pet Passport & QR Pet ID",
    description: "Create a free digital passport for your pet. Store health records, vaccinations, and medical history in one QR-shareable profile.",
    url: 'https://petpass-xyz.netlify.app',
    siteName: 'PetPass',
    images: [
      {
        url: '/opengraph-image',
        width: 1200,
        height: 630,
        alt: 'PetPass - One passport for every paw',
      },
    ],
    locale: 'en_US',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: "PetPass - Digital Pet Passport & QR Pet ID",
    description: "Create a free digital passport for your pet with QR code sharing.",
    images: ['/opengraph-image'],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  verification: {
    google: 'google-site-verification-code', // Replace with actual verification code
  },
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
