'use client';

import React, { createContext, useContext, useEffect, useState } from 'react';

const NotificationContext = createContext();

const MOCK_NOTIFICATIONS = [
  {
    id: 'notif-1',
    category: 'Orders',
    title: 'Order Confirmed',
    message: 'Your tickets for Taylor Swift | The Eras Tour are ready in your account.',
    timestamp: '2 hours ago',
    read: false,
  },
  {
    id: 'notif-2',
    category: 'Watchlist',
    title: 'Event Reminder',
    message: 'LA Lakers vs. Boston Celtics is happening this weekend at Crypto.com Arena.',
    timestamp: '1 day ago',
    read: false,
  },
  {
    id: 'notif-3',
    category: 'System',
    title: 'Welcome to TicketX',
    message: 'Explore concerts, sports, theater, comedy, and family shows near you.',
    timestamp: '3 days ago',
    read: true,
  },
];

function getInitialNotifications() {
  if (typeof window === 'undefined') return MOCK_NOTIFICATIONS;
  const saved = localStorage.getItem('ticketx-notifications');
  if (saved) try { return JSON.parse(saved); } catch (_) {}
  return MOCK_NOTIFICATIONS;
}

export function NotificationProvider({ children }) {
  const [notifications, setNotifications] = useState(getInitialNotifications);

  const createNotification = (title, message, category = 'System') => {
    const newNotif = {
      id: `notif-${Date.now()}`,
      category,
      title,
      message,
      timestamp: 'Just now',
      read: false,
    };
    setNotifications((prev) => {
      const next = [newNotif, ...prev];
      localStorage.setItem('ticketx-notifications', JSON.stringify(next));
      return next;
    });
  };

  const markNotificationRead = (id) => {
    setNotifications((prev) => {
      const next = prev.map((n) => (n.id === id ? { ...n, read: true } : n));
      localStorage.setItem('ticketx-notifications', JSON.stringify(next));
      return next;
    });
  };

  const markAllNotificationsRead = () => {
    setNotifications((prev) => {
      const next = prev.map((n) => ({ ...n, read: true }));
      localStorage.setItem('ticketx-notifications', JSON.stringify(next));
      return next;
    });
  };

  const deleteNotification = (id) => {
    setNotifications((prev) => {
      const next = prev.filter((n) => n.id !== id);
      localStorage.setItem('ticketx-notifications', JSON.stringify(next));
      return next;
    });
  };

  const unreadCount = notifications.filter((n) => !n.read).length;

  return (
    <NotificationContext.Provider
      value={{
        notifications,
        unreadCount,
        createNotification,
        markNotificationRead,
        markAllNotificationsRead,
        deleteNotification,
      }}
    >
      {children}
    </NotificationContext.Provider>
  );
}

export const useNotifications = () => useContext(NotificationContext);
