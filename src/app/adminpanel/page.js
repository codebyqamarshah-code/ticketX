'use client';

import React, { useState, useCallback } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ShieldCheck,
  Lock,
  User,
  Mail,
  Key,
  LogOut,
  LayoutDashboard,
  Users,
  Ticket,
  ShoppingBag,
  Settings,
  PlusCircle,
  Search,
  CheckCircle2,
  DollarSign,
  Calendar,
  Trash2,
  Eye,
  AlertTriangle,
  ArrowUpRight,
  TrendingUp
} from 'lucide-react';
import { getAllEvents } from '@/data/events';
import ThemeToggle from '@/components/ui/ThemeToggle';

const ADMIN_CREDS_KEY = 'ticketx-admin-credentials';
const ADMIN_SESSION_KEY = 'ticketx-admin-session';
const CUSTOM_EVENTS_KEY = 'ticketx-custom-events';
const USERS_DB_KEY = 'ticketx-users-db';
const ORDERS_DB_KEY = 'ticketx-orders';
const TICKETS_DB_KEY = 'ticketx-purchased-tickets';

function getInitialAdminAccount() {
  if (typeof window === 'undefined') return false;
  try {
    return !!localStorage.getItem(ADMIN_CREDS_KEY);
  } catch (_) {
    return false;
  }
}

function getInitialAdminSession() {
  if (typeof window === 'undefined') return null;
  try {
    const activeSession = sessionStorage.getItem(ADMIN_SESSION_KEY) || localStorage.getItem(ADMIN_SESSION_KEY);
    return activeSession ? JSON.parse(activeSession) : null;
  } catch (_) {
    return null;
  }
}

function getInitialEvents() {
  if (typeof window === 'undefined') return [];
  return getAllEvents();
}

function getInitialUsers() {
  if (typeof window === 'undefined') return [];
  try {
    const savedUsers = localStorage.getItem(USERS_DB_KEY);
    if (savedUsers) return JSON.parse(savedUsers);
    const defaultUsers = [
      {
        id: 'usr-001',
        firstName: 'Qamar',
        lastName: 'Abbas',
        email: 'jafferi2008@gmail.com',
        phone: '+92 300 1234567',
        city: 'Lahore',
        country: 'Pakistan',
        createdAt: '2026-09-01',
        status: 'Active',
      },
      {
        id: 'usr-002',
        firstName: 'Alex',
        lastName: 'Morgan',
        email: 'alex.morgan@example.com',
        phone: '+1 (555) 234-5678',
        city: 'Los Angeles',
        country: 'USA',
        createdAt: '2026-09-12',
        status: 'Active',
      },
    ];
    localStorage.setItem(USERS_DB_KEY, JSON.stringify(defaultUsers));
    return defaultUsers;
  } catch (_) {
    return [];
  }
}

function getInitialOrders() {
  if (typeof window === 'undefined') return [];
  try {
    const saved = localStorage.getItem(ORDERS_DB_KEY);
    return saved ? JSON.parse(saved) : [];
  } catch (_) {
    return [];
  }
}

function getInitialTickets() {
  if (typeof window === 'undefined') return [];
  try {
    const saved = localStorage.getItem(TICKETS_DB_KEY);
    return saved ? JSON.parse(saved) : [];
  } catch (_) {
    return [];
  }
}

