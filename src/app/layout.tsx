import type { Metadata, Viewport } from "next";
import { Inter } from "next/font/google";
import { ClerkProvider } from "@clerk/nextjs";
import { trTR } from "@clerk/localizations";
import "./globals.css";
import { Providers } from "@/components/providers/Providers";
import { Toaster } from "@/components/ui/toaster";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: {
    default: "Kronos Dijital — Markanı Tasarla, Güvenle Büyüt.",
    template: "%s | Kronos Dijital",
  },
  description:
    "Yapay zeka destekli profesyonel marka tasarım platformu. Logo, kartvizit, afiş ve daha fazlasını saniyeler içinde oluşturun.",
  keywords: [
    "yapay zeka tasarım",
    "AI logo",
    "marka tasarımı",
    "kartvizit tasarımı",
    "afiş tasarımı",
    "Türkçe AI tasarım",
    "Kronos Dijital",
  ],
  authors: [{ name: "Kronos Dijital" }],
  creator: "Kronos Dijital",
  metadataBase: new URL(process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000"),
  openGraph: {
    type: "website",
    locale: "tr_TR",
    url: "/",
    siteName: "Kronos Dijital",
    title: "Kronos Dijital — Markanı Tasarla, Güvenle Büyüt.",
    description:
      "Yapay zeka destekli profesyonel marka tasarım platformu. Saniyeler içinde profesyonel tasarımlar oluşturun.",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "Kronos Dijital",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Kronos Dijital",
    description: "Yapay zeka destekli profesyonel marka tasarım platformu.",
    images: ["/og-image.png"],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
};

export const viewport: Viewport = {
  themeColor: "#09090B",
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <ClerkProvider localization={trTR}>
      <html lang="tr" suppressHydrationWarning>
        <body className={`${inter.variable} font-sans antialiased`}>
          <Providers>
            {children}
            <Toaster />
          </Providers>
        </body>
      </html>
    </ClerkProvider>
  );
}
