'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { useNotifications } from '@/context/NotificationContext';
import {
  LayoutDashboard, Ticket, ShoppingBag, Heart, Bookmark, Bell, Tag, CreditCard, User, Shield, Settings, LogOut
} from 'lucide-react';

export default function AccountSidebar({ className = '' }) {
  const pathname = usePathname();
  const { signOut } = useAuth();
  const { unreadCount } = useNotifications();

  const links = [
    { label: 'Overview', href: '/account', icon: LayoutDashboard },
    { label: 'My Tickets', href: '/account/tickets', icon: Ticket },
    { label: 'Order History', href: '/account/orders', icon: ShoppingBag },
    { label: 'Favorites', href: '/account/favorites', icon: Heart },
    { label: 'Watchlist', href: '/account/watchlist', icon: Bookmark },
    { label: 'Notifications', href: '/account/notifications', icon: Bell, badge: unreadCount },
    { label: 'Resale Listings', href: '/account/resale', icon: Tag },
    { label: 'Payment Methods', href: '/account/payment-methods', icon: CreditCard },
    { label: 'Profile Settings', href: '/account/profile', icon: User },
    { label: 'Security', href: '/account/security', icon: Shield },
    { label: 'Account Settings', href: '/account/settings', icon: Settings },
  ];

  return (
    <aside className={`w-full lg:w-64 shrink-0 rounded-2xl border border-[var(--border)] bg-[var(--card)] p-4 space-y-1 ${className}`}>
      <div className="pb-3 px-3 mb-2 border-b border-[var(--border)]">
        <p className="text-[10px] font-bold uppercase tracking-widest text-[var(--fg-sec)]">Account Navigation</p>
      </div>

      <nav className="space-y-1">
        {links.map((link) => {
          const active = pathname === link.href;
          const Icon = link.icon;
          return (
            <Link
              key={link.href}
              href={link.href}
              className={`flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-bold transition-all ${
                active
                  ? 'bg-[var(--fg)] text-[var(--bg)] shadow-sm'
                  : 'text-[var(--fg-sec)] hover:text-[var(--fg)] hover:bg-[var(--bg-sec)]'
              }`}
            >
              <div className="flex items-center gap-3">
                <Icon size={16} />
                <span>{link.label}</span>
              </div>
              {link.badge > 0 && (
                <span className={`text-[10px] font-extrabold px-2 py-0.5 rounded-full ${
                  active ? 'bg-[var(--bg)] text-[var(--fg)]' : 'bg-[var(--fg)] text-[var(--bg)]'
                }`}>
                  {link.badge}
                </span>
              )}
            </Link>
          );
        })}

        <button
          onClick={signOut}
          className="w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-bold text-red-500 hover:bg-red-500/10 transition-all mt-4 pt-4 border-t border-[var(--border)]"
        >
          <LogOut size={16} />
          Sign Out
        </button>
      </nav>
    </aside>
  );
}
