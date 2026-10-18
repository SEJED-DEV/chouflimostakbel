import type { Metadata } from "next";
import localFont from "next/font/local";
import { Patrick_Hand } from "next/font/google";
import "./globals.css";
import Nav from "@/components/Nav";
import Footer from "@/components/Footer";

// Matcha Style - display font for hero headlines only. Free for personal &
// commercial use (Khurasan Studio). Exposed as --font-matcha.
const matcha = localFont({
  src: "./fonts/MatchaStyle.ttf",
  variable: "--font-matcha",
  display: "swap",
  weight: "400",
});

// Patrick Hand - the rest of the site (body, nav, cards, footer).
const patrick = Patrick_Hand({
  weight: "400",
  subsets: ["latin"],
  display: "swap",
  variable: "--font-patrick",
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
  icons: { icon: "/favicon.png" },
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

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className={`${matcha.variable} ${patrick.variable}`}>
      <body className="min-h-[100dvh] flex flex-col pb-[calc(64px+env(safe-area-inset-bottom))] md:pb-0">
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
        <Nav />
        <main className="flex-1">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
