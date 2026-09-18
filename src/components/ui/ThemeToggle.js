'use client';

import { useState, useEffect } from 'react';
import { useTheme } from '@/context/ThemeContext';
import { Moon, Sun } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export default function ThemeToggle({ className = '' }) {
  const { theme, toggleTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <button
        type="button"
        className={`relative p-2 rounded-full border border-[var(--border)] bg-[var(--bg-sec)] ${className}`}
        aria-label="Toggle theme"
      >
        <Moon size={18} className="text-[var(--fg)] opacity-0" />
      </button>
    );
  }

  return (
    <button
      type="button"
      onClick={toggleTheme}
      className={`relative p-2 rounded-full border border-[var(--border)] bg-[var(--bg-sec)] hover:border-[var(--fg-sec)] transition-all duration-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--fg-sec)] ${className}`}
      aria-label={theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'}
    >
      <AnimatePresence mode="wait" initial={false}>
        <motion.div
          key={theme}
          initial={{ opacity: 0, rotate: -90, scale: 0.6 }}
          animate={{ opacity: 1, rotate: 0, scale: 1 }}
          exit={{ opacity: 0, rotate: 90, scale: 0.6 }}
          transition={{ duration: 0.2 }}
        >
          {theme === 'dark' ? (
            <Sun size={18} className="text-[var(--fg)]" />
          ) : (
            <Moon size={18} className="text-[var(--fg)]" />
          )}
        </motion.div>
      </AnimatePresence>
    </button>
  );
}
