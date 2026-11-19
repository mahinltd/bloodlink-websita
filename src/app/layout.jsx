import { Inter, Plus_Jakarta_Sans } from 'next/font/google';
import './globals.css';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';

const inter = Inter({ subsets: ['latin'], variable: '--font-inter' });
const jakarta = Plus_Jakarta_Sans({ subsets: ['latin'], variable: '--font-jakarta' });

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://bloodlink.tech';

export const metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: 'BloodLink — রক্ত দিন, প্রাণ বাঁচান | Voluntary Blood Donation Bangladesh',
    template: '%s | BloodLink',
  },
  description:
    'BloodLink is a voluntary, non-profit blood donation platform for Bangladesh. Find blood donors near you, send SOS requests, and save lives. রক্তদাতা খুঁজুন মিনিটেই — 100% ফ্রি।',
  keywords: [
    'blood donation bangladesh',
    'blood donor finder',
    'রক্তদাতা',
    'রক্ত দান',
    'রক্ত খুঁজি',
    'blood bank bangladesh',
    'SOS blood request',
    'voluntary blood donation',
    'donate blood dhaka',
    'blood donor app',
    'BloodLink',
    'bloodlink.tech',
    'emergency blood bangladesh',
    'free blood donation app',
  ],
  authors: [{ name: 'BloodLink Team', url: SITE_URL }],
  creator: 'BloodLink',
  publisher: 'BloodLink',
  applicationName: 'BloodLink',
  category: 'Health & Social Good',
  alternates: {
    canonical: '/',
  },
  openGraph: {
    type: 'website',
    locale: 'en_US',
    alternateLocale: 'bn_BD',
    url: SITE_URL,
    siteName: 'BloodLink',
    title: 'BloodLink — রক্ত দিন, প্রাণ বাঁচান',
    description:
      'Voluntary blood donation platform for Bangladesh. Find donors, send SOS alerts, save lives — 100% free, forever.',
    images: [
      {
        url: '/opengraph-image.png',
        width: 1200,
        height: 630,
        alt: 'BloodLink — Voluntary Blood Donation Bangladesh',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'BloodLink — রক্ত দিন, প্রাণ বাঁচান',
    description:
      'Find blood donors near you in minutes. Voluntary, non-profit, made for Bangladesh.',
    images: ['/opengraph-image.png'],
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
    google: process.env.NEXT_PUBLIC_GOOGLE_VERIFICATION || undefined,
  },
  other: {
    'geo.region': 'BD',
    'geo.placename': 'Dhaka, Bangladesh',
  },
};

// ---------- Structured Data (Google + AI কে বোঝায় আমরা কে) ----------
const organizationJsonLd = {
  '@context': 'https://schema.org',
  '@type': 'Organization',
  name: 'BloodLink',
  url: SITE_URL,
  logo: `${SITE_URL}/images/logo.png`,
  description:
    'A voluntary, non-profit blood donation ecosystem for Bangladesh — connecting donors with patients in minutes.',
  email: 'support@bloodlink.tech',
  areaServed: { '@type': 'Country', name: 'Bangladesh' },
  nonprofitStatus: 'NonprofitType',
  sameAs: [],
};

const websiteJsonLd = {
  '@context': 'https://schema.org',
  '@type': 'WebSite',
  name: 'BloodLink',
  url: SITE_URL,
  description:
    'Find voluntary blood donors and blood banks across Bangladesh. SOS alerts, smart matching, real-time chat.',
  inLanguage: ['en', 'bn'],
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" className={`${inter.variable} ${jakarta.variable}`}>
      <body className="font-sans bg-white text-ink antialiased">
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationJsonLd) }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(websiteJsonLd) }}
        />
        <Navbar />
        {children}
        <Footer />
      </body>
    </html>
  );
}