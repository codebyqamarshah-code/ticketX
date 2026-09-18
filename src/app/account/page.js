'use client';

import Link from 'next/link';
import Image from 'next/image';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import AccountSidebar from '@/components/account/AccountSidebar';
import { useAuth } from '@/context/AuthContext';
import { useBooking } from '@/context/BookingContext';
import { useNotifications } from '@/context/NotificationContext';
import { useFavorites } from '@/context/FavoritesContext';
import { useWatchlist } from '@/context/WatchlistContext';
import {
  Ticket, ShoppingBag, Heart, Bookmark, Bell, Tag, ArrowRight, Send, PlusCircle, ShieldCheck, User
} from 'lucide-react';

export default function AccountDashboardPage() {
  const { user } = useAuth();
  const { purchasedTickets, orders } = useBooking();
  const { notifications, unreadCount } = useNotifications();
  const { favorites } = useFavorites();
  const { watchlist } = useWatchlist();

  const activeTickets = purchasedTickets.filter((t) => t.status !== 'Transferred');
  const recentTickets = activeTickets.slice(0, 2);
  const recentOrders = orders.slice(0, 2);

  return (
    <div className="min-h-screen flex flex-col bg-[var(--bg)] text-[var(--fg)]">
      <Header />

      <main className="flex-1 pt-24 pb-16 px-4 md:px-6 lg:px-8 max-w-[1600px] mx-auto w-full">
        {/* Header Breadcrumb */}
        <div className="mb-6">
          <h1 className="text-2xl sm:text-3xl font-black tracking-tight">Account Overview</h1>
          <p className="text-xs sm:text-sm text-[var(--fg-sec)] mt-1">
            Manage your tickets, orders, security, and account preferences
          </p>
        </div>

        <div className="flex flex-col lg:flex-row gap-8">
          {/* Sidebar */}
          <AccountSidebar />

          {/* Dashboard Content */}
          <div className="flex-1 space-y-6">
            {/* User Profile Banner */}
            <div className="rounded-2xl border border-[var(--border)] bg-[var(--card)] p-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 shadow-sm">
              <div className="flex items-center gap-4">
                <div className="relative w-16 h-16 rounded-full overflow-hidden border-2 border-[var(--border)] bg-[var(--bg-sec)] shrink-0">
                  {user?.avatar ? (
                    <Image
                      src={user.avatar}
                      alt={user.firstName || 'User'}
                      fill
                      className="object-cover"
                      unoptimized
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center font-black text-xl text-[var(--fg-sec)]">
                      {user?.firstName?.[0] || 'U'}
                    </div>
                  )}
                </div>
                <div>
                  <h2 className="text-lg font-black tracking-tight">
                    Welcome back, {user?.firstName} {user?.lastName}!
                  </h2>
                  <p className="text-xs text-[var(--fg-sec)] mt-0.5">{user?.email}</p>
                  <div className="flex items-center gap-2 mt-1">
                    <span className="inline-flex items-center gap-1 text-[10px] font-extrabold uppercase px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-500 border border-emerald-500/20">
                      <ShieldCheck size={12} /> Verified Member
                    </span>
                    <span className="text-[10px] text-[var(--fg-sec)]">
                      {user?.city || 'Los Angeles'}, {user?.country || 'USA'}
                    </span>
                  </div>
                </div>
              </div>

              <Link
                href="/account/profile"
                className="px-4 py-2 rounded-xl border border-[var(--border)] bg-[var(--bg-sec)] text-xs font-bold hover:bg-[var(--card)] text-[var(--fg)] transition-all shrink-0"
              >
                Edit Profile
              </Link>
            </div>

            {/* Overview Stats */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              <Link
                href="/account/tickets"
                className="rounded-2xl border border-[var(--border)] bg-[var(--card)] p-4 hover:border-[var(--fg-sec)] transition-all group"
              >
                <div className="flex items-center justify-between text-[var(--fg-sec)] group-hover:text-[var(--fg)]">
                  <span className="text-[11px] font-bold uppercase tracking-wider">Active Tickets</span>
                  <Ticket size={18} />
                </div>
                <p className="text-2xl font-black mt-2">{activeTickets.length}</p>
                <p className="text-[10px] text-[var(--fg-sec)] mt-1">Ready for scan</p>
              </Link>

              <Link
                href="/account/orders"
                className="rounded-2xl border border-[var(--border)] bg-[var(--card)] p-4 hover:border-[var(--fg-sec)] transition-all group"
              >
                <div className="flex items-center justify-between text-[var(--fg-sec)] group-hover:text-[var(--fg)]">
                  <span className="text-[11px] font-bold uppercase tracking-wider">Total Orders</span>
                  <ShoppingBag size={18} />
                </div>
                <p className="text-2xl font-black mt-2">{orders.length}</p>
                <p className="text-[10px] text-[var(--fg-sec)] mt-1">Order receipts</p>
              </Link>

              <Link
                href="/account/favorites"
                className="rounded-2xl border border-[var(--border)] bg-[var(--card)] p-4 hover:border-[var(--fg-sec)] transition-all group"
              >
                <div className="flex items-center justify-between text-[var(--fg-sec)] group-hover:text-[var(--fg)]">
                  <span className="text-[11px] font-bold uppercase tracking-wider">Favorites</span>
                  <Heart size={18} />
                </div>
                <p className="text-2xl font-black mt-2">{favorites.length}</p>
                <p className="text-[10px] text-[var(--fg-sec)] mt-1">Saved performers</p>
              </Link>

              <Link
                href="/account/notifications"
                className="rounded-2xl border border-[var(--border)] bg-[var(--card)] p-4 hover:border-[var(--fg-sec)] transition-all group"
              >
                <div className="flex items-center justify-between text-[var(--fg-sec)] group-hover:text-[var(--fg)]">
                  <span className="text-[11px] font-bold uppercase tracking-wider">Notifications</span>
                  <Bell size={18} />
                </div>
                <p className="text-2xl font-black mt-2">{unreadCount}</p>
                <p className="text-[10px] text-[var(--fg-sec)] mt-1">Unread alerts</p>
              </Link>
            </div>

            {/* Quick Actions Bar */}
            <div className="rounded-2xl border border-[var(--border)] bg-[var(--card)] p-5 space-y-3">
              <h3 className="text-xs font-bold uppercase tracking-wider text-[var(--fg-sec)]">Quick Actions</h3>
              <div className="flex flex-wrap gap-3">
                <Link
                  href="/account/tickets"
                  className="flex items-center gap-2 px-4 py-2.5 rounded-xl border border-[var(--border)] bg-[var(--bg-sec)] hover:bg-[var(--card)] text-xs font-bold transition-all"
                >
                  <Ticket size={16} /> View My Tickets
                </Link>
                <Link
                  href="/sell"
                  className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-[var(--fg)] text-[var(--bg)] hover:opacity-90 text-xs font-bold transition-all shadow-sm"
                >
                  <Tag size={16} /> Sell Tickets
                </Link>
                <Link
                  href="/account/resale"
                  className="flex items-center gap-2 px-4 py-2.5 rounded-xl border border-[var(--border)] bg-[var(--bg-sec)] hover:bg-[var(--card)] text-xs font-bold transition-all"
                >
                  <PlusCircle size={16} /> Manage Resale Listings
                </Link>
              </div>
            </div>

            {/* Upcoming Tickets Section */}
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-black tracking-tight">Upcoming Event Tickets</h3>
                <Link href="/account/tickets" className="text-xs font-bold text-[var(--fg-sec)] hover:text-[var(--fg)] flex items-center gap-1">
                  View All <ArrowRight size={14} />
                </Link>
              </div>

              {recentTickets.length === 0 ? (
                <div className="rounded-2xl border border-[var(--border)] bg-[var(--card)] p-8 text-center">
                  <Ticket size={32} className="mx-auto text-[var(--fg-sec)] mb-2" />
                  <p className="text-sm font-bold">No active tickets found</p>
                  <p className="text-xs text-[var(--fg-sec)] mt-1">Explore upcoming events to grab your tickets!</p>
                  <Link
                    href="/search"
                    className="inline-flex items-center gap-2 mt-4 px-4 py-2 rounded-xl bg-[var(--fg)] text-[var(--bg)] text-xs font-bold"
                  >
                    Browse Events
                  </Link>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {recentTickets.map((t) => (
                    <div key={t.ticketId} className="rounded-2xl border border-[var(--border)] bg-[var(--card)] p-5 space-y-3 relative">
                      <div className="flex items-start justify-between">
                        <div>
                          <span className="text-[10px] font-extrabold uppercase px-2 py-0.5 rounded-md bg-[var(--bg-sec)] border border-[var(--border)] text-[var(--fg-sec)]">
                            {t.status}
                          </span>
                          <h4 className="text-base font-black tracking-tight mt-2 line-clamp-1">{t.eventTitle}</h4>
                          <p className="text-xs text-[var(--fg-sec)] mt-0.5">{t.date} · {t.time}</p>
                          <p className="text-xs text-[var(--fg-sec)]">{t.venue}, {t.city}</p>
                        </div>
                      </div>

                      <div className="pt-3 border-t border-[var(--border)] flex items-center justify-between text-xs">
                        <div>
                          <span className="text-[var(--fg-sec)]">Sec: </span>
                          <span className="font-bold">{t.section}</span>
                          <span className="text-[var(--fg-sec)] ml-2">Row: </span>
                          <span className="font-bold">{t.row}</span>
                          <span className="text-[var(--fg-sec)] ml-2">Seat: </span>
                          <span className="font-bold">{t.seat}</span>
                        </div>
                      </div>

                      <div className="flex items-center gap-2 pt-2">
                        <Link
                          href="/account/tickets"
                          className="flex-1 text-center py-2 rounded-xl bg-[var(--fg)] text-[var(--bg)] font-bold text-xs"
                        >
                          View Barcode
                        </Link>
                        <Link
                          href={`/transfer/${t.ticketId}`}
                          className="px-3 py-2 rounded-xl border border-[var(--border)] hover:bg-[var(--bg-sec)] text-xs font-bold flex items-center gap-1"
                        >
                          <Send size={14} /> Transfer
                        </Link>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Recent Orders Section */}
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-black tracking-tight">Recent Orders</h3>
                <Link href="/account/orders" className="text-xs font-bold text-[var(--fg-sec)] hover:text-[var(--fg)] flex items-center gap-1">
                  View All Orders <ArrowRight size={14} />
                </Link>
              </div>

              {recentOrders.length === 0 ? (
                <div className="rounded-2xl border border-[var(--border)] bg-[var(--card)] p-8 text-center text-xs text-[var(--fg-sec)]">
                  No order history yet.
                </div>
              ) : (
                <div className="rounded-2xl border border-[var(--border)] bg-[var(--card)] divide-y divide-[var(--border)]">
                  {recentOrders.map((ord) => (
                    <div key={ord.orderId} className="p-4 flex items-center justify-between gap-4">
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="font-bold text-xs">{ord.orderId}</span>
                          <span className="text-[10px] text-[var(--fg-sec)]">
                            {new Date(ord.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                          </span>
                        </div>
                        <p className="text-xs font-bold text-[var(--fg)] mt-1">
                          {ord.items?.[0]?.eventTitle || 'Event Ticket'}
                          {ord.items?.length > 1 && ` (+${ord.items.length - 1} more)`}
                        </p>
                      </div>

                      <div className="text-right">
                        <p className="text-sm font-black">${ord.pricing?.grandTotal || 0}</p>
                        <span className="text-[10px] text-emerald-500 font-bold">{ord.status}</span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
