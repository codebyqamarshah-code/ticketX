'use client';

import { useSyncExternalStore } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { useTheme } from '@/context/ThemeContext';

const emptySubscribe = () => () => {};

// SSR-safe mount check — prevents hydration mismatch
function useIsMounted() {
  return useSyncExternalStore(
    emptySubscribe,
    () => true,
    () => false
  );
}

export default function Logo({ className = '', onClick }) {
  const { theme } = useTheme();
  const isMounted = useIsMounted();

  // On server / first render: always use light logo so SSR HTML matches client HTML
  // After mount: switch based on actual theme
  const isDark = isMounted ? theme === 'dark' : false;
  const logoSrc = isDark ? '/Ticketx_Logo_Dark.png' : '/Ticketx_Logo.png';

  return (
    <Link
      href="/"
      onClick={onClick}
      className={`group relative inline-flex items-center focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--fg-sec)] rounded-lg ${className}`}
      aria-label="TicketX Home"
    >
      <motion.div
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.96 }}
        transition={{ type: 'spring', stiffness: 400, damping: 22 }}
        className="relative flex items-center"
      >
        <Image
          key={logoSrc}
          src={logoSrc}
          alt="TicketX Logo"
          width={210}
          height={58}
          className="h-auto w-auto object-contain transition-all duration-300 drop-shadow-sm group-hover:drop-shadow-md max-h-14 md:max-h-16 lg:max-h-20"
          priority
          unoptimized
        />
      </motion.div>
    </Link>
  );
}
