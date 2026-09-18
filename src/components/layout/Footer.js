'use client';

import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import Logo from '@/components/ui/Logo';

const footerLinks = {
  Explore: [
    { label: 'Concerts', href: '/concerts' },
    { label: 'Sports', href: '/sports' },
    { label: 'Arts & Theater', href: '/arts-theater' },
    { label: 'Comedy', href: '/comedy' },
    { label: 'Family', href: '/family' },
    { label: 'Cities', href: '/cities' },
  ],
  Tickets: [
    { label: 'Search Events', href: '/search' },
    { label: 'Upcoming Events', href: '/events' },
    { label: 'Sell Tickets', href: '/sell' },
    { label: 'Transfer Tickets', href: '/transfer' },
    { label: 'My Tickets', href: '/account/tickets' },
  ],
  Account: [
    { label: 'Sign In', href: '/account' },
    { label: 'Create Account', href: '/account' },
    { label: 'My Orders', href: '/account/orders' },
    { label: 'Favorites', href: '/account/favorites' },
    { label: 'Watchlist', href: '/account/watchlist' },
  ],
  Company: [
    { label: 'About Us', href: '/about' },
    { label: 'TicketX+', href: '/about' },
    { label: 'Blog', href: '/about' },
    { label: 'Press', href: '/about' },
    { label: 'Careers', href: '/about' },
  ],
  Support: [
    { label: 'Help Center', href: '/help' },
    { label: 'Contact Us', href: '/contact' },
    { label: 'Accessibility', href: '/help' },
    { label: 'Refund Policy', href: '/help' },
    { label: 'Venue Info', href: '/help' },
  ],
};

function TwitterIcon({ size = 15 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor">
      <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
    </svg>
  );
}

function InstagramIcon({ size = 15 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect x="2" y="2" width="20" height="20" rx="5" ry="5"/>
      <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/>
      <line x1="17.5" y1="6.5" x2="17.51" y2="6.5"/>
    </svg>
  );
}

function YoutubeIcon({ size = 15 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M22.54 6.42a2.78 2.78 0 0 0-1.94-2C18.88 4 12 4 12 4s-6.88 0-8.6.46a2.78 2.78 0 0 0-1.94 2A29 29 0 0 0 1 11.75a29 29 0 0 0 .46 5.33A2.78 2.78 0 0 0 3.4 19c1.72.46 8.6.46 8.6.46s6.88 0 8.6-.46a2.78 2.78 0 0 0 1.94-2 29 29 0 0 0 .46-5.25 29 29 0 0 0-.46-5.33z"/>
      <polygon points="9.75 15.02 15.5 11.75 9.75 8.48 9.75 15.02"/>
    </svg>
  );
}

function FacebookIcon({ size = 15 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"/>
    </svg>
  );
}

const socialLinks = [
  { label: 'Twitter', Icon: TwitterIcon, href: '#' },
  { label: 'Instagram', Icon: InstagramIcon, href: '#' },
  { label: 'YouTube', Icon: YoutubeIcon, href: '#' },
  { label: 'Facebook', Icon: FacebookIcon, href: '#' },
];

export default function Footer() {
  return (
    <footer className="border-t border-[var(--border)] bg-[var(--bg-sec)] mt-16">
      {/* Newsletter strip */}
      <div className="border-b border-[var(--border)]">
        <div className="max-w-[1600px] mx-auto px-4 md:px-6 lg:px-8 py-8 flex flex-col md:flex-row items-start md:items-center gap-4 justify-between">
          <div>
            <h3 className="text-base font-bold text-[var(--fg)]">Never miss an event</h3>
            <p className="text-sm text-[var(--fg-sec)] mt-0.5">Get the best events delivered to your inbox</p>
          </div>
          <div className="flex gap-2 w-full md:w-auto">
            <input
              type="email"
              placeholder="Enter your email"
              className="flex-1 md:w-64 px-4 py-2.5 text-sm rounded-lg bg-[var(--bg)] border border-[var(--border)] text-[var(--fg)] placeholder:text-[var(--fg-sec)] focus:outline-none focus:border-[var(--fg-sec)] transition-colors"
              aria-label="Email address for newsletter"
            />
            <button className="flex items-center gap-2 px-4 py-2.5 bg-[var(--fg)] text-[var(--bg)] text-sm font-bold rounded-lg hover:opacity-90 active:scale-95 transition-all duration-200 shrink-0">
              Subscribe
              <ArrowRight size={14} />
            </button>
          </div>
        </div>
      </div>

      {/* Main footer */}
      <div className="max-w-[1600px] mx-auto px-4 md:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-8">
          {/* Brand */}
          <div className="col-span-2 md:col-span-3 lg:col-span-1">
            <Logo width={135} height={36} />
            <p className="mt-3 text-sm text-[var(--fg-sec)] leading-relaxed max-w-xs">
              The premium destination for live event discovery, tickets, and experiences.
            </p>
            {/* Social */}
            <div className="flex items-center gap-2 mt-4">
              {socialLinks.map((s) => (
                <a
                  key={s.label}
                  href={s.href}
                  aria-label={s.label}
                  className="w-9 h-9 flex items-center justify-center rounded-full border border-[var(--border)] text-[var(--fg-sec)] hover:text-[var(--fg)] hover:border-[var(--fg-sec)] transition-all duration-200"
                >
                  <s.Icon size={15} />
                </a>
              ))}
            </div>
          </div>

          {/* Links */}
          {Object.entries(footerLinks).map(([group, links]) => (
            <div key={group}>
              <h4 className="text-xs font-bold uppercase tracking-wider text-[var(--fg)] mb-4">{group}</h4>
              <ul className="space-y-2.5">
                {links.map((link) => (
                  <li key={link.href + link.label}>
                    <Link
                      href={link.href}
                      className="text-sm text-[var(--fg-sec)] hover:text-[var(--fg)] transition-colors duration-200"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>

      {/* Bottom bar */}
      <div className="border-t border-[var(--border)]">
        <div className="max-w-[1600px] mx-auto px-4 md:px-6 lg:px-8 py-5 flex flex-col sm:flex-row items-center justify-between gap-3">
          <p className="text-xs text-[var(--fg-sec)]">
            © {new Date().getFullYear()} TicketX. All rights reserved.
          </p>
          <div className="flex items-center gap-4 flex-wrap justify-center">
            {['Terms', 'Privacy', 'Cookies', 'Accessibility'].map((item) => (
              <Link
                key={item}
                href="/help"
                className="text-xs text-[var(--fg-sec)] hover:text-[var(--fg)] transition-colors"
              >
                {item}
              </Link>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}
