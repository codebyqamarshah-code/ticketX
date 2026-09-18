import { Poppins, Inter } from 'next/font/google';
import { ThemeProvider } from '@/context/ThemeContext';
import { LocationProvider } from '@/context/LocationContext';
import { FavoritesProvider } from '@/context/FavoritesContext';
import { WatchlistProvider } from '@/context/WatchlistContext';
import { CartProvider } from '@/context/CartContext';
import { BookingProvider } from '@/context/BookingContext';
import { AuthProvider } from '@/context/AuthContext';
import { NotificationProvider } from '@/context/NotificationContext';
import ConcertLightBeams from '@/components/ui/ConcertLightBeams';
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
  title: 'TicketX | Advanced Event Discovery & Booking',
  description: 'Premium event ticketing platform for concerts, sports, theater, comedy, and family events. Discover, book, and manage your live event experiences.',
  keywords: 'tickets, concerts, sports, events, theater, comedy, family, live music',
  openGraph: {
    title: 'TicketX | Advanced Event Discovery & Booking',
    description: 'Discover and book tickets for the best live events near you.',
    type: 'website',
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" className={`${poppins.variable} ${inter.variable}`} suppressHydrationWarning>
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
                        <ConcertLightBeams />
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