export default function AdminPanelPage() {
  // Auth state
  const [hasAdminAccount, setHasAdminAccount] = useState(false);
  const [activeAdmin, setActiveAdmin] = useState(null);
  const [isAdminLoggedIn, setIsAdminLoggedIn] = useState(false);
  const [authStep, setAuthStep] = useState('loading'); // 'loading', 'setup', 'login', 'otp'
  const [otpEmail, setOtpEmail] = useState('');

  React.useEffect(() => {
    async function checkAuth() {
      try {
        // First check if logged in
        const meRes = await fetch('/api/auth/me');
        const meData = await meRes.json();
        
        if (meData.success && meData.user && meData.user.role === 'super_admin') {
          setActiveAdmin(meData.user);
          setIsAdminLoggedIn(true);
          setHasAdminAccount(true);
          setAuthStep('dashboard');
          return;
        }

        // If not logged in, check if admin exists
        const statusRes = await fetch('/api/admin/status');
        const statusData = await statusRes.json();
        
        if (statusData.isSetup) {
          setHasAdminAccount(true);
          setAuthStep('login');
        } else {
          setHasAdminAccount(false);
          setAuthStep('setup');
        }
      } catch (err) {
        console.error(err);
        setAuthStep('login');
      }
    }
    checkAuth();
  }, []);

  // Form states (Registration & Login)
  const [regForm, setRegForm] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    securityCode: '',
    avatar: '',
  });
  const [loginForm, setLoginForm] = useState({
    email: '',
    password: '',
  });
  const [authError, setAuthError] = useState('');
  const [authSuccess, setAuthSuccess] = useState('');
  const [isLoading, setIsLoading] = useState(false);


  // Dashboard Navigation
  const [activeTab, setActiveTab] = useState('overview');

  // Data states using lazy initializers
  const [eventsList, setEventsList] = useState(getInitialEvents);
  const [usersList, setUsersList] = useState([]);

  React.useEffect(() => {
    if (isAdminLoggedIn) {
      fetch('/api/admin/users')
        .then(res => res.json())
        .then(data => {
          if (data.success) {
            setUsersList(data.users);
          }
        });
    }
  }, [isAdminLoggedIn]);
  const [ordersList] = useState(getInitialOrders);
  const [ticketsList] = useState(getInitialTickets);

  // Filters & Search
  const [userSearch, setUserSearch] = useState('');
  const [eventSearch, setEventSearch] = useState('');
  const [orderSearch, setOrderSearch] = useState('');

  // Modals & Form States for Ticket Upload
  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);
  const [newTicket, setNewTicket] = useState({
    title: '',
    category: 'concerts',
    subcategory: 'Live Performance',
    artist: '',
    venue: '',
    city: 'Lahore',
    country: 'Pakistan',
    date: '2026-11-15',
    time: '08:00 PM',
    priceFrom: 50,
    priceTo: 250,
    availableSeats: 500,
    image: 'https://images.unsplash.com/photo-1470225620780-dba8ba36b745?w=800&q=80',
    description: '',
    isFeatured: true,
    isTrending: true,
    isVIP: false,
  });

  // Selected Order Modal
  const [selectedOrder, setSelectedOrder] = useState(null);

  // Notification Banner
  const [toastMessage, setToastMessage] = useState(null);

  const showToast = useCallback((msg, type = 'success') => {
    setToastMessage({ msg, type });
    setTimeout(() => setToastMessage(null), 4000);
  }, []);

  const refreshEvents = useCallback(() => {
    setEventsList(getAllEvents());
  }, []);

  // Handle Admin One-Time Registration
  const handleRegisterAdmin = async (e) => {
    e.preventDefault();
    setAuthError('');
    setAuthSuccess('');

    if (!regForm.name || !regForm.email || !regForm.password) {
      setAuthError('Please fill in all required fields.');
      return;
    }

    if (regForm.password !== regForm.confirmPassword) {
      setAuthError('Passwords do not match.');
      return;
    }

    if (regForm.password.length < 6) {
      setAuthError('Password must be at least 6 characters long.');
      return;
    }

    setIsLoading(true);
    try {
      const res = await fetch('/api/admin/setup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          firstName: regForm.name.trim(),
          email: regForm.email.trim(),
          password: regForm.password
        })
      });
      const data = await res.json();
      setIsLoading(false);

      if (data.success) {
        if (data.alreadyVerified) {
          setAuthStep('login');
          showToast('Setup complete! Your email is already verified. Please login.', 'success');
        } else {
          setOtpEmail(regForm.email.trim());
          setAuthStep('otp');
          showToast('Verification email sent!');
        }
      } else {
        setAuthError(data.message || 'Setup failed.');
      }
    } catch (err) {
      setIsLoading(false);
      setAuthError('Network error. Please try again.');
    }
  };

  // Handle Admin Login
  const handleLoginAdmin = async (e) => {
    e.preventDefault();
    setAuthError('');
    setIsLoading(true);

    try {
      const res = await fetch('/api/admin/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: loginForm.email.trim(),
          password: loginForm.password
        })
      });
      const data = await res.json();
      setIsLoading(false);

      if (data.success) {
        setActiveAdmin(data.user);
        setIsAdminLoggedIn(true);
        setHasAdminAccount(true);
        setAuthStep('dashboard');
        showToast(`Welcome back, ${data.user.firstName}!`);
      } else if (data.unverified) {
        setOtpEmail(loginForm.email.trim());
        
        // request resend before moving to otp step automatically
        await fetch('/api/auth/resend-otp', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ email: loginForm.email.trim() })
        });

        setAuthStep('otp');
      } else {
        setAuthError(data.message || 'Invalid Admin Email or Password.');
      }
    } catch (err) {
      setIsLoading(false);
      setAuthError('Authentication error. Please try again.');
    }
  };

  const handleAdminOtpVerified = () => {
    showToast('Admin email verified successfully!');
    // After verified, they have a cookie. We can set them as logged in.
    setTimeout(async () => {
      const meRes = await fetch('/api/auth/me');
      const meData = await meRes.json();
      if (meData.success && meData.user && meData.user.role === 'super_admin') {
        setActiveAdmin(meData.user);
        setIsAdminLoggedIn(true);
        setHasAdminAccount(true);
        setAuthStep('dashboard');
      } else {
        setAuthStep('login');
      }
    }, 500);
  };


  // Handle Logout
  const handleLogout = () => {
    sessionStorage.removeItem(ADMIN_SESSION_KEY);
    localStorage.removeItem(ADMIN_SESSION_KEY);
    setIsAdminLoggedIn(false);
    setActiveAdmin(null);
    showToast('Logged out from Admin Panel.', 'info');
  };

  // Upload/Create/Edit Ticket
  const handleCreateTicket = (e) => {
    e.preventDefault();

    if (!newTicket.title || !newTicket.artist || !newTicket.venue) {
      alert('Please fill in title, artist/organizer, and venue name.');
      return;
    }

    const isEdit = !!newTicket.id;
    const slug = newTicket.title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '');
    
    const eventData = {
      ...newTicket,
      id: newTicket.id || `evt-${Date.now()}`,
      slug: newTicket.slug || `${slug}-${Math.floor(Math.random() * 1000)}`,
      artistSlug: newTicket.artist.toLowerCase().replace(/[^a-z0-9]+/g, '-'),
      description: newTicket.description || `Official tickets for ${newTicket.title} live at ${newTicket.venue}.`,
      venueSlug: newTicket.venue.toLowerCase().replace(/[^a-z0-9]+/g, '-'),
      cityId: newTicket.city.toLowerCase().replace(/[^a-z0-9]+/g, '-'),
      priceFrom: Number(newTicket.priceFrom) || 50,
      priceTo: Number(newTicket.priceTo) || 300,
      availableSeats: Number(newTicket.availableSeats) || 500,
      availability: newTicket.availability || 'available',
      isPopular: true,
      isNearYou: true,
      isAccessible: true,
      isResale: false,
      tags: newTicket.tags || [newTicket.category, newTicket.city.toLowerCase()],
      uploadedByAdmin: newTicket.uploadedByAdmin !== undefined ? newTicket.uploadedByAdmin : true,
      uploadedAt: newTicket.uploadedAt || new Date().toISOString(),
    };

    try {
      if (isEdit && !newTicket.uploadedByAdmin) {
        // It's a static event edit
        const editedStr = localStorage.getItem('ticketx-edited-events');
        const editedDict = editedStr ? JSON.parse(editedStr) : {};
        editedDict[eventData.id] = eventData;
        localStorage.setItem('ticketx-edited-events', JSON.stringify(editedDict));
      } else {
        // It's a custom event (new or edit)
        const existingCustomStr = localStorage.getItem(CUSTOM_EVENTS_KEY);
        let existingCustom = existingCustomStr ? JSON.parse(existingCustomStr) : [];
        if (isEdit) {
          existingCustom = existingCustom.map(ev => ev.id === eventData.id ? eventData : ev);
        } else {
          existingCustom = [eventData, ...existingCustom];
        }
        localStorage.setItem(CUSTOM_EVENTS_KEY, JSON.stringify(existingCustom));
      }

      refreshEvents();
      setIsUploadModalOpen(false);
      showToast(`Ticket "${eventData.title}" ${isEdit ? 'updated' : 'published'} live to website!`);
    } catch (err) {
      alert('Failed to save ticket event. Storage limit exceeded.');
    }
  };

  const handleEditEventClick = (event) => {
    setNewTicket(event);
    setIsUploadModalOpen(true);
  };

  // Delete Event (Custom or Static)
  const handleDeleteEvent = (id) => {
    if (!confirm('Are you sure you want to permanently delete this event? This will remove it from the main website as well.')) return;

    try {
      const existingCustomStr = localStorage.getItem(CUSTOM_EVENTS_KEY);
      let isCustom = false;
      if (existingCustomStr) {
        const existingCustom = JSON.parse(existingCustomStr);
        if (existingCustom.find((e) => e.id === id)) {
          isCustom = true;
          const filtered = existingCustom.filter((e) => e.id !== id);
          localStorage.setItem(CUSTOM_EVENTS_KEY, JSON.stringify(filtered));
        }
      }

      if (!isCustom) {
        // Add to deleted-events list
        const deletedStr = localStorage.getItem('ticketx-deleted-events');
        const deletedArr = deletedStr ? JSON.parse(deletedStr) : [];
        if (!deletedArr.includes(id)) {
          deletedArr.push(id);
          localStorage.setItem('ticketx-deleted-events', JSON.stringify(deletedArr));
        }
      }

      refreshEvents();
      showToast('Event removed successfully.');
    } catch (_) {
      showToast('Error removing event', 'error');
    }
  };

  // Toggle User Status (Active / Suspended)
  const handleToggleUserStatus = async (userId) => {
    const user = usersList.find(u => u._id === userId || u.id === userId);
    if (!user) return;
    
    const newStatus = user.status === 'Active' ? 'Suspended' : 'Active';
    const actualId = user._id || user.id;

    try {
      const res = await fetch('/api/admin/users', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId: actualId, status: newStatus })
      });
      const data = await res.json();
      if (data.success) {
        setUsersList(usersList.map((u) => {
          if ((u._id || u.id) === actualId) {
            return { ...u, status: newStatus };
          }
          return u;
        }));
        showToast('User status updated successfully.');
      } else {
        showToast(data.message || 'Failed to update user', 'error');
      }
    } catch (e) {
      showToast('Error updating user', 'error');
    }
  };

  const handleDeleteUser = async (userId) => {
    if (!confirm('Are you sure you want to permanently delete this user?')) return;
    const user = usersList.find(u => u._id === userId || u.id === userId);
    const actualId = user._id || user.id;

    try {
      const res = await fetch(`/api/admin/users?id=${actualId}`, { method: 'DELETE' });
      const data = await res.json();
      if (data.success) {
        setUsersList(usersList.filter(u => (u._id || u.id) !== actualId));
        showToast('User deleted successfully.');
      } else {
        showToast(data.message || 'Failed to delete user', 'error');
      }
    } catch (e) {
      showToast('Error deleting user', 'error');
    }
  };

  // Calculations for Stats
  const totalRevenue = ordersList.reduce((acc, order) => acc + (Number(order.total) || Number(order.paymentSummary?.total) || 0), 0);
  const totalTicketsSold = ticketsList.length || ordersList.reduce((acc, o) => acc + (o.items ? o.items.reduce((sum, i) => sum + (i.quantity || 1), 0) : 1), 0);

  // -------------------------------------------------------------
  // RENDER: LOGIN / ONE-TIME REGISTER FORM (UNAUTHENTICATED)
  // -------------------------------------------------------------
  if (!isAdminLoggedIn) {
    return (
      <div className="min-h-screen dark:bg-slate-950 bg-white dark:text-slate-100 text-black flex flex-col justify-center items-center px-4 py-12 relative overflow-hidden">
        {/* Background glow effects */}
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none" />

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="w-full max-w-md z-10"
        >
          {/* Header Logo */}
          <div className="text-center mb-8">
            <Link href="/" className="inline-block mb-3">
              <span className="text-3xl font-black tracking-tight dark:text-white text-black">
                Ticket<span className="text-rose-600">X</span>
              </span>
            </Link>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full dark:bg-slate-900 bg-gray-100 border dark:border-slate-800 border-gray-300 text-xs dark:text-slate-400 text-gray-600">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
              <span>Super Admin Authorization Portal</span>
            </div>
          </div>

          <div className="dark:bg-slate-900 bg-gray-100/90 backdrop-blur-xl border dark:border-slate-800 border-gray-300 rounded-2xl p-8 shadow-2xl relative">
            {/* Form Title */}
            <div className="mb-6">
              <h2 className="text-xl font-bold dark:text-white text-black">
                {hasAdminAccount ? 'Super Admin Sign In' : 'One-Time Admin Setup'}
              </h2>
              <p className="text-xs dark:text-slate-400 text-gray-600 mt-1">
                {hasAdminAccount
                  ? 'Enter your registered credentials to manage the platform.'
                  : 'Welcome! Create your primary Super Admin account to get full control.'}
              </p>
            </div>

            {/* Error / Success Notices */}
            {authError && (
              <div className="mb-4 p-3 rounded-lg bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs flex items-center gap-2">
                <AlertTriangle className="w-4 h-4 shrink-0" />
                <span>{authError}</span>
              </div>
            )}
            {authSuccess && (
              <div className="mb-4 p-3 rounded-lg bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 text-xs flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 shrink-0" />
                <span>{authSuccess}</span>
              </div>
            )}

            {authStep === 'otp' ? (
              <div className="space-y-4">
                <p className="text-sm dark:text-slate-300 text-gray-700 mb-4 text-center">
                  We've sent a 6-digit verification code to:<br/>
                  <strong className="text-emerald-400">{otpEmail}</strong>
                </p>
                <form onSubmit={async (e) => {
                  e.preventDefault();
                  setAuthError('');
                  setIsLoading(true);
                  const formData = new FormData(e.target);
                  const otp = formData.get('otp');
                  try {
                    const res = await fetch('/api/auth/verify-email', {
                      method: 'POST',
                      headers: { 'Content-Type': 'application/json' },
                      body: JSON.stringify({ email: otpEmail, otp })
                    });
                    const data = await res.json();
                    setIsLoading(false);
                    if (data.success) {
                      handleAdminOtpVerified();
                    } else {
                      setAuthError(data.message || 'Invalid OTP');
                    }
                  } catch (err) {
                    setIsLoading(false);
                    setAuthError('Network error');
                  }
                }}>
                  <input
                    name="otp"
                    type="text"
                    required
                    maxLength={6}
                    placeholder="123456"
                    className="w-full text-center tracking-[1em] py-3 dark:bg-slate-950 bg-white/80 border dark:border-slate-800 border-gray-300 rounded-lg text-xl font-mono dark:text-white text-black placeholder-slate-600 focus:outline-none focus:border-emerald-500"
                  />
                  <button
                    type="submit"
                    disabled={isLoading}
                    className="w-full mt-4 py-2.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 dark:text-white text-black text-sm font-semibold transition-colors disabled:opacity-50"
                  >
                    {isLoading ? 'Verifying...' : 'Verify Admin Email'}
                  </button>
                </form>
                <div className="text-center mt-4 text-xs">
                  <button onClick={async () => {
                    if(isLoading) return;
                    setIsLoading(true);
                    setAuthError('');
                    setAuthSuccess('');
                    try {
                      const res = await fetch('/api/auth/resend-otp', {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({ email: otpEmail })
                      });
                      const data = await res.json();
                      setIsLoading(false);
                      if (data.success) {
                        setAuthSuccess('Code resent!');
                      } else {
                        setAuthError(data.message || 'Failed to resend code.');
                      }
                    } catch (err) {
                      setIsLoading(false);
                      setAuthError('Network error.');
                    }
                  }} className="dark:text-slate-400 text-gray-600 hover:text-emerald-400 disabled:opacity-50" disabled={isLoading}>
                    Resend Code
                  </button>
                </div>
              </div>
            ) : !hasAdminAccount ? (
              <form onSubmit={handleRegisterAdmin} className="space-y-4">
                <div>
                  <label className="block text-xs font-semibold dark:text-slate-300 text-gray-700 mb-1">
                    Super Admin Full Name *
                  </label>
                  <div className="relative">
                    <User className="w-4 h-4 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
                    <input
                      type="text"
                      required
                      placeholder="e.g. Qamar Abbas"
                      value={regForm.name}
                      onChange={(e) => setRegForm({ ...regForm, name: e.target.value })}
                      className="w-full pl-9 pr-3 py-2 dark:bg-slate-950 bg-white/80 border dark:border-slate-800 border-gray-300 rounded-lg text-sm dark:text-white text-black placeholder-slate-600 focus:outline-none focus:border-emerald-500"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold dark:text-slate-300 text-gray-700 mb-1">
                    Admin Official Email *
                  </label>
                  <div className="relative">
                    <Mail className="w-4 h-4 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
                    <input
                      type="email"
                      required
                      placeholder="admin@ticketx.com"
                      value={regForm.email}
                      onChange={(e) => setRegForm({ ...regForm, email: e.target.value })}
                      className="w-full pl-9 pr-3 py-2 dark:bg-slate-950 bg-white/80 border dark:border-slate-800 border-gray-300 rounded-lg text-sm dark:text-white text-black placeholder-slate-600 focus:outline-none focus:border-emerald-500"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold dark:text-slate-300 text-gray-700 mb-1">
                    Password *
                  </label>
                  <div className="relative">
                    <Lock className="w-4 h-4 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
                    <input
                      type="password"
                      required
                      placeholder="••••••••"
                      value={regForm.password}
                      onChange={(e) => setRegForm({ ...regForm, password: e.target.value })}
                      className="w-full pl-9 pr-3 py-2 dark:bg-slate-950 bg-white/80 border dark:border-slate-800 border-gray-300 rounded-lg text-sm dark:text-white text-black placeholder-slate-600 focus:outline-none focus:border-emerald-500"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold dark:text-slate-300 text-gray-700 mb-1">
                    Confirm Password *
                  </label>
                  <div className="relative">
                    <Lock className="w-4 h-4 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
                    <input
                      type="password"
                      required
                      placeholder="••••••••"
                      value={regForm.confirmPassword}
                      onChange={(e) => setRegForm({ ...regForm, confirmPassword: e.target.value })}
                      className="w-full pl-9 pr-3 py-2 dark:bg-slate-950 bg-white/80 border dark:border-slate-800 border-gray-300 rounded-lg text-sm dark:text-white text-black placeholder-slate-600 focus:outline-none focus:border-emerald-500"
                    />
                  </div>
                </div>

                <div className="pt-2">
                  <button
                    type="submit"
                    className="w-full py-2.5 px-4 bg-emerald-600 hover:bg-emerald-500 dark:text-white text-black font-semibold rounded-lg text-sm transition-all shadow-lg shadow-emerald-600/20 flex items-center justify-center gap-2"
                  >
                    <ShieldCheck className="w-4 h-4" />
                    <span>Complete One-Time Admin Setup</span>
                  </button>
                </div>
              </form>
            ) : (
              /* LOGIN FORM (Shown when account is already registered) */
              <form onSubmit={handleLoginAdmin} className="space-y-4">
                <div>
                  <label className="block text-xs font-semibold dark:text-slate-300 text-gray-700 mb-1">
                    Admin Email
                  </label>
                  <div className="relative">
                    <Mail className="w-4 h-4 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
                    <input
                      type="email"
                      required
                      placeholder="admin@ticketx.com"
                      value={loginForm.email}
                      onChange={(e) => setLoginForm({ ...loginForm, email: e.target.value })}
                      className="w-full pl-9 pr-3 py-2 dark:bg-slate-950 bg-white/80 border dark:border-slate-800 border-gray-300 rounded-lg text-sm dark:text-white text-black placeholder-slate-600 focus:outline-none focus:border-emerald-500"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold dark:text-slate-300 text-gray-700 mb-1">
                    Password
                  </label>
                  <div className="relative">
                    <Lock className="w-4 h-4 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
                    <input
                      type="password"
                      required
                      placeholder="••••••••"
                      value={loginForm.password}
                      onChange={(e) => setLoginForm({ ...loginForm, password: e.target.value })}
                      className="w-full pl-9 pr-3 py-2 dark:bg-slate-950 bg-white/80 border dark:border-slate-800 border-gray-300 rounded-lg text-sm dark:text-white text-black placeholder-slate-600 focus:outline-none focus:border-emerald-500"
                    />
                  </div>
                </div>

                <div className="pt-2">
                  <button
                    type="submit"
                    className="w-full py-2.5 px-4 bg-emerald-600 hover:bg-emerald-500 dark:text-white text-black font-semibold rounded-lg text-sm transition-all shadow-lg shadow-emerald-600/20 flex items-center justify-center gap-2"
                  >
                    <Key className="w-4 h-4" />
                    <span>Sign In to Admin Dashboard</span>
                  </button>
                </div>

                <div className="text-center pt-2">
                  <p className="text-[11px] text-slate-500">
                    Registration is locked. Single Super Admin active.
                  </p>
                </div>
              </form>
            )}
          </div>

          <div className="text-center mt-6">
            <Link
              href="/"
              className="text-xs text-slate-500 hover:dark:text-slate-300 text-gray-700 transition-colors inline-flex items-center gap-1"
            >
              ← Back to Main TicketX Website
            </Link>
          </div>
        </motion.div>
      </div>
    );
  }

  // -------------------------------------------------------------
  // RENDER: FULL SUPER ADMIN DASHBOARD (AUTHENTICATED)
  // -------------------------------------------------------------
  return (
    <div className="min-h-screen dark:bg-slate-950 bg-white dark:text-slate-100 text-black flex flex-col md:flex-row">
      {/* Toast Notification Banner */}
      <AnimatePresence>
        {toastMessage && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className={`fixed top-4 right-4 z-50 px-4 py-3 rounded-xl shadow-2xl text-xs font-semibold flex items-center gap-2 border ${
              toastMessage.type === 'error'
                ? 'bg-rose-950 border-rose-800 text-rose-200'
                : toastMessage.type === 'info'
                ? 'bg-sky-950 border-sky-800 text-sky-200'
                : 'bg-emerald-950 border-emerald-800 text-emerald-200'
            }`}
          >
            <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
            <span>{toastMessage.msg}</span>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ADMIN SIDEBAR */}
      <aside className="w-full md:w-64 dark:bg-slate-900 bg-gray-100 border-b md:border-b-0 md:border-r dark:border-slate-800 border-gray-300 flex flex-col justify-between shrink-0">
        <div>
          {/* Logo & Brand */}
          <div className="p-5 border-b dark:border-slate-800 border-gray-300/80 flex items-center justify-between">
            <Link href="/" className="flex items-center gap-2">
              <span className="text-xl font-black tracking-tight dark:text-white text-black">
                Ticket<span className="text-rose-600">X</span>
              </span>
              <span className="px-2 py-0.5 text-[10px] font-bold rounded bg-rose-500/20 text-rose-400 border border-rose-500/30">
                ADMIN
              </span>
            </Link>
          </div>

          {/* Nav Items */}
          <nav className="p-3 space-y-1">
            <button
              onClick={() => setActiveTab('overview')}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-medium transition-all ${
                activeTab === 'overview'
                  ? 'bg-emerald-600/15 text-emerald-400 border border-emerald-500/30'
                  : 'dark:text-slate-400 text-gray-600 hover:bg-slate-800/50 hover:text-slate-200'
              }`}
            >
              <LayoutDashboard className="w-4 h-4" />
              <span>Overview & Analytics</span>
            </button>

            <button
              onClick={() => setActiveTab('users')}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-medium transition-all ${
                activeTab === 'users'
                  ? 'bg-emerald-600/15 text-emerald-400 border border-emerald-500/30'
                  : 'dark:text-slate-400 text-gray-600 hover:bg-slate-800/50 hover:text-slate-200'
              }`}
            >
              <Users className="w-4 h-4" />
              <span>User Profiles ({usersList.length})</span>
            </button>

            <button
              onClick={() => setActiveTab('tickets')}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-medium transition-all ${
                activeTab === 'tickets'
                  ? 'bg-emerald-600/15 text-emerald-400 border border-emerald-500/30'
                  : 'dark:text-slate-400 text-gray-600 hover:bg-slate-800/50 hover:text-slate-200'
              }`}
            >
              <Ticket className="w-4 h-4" />
              <span>Ticket & Event Upload</span>
            </button>

            <button
              onClick={() => setActiveTab('orders')}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-medium transition-all ${
                activeTab === 'orders'
                  ? 'bg-emerald-600/15 text-emerald-400 border border-emerald-500/30'
                  : 'dark:text-slate-400 text-gray-600 hover:bg-slate-800/50 hover:text-slate-200'
              }`}
            >
              <ShoppingBag className="w-4 h-4" />
              <span>Orders & Bookings ({ordersList.length})</span>
            </button>

            <button
              onClick={() => setActiveTab('settings')}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-medium transition-all ${
                activeTab === 'settings'
                  ? 'bg-emerald-600/15 text-emerald-400 border border-emerald-500/30'
                  : 'dark:text-slate-400 text-gray-600 hover:bg-slate-800/50 hover:text-slate-200'
              }`}
            >
              <Settings className="w-4 h-4" />
              <span>Admin Profile & Settings</span>
            </button>
          </nav>
        </div>

        {/* Admin Footer Info */}
        <div className="p-4 border-t dark:border-slate-800 border-gray-300 dark:bg-slate-950 bg-white/40">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2.5 min-w-0">
              <div className="w-8 h-8 rounded-full bg-emerald-600 flex items-center justify-center font-bold dark:text-white text-black text-xs shrink-0">
                {activeAdmin?.name?.charAt(0).toUpperCase() || 'A'}
              </div>
              <div className="min-w-0">
                <p className="text-xs font-semibold dark:text-white text-black truncate">{activeAdmin?.name}</p>
                <p className="text-[10px] dark:text-slate-400 text-gray-600 truncate">{activeAdmin?.role || 'Super Admin'}</p>
              </div>
            </div>
          </div>

          <button
            onClick={handleLogout}
            className="w-full py-1.5 px-3 bg-slate-800 hover:bg-rose-950/60 hover:text-rose-300 dark:text-slate-300 text-gray-700 rounded-lg text-xs font-medium transition-colors flex items-center justify-center gap-1.5"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span>Sign Out</span>
          </button>
        </div>
      </aside>

      {/* MAIN CONTENT AREA */}
      <main className="flex-1 overflow-y-auto p-4 md:p-8 dark:bg-slate-950 bg-white">
        {/* TOP BAR */}
        <header className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8 pb-4 border-b dark:border-slate-800 border-gray-300/80">
          <div>
            <h1 className="text-2xl font-bold dark:text-white text-black tracking-tight flex items-center gap-2">
              {activeTab === 'overview' && 'Dashboard Overview'}
              {activeTab === 'users' && 'User Profiles & Access'}
              {activeTab === 'tickets' && 'Ticket & Event Management'}
              {activeTab === 'orders' && 'Customer Orders & Transactions'}
              {activeTab === 'settings' && 'Admin Settings'}
            </h1>
            <p className="text-xs dark:text-slate-400 text-gray-600 mt-1">
              Live Super Admin Control Panel · Route: <code className="dark:bg-slate-900 bg-gray-100 px-1.5 py-0.5 rounded text-emerald-400">/adminpanel</code>
            </p>
          </div>

          <div className="flex items-center gap-3">
            <ThemeToggle />
            <button
              onClick={() => setIsUploadModalOpen(true)}
              className="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 dark:text-white text-black font-semibold rounded-xl text-xs transition-all shadow-lg shadow-emerald-600/20 flex items-center gap-2"
            >
              <PlusCircle className="w-4 h-4" />
              <span>Upload New Ticket</span>
            </button>
            <Link
              href="/"
              target="_blank"
              className="px-3 py-2 dark:bg-slate-900 bg-gray-100 hover:bg-slate-800 dark:text-slate-300 text-gray-700 rounded-xl text-xs font-medium border dark:border-slate-800 border-gray-300 transition-colors flex items-center gap-1.5"
            >
              <ArrowUpRight className="w-3.5 h-3.5 dark:text-slate-400 text-gray-600" />
              <span>Live Website</span>
            </Link>
          </div>
        </header>

        {/* TAB 1: OVERVIEW */}
        {activeTab === 'overview' && (
          <div className="space-y-6">
            {/* KPI Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="p-5 dark:bg-slate-900 bg-gray-100/80 border dark:border-slate-800 border-gray-300 rounded-2xl relative overflow-hidden">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs dark:text-slate-400 text-gray-600 font-medium">Total Platform Revenue</span>
                  <div className="w-8 h-8 rounded-lg bg-emerald-500/10 flex items-center justify-center text-emerald-400">
                    <DollarSign className="w-4 h-4" />
                  </div>
                </div>
                <h3 className="text-2xl font-black dark:text-white text-black">${totalRevenue.toLocaleString()}</h3>
                <span className="text-[10px] text-emerald-400 font-medium mt-1 inline-flex items-center gap-0.5">
                  <TrendingUp className="w-3 h-3" /> Live primary box office sales
                </span>
              </div>

              <div className="p-5 dark:bg-slate-900 bg-gray-100/80 border dark:border-slate-800 border-gray-300 rounded-2xl relative overflow-hidden">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs dark:text-slate-400 text-gray-600 font-medium">Tickets Sold</span>
                  <div className="w-8 h-8 rounded-lg bg-cyan-500/10 flex items-center justify-center text-cyan-400">
                    <Ticket className="w-4 h-4" />
                  </div>
                </div>
                <h3 className="text-2xl font-black dark:text-white text-black">{totalTicketsSold}</h3>
                <span className="text-[10px] dark:text-slate-400 text-gray-600 font-medium mt-1">Confirmed ticket seats issued</span>
              </div>

              <div className="p-5 dark:bg-slate-900 bg-gray-100/80 border dark:border-slate-800 border-gray-300 rounded-2xl relative overflow-hidden">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs dark:text-slate-400 text-gray-600 font-medium">Active User Profiles</span>
                  <div className="w-8 h-8 rounded-lg bg-indigo-500/10 flex items-center justify-center text-indigo-400">
                    <Users className="w-4 h-4" />
                  </div>
                </div>
                <h3 className="text-2xl font-black dark:text-white text-black">{usersList.length}</h3>
                <span className="text-[10px] text-indigo-400 font-medium mt-1">Registered members</span>
              </div>

              <div className="p-5 dark:bg-slate-900 bg-gray-100/80 border dark:border-slate-800 border-gray-300 rounded-2xl relative overflow-hidden">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs dark:text-slate-400 text-gray-600 font-medium">Live Events & Listings</span>
                  <div className="w-8 h-8 rounded-lg bg-amber-500/10 flex items-center justify-center text-amber-400">
                    <Calendar className="w-4 h-4" />
                  </div>
                </div>
                <h3 className="text-2xl font-black dark:text-white text-black">{eventsList.length}</h3>
                <span className="text-[10px] text-amber-400 font-medium mt-1">Available across categories</span>
              </div>
            </div>

            {/* Quick Actions & Activity */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div className="lg:col-span-2 dark:bg-slate-900 bg-gray-100/80 border dark:border-slate-800 border-gray-300 rounded-2xl p-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-sm font-bold dark:text-white text-black flex items-center gap-2">
                    <ShoppingBag className="w-4 h-4 text-emerald-400" />
                    <span>Recent Ticket Orders</span>
                  </h3>
                  <button
                    onClick={() => setActiveTab('orders')}
                    className="text-xs text-emerald-400 hover:underline font-medium"
                  >
                    View All Orders →
                  </button>
                </div>

                {ordersList.length === 0 ? (
                  <div className="text-center py-8 border border-dashed dark:border-slate-800 border-gray-300 rounded-xl">
                    <ShoppingBag className="w-8 h-8 text-slate-600 mx-auto mb-2" />
                    <p className="text-xs dark:text-slate-400 text-gray-600">No ticket orders placed yet.</p>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {ordersList.slice(0, 5).map((order) => (
                      <div
                        key={order.orderId || order.id}
                        className="p-3 dark:bg-slate-950 bg-white/60 border dark:border-slate-800 border-gray-300/80 rounded-xl flex items-center justify-between text-xs"
                      >
                        <div>
                          <p className="font-semibold dark:text-white text-black">Order #{order.orderId || order.id}</p>
                          <p className="dark:text-slate-400 text-gray-600 text-[11px]">{order.customerInfo?.email || order.email || 'Customer'}</p>
                        </div>
                        <div className="text-right">
                          <p className="font-bold text-emerald-400">${order.total || order.paymentSummary?.total || 0}</p>
                          <span className="text-[10px] bg-emerald-500/10 text-emerald-400 px-1.5 py-0.5 rounded border border-emerald-500/20">
                            {order.status || 'CONFIRMED'}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* System Info Card */}
              <div className="dark:bg-slate-900 bg-gray-100/80 border dark:border-slate-800 border-gray-300 rounded-2xl p-6">
                <h3 className="text-sm font-bold dark:text-white text-black mb-4 flex items-center gap-2">
                  <ShieldCheck className="w-4 h-4 text-emerald-400" />
                  <span>Platform System Status</span>
                </h3>
                <div className="space-y-3 text-xs">
                  <div className="p-3 rounded-xl dark:bg-slate-950 bg-white/60 border dark:border-slate-800 border-gray-300 flex items-center justify-between">
                    <span className="dark:text-slate-400 text-gray-600">Route Access</span>
                    <span className="font-semibold text-emerald-400">/adminpanel (Protected)</span>
                  </div>
                  <div className="p-3 rounded-xl dark:bg-slate-950 bg-white/60 border dark:border-slate-800 border-gray-300 flex items-center justify-between">
                    <span className="dark:text-slate-400 text-gray-600">Registration Mode</span>
                    <span className="font-semibold dark:text-slate-300 text-gray-700">Single Admin Locked</span>
                  </div>
                  <div className="p-3 rounded-xl dark:bg-slate-950 bg-white/60 border dark:border-slate-800 border-gray-300 flex items-center justify-between">
                    <span className="dark:text-slate-400 text-gray-600">Box Office Sync</span>
                    <span className="font-semibold text-emerald-400">Live Reaction Active</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* TAB 2: USER PROFILES */}
        {activeTab === 'users' && (
          <div className="space-y-6">
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
              <div className="relative w-full sm:w-72">
                <Search className="w-4 h-4 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  placeholder="Search user by name or email..."
                  value={userSearch}
                  onChange={(e) => setUserSearch(e.target.value)}
                  className="w-full pl-9 pr-3 py-2 dark:bg-slate-900 bg-gray-100 border dark:border-slate-800 border-gray-300 rounded-xl text-xs dark:text-white text-black placeholder-slate-500 focus:outline-none focus:border-emerald-500"
                />
              </div>

              <div className="text-xs dark:text-slate-400 text-gray-600">
                Total Registered User Profiles: <span className="font-bold dark:text-white text-black">{usersList.length}</span>
              </div>
            </div>

            <div className="dark:bg-slate-900 bg-gray-100 border dark:border-slate-800 border-gray-300 rounded-2xl overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs dark:text-slate-300 text-gray-700">
                  <thead className="dark:bg-slate-950 bg-white/80 dark:text-slate-400 text-gray-600 font-semibold border-b dark:border-slate-800 border-gray-300">
                    <tr>
                      <th className="p-3.5">User Profile</th>
                      <th className="p-3.5">Contact Email</th>
                      <th className="p-3.5">Location</th>
                      <th className="p-3.5">Registered Date</th>
                      <th className="p-3.5">Account Status</th>
                      <th className="p-3.5 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-800/60">
                    {usersList
                      .filter((u) => {
                        if (!userSearch.trim()) return true;
                        const q = userSearch.toLowerCase();
                        return (
                          u.firstName?.toLowerCase().includes(q) ||
                          u.lastName?.toLowerCase().includes(q) ||
                          u.email?.toLowerCase().includes(q)
                        );
                      })
                      .map((u) => (
                        <tr key={u._id || u.id} className="hover:bg-slate-800/40 transition-colors">
                          <td className="p-3.5">
                            <div className="flex items-center gap-3">
                              <div className="w-8 h-8 rounded-full bg-slate-800 border border-slate-700 flex items-center justify-center font-bold text-emerald-400 text-xs shrink-0">
                                {u.firstName ? u.firstName.charAt(0).toUpperCase() : u.email.charAt(0).toUpperCase()}
                              </div>
                              <div>
                                <p className="font-semibold dark:text-white text-black">
                                  {u.firstName} {u.lastName}
                                </p>
                                <p className="text-[10px] text-slate-500">ID: {u._id || u.id}</p>
                              </div>
                            </div>
                          </td>
                          <td className="p-3.5">{u.email}</td>
                          <td className="p-3.5 dark:text-slate-400 text-gray-600">
                            {u.city || 'N/A'}, {u.country || 'N/A'}
                          </td>
                          <td className="p-3.5 dark:text-slate-400 text-gray-600">
                            {u.createdAt ? new Date(u.createdAt).toLocaleDateString() : 'Recent'}
                          </td>
                          <td className="p-3.5">
                            <span
                              className={`px-2 py-0.5 rounded text-[10px] font-bold border ${
                                u.status === 'Suspended'
                                  ? 'bg-rose-500/10 text-rose-400 border-rose-500/30'
                                  : 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30'
                              }`}
                            >
                              {u.status || 'Active'}
                            </span>
                          </td>
                          <td className="p-3.5 text-right space-x-2 flex justify-end">
                            <button
                              onClick={() => handleToggleUserStatus(u._id || u.id)}
                              className="px-2.5 py-1 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-lg text-[11px] font-medium transition-colors"
                            >
                              {u.status === 'Suspended' ? 'Activate' : 'Suspend'}
                            </button>
                            <button
                              onClick={() => handleDeleteUser(u._id || u.id)}
                              className="px-2.5 py-1 bg-rose-900/50 hover:bg-rose-600 text-rose-200 rounded-lg text-[11px] font-medium transition-colors"
                            >
                              Delete
                            </button>
                          </td>
                        </tr>
                      ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* TAB 3: TICKET & EVENT UPLOAD */}
        {activeTab === 'tickets' && (
          <div className="space-y-6">
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
              <div className="relative w-full sm:w-72">
                <Search className="w-4 h-4 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  placeholder="Search events or tickets..."
                  value={eventSearch}
                  onChange={(e) => setEventSearch(e.target.value)}
                  className="w-full pl-9 pr-3 py-2 dark:bg-slate-900 bg-gray-100 border dark:border-slate-800 border-gray-300 rounded-xl text-xs dark:text-white text-black placeholder-slate-500 focus:outline-none focus:border-emerald-500"
                />
              </div>

              <button
                onClick={() => setIsUploadModalOpen(true)}
                className="w-full sm:w-auto px-4 py-2 bg-emerald-600 hover:bg-emerald-500 dark:text-white text-black font-semibold rounded-xl text-xs transition-all flex items-center justify-center gap-2"
              >
                <PlusCircle className="w-4 h-4" />
                <span>Upload & Publish Ticket</span>
              </button>
            </div>

            {/* Events Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {eventsList
                .filter((e) => {
                  if (!eventSearch.trim()) return true;
                  const q = eventSearch.toLowerCase();
                  return e.title?.toLowerCase().includes(q) || e.artist?.toLowerCase().includes(q);
                })
                .map((event) => (
                  <div
                    key={event.id}
                    className="dark:bg-slate-900 bg-gray-100 border dark:border-slate-800 border-gray-300 rounded-2xl p-4 flex flex-col justify-between hover:border-slate-700 transition-all"
                  >
                    <div>
                      <div className="relative h-36 w-full rounded-xl overflow-hidden mb-3 dark:bg-slate-950 bg-white">
                        <Image
                          src={event.image}
                          alt={event.title}
                          fill
                          className="object-cover"
                          unoptimized
                        />
                        {event.uploadedByAdmin && (
                          <span className="absolute top-2 left-2 px-2 py-0.5 rounded bg-emerald-600 dark:text-white text-black text-[10px] font-bold shadow">
                            Admin Uploaded
                          </span>
                        )}
                        <span className="absolute bottom-2 right-2 px-2 py-0.5 rounded dark:bg-slate-950 bg-white/80 dark:text-white text-black text-[10px] font-semibold border dark:border-slate-800 border-gray-300">
                          {event.category?.toUpperCase()}
                        </span>
                      </div>

                      <h4 className="font-bold dark:text-white text-black text-sm line-clamp-1">{event.title}</h4>
                      <p className="text-xs dark:text-slate-400 text-gray-600 mt-0.5">{event.artist} · {event.venue}, {event.city}</p>
                      <p className="text-[11px] text-slate-500 mt-1">Date: {event.date} · {event.time}</p>
                    </div>

                    <div className="pt-4 border-t dark:border-slate-800 border-gray-300/80 mt-3 flex items-center justify-between">
                      <span className="text-sm font-bold text-emerald-400">${event.priceFrom}+</span>

                      <div className="flex gap-2">
                        <button
                          onClick={() => handleEditEventClick(event)}
                          className="px-2.5 py-1 bg-blue-500/10 hover:bg-blue-500/20 text-blue-400 border border-blue-500/30 rounded-lg text-[11px] font-semibold transition-colors flex items-center gap-1"
                        >
                          <span>Edit</span>
                        </button>
                        <button
                          onClick={() => handleDeleteEvent(event.id)}
                          className="px-2.5 py-1 bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 border border-rose-500/30 rounded-lg text-[11px] font-semibold transition-colors flex items-center gap-1"
                        >
                          <Trash2 className="w-3 h-3" />
                          <span>Delete</span>
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
            </div>
          </div>
        )}

        {/* TAB 4: ORDERS */}
        {activeTab === 'orders' && (
          <div className="space-y-6">
            <div className="relative w-full sm:w-72">
              <Search className="w-4 h-4 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Search order ID or customer email..."
                value={orderSearch}
                onChange={(e) => setOrderSearch(e.target.value)}
                className="w-full pl-9 pr-3 py-2 dark:bg-slate-900 bg-gray-100 border dark:border-slate-800 border-gray-300 rounded-xl text-xs dark:text-white text-black placeholder-slate-500 focus:outline-none focus:border-emerald-500"
              />
            </div>

            <div className="dark:bg-slate-900 bg-gray-100 border dark:border-slate-800 border-gray-300 rounded-2xl overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs dark:text-slate-300 text-gray-700">
                  <thead className="dark:bg-slate-950 bg-white/80 dark:text-slate-400 text-gray-600 font-semibold border-b dark:border-slate-800 border-gray-300">
                    <tr>
                      <th className="p-3.5">Order Ref ID</th>
                      <th className="p-3.5">Customer Email</th>
                      <th className="p-3.5">Total Amount</th>
                      <th className="p-3.5">Payment Status</th>
                      <th className="p-3.5">Order Timestamp</th>
                      <th className="p-3.5 text-right">View Ticket</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-800/60">
                    {ordersList.length === 0 ? (
                      <tr>
                        <td colSpan="6" className="p-8 text-center text-slate-500">
                          No customer orders found in database yet.
                        </td>
                      </tr>
                    ) : (
                      ordersList
                        .filter((o) => {
                          if (!orderSearch.trim()) return true;
                          const q = orderSearch.toLowerCase();
                          return (
                            o.orderId?.toLowerCase().includes(q) ||
                            o.id?.toLowerCase().includes(q) ||
                            o.customerInfo?.email?.toLowerCase().includes(q)
                          );
                        })
                        .map((o) => (
                          <tr key={o.orderId || o.id} className="hover:bg-slate-800/40 transition-colors">
                            <td className="p-3.5 font-bold dark:text-white text-black">#{o.orderId || o.id}</td>
                            <td className="p-3.5">{o.customerInfo?.email || o.email || 'customer@ticketx.com'}</td>
                            <td className="p-3.5 font-bold text-emerald-400">${o.total || o.paymentSummary?.total || 0}</td>
                            <td className="p-3.5">
                              <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-500/10 text-emerald-400 border border-emerald-500/30">
                                {o.status || 'CONFIRMED'}
                              </span>
                            </td>
                            <td className="p-3.5 dark:text-slate-400 text-gray-600">{o.createdAt || 'Recent'}</td>
                            <td className="p-3.5 text-right">
                              <button
                                onClick={() => setSelectedOrder(o)}
                                className="px-2.5 py-1 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-lg text-[11px] font-medium transition-colors flex items-center gap-1 inline-flex"
                              >
                                <Eye className="w-3 h-3 text-emerald-400" />
                                <span>Details</span>
                              </button>
                            </td>
                          </tr>
                        ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* TAB 5: ADMIN SETTINGS */}
        {activeTab === 'settings' && (
          <div className="max-w-xl space-y-6">
            <div className="dark:bg-slate-900 bg-gray-100 border dark:border-slate-800 border-gray-300 rounded-2xl p-6">
              <h3 className="text-sm font-bold dark:text-white text-black mb-4">Admin Profile Details</h3>
              <div className="space-y-4 text-xs">
                <div>
                  <label className="block dark:text-slate-400 text-gray-600 mb-1">Admin Full Name</label>
                  <input
                    type="text"
                    readOnly
                    value={activeAdmin?.name || 'Super Admin'}
                    className="w-full px-3 py-2 dark:bg-slate-950 bg-white border dark:border-slate-800 border-gray-300 rounded-lg dark:text-white text-black font-semibold"
                  />
                </div>
                <div>
                  <label className="block dark:text-slate-400 text-gray-600 mb-1">Admin Authorized Email</label>
                  <input
                    type="email"
                    readOnly
                    value={activeAdmin?.email || 'admin@ticketx.com'}
                    className="w-full px-3 py-2 dark:bg-slate-950 bg-white border dark:border-slate-800 border-gray-300 rounded-lg dark:text-white text-black font-semibold"
                  />
                </div>
                <div>
                  <label className="block dark:text-slate-400 text-gray-600 mb-1">Role & Privilege Level</label>
                  <span className="inline-block px-2.5 py-1 bg-rose-500/20 text-rose-400 rounded text-xs font-bold border border-rose-500/30">
                    Super Admin (Unrestricted Access)
                  </span>
                </div>
              </div>
            </div>
          </div>
        )}
      </main>

      {/* MODAL: UPLOAD NEW TICKET */}
      {isUploadModalOpen && (
        <div className="fixed inset-0 z-50 dark:bg-slate-950 bg-white/80 backdrop-blur-md flex items-center justify-center p-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="w-full max-w-2xl dark:bg-slate-900 bg-gray-100 border dark:border-slate-800 border-gray-300 rounded-2xl p-6 max-h-[90vh] overflow-y-auto"
          >
            <div className="flex items-center justify-between pb-4 border-b dark:border-slate-800 border-gray-300 mb-4">
              <h3 className="text-lg font-bold dark:text-white text-black flex items-center gap-2">
                <Ticket className="w-5 h-5 text-emerald-400" />
                <span>Upload & Publish New Ticket Event</span>
              </h3>
              <button
                onClick={() => setIsUploadModalOpen(false)}
                className="dark:text-slate-400 text-gray-600 hover:dark:text-white text-black text-sm"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleCreateTicket} className="space-y-4 text-xs">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block dark:text-slate-300 text-gray-700 font-semibold mb-1">Event Title *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Atif Aslam Live Concert"
                    value={newTicket.title}
                    onChange={(e) => setNewTicket({ ...newTicket, title: e.target.value })}
                    className="w-full px-3 py-2 dark:bg-slate-950 bg-white border dark:border-slate-800 border-gray-300 rounded-lg dark:text-white text-black placeholder-slate-600 focus:outline-none focus:border-emerald-500"
                  />
                </div>

                <div>
                  <label className="block dark:text-slate-300 text-gray-700 font-semibold mb-1">Artist / Organizer *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Atif Aslam"
                    value={newTicket.artist}
                    onChange={(e) => setNewTicket({ ...newTicket, artist: e.target.value })}
                    className="w-full px-3 py-2 dark:bg-slate-950 bg-white border dark:border-slate-800 border-gray-300 rounded-lg dark:text-white text-black placeholder-slate-600 focus:outline-none focus:border-emerald-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="block dark:text-slate-300 text-gray-700 font-semibold mb-1">Category</label>
                  <select
                    value={newTicket.category}
                    onChange={(e) => setNewTicket({ ...newTicket, category: e.target.value })}
                    className="w-full px-3 py-2 dark:bg-slate-950 bg-white border dark:border-slate-800 border-gray-300 rounded-lg dark:text-white text-black focus:outline-none focus:border-emerald-500"
                  >
                    <option value="concerts">Concerts</option>
                    <option value="sports">Sports</option>
                    <option value="arts-theater">Theater & Arts</option>
                    <option value="comedy">Comedy</option>
                    <option value="family">Family</option>
                  </select>
                </div>

                <div>
                  <label className="block dark:text-slate-300 text-gray-700 font-semibold mb-1">City</label>
                  <input
                    type="text"
                    value={newTicket.city}
                    onChange={(e) => setNewTicket({ ...newTicket, city: e.target.value })}
                    className="w-full px-3 py-2 dark:bg-slate-950 bg-white border dark:border-slate-800 border-gray-300 rounded-lg dark:text-white text-black focus:outline-none focus:border-emerald-500"
                  />
                </div>

                <div>
                  <label className="block dark:text-slate-300 text-gray-700 font-semibold mb-1">Venue Name *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Gaddafi Stadium"
                    value={newTicket.venue}
                    onChange={(e) => setNewTicket({ ...newTicket, venue: e.target.value })}
                    className="w-full px-3 py-2 dark:bg-slate-950 bg-white border dark:border-slate-800 border-gray-300 rounded-lg dark:text-white text-black placeholder-slate-600 focus:outline-none focus:border-emerald-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="block dark:text-slate-300 text-gray-700 font-semibold mb-1">Date</label>
                  <input
                    type="date"
                    value={newTicket.date}
                    onChange={(e) => setNewTicket({ ...newTicket, date: e.target.value })}
                    className="w-full px-3 py-2 dark:bg-slate-950 bg-white border dark:border-slate-800 border-gray-300 rounded-lg dark:text-white text-black focus:outline-none focus:border-emerald-500"
                  />
                </div>

                <div>
                  <label className="block dark:text-slate-300 text-gray-700 font-semibold mb-1">Time</label>
                  <input
                    type="text"
                    value={newTicket.time}
                    onChange={(e) => setNewTicket({ ...newTicket, time: e.target.value })}
                    className="w-full px-3 py-2 dark:bg-slate-950 bg-white border dark:border-slate-800 border-gray-300 rounded-lg dark:text-white text-black focus:outline-none focus:border-emerald-500"
                  />
                </div>

                <div>
                  <label className="block dark:text-slate-300 text-gray-700 font-semibold mb-1">Starting Price ($)</label>
                  <input
                    type="number"
                    value={newTicket.priceFrom}
                    onChange={(e) => setNewTicket({ ...newTicket, priceFrom: e.target.value })}
                    className="w-full px-3 py-2 dark:bg-slate-950 bg-white border dark:border-slate-800 border-gray-300 rounded-lg dark:text-white text-black focus:outline-none focus:border-emerald-500"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="block dark:text-slate-300 text-gray-700 font-semibold mb-1">Cover Image (URL or Upload)</label>
                <input
                  type="text"
                  placeholder="https://images.unsplash.com/..."
                  value={newTicket.image}
                  onChange={(e) => setNewTicket({ ...newTicket, image: e.target.value })}
                  className="w-full px-3 py-2 dark:bg-slate-950 bg-white border dark:border-slate-800 border-gray-300 rounded-lg dark:text-white text-black placeholder-slate-600 focus:outline-none focus:border-emerald-500 mb-2"
                />
                <div className="flex items-center gap-2">
                  <span className="text-xs dark:text-slate-500 text-gray-500">OR</span>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => {
                      const file = e.target.files[0];
                      if (file) {
                        const reader = new FileReader();
                        reader.onloadend = () => {
                          setNewTicket({ ...newTicket, image: reader.result });
                        };
                        reader.readAsDataURL(file);
                      }
                    }}
                    className="flex-1 px-3 py-2 text-sm dark:bg-slate-950 bg-white border dark:border-slate-800 border-gray-300 rounded-lg dark:text-white text-black file:mr-4 file:py-1 file:px-3 file:rounded-full file:border-0 file:text-xs file:font-semibold file:bg-emerald-50 file:text-emerald-700 hover:file:bg-emerald-100 transition-all"
                  />
                </div>
              </div>

              <div>
                <label className="block dark:text-slate-300 text-gray-700 font-semibold mb-1">Description</label>
                <textarea
                  rows="3"
                  placeholder="Write details about the event..."
                  value={newTicket.description}
                  onChange={(e) => setNewTicket({ ...newTicket, description: e.target.value })}
                  className="w-full px-3 py-2 dark:bg-slate-950 bg-white border dark:border-slate-800 border-gray-300 rounded-lg dark:text-white text-black placeholder-slate-600 focus:outline-none focus:border-emerald-500"
                />
              </div>

              <div className="pt-4 flex items-center justify-end gap-3 border-t dark:border-slate-800 border-gray-300">
                <button
                  type="button"
                  onClick={() => setIsUploadModalOpen(false)}
                  className="px-4 py-2 bg-slate-800 hover:bg-slate-700 dark:text-slate-300 text-gray-700 rounded-xl text-xs font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-emerald-600 hover:bg-emerald-500 dark:text-white text-black font-semibold rounded-xl text-xs shadow-lg shadow-emerald-600/20"
                >
                  Publish Ticket Event Live
                </button>
              </div>
            </form>
          </motion.div>
        </div>
      )}

      {/* MODAL: ORDER DETAILS */}
      {selectedOrder && (
        <div className="fixed inset-0 z-50 dark:bg-slate-950 bg-white/80 backdrop-blur-md flex items-center justify-center p-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="w-full max-w-lg dark:bg-slate-900 bg-gray-100 border dark:border-slate-800 border-gray-300 rounded-2xl p-6"
          >
            <div className="flex items-center justify-between pb-4 border-b dark:border-slate-800 border-gray-300 mb-4">
              <h3 className="text-base font-bold dark:text-white text-black">
                Order #{selectedOrder.orderId || selectedOrder.id} Details
              </h3>
              <button onClick={() => setSelectedOrder(null)} className="dark:text-slate-400 text-gray-600 hover:dark:text-white text-black">
                ✕
              </button>
            </div>

            <div className="space-y-3 text-xs dark:text-slate-300 text-gray-700">
              <p><strong className="dark:text-white text-black">Customer:</strong> {selectedOrder.customerInfo?.name || 'Customer'}</p>
              <p><strong className="dark:text-white text-black">Email:</strong> {selectedOrder.customerInfo?.email || 'N/A'}</p>
              <p><strong className="dark:text-white text-black">Total Amount Paid:</strong> <span className="text-emerald-400 font-bold">${selectedOrder.total || selectedOrder.paymentSummary?.total || 0}</span></p>
              <p><strong className="dark:text-white text-black">Status:</strong> {selectedOrder.status || 'CONFIRMED'}</p>
            </div>

            <div className="pt-4 border-t dark:border-slate-800 border-gray-300 mt-4 text-right">
              <button
                onClick={() => setSelectedOrder(null)}
                className="px-4 py-2 bg-slate-800 hover:bg-slate-700 dark:text-white text-black rounded-xl text-xs font-semibold"
              >
                Close
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  );
}
