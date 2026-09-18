'use client';

import { useState } from 'react';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import AccountSidebar from '@/components/account/AccountSidebar';
import { useNotifications } from '@/context/NotificationContext';
import { Bell, CheckCheck, Trash2, CheckCircle2, Bookmark, ShoppingBag, ShieldAlert } from 'lucide-react';

export default function NotificationsPage() {
  const { notifications, unreadCount, markNotificationRead, markAllNotificationsRead, deleteNotification } = useNotifications();
  const [filter, setFilter] = useState('All');

  const filteredNotifications = notifications.filter((n) => {
    if (filter === 'All') return true;
    return n.category === filter;
  });

  return (
    <div className="min-h-screen flex flex-col bg-[var(--bg)] text-[var(--fg)]">
      <Header />

      <main className="flex-1 pt-24 pb-16 px-4 md:px-6 lg:px-8 max-w-[1600px] mx-auto w-full">
        {/* Page Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
          <div>
            <h1 className="text-2xl sm:text-3xl font-black tracking-tight">Notification Center</h1>
            <p className="text-xs sm:text-sm text-[var(--fg-sec)] mt-1">
              Stay updated on your orders, event alerts, and watchlist reminders
            </p>
          </div>

          {unreadCount > 0 && (
            <button
              onClick={markAllNotificationsRead}
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl border border-[var(--border)] bg-[var(--card)] hover:bg-[var(--bg-sec)] text-xs font-bold transition-all shrink-0"
            >
              <CheckCheck size={16} /> Mark All as Read ({unreadCount})
            </button>
          )}
        </div>

        <div className="flex flex-col lg:flex-row gap-8">
          <AccountSidebar />

          <div className="flex-1 space-y-6">
            {/* Filter Pills */}
            <div className="flex items-center gap-2 border-b border-[var(--border)] pb-3">
              {['All', 'Orders', 'Watchlist', 'System'].map((cat) => (
                <button
                  key={cat}
                  onClick={() => setFilter(cat)}
                  className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all ${
                    filter === cat
                      ? 'bg-[var(--fg)] text-[var(--bg)]'
                      : 'text-[var(--fg-sec)] hover:text-[var(--fg)] hover:bg-[var(--bg-sec)]'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>

            {/* List */}
            {filteredNotifications.length === 0 ? (
              <div className="rounded-2xl border border-[var(--border)] bg-[var(--card)] p-12 text-center">
                <Bell size={40} className="mx-auto text-[var(--fg-sec)] mb-3" />
                <h3 className="text-base font-bold">No notifications</h3>
                <p className="text-xs text-[var(--fg-sec)] mt-1">You are all caught up!</p>
              </div>
            ) : (
              <div className="rounded-2xl border border-[var(--border)] bg-[var(--card)] divide-y divide-[var(--border)]">
                {filteredNotifications.map((notif) => {
                  const getCategoryIcon = (category) => {
                    switch (category) {
                      case 'Orders': return <ShoppingBag size={18} className="text-emerald-500 shrink-0" />;
                      case 'Watchlist': return <Bookmark size={18} className="text-amber-500 shrink-0" />;
                      default: return <Bell size={18} className="text-[var(--fg-sec)] shrink-0" />;
                    }
                  };

                  return (
                    <div
                      key={notif.id}
                      onClick={() => !notif.read && markNotificationRead(notif.id)}
                      className={`p-4 sm:p-5 flex items-start justify-between gap-4 transition-colors cursor-pointer ${
                        !notif.read ? 'bg-[var(--bg-sec)]/50' : 'hover:bg-[var(--bg-sec)]/30'
                      }`}
                    >
                      <div className="flex items-start gap-3.5">
                        {getCategoryIcon(notif.category)}
                        <div className="space-y-1">
                          <div className="flex items-center gap-2">
                            <h4 className="text-sm font-bold text-[var(--fg)]">{notif.title}</h4>
                            {!notif.read && (
                              <span className="w-2 h-2 rounded-full bg-[var(--fg)] shrink-0" />
                            )}
                          </div>
                          <p className="text-xs text-[var(--fg-sec)] leading-relaxed">{notif.message}</p>
                          <span className="text-[10px] text-[var(--fg-sec)] font-mono block pt-0.5">
                            {notif.timestamp}
                          </span>
                        </div>
                      </div>

                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          deleteNotification(notif.id);
                        }}
                        className="p-1.5 rounded-lg hover:bg-[var(--bg-sec)] text-[var(--fg-sec)] hover:text-red-500 transition-colors"
                        title="Delete Notification"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
