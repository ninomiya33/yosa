import type { Metadata } from "next";
import { Geist, Geist_Mono, Pacifico, Orbitron, Righteous } from "next/font/google";
import "./globals.css";

const pacifico = Pacifico({
  weight: '400',
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-pacifico',
})

const orbitron = Orbitron({
  weight: ['400', '700', '900'],
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-orbitron',
})

const righteous = Righteous({
  weight: '400',
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-righteous',
})

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "yosaPARK - よもぎ蒸しサロン",
  description: "自然の恵みで心と体を癒す、伝統的なよもぎ蒸しサロン",
  openGraph: {
    title: "yosaPARK",
    description: "自然の恵みで心と体を癒す、伝統的なよもぎ蒸しサロン",
    images: [
      {
        url: "/images/hero/yosa-image-w1600.jpg",
        width: 1600,
        height: 900,
        alt: "yosaPARK - よもぎ蒸しサロン",
      },
    ],
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "yosaPARK",
    description: "自然の恵みで心と体を癒す、伝統的なよもぎ蒸しサロン",
    images: ["/images/hero/yosa-image-w1600.jpg"],
  },
  other: {
    "apple-mobile-web-app-title": "yosaPARK",
    "application-name": "yosaPARK",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning={true}>
      <head>
        <link rel="manifest" href="/manifest.json" />
        <meta name="theme-color" content="#ec4899" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="default" />
        <meta name="apple-mobile-web-app-title" content="yosaPARK" />
        <link rel="apple-touch-icon" href="/images/hero/yosa-image-w1600.jpg" />
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} ${pacifico.variable} ${orbitron.variable} ${righteous.variable} antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
