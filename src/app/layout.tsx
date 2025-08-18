import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Providers } from './providers'

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

export const metadata: Metadata = {
  title: {
    template: '%s | Workfusion.pro',
    default: 'Workfusion.pro - AI Agency & Automation Platform',
  },
  description: "Transform your business with cutting-edge AI solutions. Experience the future of automation, chatbots, and data analysis with our interactive AI playground.",
  keywords: [
    "AI automation",
    "chatbot development", 
    "business intelligence",
    "artificial intelligence",
    "workflow automation",
    "data analysis",
    "AI playground",
    "machine learning"
  ],
  authors: [{ name: "Workfusion Team" }],
  creator: "Workfusion.pro",
  metadataBase: new URL('https://www.workfusion.pro'),
  alternates: {
    canonical: '/',
  },
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: 'https://www.workfusion.pro',
    title: 'Workfusion.pro - AI Agency & Automation Platform',
    description: 'Transform your business with cutting-edge AI solutions. Experience the future of automation, chatbots, and data analysis.',
    siteName: 'Workfusion.pro',
    images: [
      {
        url: '/og-image.png',
        width: 1200,
        height: 630,
        alt: 'Workfusion.pro - AI Agency Platform',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Workfusion.pro - AI Agency & Automation Platform',
    description: 'Transform your business with cutting-edge AI solutions.',
    images: ['/og-image.png'],
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
    google: 'your-google-verification-code',
  },
  other: {
    'application-ld+json': JSON.stringify({
      "@context": "https://schema.org",
      "@type": "Organization",
      "name": "Workfusion.pro",
      "url": "https://www.workfusion.pro",
      "logo": "https://www.workfusion.pro/logo.png",
      "description": "AI Agency specializing in automation, chatbots, and data analysis solutions for businesses.",
      "email": "info@workfusion.pro",
      "telephone": "+1-877-450-3224",
      "address": {
        "@type": "PostalAddress",
        "streetAddress": "1239 120th NE AVE",
        "addressLocality": "Bellevue",
        "addressRegion": "WA",
        "postalCode": "98005",
        "addressCountry": "US"
      },
      "sameAs": [
        "https://twitter.com/workfusionpro",
        "https://linkedin.com/company/workfusionpro",
        "https://github.com/workfusionpro"
      ],
      "offers": {
        "@type": "Service",
        "name": "AI Automation Services",
        "description": "Comprehensive AI solutions including chatbots, automation, and data analysis."
      }
    })
  }
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark" suppressHydrationWarning>
      <body className={`${inter.variable} font-sans antialiased mesh-gradient min-h-screen`}>
        <Providers>
          {children}
        </Providers>
      </body>
    </html>
  );
}
