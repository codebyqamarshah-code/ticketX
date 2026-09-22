import { Poppins, Inter } from 'next/font/google';
import { ThemeProvider } from '@/context/ThemeContext';
import { LocationProvider } from '@/context/LocationContext';
import { FavoritesProvider } from '@/context/FavoritesContext';
import { WatchlistProvider } from '@/context/WatchlistContext';
import { CartProvider } from '@/context/CartContext';
import { BookingProvider } from '@/context/BookingContext';
import { AuthProvider } from '@/context/AuthContext';
import { NotificationProvider } from '@/context/NotificationContext';
import GlobalAmbientBackground from '@/components/ui/GlobalAmbientBackground';
import './globals.css';

const poppins = Poppins({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700', '800', '900'],
  variable: '--font-poppins',
  display: 'swap',
});

const inter = Inter({
  subsets: ['latin'],
  weight: ['300', '400', '500', '600', '700', '800'],
  variable: '--font-inter',
  display: 'swap',
});

export const metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || 'https://ticketx.com'),
  title: {
    default: 'TicketX | Premium Live Event Tickets & Concert Discovery',
    template: '%s | TicketX',
  },
  description: 'Book official tickets for top concerts, sports matches, Broadway shows, comedy tours, and family events worldwide. Guaranteed real seats, zero hassle.',
  keywords: [
    'tickets',
    'concert tickets',
    'sports tickets',
    'broadway tickets',
    'comedy tickets',
    'family events',
    'live events',
    'ticket marketplace',
  ],
  authors: [{ name: 'TicketX Team' }],
  creator: 'TicketX',
  publisher: 'TicketX',
  icons: {
    icon: '/icon.svg',
    shortcut: '/icon.svg',
    apple: '/icon.svg',
  },
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  openGraph: {
    title: 'TicketX | Premium Live Event Tickets & Concert Discovery',
    description: 'Discover, pick seats, and book tickets for top live events with interactive venue maps and instant hold guarantee.',
    url: 'https://ticketx.com',
    siteName: 'TicketX',
    locale: 'en_US',
    type: 'website',
    images: [
      {
        url: 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=1200&q=80',
        width: 1200,
        height: 630,
        alt: 'TicketX Live Events & Concerts',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'TicketX | Premium Live Event Tickets',
    description: 'Book official tickets with interactive venue seat maps and instant hold guarantee.',
    creator: '@ticketx',
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
};

export default function RootLayout({ children }) {
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: 'TicketX',
    url: process.env.NEXT_PUBLIC_SITE_URL || 'https://ticketx.com',
    potentialAction: {
      '@type': 'SearchAction',
      target: `${process.env.NEXT_PUBLIC_SITE_URL || 'https://ticketx.com'}/search?q={search_term_string}`,
      'query-input': 'required name=search_term_string',
    },
  };

  return (
    <html lang="en" className={`${poppins.variable} ${inter.variable}`} suppressHydrationWarning>
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </head>
      <body
        className="antialiased relative"
        style={{ backgroundColor: 'var(--bg)', color: 'var(--fg)' }}
        suppressHydrationWarning
      >
        <ThemeProvider>
          <LocationProvider>
            <FavoritesProvider>
              <WatchlistProvider>
                <AuthProvider>
                  <NotificationProvider>
                    <CartProvider>
                      <BookingProvider>
                        <GlobalAmbientBackground />
                        <div className="relative z-10 flex flex-col min-h-screen">
                          {children}
                        </div>
                      </BookingProvider>
                    </CartProvider>
                  </NotificationProvider>
                </AuthProvider>
              </WatchlistProvider>
            </FavoritesProvider>
          </LocationProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
