import type { Metadata, Viewport } from "next";
import localFont from "next/font/local";
import "./globals.css";
import Nav from "@/components/Nav";
import Footer from "@/components/Footer";
import { LanguageProvider } from "@/components/LanguageProvider";
import LanguagePicker from "@/components/LanguagePicker";
import WelcomePopup from "@/components/WelcomePopup";
import InstallPrompt from "@/components/InstallPrompt";
import DevModalReset from "@/components/DevModalReset";
import ServiceWorkerRegister from "@/components/ServiceWorkerRegister";
import { ThemeProvider, themeInitScript } from "@/components/ThemeProvider";

// Matcha Style - display font for hero headlines only. Free for personal &
// commercial use (Khurasan Studio). Exposed as --font-matcha.
const matcha = localFont({
  src: "./fonts/MatchaStyle.ttf",
  variable: "--font-matcha",
  display: "swap",
  weight: "400",
});

// Satoshi - the site typeface. Variable font (wght 300-900) in a single
// self-hosted woff2, so one request covers every weight we use.
// Licence: ITF Free Font License v2.0 (see app/fonts/Satoshi-LICENSE.txt).
const satoshi = localFont({
  src: [
    { path: "./fonts/Satoshi-Variable.woff2", weight: "300 900", style: "normal" },
    { path: "./fonts/Satoshi-VariableItalic.woff2", weight: "300 900", style: "italic" },
  ],
  display: "swap",
  variable: "--font-satoshi",
  fallback: [
    "-apple-system",
    "BlinkMacSystemFont",
    "SF Pro Text",
    "Segoe UI",
    "Roboto",
    "Helvetica Neue",
    "Arial",
    "sans-serif",
  ],
});

export const metadata: Metadata = {
  metadataBase: new URL("https://www.chouflimostakbel.tn"),
  title: {
    default: "Choufli Mosta9bel | Find your path",
    template: "%s | Choufli Mosta9bel",
  },
  description:
    "Choufli Mosta9bel helps school dropouts, undecided students, and graduates in Tunisia find real, practical paths to a stable future.",
  keywords: [
    "Tunisia",
    "school dropout",
    "ATFP",
    "high school divisions",
    "orientation",
    "Bac",
    "university guidance",
    "Tunisia scholarships",
    "Choufli Mosta9bel",
  ],
  authors: [{ name: "Choufli Mosta9bel" }],
  creator: "Choufli Mosta9bel",
  publisher: "Choufli Mosta9bel",
  alternates: { canonical: "/" },
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://www.chouflimostakbel.tn",
    siteName: "Choufli Mosta9bel",
    title: "Choufli Mosta9bel | Find your path",
    description:
      "Real, practical paths to a stable future for Tunisian youth, with or without a Bac.",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "Choufli Mosta9bel - find your path",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Choufli Mosta9bel | Find your path",
    description:
      "Real, practical paths to a stable future for Tunisian youth, with or without a Bac.",
    images: ["/og-image.png"],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-image-preview": "large",
      "max-snippet": -1,
      "max-video-preview": -1,
    },
  },
  manifest: "/manifest.webmanifest",
  appleWebApp: {
    capable: true,
    title: "Choufli Mosta9bel",
    statusBarStyle: "default",
  },
  formatDetection: { telephone: false },
  icons: {
    icon: [
      { url: "/favicon.png", sizes: "any" },
      { url: "/icons/icon-192.png", sizes: "192x192", type: "image/png" },
    ],
    apple: [{ url: "/icons/apple-touch-icon.png", sizes: "180x180" }],
  },
};

/**
 * Organization + WebSite structured data so Google can render a rich
 * knowledge panel (logo, social links, site name) instead of a bare blue link.
 */
const jsonLd = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "Organization",
      "@id": "https://www.chouflimostakbel.tn/#organization",
      name: "Choufli Mosta9bel",
      alternateName: "شوفلي مستقبلك",
      url: "https://www.chouflimostakbel.tn",
      logo: {
        "@type": "ImageObject",
        url: "https://www.chouflimostakbel.tn/logo.svg",
      },
      image: "https://www.chouflimostakbel.tn/og-image.png",
      email: "contact@chouflimostakbel.tn",
      description:
        "A Tunisian guidance project helping school dropouts, undecided students, and graduates find real, practical paths to a stable future.",
      areaServed: { "@type": "Country", name: "Tunisia" },
    },
    {
      "@type": "WebSite",
      "@id": "https://www.chouflimostakbel.tn/#website",
      url: "https://www.chouflimostakbel.tn",
      name: "Choufli Mosta9bel",
      description:
        "Real, practical paths to a stable future for Tunisian youth, with or without a Bac.",
      inLanguage: "en",
      publisher: {
        "@id": "https://www.chouflimostakbel.tn/#organization",
      },
    },
  ],
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#ffffff" },
    { media: "(prefers-color-scheme: dark)", color: "#000000" },
  ],
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className={`${matcha.variable} ${satoshi.variable}`}>
      <head>
        {/* Applies the stored theme before first paint - without this the page
            flashes light before React hydrates. */}
        <script dangerouslySetInnerHTML={{ __html: themeInitScript }} />
      </head>
      <body className="min-h-[100dvh] flex flex-col pb-[calc(64px+env(safe-area-inset-bottom))] md:pb-0">
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
        <ThemeProvider>
          <LanguageProvider>
            <Nav />
            <main className="flex-1">{children}</main>
            <Footer />
            <LanguagePicker />
            <WelcomePopup />
            <InstallPrompt />
          </LanguageProvider>
        </ThemeProvider>
        <ServiceWorkerRegister />
        <DevModalReset />
      </body>
    </html>
  );
}
