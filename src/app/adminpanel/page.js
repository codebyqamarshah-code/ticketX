'use client';

import React, { useState, useEffect, useCallback, useMemo } from 'react';
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
  EyeOff,
  Loader2,
  AlertTriangle,
  ArrowUpRight,
  TrendingUp,
  ArrowLeft,
  KeyRound,
  Download,
  Filter,
  RefreshCw,
  Edit3,
  Copy,
  Clock,
  MapPin,
  Sparkles,
  Layers,
  ChevronLeft,
  ChevronRight,
  AlertCircle,
  X,
  CreditCard,
  FileSpreadsheet,
  Check,
  Activity,
  Printer,
  Send,
  Smartphone,
  Globe,
  History,
  Ban
} from 'lucide-react';
import ThemeToggle from '@/components/ui/ThemeToggle';
import OtpInput from '@/components/ui/OtpInput';
import Logo from '@/components/ui/Logo';

const CATEGORIES = [
  { id: 'concerts', label: 'Concerts' },
  { id: 'sports', label: 'Sports' },
  { id: 'arts-theater', label: 'Theater & Arts' },
  { id: 'comedy', label: 'Comedy' },
  { id: 'family', label: 'Family' }
];

const TIMEZONES = [
  { value: 'America/New_York', label: 'Eastern Time (US & Canada - EST/EDT)' },
  { value: 'America/Chicago', label: 'Central Time (US & Canada - CST/CDT)' },
  { value: 'America/Denver', label: 'Mountain Time (US & Canada - MST/MDT)' },
  { value: 'America/Los_Angeles', label: 'Pacific Time (US & Canada - PST/PDT)' },
  { value: 'Europe/London', label: 'London / Greenwich (GMT/BST)' },
  { value: 'Europe/Paris', label: 'Central European Time (CET/CEST)' },
  { value: 'Asia/Karachi', label: 'Pakistan Standard Time (PKT)' },
  { value: 'Asia/Dubai', label: 'Gulf Standard Time (GST)' }
];

export default function AdminPanelPage() {
  // -------------------------------------------------------------
  // AUTHENTICATION & PORTAL STATE
  // -------------------------------------------------------------
  const [activeAdmin, setActiveAdmin] = useState(null);
  const [isAdminLoggedIn, setIsAdminLoggedIn] = useState(false);
  const [authStep, setAuthStep] = useState('loading'); // 'loading', 'setup', 'login', 'otp', 'forgot-email', 'forgot-otp', 'forgot-new-password', 'dashboard'
  const [otpEmail, setOtpEmail] = useState('');

  // Auth Forms
  const [regForm, setRegForm] = useState({ name: '', email: '', password: '', confirmPassword: '' });
  const [loginForm, setLoginForm] = useState({ email: '', password: '' });
  const [authError, setAuthError] = useState('');
  const [authSuccess, setAuthSuccess] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isLoginSuccess, setIsLoginSuccess] = useState(false);
  const [showSetupPassword, setShowSetupPassword] = useState(false);
  const [showSetupConfirmPassword, setShowSetupConfirmPassword] = useState(false);
  const [showLoginPassword, setShowLoginPassword] = useState(false);

  // OTP & Cooldown
  const [otpCode, setOtpCode] = useState('');
  const [resendCooldown, setResendCooldown] = useState(0);

  // Forgot Password flow
  const [forgotEmail, setForgotEmail] = useState('');
  const [forgotOtp, setForgotOtp] = useState('');
  const [forgotNewPassword, setForgotNewPassword] = useState('');
  const [forgotConfirmPassword, setForgotConfirmPassword] = useState('');
  const [showForgotNewPassword, setShowForgotNewPassword] = useState(false);
  const [showForgotConfirmPassword, setShowForgotConfirmPassword] = useState(false);

  // Toast System
  const [toast, setToast] = useState({ show: false, message: '', type: 'success' });
  const showToast = useCallback((message, type = 'success') => {
    setToast({ show: true, message, type });
    setTimeout(() => setToast({ show: false, message: '', type: 'success' }), 4000);
  }, []);

  // Cooldown countdown
  useEffect(() => {
    if (resendCooldown <= 0) return;
    const interval = setInterval(() => {
      setResendCooldown((prev) => (prev > 0 ? prev - 1 : 0));
    }, 1000);
    return () => clearInterval(interval);
  }, [resendCooldown]);

  // Initial Auth Check
  useEffect(() => {
    async function checkAuth() {
      try {
        const meRes = await fetch('/api/auth/me');
        const meData = await meRes.json();

        if (meData.success && meData.user && meData.user.role === 'super_admin') {
          setActiveAdmin(meData.user);
          setIsAdminLoggedIn(true);
          setAuthStep('dashboard');
          return;
        }

        const statusRes = await fetch('/api/admin/status');
        const statusData = await statusRes.json();

        if (statusData.isSetup) {
          setAuthStep('login');
        } else {
          setAuthStep('setup');
        }
      } catch (err) {
        console.error(err);
        setAuthStep('login');
      }
    }
    checkAuth();
  }, []);

  // -------------------------------------------------------------
  // DASHBOARD DATA & TAB STATE
  // -------------------------------------------------------------
  const [activeTab, setActiveTab] = useState('overview'); // 'overview', 'users', 'tickets', 'orders', 'settings'

  // Overview & Analytics Data
  const [analyticsRange, setAnalyticsRange] = useState('all'); // 'today', '7d', '30d', 'all'
  const [overviewMetrics, setOverviewMetrics] = useState(null);
  const [topEvents, setTopEvents] = useState([]);
  const [recentOrdersList, setRecentOrdersList] = useState([]);
  const [recentAuditLogs, setRecentAuditLogs] = useState([]);
  const [isLoadingAnalytics, setIsLoadingAnalytics] = useState(false);

  // Users Data
  const [usersList, setUsersList] = useState([]);
  const [usersStats, setUsersStats] = useState({ totalRegistered: 0, totalActive: 0, totalSuspended: 0 });
  const [userSearch, setUserSearch] = useState('');
  const [userStatusFilter, setUserStatusFilter] = useState('All');
  const [userSortBy, setUserSortBy] = useState('newest');
  const [userPage, setUserPage] = useState(1);
  const [userLimit, setUserLimit] = useState(10);
  const [userPagination, setUserPagination] = useState({ totalPages: 1, total: 0 });
  const [isLoadingUsers, setIsLoadingUsers] = useState(false);
  const [selectedUserDetails, setSelectedUserDetails] = useState(null);
  const [isUserDrawerOpen, setIsUserDrawerOpen] = useState(false);

  // Events Data
  const [eventsList, setEventsList] = useState([]);
  const [eventsStats, setEventsStats] = useState({ totalEvents: 0, publishedCount: 0, draftCount: 0, soldOutCount: 0 });
  const [eventSearch, setEventSearch] = useState('');
  const [eventCategoryFilter, setEventCategoryFilter] = useState('all');
  const [eventStatusFilter, setEventStatusFilter] = useState('all');
  const [eventSortBy, setEventSortBy] = useState('newest');
  const [eventViewMode, setEventViewMode] = useState('grid'); // 'grid' | 'list'
  const [eventPage, setEventPage] = useState(1);
  const [eventLimit, setEventLimit] = useState(50);
  const [eventPagination, setEventPagination] = useState({ totalPages: 1, total: 0 });
  const [isLoadingEvents, setIsLoadingEvents] = useState(false);

  // Event Wizard & Preview
  const [isWizardOpen, setIsWizardOpen] = useState(false);
  const [wizardStep, setWizardStep] = useState(1); // 1: Details, 2: Ticket Tiers, 3: Review & Publish
  const [editingEventId, setEditingEventId] = useState(null);
  const [isSavingEvent, setIsSavingEvent] = useState(false);
  const [eventPreviewModal, setEventPreviewModal] = useState(null);

  // Event Wizard Form State
  const initialEventForm = {
    title: '',
    artist: '',
    category: 'concerts',
    subcategory: 'Live Show',
    description: '',
    city: 'Los Angeles',
    venue: '',
    venueAddress: '',
    date: '2026-11-20',
    time: '07:30 PM',
    endTime: '11:00 PM',
    timezone: 'America/New_York',
    image: '',
    currency: 'USD',
    status: 'Published',
    ticketTypes: [
      {
        id: 'tt-ga-1',
        name: 'General Admission',
        description: 'Standard access to general floor and seating area.',
        price: 55,
        totalQuantity: 250,
        availableQuantity: 250,
        maxPerCustomer: 8,
        section: 'General Floor',
        status: 'Available'
      },
      {
        id: 'tt-vip-2',
        name: 'VIP Front Stage Experience',
        description: 'Priority fast-track entry, VIP lounge access & front row view.',
        price: 160,
        totalQuantity: 50,
        availableQuantity: 50,
        maxPerCustomer: 4,
        section: 'VIP Golden Circle',
        status: 'Available'
      }
    ]
  };
  const [eventForm, setEventForm] = useState(initialEventForm);
  const [wizardErrors, setWizardErrors] = useState({});

  // -------------------------------------------------------------
  // ORDERS & BOOKINGS DATA & STATES
  // -------------------------------------------------------------
  const [ordersList, setOrdersList] = useState([]);
  const [ordersStats, setOrdersStats] = useState({
    totalOrders: 0,
    confirmedOrders: 0,
    pendingPayments: 0,
    failedPayments: 0,
    cancelledOrders: 0,
    totalTicketQuantitySold: 0,
    grossSales: 0,
    refundedCount: 0,
    refundedAmount: 0,
    netRevenue: 0
  });
  const [orderSearch, setOrderSearch] = useState('');
  const [orderPaymentStatusFilter, setOrderPaymentStatusFilter] = useState('all');
  const [orderBookingStatusFilter, setOrderBookingStatusFilter] = useState('all');
  const [orderEventFilter, setOrderEventFilter] = useState('all');
  const [orderDateFrom, setOrderDateFrom] = useState('');
  const [orderDateTo, setOrderDateTo] = useState('');
  const [orderSortBy, setOrderSortBy] = useState('newest'); // 'newest', 'oldest', 'amountHigh', 'amountLow'
  const [orderPage, setOrderPage] = useState(1);
  const [orderLimit, setOrderLimit] = useState(15);
  const [orderPagination, setOrderPagination] = useState({ totalPages: 1, total: 0 });
  const [isLoadingOrders, setIsLoadingOrders] = useState(false);
  const [ordersError, setOrdersError] = useState(null);
  const [selectedOrderDetails, setSelectedOrderDetails] = useState(null);
  const [isResendingEmail, setIsResendingEmail] = useState(false);

  // -------------------------------------------------------------
  // ADMIN PROFILE & SETTINGS DATA & STATES
  // -------------------------------------------------------------
  const [adminProfileData, setAdminProfileData] = useState(null);
  const [adminActivityLogs, setAdminActivityLogs] = useState([]);
  const [isLoadingProfile, setIsLoadingProfile] = useState(false);
  const [profileError, setProfileError] = useState(null);

  // Edit Profile Form
  const [isEditingProfile, setIsEditingProfile] = useState(false);
  const [profileForm, setProfileForm] = useState({ firstName: '', lastName: '', phone: '', city: '', country: '' });
  const [isSavingProfile, setIsSavingProfile] = useState(false);

  // Change Password Form
  const [passwordForm, setPasswordForm] = useState({ currentPassword: '', newPassword: '', confirmPassword: '' });
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmNewPassword, setShowConfirmNewPassword] = useState(false);
  const [isSavingPassword, setIsSavingPassword] = useState(false);

  // Change Email 2-Step Flow
  const [isChangeEmailModalOpen, setIsChangeEmailModalOpen] = useState(false);
  const [changeEmailStep, setChangeEmailStep] = useState(1); // 1: input, 2: verify otp
  const [newEmailInput, setNewEmailInput] = useState('');
  const [emailOtpInput, setEmailOtpInput] = useState('');
  const [isEmailChangeLoading, setIsEmailChangeLoading] = useState(false);
  const [emailChangeError, setEmailChangeError] = useState('');

  // Universal Confirmation Dialog
  const [confirmModal, setConfirmModal] = useState({
    isOpen: false,
    title: '',
    message: '',
    actionText: '',
    variant: 'danger', // 'danger' | 'warning' | 'primary'
    onConfirm: null,
    isLoading: false
  });

  // -------------------------------------------------------------
  // DATA FETCHING FUNCTIONS (API SOURCE OF TRUTH)
  // -------------------------------------------------------------
  const fetchAnalytics = useCallback(async (range = analyticsRange) => {
    setIsLoadingAnalytics(true);
    try {
      const res = await fetch(`/api/admin/analytics?range=${range}`);
      const data = await res.json();
      if (data.success) {
        setOverviewMetrics(data.overview);
        setTopEvents(data.topSellingEvents || []);
        setRecentOrdersList(data.recentOrders || []);
        setRecentAuditLogs(data.recentActivities || []);
      }
    } catch (err) {
      console.error('Analytics error:', err);
    } finally {
      setIsLoadingAnalytics(false);
    }
  }, [analyticsRange]);

  const fetchUsers = useCallback(async () => {
    setIsLoadingUsers(true);
    try {
      const params = new URLSearchParams({
        page: userPage.toString(),
        limit: userLimit.toString(),
        status: userStatusFilter,
        sortBy: userSortBy
      });
      if (userSearch.trim()) params.append('search', userSearch.trim());

      const res = await fetch(`/api/admin/users?${params.toString()}`);
      const data = await res.json();
      if (data.success) {
        setUsersList(data.users || []);
        setUsersStats(data.stats || { totalRegistered: 0, totalActive: 0, totalSuspended: 0 });
        setUserPagination(data.pagination || { totalPages: 1, total: 0 });
      }
    } catch (err) {
      console.error('Users fetch error:', err);
    } finally {
      setIsLoadingUsers(false);
    }
  }, [userPage, userLimit, userStatusFilter, userSortBy, userSearch]);

  const fetchEvents = useCallback(async () => {
    setIsLoadingEvents(true);
    try {
      const params = new URLSearchParams({
        page: eventPage.toString(),
        limit: eventLimit.toString(),
        category: eventCategoryFilter,
        status: eventStatusFilter,
        sortBy: eventSortBy
      });
      if (eventSearch.trim()) params.append('search', eventSearch.trim());

      const res = await fetch(`/api/admin/events?${params.toString()}`);
      const data = await res.json();
      if (data.success) {
        setEventsList(data.events || []);
        setEventsStats(data.stats || { totalEvents: 0, publishedCount: 0, draftCount: 0, soldOutCount: 0 });
        setEventPagination(data.pagination || { totalPages: 1, total: 0 });
      }
    } catch (err) {
      console.error('Events fetch error:', err);
    } finally {
      setIsLoadingEvents(false);
    }
  }, [eventPage, eventLimit, eventCategoryFilter, eventStatusFilter, eventSortBy, eventSearch]);

  const fetchOrders = useCallback(async () => {
    setIsLoadingOrders(true);
    setOrdersError(null);
    try {
      const params = new URLSearchParams({
        page: orderPage.toString(),
        limit: orderLimit.toString(),
        status: orderBookingStatusFilter,
        paymentStatus: orderPaymentStatusFilter,
        sortBy: orderSortBy
      });
      if (orderSearch.trim()) params.append('search', orderSearch.trim());
      if (orderEventFilter !== 'all') params.append('event', orderEventFilter);
      if (orderDateFrom) params.append('dateFrom', orderDateFrom);
      if (orderDateTo) params.append('dateTo', orderDateTo);

      const res = await fetch(`/api/admin/orders?${params.toString()}`);
      const data = await res.json();

      if (data.success) {
        setOrdersList(data.orders || []);
        setOrdersStats(data.stats || {
          totalOrders: 0,
          confirmedOrders: 0,
          pendingPayments: 0,
          failedPayments: 0,
          cancelledOrders: 0,
          totalTicketQuantitySold: 0,
          grossSales: 0,
          refundedCount: 0,
          refundedAmount: 0,
          netRevenue: 0
        });
        setOrderPagination(data.pagination || { totalPages: 1, total: 0 });
      } else {
        setOrdersError(data.message || 'Failed to retrieve orders from database.');
      }
    } catch (err) {
      console.error('Orders fetch error:', err);
      setOrdersError('Failed to connect to the orders database API. Please check network connection.');
    } finally {
      setIsLoadingOrders(false);
    }
  }, [orderPage, orderLimit, orderBookingStatusFilter, orderPaymentStatusFilter, orderEventFilter, orderSortBy, orderSearch, orderDateFrom, orderDateTo]);

  const fetchAdminProfile = useCallback(async () => {
    setIsLoadingProfile(true);
    setProfileError(null);
    try {
      const res = await fetch('/api/admin/profile');
      const data = await res.json();
      if (data.success) {
        setAdminProfileData(data.profile);
        setAdminActivityLogs(data.recentLogs || []);
        setProfileForm({
          firstName: data.profile.firstName || '',
          lastName: data.profile.lastName || '',
          phone: data.profile.phone || '',
          city: data.profile.city || '',
          country: data.profile.country || 'USA'
        });
      } else {
        setProfileError(data.message || 'Failed to load profile details.');
      }
    } catch (err) {
      setProfileError('Failed to retrieve profile. Check connection.');
    } finally {
      setIsLoadingProfile(false);
    }
  }, []);

  // Synchronize Tab Changes
  useEffect(() => {
    if (isAdminLoggedIn) {
      if (activeTab === 'overview') fetchAnalytics();
      if (activeTab === 'users') fetchUsers();
      if (activeTab === 'tickets') fetchEvents();
      if (activeTab === 'orders') fetchOrders();
      if (activeTab === 'settings') fetchAdminProfile();
    }
  }, [isAdminLoggedIn, activeTab, fetchAnalytics, fetchUsers, fetchEvents, fetchOrders, fetchAdminProfile]);

  // -------------------------------------------------------------
  // AUTHENTICATION HANDLERS
  // -------------------------------------------------------------
  const handleSetupAdmin = async (e) => {
    e.preventDefault();
    setAuthError('');
    setAuthSuccess('');

    if (regForm.password !== regForm.confirmPassword) {
      setAuthError('Passwords do not match.');
      return;
    }
    if (regForm.password.length < 8) {
      setAuthError('Password must be at least 8 characters long.');
      return;
    }
    const specialCharRegex = /[!@#$%^&*(),.?":{}|<>_~`\-+=/\\[\]]/;
    if (!specialCharRegex.test(regForm.password)) {
      setAuthError('Password must contain at least one special character (!@#$%^&* etc.).');
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
          showToast('Super Admin setup verified. Please sign in.', 'success');
        } else {
          setOtpEmail(regForm.email.trim());
          setOtpCode('');
          setResendCooldown(60);
          setAuthStep('otp');
          showToast('Verification code sent to your email!');
        }
      } else {
        setAuthError(data.message || 'Setup initialization failed.');
      }
    } catch (err) {
      setIsLoading(false);
      setAuthError('Network error. Please try again.');
    }
  };

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

      if (data.success) {
        setIsLoginSuccess(true);
        setAuthSuccess(`Super Admin authorization granted! Opening portal...`);
        setActiveAdmin(data.user);

        setTimeout(() => {
          setIsAdminLoggedIn(true);
          setAuthStep('dashboard');
          showToast(`Welcome back, ${data.user.firstName || 'Super Admin'}!`);
          setIsLoading(false);
          setIsLoginSuccess(false);
        }, 550);
      } else if (data.unverified) {
        setIsLoading(false);
        setOtpEmail(loginForm.email.trim());
        setOtpCode('');
        setResendCooldown(60);

        await fetch('/api/auth/resend-otp', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ email: loginForm.email.trim() })
        });

        setAuthStep('otp');
      } else {
        setIsLoading(false);
        setAuthError(data.message || 'Invalid Super Admin credentials.');
      }
    } catch (err) {
      setIsLoading(false);
      setAuthError('Authentication error. Please try again.');
    }
  };

  const handleVerifySetupOtp = async (e) => {
    e?.preventDefault();
    if (!otpCode || otpCode.length < 6) {
      setAuthError('Please enter all 6 digits of the verification code.');
      return;
    }
    setAuthError('');
    setIsLoading(true);
    try {
      const res = await fetch('/api/auth/verify-email', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: otpEmail, otp: otpCode })
      });
      const data = await res.json();
      setIsLoading(false);
      if (data.success) {
        setIsLoginSuccess(true);
        setAuthSuccess('Super Admin email verified! Accessing dashboard...');
        showToast('Super Admin email verified successfully!');
        setTimeout(async () => {
          const meRes = await fetch('/api/auth/me');
          const meData = await meRes.json();
          if (meData.success && meData.user && meData.user.role === 'super_admin') {
            setActiveAdmin(meData.user);
            setIsAdminLoggedIn(true);
            setAuthStep('dashboard');
          } else {
            setAuthStep('login');
          }
          setIsLoginSuccess(false);
          setIsLoading(false);
        }, 600);
      } else {
        setAuthError(data.message || 'Invalid verification code.');
      }
    } catch (err) {
      setIsLoading(false);
      setAuthError('Network error. Please try again.');
    }
  };

  const handleResendSetupOtp = async () => {
    if (isLoading || resendCooldown > 0) return;
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
        setAuthSuccess('Verification code resent successfully!');
        setResendCooldown(60);
      } else {
        setAuthError(data.message || 'Failed to resend code.');
      }
    } catch (err) {
      setIsLoading(false);
      setAuthError('Network error. Please try again.');
    }
  };

  const handleRequestForgotOtp = async (e) => {
    e?.preventDefault();
    setAuthError('');
    setAuthSuccess('');
    if (!forgotEmail) {
      setAuthError('Please enter your Super Admin email address.');
      return;
    }
    setIsLoading(true);
    try {
      const res = await fetch('/api/auth/forgot-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: forgotEmail.trim() })
      });
      const data = await res.json();
      setIsLoading(false);
      if (data.success) {
        setAuthSuccess(data.message || 'Reset code sent to your email.');
        setForgotOtp('');
        setResendCooldown(60);
        setAuthStep('forgot-otp');
      } else {
        setAuthError(data.message || 'Failed to send reset code.');
      }
    } catch (err) {
      setIsLoading(false);
      setAuthError('Network error. Please try again.');
    }
  };

  const handleVerifyForgotOtp = async (e) => {
    e?.preventDefault();
    setAuthError('');
    setAuthSuccess('');
    if (!forgotOtp || forgotOtp.length < 6) {
      setAuthError('Please enter the full 6-digit verification code.');
      return;
    }
    setIsLoading(true);
    try {
      const res = await fetch('/api/auth/verify-reset-otp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: forgotEmail.trim(), otp: forgotOtp.trim() })
      });
      const data = await res.json();
      setIsLoading(false);
      if (data.success) {
        setAuthSuccess('Code verified! Enter your new password below.');
        setAuthStep('forgot-new-password');
      } else {
        setAuthError(data.message || 'Invalid verification code.');
      }
    } catch (err) {
      setIsLoading(false);
      setAuthError('Network error. Please try again.');
    }
  };

  const handleResetPasswordSubmit = async (e) => {
    e?.preventDefault();
    setAuthError('');
    setAuthSuccess('');

    if (!forgotNewPassword) {
      setAuthError('Please enter a new password.');
      return;
    }
    if (forgotNewPassword.length < 8) {
      setAuthError('Password must be at least 8 characters long.');
      return;
    }
    const specialCharRegex = /[!@#$%^&*(),.?":{}|<>_~`\-+=/\\[\]]/;
    if (!specialCharRegex.test(forgotNewPassword)) {
      setAuthError('Password must contain at least one special character (!@#$%^&* etc.).');
      return;
    }
    if (forgotNewPassword !== forgotConfirmPassword) {
      setAuthError('Passwords do not match.');
      return;
    }

    setIsLoading(true);
    try {
      const res = await fetch('/api/auth/reset-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: forgotEmail.trim(),
          otp: forgotOtp.trim(),
          newPassword: forgotNewPassword
        })
      });
      const data = await res.json();
      setIsLoading(false);

      if (data.success) {
        showToast('Password updated successfully! Please sign in with your new password.');
        setAuthSuccess('Password updated successfully! Please sign in.');
        setLoginForm((prev) => ({ ...prev, email: forgotEmail.trim(), password: '' }));
        setForgotOtp('');
        setForgotNewPassword('');
        setForgotConfirmPassword('');
        setAuthStep('login');
      } else {
        setAuthError(data.message || 'Failed to update password.');
      }
    } catch (err) {
      setIsLoading(false);
      setAuthError('Network error. Please try again.');
    }
  };

  const handleLogout = async () => {
    try {
      await fetch('/api/auth/logout', { method: 'POST' });
    } catch (_) {}
    setIsAdminLoggedIn(false);
    setActiveAdmin(null);
    setAuthStep('login');
    showToast('Signed out of Super Admin Portal.');
  };

  // -------------------------------------------------------------
  // USER MANAGEMENT ACTIONS
  // -------------------------------------------------------------
  const handleOpenUserDetails = async (userId) => {
    try {
      const res = await fetch(`/api/admin/users?id=${userId}`);
      const data = await res.json();
      if (data.success && data.user) {
        setSelectedUserDetails(data.user);
        setIsUserDrawerOpen(true);
      } else {
        showToast('Could not load user details.', 'error');
      }
    } catch (err) {
      showToast('Failed to retrieve user profile.', 'error');
    }
  };

  const handleToggleUserStatus = (user) => {
    const isCurrentlySuspended = user.status === 'Suspended';
    const nextStatus = isCurrentlySuspended ? 'Active' : 'Suspended';

    setConfirmModal({
      isOpen: true,
      title: isCurrentlySuspended ? 'Reactivate User Account?' : 'Suspend User Account?',
      message: isCurrentlySuspended
        ? `Reactivating ${user.email} will restore their login access and ticket purchasing capabilities immediately.`
        : `Suspending ${user.email} will revoke their session on the server and strictly prevent them from logging in, checking out, or buying tickets.`,
      actionText: isCurrentlySuspended ? 'Reactivate Account' : 'Suspend Account',
      variant: isCurrentlySuspended ? 'primary' : 'warning',
      onConfirm: async () => {
        try {
          const res = await fetch('/api/admin/users', {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ userId: user._id || user.id, status: nextStatus })
          });
          const data = await res.json();
          if (data.success) {
            showToast(data.message);
            fetchUsers();
            if (selectedUserDetails && (selectedUserDetails._id === user._id || selectedUserDetails.id === user.id)) {
              setSelectedUserDetails((prev) => ({ ...prev, status: nextStatus }));
            }
          } else {
            showToast(data.message || 'Action failed.', 'error');
          }
        } catch (err) {
          showToast('Failed to update user status.', 'error');
        } finally {
          setConfirmModal((prev) => ({ ...prev, isOpen: false }));
        }
      }
    });
  };

  const handleDeleteUser = (user) => {
    setConfirmModal({
      isOpen: true,
      title: 'Permanently Deactivate User?',
      message: `Are you sure you want to delete user ${user.email}? If this user has order or booking history, their legal and financial records will be safely preserved while their login will be permanently disabled.`,
      actionText: 'Confirm Deactivation',
      variant: 'danger',
      onConfirm: async () => {
        try {
          const res = await fetch(`/api/admin/users?id=${user._id || user.id}`, {
            method: 'DELETE'
          });
          const data = await res.json();
          if (data.success) {
            showToast(data.message);
            fetchUsers();
            setIsUserDrawerOpen(false);
          } else {
            showToast(data.message || 'Failed to delete user.', 'error');
          }
        } catch (err) {
          showToast('Failed to delete user.', 'error');
        } finally {
          setConfirmModal((prev) => ({ ...prev, isOpen: false }));
        }
      }
    });
  };

  const handleExportUsersCsv = () => {
    const params = new URLSearchParams({
      export: 'csv',
      status: userStatusFilter,
      sortBy: userSortBy
    });
    if (userSearch.trim()) params.append('search', userSearch.trim());
    window.open(`/api/admin/users?${params.toString()}`, '_blank');
  };

  // -------------------------------------------------------------
  // EVENT & TICKET TIER MANAGEMENT ACTIONS
  // -------------------------------------------------------------
  const handleOpenCreateEventWizard = () => {
    setEditingEventId(null);
    setEventForm(initialEventForm);
    setWizardStep(1);
    setWizardErrors({});
    setIsWizardOpen(true);
  };

  const handleOpenEditEventWizard = (event) => {
    setEditingEventId(event.id || event._id);

    let ticketTypes = event.ticketTypes;
    if (!ticketTypes || ticketTypes.length === 0) {
      ticketTypes = [
        {
          id: `tt-${Date.now()}-ga`,
          name: 'General Admission',
          description: 'Standard event access',
          price: Number(event.priceFrom) || 50,
          totalQuantity: Number(event.availableSeats) || 200,
          availableQuantity: Number(event.availableSeats) || 200,
          maxPerCustomer: 8,
          section: 'General Floor',
          status: 'Available'
        }
      ];
    }

    setEventForm({
      title: event.title || '',
      artist: event.artist || '',
      category: event.category || 'concerts',
      subcategory: event.subcategory || '',
      description: event.description || '',
      city: event.city || '',
      venue: event.venue || '',
      venueAddress: event.venueAddress || '',
      date: event.date || '',
      time: event.time || '',
      endTime: event.endTime || '',
      timezone: event.timezone || 'America/New_York',
      image: event.image || '',
      currency: event.currency || 'USD',
      status: event.status || 'Published',
      ticketTypes
    });
    setWizardStep(1);
    setWizardErrors({});
    setIsWizardOpen(true);
  };

  const handleDuplicateEvent = (event) => {
    setEditingEventId(null);
    const clonedTicketTypes = (event.ticketTypes || []).map((t, idx) => ({
      ...t,
      id: `tt-copy-${Date.now()}-${idx}`
    }));

    setEventForm({
      ...event,
      title: `${event.title} (Copy)`,
      status: 'Draft',
      ticketTypes: clonedTicketTypes.length > 0 ? clonedTicketTypes : initialEventForm.ticketTypes
    });
    setWizardStep(1);
    setWizardErrors({});
    setIsWizardOpen(true);
    showToast(`Duplicated "${event.title}" as draft. Ready to review and publish.`);
  };

  const handleDeleteEvent = (event) => {
    setConfirmModal({
      isOpen: true,
      title: 'Delete Event Listing?',
      message: `Are you sure you want to delete "${event.title}"? This event will be archived from the public website and ticket box office.`,
      actionText: 'Delete Event',
      variant: 'danger',
      onConfirm: async () => {
        try {
          const res = await fetch(`/api/admin/events?id=${event.id || event._id}`, {
            method: 'DELETE'
          });
          const data = await res.json();
          if (data.success) {
            showToast(data.message);
            fetchEvents();

            if (typeof window !== 'undefined') {
              try {
                const deletedIds = JSON.parse(localStorage.getItem('ticketx-deleted-events') || '[]');
                if (!deletedIds.includes(event.id)) {
                  deletedIds.push(event.id);
                  localStorage.setItem('ticketx-deleted-events', JSON.stringify(deletedIds));
                }
                window.dispatchEvent(new CustomEvent('ticketx-events-updated'));
              } catch (_) {}
            }
          } else {
            showToast(data.message || 'Failed to delete event.', 'error');
          }
        } catch (err) {
          showToast('Failed to delete event.', 'error');
        } finally {
          setConfirmModal((prev) => ({ ...prev, isOpen: false }));
        }
      }
    });
  };

  const handleAddTicketTier = () => {
    const newTier = {
      id: `tt-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
      name: 'New Ticket Tier',
      description: 'Access pass details',
      price: 75,
      totalQuantity: 100,
      availableQuantity: 100,
      maxPerCustomer: 6,
      section: 'General Seating',
      status: 'Available'
    };
    setEventForm((prev) => ({
      ...prev,
      ticketTypes: [...prev.ticketTypes, newTier]
    }));
  };

  const handleUpdateTicketTier = (index, field, value) => {
    setEventForm((prev) => {
      const updated = [...prev.ticketTypes];
      updated[index] = { ...updated[index], [field]: value };
      return { ...prev, ticketTypes: updated };
    });
  };

  const handleRemoveTicketTier = (index) => {
    if (eventForm.ticketTypes.length <= 1) {
      showToast('An event must have at least one valid ticket type.', 'error');
      return;
    }
    setEventForm((prev) => ({
      ...prev,
      ticketTypes: prev.ticketTypes.filter((_, i) => i !== index)
    }));
  };

  const calculatedStartingPrice = useMemo(() => {
    if (!eventForm.ticketTypes || eventForm.ticketTypes.length === 0) return 0;
    const validPrices = eventForm.ticketTypes.map((t) => Number(t.price) || 0);
    return Math.min(...validPrices);
  }, [eventForm.ticketTypes]);

  const calculatedTotalCapacity = useMemo(() => {
    if (!eventForm.ticketTypes || eventForm.ticketTypes.length === 0) return 0;
    return eventForm.ticketTypes.reduce((sum, t) => sum + (Number(t.totalQuantity) || 0), 0);
  }, [eventForm.ticketTypes]);

  const calculatedPotentialRevenue = useMemo(() => {
    if (!eventForm.ticketTypes || eventForm.ticketTypes.length === 0) return 0;
    return eventForm.ticketTypes.reduce((sum, t) => sum + (Number(t.price) || 0) * (Number(t.totalQuantity) || 0), 0);
  }, [eventForm.ticketTypes]);

  const validateStep1 = () => {
    const errors = {};
    if (!eventForm.title.trim()) errors.title = 'Event title is required.';
    if (!eventForm.artist.trim()) errors.artist = 'Artist or organizer name is required.';
    if (!eventForm.category) errors.category = 'Select a category.';
    if (!eventForm.city.trim()) errors.city = 'City is required.';
    if (!eventForm.venue.trim()) errors.venue = 'Venue name is required.';
    if (!eventForm.date) errors.date = 'Event date is required.';
    if (!eventForm.time.trim()) errors.time = 'Start time is required.';
    if (!eventForm.description.trim() || eventForm.description.trim().length < 15) {
      errors.description = 'Description must be at least 15 characters.';
    }
    if (!eventForm.image) errors.image = 'Provide a cover image URL or upload an image.';
    setWizardErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const validateStep2 = () => {
    const errors = {};
    if (!eventForm.ticketTypes || eventForm.ticketTypes.length === 0) {
      errors.tiers = 'Add at least one ticket tier.';
    } else {
      for (let i = 0; i < eventForm.ticketTypes.length; i++) {
        const t = eventForm.ticketTypes[i];
        if (!t.name.trim()) errors[`tier_${i}_name`] = 'Tier name is required.';
        if (isNaN(t.price) || Number(t.price) < 0) errors[`tier_${i}_price`] = 'Price must be >= 0.';
        if (isNaN(t.totalQuantity) || Number(t.totalQuantity) < 1) errors[`tier_${i}_qty`] = 'Quantity must be >= 1.';
      }
    }
    setWizardErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSaveEvent = async (targetStatus = 'Published') => {
    if (!validateStep1() || !validateStep2()) {
      showToast('Please fix the validation errors before publishing.', 'error');
      return;
    }

    setIsSavingEvent(true);
    try {
      const payload = {
        ...eventForm,
        status: targetStatus,
        id: editingEventId || undefined
      };

      const method = editingEventId ? 'PUT' : 'POST';
      const res = await fetch('/api/admin/events', {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
      const data = await res.json();
      setIsSavingEvent(false);

      if (data.success) {
        showToast(data.message, 'success');
        setIsWizardOpen(false);
        fetchEvents();

        if (typeof window !== 'undefined' && data.event) {
          try {
            const savedEvent = data.event;
            if (editingEventId) {
              const editedDict = JSON.parse(localStorage.getItem('ticketx-edited-events') || '{}');
              editedDict[savedEvent.id] = savedEvent;
              localStorage.setItem('ticketx-edited-events', JSON.stringify(editedDict));
            } else {
              const custom = JSON.parse(localStorage.getItem('ticketx-custom-events') || '[]');
              const existingIdx = custom.findIndex((e) => e.id === savedEvent.id);
              if (existingIdx >= 0) {
                custom[existingIdx] = savedEvent;
              } else {
                custom.unshift(savedEvent);
              }
              localStorage.setItem('ticketx-custom-events', JSON.stringify(custom));
            }
            window.dispatchEvent(new CustomEvent('ticketx-events-updated'));
          } catch (_) {}
        }
      } else {
        showToast(data.message || 'Operation failed.', 'error');
      }
    } catch (err) {
      setIsSavingEvent(false);
      showToast('Failed to save event. Check your connection.', 'error');
    }
  };

  // -------------------------------------------------------------
  // ORDERS MANAGEMENT ACTIONS
  // -------------------------------------------------------------
  const handleOpenOrderDetails = async (orderId) => {
    try {
      const res = await fetch(`/api/admin/orders?orderId=${orderId}`);
      const data = await res.json();
      if (data.success && data.order) {
        setSelectedOrderDetails(data.order);
      } else {
        showToast('Could not load detailed order information.', 'error');
      }
    } catch (err) {
      showToast('Failed to retrieve order details.', 'error');
    }
  };

  const handleResendTicketEmail = async (order) => {
    setIsResendingEmail(true);
    try {
      const res = await fetch('/api/admin/orders', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          orderId: order.orderId,
          action: 'resend-confirmation'
        })
      });
      const data = await res.json();
      setIsResendingEmail(false);
      if (data.success) {
        showToast(data.message, 'success');
        if (selectedOrderDetails && selectedOrderDetails.orderId === order.orderId) {
          setSelectedOrderDetails((prev) => ({
            ...prev,
            confirmationEmailCount: (prev.confirmationEmailCount || 1) + 1,
            confirmationEmailSentAt: new Date()
          }));
        }
      } else {
        showToast(data.message || 'Failed to resend confirmation.', 'error');
      }
    } catch (err) {
      setIsResendingEmail(false);
      showToast('Network error resending email.', 'error');
    }
  };

  const handlePrintReceipt = (order) => {
    const printWindow = window.open('', '_blank');
    if (!printWindow) {
      showToast('Please allow popups to print receipt.', 'error');
      return;
    }

    const itemsRows = (order.items || []).map((item, idx) => `
      <tr>
        <td style="padding: 10px 0; border-bottom: 1px solid #f1f5f9; font-family: monospace; font-weight: bold;">${item.ticketId || `TKT-${idx + 1}`}</td>
        <td style="padding: 10px 0; border-bottom: 1px solid #f1f5f9;">${item.ticketType || order.ticketType}</td>
        <td style="padding: 10px 0; border-bottom: 1px solid #f1f5f9; color: #64748b;">${item.sectionName || 'GA'} · Seat ${item.seatNumber || 'GA'}</td>
        <td style="padding: 10px 0; border-bottom: 1px solid #f1f5f9; text-align: right; font-weight: bold;">$${Number(item.price || 0).toFixed(2)}</td>
      </tr>
    `).join('');

    printWindow.document.write(`
      <!DOCTYPE html>
      <html>
        <head>
          <title>TicketX Receipt #${order.orderId}</title>
          <style>
            body { font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif; padding: 40px; color: #0f172a; max-width: 600px; margin: 0 auto; line-height: 1.5; }
            .header { text-align: center; margin-bottom: 30px; border-bottom: 2px solid #e2e8f0; padding-bottom: 20px; }
            .logo { font-size: 28px; font-weight: 900; letter-spacing: -0.5px; }
            .logo span { color: #e11d48; }
            .badge { display: inline-block; padding: 4px 12px; border-radius: 9999px; background: #ecfdf5; color: #059669; font-weight: bold; font-size: 11px; margin-top: 8px; text-transform: uppercase; }
            table { width: 100%; border-collapse: collapse; margin: 20px 0; font-size: 13px; }
            th { text-align: left; padding: 8px 0; border-bottom: 2px solid #cbd5e1; color: #64748b; font-size: 11px; text-transform: uppercase; letter-spacing: 0.5px; }
            .total-box { background: #f8fafc; border-radius: 10px; padding: 18px; margin-top: 24px; border: 1px solid #e2e8f0; font-size: 13px; }
            .row { display: flex; justify-content: space-between; margin-bottom: 6px; color: #475569; }
            .grand { font-size: 16px; font-weight: 900; color: #0f172a; border-top: 2px solid #e2e8f0; padding-top: 10px; margin-top: 10px; }
            .grand span:last-child { color: #e11d48; }
            .footer { text-align: center; margin-top: 40px; color: #94a3b8; font-size: 11px; border-top: 1px solid #e2e8f0; padding-top: 20px; }
          </style>
        </head>
        <body>
          <div class="header">
            <div class="logo">Ticket<span>X</span></div>
            <div class="badge">Official Box Office Receipt</div>
            <p style="margin: 8px 0 0 0; color: #64748b; font-size: 12px;">Order ID: <strong>#${order.orderId}</strong> · Date: ${new Date(order.createdAt).toLocaleDateString()}</p>
          </div>

          <div style="font-size: 13px; margin-bottom: 20px;">
            <p style="margin: 0 0 4px 0;"><strong>Customer:</strong> ${order.customer?.firstName} ${order.customer?.lastName || ''} (${order.customer?.email})</p>
            <p style="margin: 0 0 4px 0;"><strong>Event:</strong> ${order.eventTitle}</p>
            <p style="margin: 0;"><strong>Quantity:</strong> ${order.quantity} admission ticket(s) · <strong>Payment Status:</strong> ${order.payment?.status || 'Paid'}</p>
          </div>

          <table>
            <thead>
              <tr>
                <th>Ticket ID</th>
                <th>Tier</th>
                <th>Seating</th>
                <th style="text-align: right;">Amount</th>
              </tr>
            </thead>
            <tbody>
              ${itemsRows}
            </tbody>
          </table>

          <div class="total-box">
            <div class="row"><span>Subtotal:</span><span>$${Number(order.pricing?.subtotal || 0).toFixed(2)}</span></div>
            <div class="row"><span>Service & Facility Fees:</span><span>$${((order.pricing?.serviceFee || 0) + (order.pricing?.facilityFee || 0)).toFixed(2)}</span></div>
            <div class="row"><span>Tax:</span><span>$${Number(order.pricing?.tax || 0).toFixed(2)}</span></div>
            <div class="row grand"><span>Grand Total Paid:</span><span>$${Number(order.pricing?.grandTotal || 0).toFixed(2)} USD</span></div>
          </div>

          <div class="footer">
            <p>Verified by TicketX Primary Box Office Authority · https://ticketxmaster.vercel.app</p>
          </div>
          <script>window.onload = function() { window.print(); };</script>
        </body>
      </html>
    `);
    printWindow.document.close();
  };

  const handleRefundOrder = (order) => {
    setConfirmModal({
      isOpen: true,
      title: `Refund Order #${order.orderId}?`,
      message: `Refunding this order will mark payment as 'Refunded', revoke admission barcode validity, and automatically restore ${order.quantity} ticket(s) back into the live event inventory.`,
      actionText: 'Process Full Refund',
      variant: 'danger',
      onConfirm: async () => {
        try {
          const res = await fetch('/api/admin/orders', {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              orderId: order.orderId,
              action: 'refund',
              reason: 'Super Admin authorized customer refund'
            })
          });
          const data = await res.json();
          if (data.success) {
            showToast(data.message);
            fetchOrders();
            if (selectedOrderDetails && selectedOrderDetails.orderId === order.orderId) {
              setSelectedOrderDetails((prev) => ({
                ...prev,
                status: 'Refunded',
                payment: { ...prev.payment, status: 'Refunded' },
                refundedAt: new Date()
              }));
            }
          } else {
            showToast(data.message || 'Refund failed.', 'error');
          }
        } catch (err) {
          showToast('Failed to process refund.', 'error');
        } finally {
          setConfirmModal((prev) => ({ ...prev, isOpen: false }));
        }
      }
    });
  };

  const handleCancelOrder = (order) => {
    setConfirmModal({
      isOpen: true,
      title: `Cancel Booking #${order.orderId}?`,
      message: `Cancelling this booking will invalidate all admission passes and release ${order.quantity} ticket(s) back to inventory.`,
      actionText: 'Confirm Cancellation',
      variant: 'danger',
      onConfirm: async () => {
        try {
          const res = await fetch('/api/admin/orders', {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              orderId: order.orderId,
              action: 'cancel',
              reason: 'Order cancelled by Super Admin'
            })
          });
          const data = await res.json();
          if (data.success) {
            showToast(data.message);
            fetchOrders();
            if (selectedOrderDetails && selectedOrderDetails.orderId === order.orderId) {
              setSelectedOrderDetails((prev) => ({
                ...prev,
                status: 'Cancelled',
                cancelledAt: new Date()
              }));
            }
          } else {
            showToast(data.message || 'Cancellation failed.', 'error');
          }
        } catch (err) {
          showToast('Failed to cancel order.', 'error');
        } finally {
          setConfirmModal((prev) => ({ ...prev, isOpen: false }));
        }
      }
    });
  };

  const handleExportOrdersCsv = () => {
    const params = new URLSearchParams({
      export: 'csv',
      status: orderBookingStatusFilter,
      paymentStatus: orderPaymentStatusFilter,
      sortBy: orderSortBy
    });
    if (orderSearch.trim()) params.append('search', orderSearch.trim());
    if (orderEventFilter !== 'all') params.append('event', orderEventFilter);
    if (orderDateFrom) params.append('dateFrom', orderDateFrom);
    if (orderDateTo) params.append('dateTo', orderDateTo);
    window.open(`/api/admin/orders?${params.toString()}`, '_blank');
  };

  // -------------------------------------------------------------
  // ADMIN PROFILE & SETTINGS ACTIONS
  // -------------------------------------------------------------
  const handleSaveProfile = async (e) => {
    e.preventDefault();
    if (!profileForm.firstName.trim()) {
      showToast('First name is required.', 'error');
      return;
    }

    setIsSavingProfile(true);
    try {
      const res = await fetch('/api/admin/profile', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(profileForm)
      });
      const data = await res.json();
      setIsSavingProfile(false);

      if (data.success) {
        showToast(data.message, 'success');
        setAdminProfileData((prev) => ({ ...prev, ...data.profile }));
        setActiveAdmin((prev) => ({ ...prev, ...data.profile }));
        setIsEditingProfile(false);
      } else {
        showToast(data.message || 'Failed to update profile.', 'error');
      }
    } catch (err) {
      setIsSavingProfile(false);
      showToast('Failed to update profile. Check connection.', 'error');
    }
  };

  const handleChangePassword = async (e) => {
    e.preventDefault();
    if (!passwordForm.currentPassword || !passwordForm.newPassword || !passwordForm.confirmPassword) {
      showToast('Please fill in all password fields.', 'error');
      return;
    }
    if (passwordForm.newPassword.length < 8) {
      showToast('New password must be at least 8 characters long.', 'error');
      return;
    }
    const specialCharRegex = /[!@#$%^&*(),.?":{}|<>_~`\-+=/\\[\]]/;
    if (!specialCharRegex.test(passwordForm.newPassword)) {
      showToast('New password must include at least one special character (!@#$%^&*).', 'error');
      return;
    }
    if (passwordForm.newPassword !== passwordForm.confirmPassword) {
      showToast('New password and confirmation do not match.', 'error');
      return;
    }

    setIsSavingPassword(true);
    try {
      const res = await fetch('/api/admin/change-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(passwordForm)
      });
      const data = await res.json();
      setIsSavingPassword(false);

      if (data.success) {
        showToast(data.message, 'success');
        setPasswordForm({ currentPassword: '', newPassword: '', confirmPassword: '' });
      } else {
        showToast(data.message || 'Failed to change password.', 'error');
      }
    } catch (err) {
      setIsSavingPassword(false);
      showToast('Error changing password. Check connection.', 'error');
    }
  };

  const handleRequestEmailChange = async (e) => {
    e.preventDefault();
    if (!newEmailInput || !newEmailInput.includes('@')) {
      setEmailChangeError('Please enter a valid email address.');
      return;
    }

    setIsEmailChangeLoading(true);
    setEmailChangeError('');
    try {
      const res = await fetch('/api/admin/change-email', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'request', newEmail: newEmailInput.trim() })
      });
      const data = await res.json();
      setIsEmailChangeLoading(false);

      if (data.success) {
        setChangeEmailStep(2);
        showToast(data.message, 'success');
      } else {
        setEmailChangeError(data.message || 'Failed to send verification code.');
      }
    } catch (err) {
      setIsEmailChangeLoading(false);
      setEmailChangeError('Network error requesting email change.');
    }
  };

  const handleVerifyEmailChange = async (e) => {
    e.preventDefault();
    if (!emailOtpInput || emailOtpInput.length < 6) {
      setEmailChangeError('Enter the full 6-digit OTP sent to your new email.');
      return;
    }

    setIsEmailChangeLoading(true);
    setEmailChangeError('');
    try {
      const res = await fetch('/api/admin/change-email', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'verify',
          newEmail: newEmailInput.trim(),
          otp: emailOtpInput.trim()
        })
      });
      const data = await res.json();
      setIsEmailChangeLoading(false);

      if (data.success) {
        showToast(data.message, 'success');
        setAdminProfileData((prev) => ({ ...prev, email: data.newEmail }));
        setActiveAdmin((prev) => ({ ...prev, email: data.newEmail }));
        setIsChangeEmailModalOpen(false);
        setChangeEmailStep(1);
        setNewEmailInput('');
        setEmailOtpInput('');
      } else {
        setEmailChangeError(data.message || 'Invalid or expired verification code.');
      }
    } catch (err) {
      setIsEmailChangeLoading(false);
      setEmailChangeError('Network error verifying email change.');
    }
  };

  const handleSignOutAllSessions = () => {
    setConfirmModal({
      isOpen: true,
      title: 'Sign Out From All Devices & Sessions?',
      message: 'This will invalidate your active Super Admin session tokens and sign you out across all browsers and devices immediately.',
      actionText: 'Confirm Sign Out',
      variant: 'danger',
      onConfirm: async () => {
        await handleLogout();
        setConfirmModal((prev) => ({ ...prev, isOpen: false }));
      }
    });
  };

  // -------------------------------------------------------------
  // RENDER: UN-AUTHENTICATED PORTAL VS DASHBOARD
  // -------------------------------------------------------------
  return (
    <div className="min-h-screen bg-[var(--bg)] text-[var(--fg)] selection:bg-rose-500 selection:text-white font-sans transition-colors">
      {/* Toast Alert */}
      <AnimatePresence>
        {toast.show && (
          <motion.div
            initial={{ opacity: 0, y: -20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -20, scale: 0.95 }}
            className={`fixed top-6 right-6 z-[999] px-4 py-3 rounded-xl shadow-2xl flex items-center gap-3 border text-xs font-semibold backdrop-blur-md ${
              toast.type === 'error'
                ? 'bg-rose-950/90 text-rose-200 border-rose-500/50'
                : 'bg-emerald-950/90 text-emerald-200 border-emerald-500/50'
            }`}
          >
            {toast.type === 'error' ? <AlertCircle className="w-4 h-4 text-rose-400 shrink-0" /> : <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />}
            <span>{toast.message}</span>
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence mode="wait">
        {!isAdminLoggedIn ? (
          /* ========================================================= */
          /* SUPER ADMIN AUTHENTICATION PORTAL (Setup / Login / OTP)    */
          /* ========================================================= */
          <motion.div
            key="admin-auth-portal"
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{
              opacity: 0,
              scale: 1.02,
              filter: 'blur(10px)',
              transition: { duration: 0.45, ease: [0.22, 1, 0.36, 1] }
            }}
            transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
            className="min-h-screen flex items-center justify-center p-4 relative overflow-hidden"
          >
            {/* Top theme toggle */}
            <div className="absolute top-6 right-6 z-20">
              <ThemeToggle />
            </div>

            {/* Ambient lighting */}
            <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-rose-600/10 rounded-full blur-3xl pointer-events-none" />
            <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-purple-600/10 rounded-full blur-3xl pointer-events-none" />

            <div className="w-full max-w-md z-10">
              {/* Header Logo */}
              <div className="text-center mb-8">
                <div className="flex justify-center mb-3">
                  <Logo imageClassName="h-10 sm:h-12 w-auto" />
                </div>
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[var(--bg-sec)] border border-[var(--border)] text-xs text-[var(--fg-sec)]">
                  <ShieldCheck className="w-3.5 h-3.5 text-rose-600" />
                  <span>Super Admin Authorization Portal</span>
                </div>
              </div>

              <div className="bg-[var(--card)] border border-[var(--border)] rounded-2xl p-8 shadow-2xl relative">
                {/* Title */}
                <div className="mb-6">
                  <h2 className="text-xl font-bold text-[var(--fg)]">
                    {authStep === 'forgot-email'
                      ? 'Reset Super Admin Password'
                      : authStep === 'forgot-otp'
                      ? 'Verify Recovery Code'
                      : authStep === 'forgot-new-password'
                      ? 'Create New Password'
                      : authStep === 'otp'
                      ? 'Verify Super Admin Email'
                      : authStep === 'setup'
                      ? 'Initialize Super Admin'
                      : 'Super Admin Access'}
                  </h2>
                  <p className="text-xs text-[var(--fg-sec)] mt-1">
                    {authStep === 'forgot-email'
                      ? 'Enter your registered email to receive a recovery code.'
                      : authStep === 'forgot-otp'
                      ? `We sent a 6-digit recovery OTP to ${forgotEmail}.`
                      : authStep === 'forgot-new-password'
                      ? 'Set a strong new password to regain portal access.'
                      : authStep === 'otp'
                      ? `Enter the 6-digit verification code sent to ${otpEmail}.`
                      : authStep === 'setup'
                      ? 'First-time setup: establish the permanent master account.'
                      : 'Authorized credentials are required to access management services.'}
                  </p>
                </div>

                {authError && (
                  <div className="mb-4 p-3 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-600 text-xs flex items-center gap-2">
                    <AlertTriangle className="w-4 h-4 shrink-0" />
                    <span>{authError}</span>
                  </div>
                )}

                {authSuccess && (
                  <div className="mb-4 p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-600 text-xs flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 shrink-0" />
                    <span>{authSuccess}</span>
                  </div>
                )}

                {/* STEP: SETUP */}
                {authStep === 'setup' && (
                  <form onSubmit={handleSetupAdmin} className="space-y-4 text-xs">
                    <div>
                      <label className="block text-[var(--fg)] font-semibold mb-1">Full Legal Name</label>
                      <div className="relative">
                        <User className="w-4 h-4 text-[var(--fg-sec)] absolute left-3 top-1/2 -translate-y-1/2" />
                        <input
                          type="text"
                          required
                          value={regForm.name}
                          onChange={(e) => setRegForm({ ...regForm, name: e.target.value })}
                          placeholder="e.g. Master Administrator"
                          className="w-full pl-9 pr-3 py-2.5 bg-[var(--bg-sec)] border border-[var(--border)] rounded-xl text-[var(--fg)] placeholder:text-[var(--fg-sec)] focus:outline-none focus:border-rose-600"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-[var(--fg)] font-semibold mb-1">Super Admin Email</label>
                      <div className="relative">
                        <Mail className="w-4 h-4 text-[var(--fg-sec)] absolute left-3 top-1/2 -translate-y-1/2" />
                        <input
                          type="email"
                          required
                          value={regForm.email}
                          onChange={(e) => setRegForm({ ...regForm, email: e.target.value })}
                          placeholder="superadmin@ticketx.com"
                          className="w-full pl-9 pr-3 py-2.5 bg-[var(--bg-sec)] border border-[var(--border)] rounded-xl text-[var(--fg)] placeholder:text-[var(--fg-sec)] focus:outline-none focus:border-rose-600"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-[var(--fg)] font-semibold mb-1">Master Password (8+ chars & symbol)</label>
                      <div className="relative">
                        <Key className="w-4 h-4 text-[var(--fg-sec)] absolute left-3 top-1/2 -translate-y-1/2" />
                        <input
                          type={showSetupPassword ? 'text' : 'password'}
                          required
                          value={regForm.password}
                          onChange={(e) => setRegForm({ ...regForm, password: e.target.value })}
                          placeholder="••••••••••••"
                          className="w-full pl-9 pr-10 py-2.5 bg-[var(--bg-sec)] border border-[var(--border)] rounded-xl text-[var(--fg)] placeholder:text-[var(--fg-sec)] focus:outline-none focus:border-rose-600"
                        />
                        <button
                          type="button"
                          onClick={() => setShowSetupPassword(!showSetupPassword)}
                          className="absolute right-3 top-1/2 -translate-y-1/2 text-[var(--fg-sec)] hover:text-[var(--fg)]"
                        >
                          {showSetupPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                        </button>
                      </div>
                    </div>

                    <div>
                      <label className="block text-[var(--fg)] font-semibold mb-1">Confirm Password</label>
                      <div className="relative">
                        <Lock className="w-4 h-4 text-[var(--fg-sec)] absolute left-3 top-1/2 -translate-y-1/2" />
                        <input
                          type={showSetupConfirmPassword ? 'text' : 'password'}
                          required
                          value={regForm.confirmPassword}
                          onChange={(e) => setRegForm({ ...regForm, confirmPassword: e.target.value })}
                          placeholder="••••••••••••"
                          className="w-full pl-9 pr-10 py-2.5 bg-[var(--bg-sec)] border border-[var(--border)] rounded-xl text-[var(--fg)] placeholder:text-[var(--fg-sec)] focus:outline-none focus:border-rose-600"
                        />
                        <button
                          type="button"
                          onClick={() => setShowSetupConfirmPassword(!showSetupConfirmPassword)}
                          className="absolute right-3 top-1/2 -translate-y-1/2 text-[var(--fg-sec)] hover:text-[var(--fg)]"
                        >
                          {showSetupConfirmPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                        </button>
                      </div>
                    </div>

                    <button
                      type="submit"
                      disabled={isLoading}
                      className="w-full mt-2 py-3 bg-rose-600 hover:bg-rose-700 disabled:opacity-50 text-white font-bold rounded-xl transition-all shadow-lg shadow-rose-600/20 flex items-center justify-center gap-2"
                    >
                      {isLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : <ShieldCheck className="w-4 h-4" />}
                      <span>Initialize Super Admin Authority</span>
                    </button>
                  </form>
                )}

                {/* STEP: LOGIN */}
                {authStep === 'login' && (
                  <form onSubmit={handleLoginAdmin} className="space-y-4 text-xs">
                    <div>
                      <label className="block text-[var(--fg)] font-semibold mb-1">Administrator Email</label>
                      <div className="relative">
                        <Mail className="w-4 h-4 text-[var(--fg-sec)] absolute left-3 top-1/2 -translate-y-1/2" />
                        <input
                          type="email"
                          required
                          value={loginForm.email}
                          onChange={(e) => setLoginForm({ ...loginForm, email: e.target.value })}
                          placeholder="superadmin@ticketx.com"
                          className="w-full pl-9 pr-3 py-2.5 bg-[var(--bg-sec)] border border-[var(--border)] rounded-xl text-[var(--fg)] placeholder:text-[var(--fg-sec)] focus:outline-none focus:border-rose-600"
                        />
                      </div>
                    </div>

                    <div>
                      <div className="flex items-center justify-between mb-1">
                        <label className="text-[var(--fg)] font-semibold">Master Password</label>
                        <button
                          type="button"
                          onClick={() => {
                            setForgotEmail(loginForm.email);
                            setAuthError('');
                            setAuthSuccess('');
                            setAuthStep('forgot-email');
                          }}
                          className="text-rose-600 hover:underline text-[11px] font-medium"
                        >
                          Forgot Password?
                        </button>
                      </div>
                      <div className="relative">
                        <Lock className="w-4 h-4 text-[var(--fg-sec)] absolute left-3 top-1/2 -translate-y-1/2" />
                        <input
                          type={showLoginPassword ? 'text' : 'password'}
                          required
                          value={loginForm.password}
                          onChange={(e) => setLoginForm({ ...loginForm, password: e.target.value })}
                          placeholder="••••••••••••"
                          className="w-full pl-9 pr-10 py-2.5 bg-[var(--bg-sec)] border border-[var(--border)] rounded-xl text-[var(--fg)] placeholder:text-[var(--fg-sec)] focus:outline-none focus:border-rose-600"
                        />
                        <button
                          type="button"
                          onClick={() => setShowLoginPassword(!showLoginPassword)}
                          className="absolute right-3 top-1/2 -translate-y-1/2 text-[var(--fg-sec)] hover:text-[var(--fg)]"
                        >
                          {showLoginPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                        </button>
                      </div>
                    </div>

                    <button
                      type="submit"
                      disabled={isLoading || isLoginSuccess}
                      className="w-full mt-2 py-3 bg-rose-600 hover:bg-rose-700 disabled:opacity-60 text-white font-bold rounded-xl transition-all shadow-lg shadow-rose-600/20 flex items-center justify-center gap-2"
                    >
                      {isLoginSuccess ? (
                        <>
                          <CheckCircle2 className="w-4 h-4 text-white" />
                          <span>Access Granted! Opening Portal...</span>
                        </>
                      ) : isLoading ? (
                        <>
                          <Loader2 className="w-4 h-4 animate-spin" />
                          <span>Authenticating Security Credentials...</span>
                        </>
                      ) : (
                        <>
                          <ShieldCheck className="w-4 h-4" />
                          <span>Authenticate & Enter Dashboard</span>
                        </>
                      )}
                    </button>
                  </form>
                )}

                {/* STEP: OTP VERIFY */}
                {authStep === 'otp' && (
                  <form onSubmit={handleVerifySetupOtp} className="space-y-4 text-xs">
                    <div className="text-center py-2">
                      <label className="block text-[var(--fg)] font-semibold mb-3">Enter 6-Digit Verification Code</label>
                      <OtpInput length={6} value={otpCode} onChange={setOtpCode} disabled={isLoading} />
                    </div>

                    <button
                      type="submit"
                      disabled={isLoading || otpCode.length < 6}
                      className="w-full py-3 bg-rose-600 hover:bg-rose-700 disabled:opacity-50 text-white font-bold rounded-xl transition-all shadow-lg shadow-rose-600/20 flex items-center justify-center gap-2"
                    >
                      {isLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : <CheckCircle2 className="w-4 h-4" />}
                      <span>Verify & Grant Super Admin Access</span>
                    </button>

                    <div className="flex items-center justify-between pt-2">
                      <button
                        type="button"
                        onClick={() => setAuthStep('login')}
                        className="text-[var(--fg-sec)] hover:text-[var(--fg)] text-[11px]"
                      >
                        ← Back to Login
                      </button>
                      <button
                        type="button"
                        onClick={handleResendSetupOtp}
                        disabled={resendCooldown > 0 || isLoading}
                        className="text-rose-600 hover:underline disabled:opacity-50 text-[11px] font-semibold"
                      >
                        {resendCooldown > 0 ? `Resend Code in ${resendCooldown}s` : 'Resend Code'}
                      </button>
                    </div>
                  </form>
                )}

                {/* STEP: FORGOT EMAIL */}
                {authStep === 'forgot-email' && (
                  <form onSubmit={handleRequestForgotOtp} className="space-y-4 text-xs">
                    <div>
                      <label className="block text-[var(--fg)] font-semibold mb-1">Super Admin Email Address</label>
                      <div className="relative">
                        <Mail className="w-4 h-4 text-[var(--fg-sec)] absolute left-3 top-1/2 -translate-y-1/2" />
                        <input
                          type="email"
                          required
                          value={forgotEmail}
                          onChange={(e) => setForgotEmail(e.target.value)}
                          placeholder="admin@ticketx.com"
                          className="w-full pl-9 pr-3 py-2.5 bg-[var(--bg-sec)] border border-[var(--border)] rounded-xl text-[var(--fg)] focus:outline-none focus:border-rose-600"
                        />
                      </div>
                    </div>

                    <button
                      type="submit"
                      disabled={isLoading}
                      className="w-full py-3 bg-rose-600 hover:bg-rose-700 disabled:opacity-50 text-white font-bold rounded-xl transition-all shadow-lg shadow-rose-600/20 flex items-center justify-center gap-2"
                    >
                      {isLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : <KeyRound className="w-4 h-4" />}
                      <span>Send Recovery OTP</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => setAuthStep('login')}
                      className="w-full text-center text-[var(--fg-sec)] hover:text-[var(--fg)] text-[11px] pt-1"
                    >
                      ← Back to Login
                    </button>
                  </form>
                )}

                {/* STEP: FORGOT OTP */}
                {authStep === 'forgot-otp' && (
                  <form onSubmit={handleVerifyForgotOtp} className="space-y-4 text-xs">
                    <div className="text-center py-2">
                      <label className="block text-[var(--fg)] font-semibold mb-3">Enter 6-Digit Password Recovery OTP</label>
                      <OtpInput length={6} value={forgotOtp} onChange={setForgotOtp} disabled={isLoading} />
                    </div>

                    <button
                      type="submit"
                      disabled={isLoading || forgotOtp.length < 6}
                      className="w-full py-3 bg-rose-600 hover:bg-rose-700 disabled:opacity-50 text-white font-bold rounded-xl transition-all shadow-lg shadow-rose-600/20 flex items-center justify-center gap-2"
                    >
                      {isLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : <CheckCircle2 className="w-4 h-4" />}
                      <span>Verify Recovery Code</span>
                    </button>

                    <div className="flex items-center justify-between pt-2">
                      <button
                        type="button"
                        onClick={() => setAuthStep('forgot-email')}
                        className="text-[var(--fg-sec)] hover:text-[var(--fg)] text-[11px]"
                      >
                        ← Change Email
                      </button>
                      <button
                        type="button"
                        onClick={handleRequestForgotOtp}
                        disabled={resendCooldown > 0 || isLoading}
                        className="text-rose-600 hover:underline disabled:opacity-50 text-[11px] font-semibold"
                      >
                        {resendCooldown > 0 ? `Resend Code in ${resendCooldown}s` : 'Resend Code'}
                      </button>
                    </div>
                  </form>
                )}

                {/* STEP: FORGOT NEW PASSWORD */}
                {authStep === 'forgot-new-password' && (
                  <form onSubmit={handleResetPasswordSubmit} className="space-y-4 text-xs">
                    <div>
                      <label className="block text-[var(--fg)] font-semibold mb-1">New Master Password (8+ chars & symbol)</label>
                      <div className="relative">
                        <Lock className="w-4 h-4 text-[var(--fg-sec)] absolute left-3 top-1/2 -translate-y-1/2" />
                        <input
                          type={showForgotNewPassword ? 'text' : 'password'}
                          required
                          value={forgotNewPassword}
                          onChange={(e) => setForgotNewPassword(e.target.value)}
                          placeholder="••••••••••••"
                          className="w-full pl-9 pr-10 py-2.5 bg-[var(--bg-sec)] border border-[var(--border)] rounded-xl text-[var(--fg)] focus:outline-none focus:border-rose-600"
                        />
                        <button
                          type="button"
                          onClick={() => setShowForgotNewPassword(!showForgotNewPassword)}
                          className="absolute right-3 top-1/2 -translate-y-1/2 text-[var(--fg-sec)] hover:text-[var(--fg)]"
                        >
                          {showForgotNewPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                        </button>
                      </div>
                    </div>

                    <div>
                      <label className="block text-[var(--fg)] font-semibold mb-1">Confirm New Password</label>
                      <div className="relative">
                        <Lock className="w-4 h-4 text-[var(--fg-sec)] absolute left-3 top-1/2 -translate-y-1/2" />
                        <input
                          type={showForgotConfirmPassword ? 'text' : 'password'}
                          required
                          value={forgotConfirmPassword}
                          onChange={(e) => setForgotConfirmPassword(e.target.value)}
                          placeholder="••••••••••••"
                          className="w-full pl-9 pr-10 py-2.5 bg-[var(--bg-sec)] border border-[var(--border)] rounded-xl text-[var(--fg)] focus:outline-none focus:border-rose-600"
                        />
                        <button
                          type="button"
                          onClick={() => setShowForgotConfirmPassword(!showForgotConfirmPassword)}
                          className="absolute right-3 top-1/2 -translate-y-1/2 text-[var(--fg-sec)] hover:text-[var(--fg)]"
                        >
                          {showForgotConfirmPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                        </button>
                      </div>
                    </div>

                    <button
                      type="submit"
                      disabled={isLoading}
                      className="w-full py-3 bg-rose-600 hover:bg-rose-700 disabled:opacity-50 text-white font-bold rounded-xl transition-all shadow-lg shadow-rose-600/20 flex items-center justify-center gap-2"
                    >
                      {isLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : <CheckCircle2 className="w-4 h-4" />}
                      <span>Update Password & Return to Login</span>
                    </button>
                  </form>
                )}
              </div>

              <div className="text-center mt-6">
                <Link href="/" className="text-xs text-[var(--fg-sec)] hover:text-rose-600 transition-colors inline-flex items-center gap-1.5">
                  <ArrowLeft className="w-3.5 h-3.5" />
                  <span>Return to Main TicketX Website</span>
                </Link>
              </div>
            </div>
          </motion.div>
        ) : (
          /* ========================================================= */
          /* AUTHENTICATED SUPER ADMIN DASHBOARD                       */
          /* ========================================================= */
          <motion.div
            key="admin-dashboard"
            initial={{ opacity: 0, scale: 0.98, y: 25, filter: 'blur(8px)' }}
            animate={{ opacity: 1, scale: 1, y: 0, filter: 'blur(0px)' }}
            exit={{ opacity: 0, scale: 0.98, y: 20, filter: 'blur(6px)' }}
            transition={{ duration: 0.55, ease: [0.16, 1, 0.3, 1] }}
            className="min-h-screen flex flex-col md:flex-row w-full transition-colors"
          >
            {/* SIDEBAR */}
            <aside className="w-full md:w-64 bg-[var(--bg-sec)] border-b md:border-b-0 md:border-r border-[var(--border)] flex flex-col justify-between shrink-0">
              <div>
                {/* Brand & Badge */}
                <div className="p-5 border-b border-[var(--border)] flex items-center justify-between">
                  <div className="flex items-center gap-2.5 min-w-0">
                    <Logo imageClassName="h-7 sm:h-8 w-auto" />
                    <span className="px-2 py-0.5 text-[10px] font-bold rounded-md bg-rose-500/10 text-rose-600 border border-rose-500/20 shrink-0">
                      ADMIN
                    </span>
                  </div>
                </div>

                {/* Nav Items */}
                <nav className="p-3 space-y-1">
                  <button
                    onClick={() => setActiveTab('overview')}
                    className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-medium transition-all ${
                      activeTab === 'overview'
                        ? 'bg-rose-600 text-white font-semibold shadow-md shadow-rose-600/20'
                        : 'text-[var(--fg-sec)] hover:bg-[var(--card)] hover:text-[var(--fg)]'
                    }`}
                  >
                    <LayoutDashboard className="w-4 h-4" />
                    <span>Overview & Analytics</span>
                  </button>

                  <button
                    onClick={() => setActiveTab('users')}
                    className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-medium transition-all ${
                      activeTab === 'users'
                        ? 'bg-rose-600 text-white font-semibold shadow-md shadow-rose-600/20'
                        : 'text-[var(--fg-sec)] hover:bg-[var(--card)] hover:text-[var(--fg)]'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <Users className="w-4 h-4" />
                      <span>User Profiles</span>
                    </div>
                    {usersStats.totalRegistered > 0 && (
                      <span className="px-1.5 py-0.5 text-[10px] rounded-md bg-black/20 text-current">
                        {usersStats.totalRegistered}
                      </span>
                    )}
                  </button>

                  <button
                    onClick={() => setActiveTab('tickets')}
                    className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-medium transition-all ${
                      activeTab === 'tickets'
                        ? 'bg-rose-600 text-white font-semibold shadow-md shadow-rose-600/20'
                        : 'text-[var(--fg-sec)] hover:bg-[var(--card)] hover:text-[var(--fg)]'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <Ticket className="w-4 h-4" />
                      <span>Events & Tickets</span>
                    </div>
                    {eventsStats.totalEvents > 0 && (
                      <span className="px-1.5 py-0.5 text-[10px] rounded-md bg-black/20 text-current">
                        {eventsStats.totalEvents}
                      </span>
                    )}
                  </button>

                  <button
                    onClick={() => setActiveTab('orders')}
                    className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-medium transition-all ${
                      activeTab === 'orders'
                        ? 'bg-rose-600 text-white font-semibold shadow-md shadow-rose-600/20'
                        : 'text-[var(--fg-sec)] hover:bg-[var(--card)] hover:text-[var(--fg)]'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <ShoppingBag className="w-4 h-4" />
                      <span>Orders & Bookings</span>
                    </div>
                    {ordersStats.totalOrders > 0 && (
                      <span className="px-1.5 py-0.5 text-[10px] rounded-md bg-black/20 text-current">
                        {ordersStats.totalOrders}
                      </span>
                    )}
                  </button>

                  <button
                    onClick={() => setActiveTab('settings')}
                    className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-medium transition-all ${
                      activeTab === 'settings'
                        ? 'bg-rose-600 text-white font-semibold shadow-md shadow-rose-600/20'
                        : 'text-[var(--fg-sec)] hover:bg-[var(--card)] hover:text-[var(--fg)]'
                    }`}
                  >
                    <Settings className="w-4 h-4" />
                    <span>Admin Profile & Settings</span>
                  </button>
                </nav>
              </div>

              {/* Admin Footer & Logout */}
              <div className="p-4 border-t border-[var(--border)] bg-[var(--card)]/50">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2.5 min-w-0">
                    <div className="w-8 h-8 rounded-full bg-rose-600 flex items-center justify-center font-bold text-white text-xs shrink-0 shadow">
                      {activeAdmin?.firstName?.charAt(0).toUpperCase() || 'A'}
                    </div>
                    <div className="min-w-0">
                      <p className="text-xs font-semibold text-[var(--fg)] truncate">
                        {activeAdmin?.firstName} {activeAdmin?.lastName || ''}
                      </p>
                      <p className="text-[10px] text-emerald-500 flex items-center gap-1">
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                        Super Admin
                      </p>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <Link
                    href="/"
                    target="_blank"
                    className="flex-1 py-1.5 px-2 bg-[var(--bg-sec)] hover:bg-[var(--border)] text-[var(--fg)] text-center text-[10px] font-medium rounded-lg border border-[var(--border)] flex items-center justify-center gap-1 transition-colors"
                  >
                    <ArrowUpRight className="w-3 h-3" />
                    <span>View Site</span>
                  </Link>
                  <button
                    onClick={handleLogout}
                    className="py-1.5 px-3 bg-rose-500/10 hover:bg-rose-500/20 text-rose-600 text-[10px] font-medium rounded-lg border border-rose-500/20 flex items-center gap-1 transition-colors"
                    title="Sign Out"
                  >
                    <LogOut className="w-3 h-3" />
                    <span>Sign Out</span>
                  </button>
                </div>
              </div>
            </aside>

            {/* MAIN CONTENT AREA */}
            <main className="flex-1 flex flex-col min-w-0 overflow-y-auto">
              {/* Top Navigation Bar */}
              <header className="h-16 px-6 border-b border-[var(--border)] flex items-center justify-between bg-[var(--card)]/40 backdrop-blur-md sticky top-0 z-30">
                <div>
                  <h1 className="text-base font-bold text-[var(--fg)]">
                    {activeTab === 'overview' && 'Executive Overview & Platform Analytics'}
                    {activeTab === 'users' && 'User Profiles & Access Management'}
                    {activeTab === 'tickets' && 'Ticket & Event Management'}
                    {activeTab === 'orders' && 'Real-Time Orders & Box Office Bookings'}
                    {activeTab === 'settings' && 'Super Admin Profile & Security Settings'}
                  </h1>
                  <p className="text-[11px] text-[var(--fg-sec)]">
                    TicketX Master Operations · Live MongoDB Atlas Production Backend
                  </p>
                </div>

                <div className="flex items-center gap-3">
                  <ThemeToggle />
                  {activeTab === 'tickets' && (
                    <button
                      onClick={handleOpenCreateEventWizard}
                      className="px-3.5 py-2 bg-rose-600 hover:bg-rose-700 text-white font-semibold rounded-xl text-xs transition-all shadow-md shadow-rose-600/20 flex items-center gap-1.5"
                    >
                      <PlusCircle className="w-3.5 h-3.5" />
                      <span>Upload New Event</span>
                    </button>
                  )}
                </div>
              </header>

              <div className="p-6 space-y-6">
                {/* ========================================================= */}
                {/* TAB 1: OVERVIEW & ANALYTICS                               */}
                {/* ========================================================= */}
                {activeTab === 'overview' && (
                  <div className="space-y-6">
                    {/* Timeframe Selector & Refresh */}
                    <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                      <div>
                        <h2 className="text-sm font-bold text-[var(--fg)]">Key Platform Metrics</h2>
                        <p className="text-xs text-[var(--fg-sec)]">Aggregated in real-time from confirmed customer orders and verified inventory.</p>
                      </div>

                      <div className="flex items-center gap-2">
                        <div className="inline-flex p-1 rounded-xl bg-[var(--card)] border border-[var(--border)] text-xs">
                          {['all', '30d', '7d', 'today'].map((r) => (
                            <button
                              key={r}
                              onClick={() => {
                                setAnalyticsRange(r);
                                fetchAnalytics(r);
                              }}
                              className={`px-3 py-1 rounded-lg font-medium transition-all ${
                                analyticsRange === r
                                  ? 'bg-rose-600 text-white shadow-sm'
                                  : 'text-[var(--fg-sec)] hover:text-[var(--fg)]'
                              }`}
                            >
                              {r === 'all' ? 'All Time' : r === '30d' ? 'Last 30 Days' : r === '7d' ? 'Last 7 Days' : 'Today'}
                            </button>
                          ))}
                        </div>

                        <button
                          onClick={() => fetchAnalytics()}
                          disabled={isLoadingAnalytics}
                          className="p-2 rounded-xl bg-[var(--card)] border border-[var(--border)] text-[var(--fg-sec)] hover:text-[var(--fg)] transition-colors"
                          title="Refresh Analytics"
                        >
                          <RefreshCw className={`w-4 h-4 ${isLoadingAnalytics ? 'animate-spin' : ''}`} />
                        </button>
                      </div>
                    </div>

                    {/* Metric Cards Grid */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                      {/* Gross Sales */}
                      <div className="p-5 bg-[var(--card)] border border-[var(--border)] rounded-2xl relative overflow-hidden shadow-sm">
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-xs text-[var(--fg-sec)] font-medium">Gross Platform Sales</span>
                          <div className="w-8 h-8 rounded-lg bg-rose-500/10 flex items-center justify-center text-rose-600">
                            <DollarSign className="w-4 h-4" />
                          </div>
                        </div>
                        <h3 className="text-2xl font-black text-[var(--fg)]">
                          ${(overviewMetrics?.grossSales || 0).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                        </h3>
                        <span className="text-[10px] text-rose-600 font-medium mt-1 inline-flex items-center gap-0.5">
                          <TrendingUp className="w-3 h-3" /> Confirmed checkout volume
                        </span>
                      </div>

                      {/* Net Revenue */}
                      <div className="p-5 bg-[var(--card)] border border-[var(--border)] rounded-2xl relative overflow-hidden shadow-sm">
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-xs text-[var(--fg-sec)] font-medium">Net Revenue (After Refunds)</span>
                          <div className="w-8 h-8 rounded-lg bg-emerald-500/10 flex items-center justify-center text-emerald-600">
                            <Sparkles className="w-4 h-4" />
                          </div>
                        </div>
                        <h3 className="text-2xl font-black text-[var(--fg)]">
                          ${(overviewMetrics?.netRevenue || 0).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                        </h3>
                        <span className="text-[10px] text-emerald-600 font-medium mt-1">
                          Refunds processed: ${(overviewMetrics?.refunds || 0).toFixed(2)}
                        </span>
                      </div>

                      {/* Total Tickets Sold */}
                      <div className="p-5 bg-[var(--card)] border border-[var(--border)] rounded-2xl relative overflow-hidden shadow-sm">
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-xs text-[var(--fg-sec)] font-medium">Tickets Sold</span>
                          <div className="w-8 h-8 rounded-lg bg-purple-500/10 flex items-center justify-center text-purple-500">
                            <Ticket className="w-4 h-4" />
                          </div>
                        </div>
                        <h3 className="text-2xl font-black text-[var(--fg)]">
                          {overviewMetrics?.totalTicketsSold || 0}
                        </h3>
                        <span className="text-[10px] text-[var(--fg-sec)] font-medium mt-1">
                          Across {overviewMetrics?.confirmedBookings || 0} confirmed orders
                        </span>
                      </div>

                      {/* User Profiles */}
                      <div className="p-5 bg-[var(--card)] border border-[var(--border)] rounded-2xl relative overflow-hidden shadow-sm">
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-xs text-[var(--fg-sec)] font-medium">Registered User Accounts</span>
                          <div className="w-8 h-8 rounded-lg bg-blue-500/10 flex items-center justify-center text-blue-500">
                            <Users className="w-4 h-4" />
                          </div>
                        </div>
                        <h3 className="text-2xl font-black text-[var(--fg)]">
                          {overviewMetrics?.totalUsers || 0}
                        </h3>
                        <span className="text-[10px] text-blue-500 font-medium mt-1">
                          {overviewMetrics?.activeUsers || 0} Active · {overviewMetrics?.suspendedUsers || 0} Suspended
                        </span>
                      </div>
                    </div>

                    {/* Secondary Metrics & Visuals */}
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                      {/* Top Selling Events */}
                      <div className="lg:col-span-2 bg-[var(--card)] border border-[var(--border)] rounded-2xl p-6 shadow-sm">
                        <div className="flex items-center justify-between mb-4">
                          <h3 className="text-sm font-bold text-[var(--fg)] flex items-center gap-2">
                            <TrendingUp className="w-4 h-4 text-rose-600" />
                            <span>Top Performing Events & Box Office</span>
                          </h3>
                        </div>

                        {topEvents.length === 0 ? (
                          <div className="py-12 text-center text-xs text-[var(--fg-sec)]">
                            No event sales recorded in this period yet.
                          </div>
                        ) : (
                          <div className="space-y-3">
                            {topEvents.map((e, idx) => {
                              const maxRev = topEvents[0]?.revenue || 1;
                              const pct = Math.min(100, Math.round((e.revenue / maxRev) * 100));
                              return (
                                <div key={idx} className="p-3 bg-[var(--bg-sec)] rounded-xl border border-[var(--border)]">
                                  <div className="flex items-center justify-between text-xs mb-1.5">
                                    <span className="font-semibold text-[var(--fg)] truncate max-w-[60%]">{e.title}</span>
                                    <span className="font-bold text-rose-600">${e.revenue.toFixed(2)}</span>
                                  </div>
                                  <div className="flex items-center justify-between text-[11px] text-[var(--fg-sec)] mb-2">
                                    <span>{e.ticketsSold} ticket(s) issued</span>
                                    <span>{pct}% share</span>
                                  </div>
                                  <div className="w-full h-1.5 bg-[var(--border)] rounded-full overflow-hidden">
                                    <div className="h-full bg-rose-600 rounded-full" style={{ width: `${pct}%` }} />
                                  </div>
                                </div>
                              );
                            })}
                          </div>
                        )}
                      </div>

                      {/* Ticket Capacity & Security Audit Feed */}
                      <div className="space-y-6">
                        {/* Capacity meter */}
                        <div className="bg-[var(--card)] border border-[var(--border)] rounded-2xl p-5 shadow-sm">
                          <h3 className="text-xs font-bold text-[var(--fg)] mb-3 flex items-center gap-2">
                            <Layers className="w-4 h-4 text-purple-500" />
                            <span>Total Platform Ticket Inventory</span>
                          </h3>
                          <div className="flex items-baseline justify-between mb-2">
                            <span className="text-2xl font-black text-[var(--fg)]">
                              {(overviewMetrics?.availableInventory || 0).toLocaleString()}
                            </span>
                            <span className="text-xs text-[var(--fg-sec)]">
                              of {(overviewMetrics?.totalCapacity || 0).toLocaleString()} capacity
                            </span>
                          </div>
                          <div className="w-full h-2 bg-[var(--bg-sec)] rounded-full overflow-hidden border border-[var(--border)] mb-3">
                            <div
                              className="h-full bg-purple-600 rounded-full transition-all"
                              style={{
                                width: `${
                                  overviewMetrics?.totalCapacity > 0
                                    ? Math.round((overviewMetrics.availableInventory / overviewMetrics.totalCapacity) * 100)
                                    : 0
                                }%`
                              }}
                            />
                          </div>
                          <p className="text-[11px] text-[var(--fg-sec)]">
                            Active listed seats across {overviewMetrics?.publishedEvents || 0} published events.
                          </p>
                        </div>

                        {/* Recent Admin Audit Logs */}
                        <div className="bg-[var(--card)] border border-[var(--border)] rounded-2xl p-5 shadow-sm">
                          <h3 className="text-xs font-bold text-[var(--fg)] mb-3 flex items-center gap-2">
                            <Activity className="w-4 h-4 text-emerald-500" />
                            <span>Recent Security & Audit Logs</span>
                          </h3>
                          {recentAuditLogs.length === 0 ? (
                            <p className="text-xs text-[var(--fg-sec)] py-4 text-center">No audit logs recorded yet.</p>
                          ) : (
                            <div className="space-y-2.5">
                              {recentAuditLogs.slice(0, 4).map((log, i) => (
                                <div key={i} className="text-xs border-b border-[var(--border)] pb-2 last:border-b-0 last:pb-0">
                                  <div className="flex items-center justify-between text-[11px]">
                                    <span className="font-semibold text-rose-500">{log.action}</span>
                                    <span className="text-[10px] text-[var(--fg-sec)]">
                                      {new Date(log.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                    </span>
                                  </div>
                                  <p className="text-[11px] text-[var(--fg-sec)] truncate mt-0.5">{log.details}</p>
                                </div>
                              ))}
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {/* ========================================================= */}
                {/* TAB 2: USER PROFILES & ACCESS MANAGEMENT                  */}
                {/* ========================================================= */}
                {activeTab === 'users' && (
                  <div className="space-y-5">
                    {/* Stat Badges */}
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                      <div className="p-4 bg-[var(--card)] border border-[var(--border)] rounded-xl flex items-center justify-between">
                        <div>
                          <p className="text-xs text-[var(--fg-sec)] font-medium">Total Registered</p>
                          <p className="text-xl font-black text-[var(--fg)]">{usersStats.totalRegistered}</p>
                        </div>
                        <Users className="w-5 h-5 text-blue-500" />
                      </div>
                      <div className="p-4 bg-[var(--card)] border border-[var(--border)] rounded-xl flex items-center justify-between">
                        <div>
                          <p className="text-xs text-[var(--fg-sec)] font-medium">Active Accounts</p>
                          <p className="text-xl font-black text-emerald-500">{usersStats.totalActive}</p>
                        </div>
                        <CheckCircle2 className="w-5 h-5 text-emerald-500" />
                      </div>
                      <div className="p-4 bg-[var(--card)] border border-[var(--border)] rounded-xl flex items-center justify-between">
                        <div>
                          <p className="text-xs text-[var(--fg-sec)] font-medium">Suspended Accounts</p>
                          <p className="text-xl font-black text-rose-500">{usersStats.totalSuspended}</p>
                        </div>
                        <AlertTriangle className="w-5 h-5 text-rose-500" />
                      </div>
                    </div>

                    {/* Filter & Search Bar */}
                    <div className="p-4 bg-[var(--card)] border border-[var(--border)] rounded-2xl flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3 shadow-sm">
                      <div className="flex-1 relative">
                        <Search className="w-4 h-4 text-[var(--fg-sec)] absolute left-3 top-1/2 -translate-y-1/2" />
                        <input
                          type="text"
                          placeholder="Search users by name, email, or user ID..."
                          value={userSearch}
                          onChange={(e) => {
                            setUserSearch(e.target.value);
                            setUserPage(1);
                          }}
                          className="w-full pl-9 pr-3 py-2 bg-[var(--bg-sec)] border border-[var(--border)] rounded-xl text-xs text-[var(--fg)] placeholder:text-[var(--fg-sec)] focus:outline-none focus:border-rose-600"
                        />
                      </div>

                      <div className="flex flex-wrap items-center gap-2">
                        {/* Status Filter */}
                        <select
                          value={userStatusFilter}
                          onChange={(e) => {
                            setUserStatusFilter(e.target.value);
                            setUserPage(1);
                          }}
                          className="px-3 py-2 bg-[var(--bg-sec)] border border-[var(--border)] rounded-xl text-xs text-[var(--fg)] focus:outline-none focus:border-rose-600"
                        >
                          <option value="All">All Statuses</option>
                          <option value="Active">Active Only</option>
                          <option value="Suspended">Suspended Only</option>
                        </select>

                        {/* Sort Order */}
                        <select
                          value={userSortBy}
                          onChange={(e) => {
                            setUserSortBy(e.target.value);
                            setUserPage(1);
                          }}
                          className="px-3 py-2 bg-[var(--bg-sec)] border border-[var(--border)] rounded-xl text-xs text-[var(--fg)] focus:outline-none focus:border-rose-600"
                        >
                          <option value="newest">Newest First</option>
                          <option value="oldest">Oldest First</option>
                          <option value="name">Name (A-Z)</option>
                          <option value="bookings">Most Bookings</option>
                        </select>

                        {/* Page Size */}
                        <select
                          value={userLimit}
                          onChange={(e) => {
                            setUserLimit(Number(e.target.value));
                            setUserPage(1);
                          }}
                          className="px-3 py-2 bg-[var(--bg-sec)] border border-[var(--border)] rounded-xl text-xs text-[var(--fg)] focus:outline-none focus:border-rose-600"
                        >
                          <option value={10}>10 per page</option>
                          <option value={25}>25 per page</option>
                          <option value={50}>50 per page</option>
                        </select>

                        {/* Export to CSV */}
                        <button
                          onClick={handleExportUsersCsv}
                          className="px-3 py-2 bg-[var(--bg-sec)] hover:bg-[var(--border)] text-[var(--fg)] border border-[var(--border)] rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-colors"
                          title="Export Filtered Users to CSV"
                        >
                          <FileSpreadsheet className="w-3.5 h-3.5 text-emerald-500" />
                          <span>Export CSV</span>
                        </button>
                      </div>
                    </div>

                    {/* Users Data Table */}
                    <div className="bg-[var(--card)] border border-[var(--border)] rounded-2xl overflow-hidden shadow-sm">
                      <div className="overflow-x-auto">
                        <table className="w-full text-left text-xs text-[var(--fg)]">
                          <thead className="bg-[var(--bg-sec)] text-[var(--fg-sec)] font-semibold border-b border-[var(--border)]">
                            <tr>
                              <th className="p-3.5">User Profile & ID</th>
                              <th className="p-3.5">Contact Email</th>
                              <th className="p-3.5">Location</th>
                              <th className="p-3.5">Registered Date</th>
                              <th className="p-3.5">Status</th>
                              <th className="p-3.5">Total Bookings</th>
                              <th className="p-3.5">Lifetime Spend</th>
                              <th className="p-3.5 text-right">Actions</th>
                            </tr>
                          </thead>
                          <tbody className="divide-y divide-[var(--border)]">
                            {isLoadingUsers ? (
                              <tr>
                                <td colSpan={8} className="p-8 text-center text-[var(--fg-sec)]">
                                  <Loader2 className="w-6 h-6 animate-spin mx-auto mb-2 text-rose-600" />
                                  Loading user profiles from MongoDB...
                                </td>
                              </tr>
                            ) : usersList.length === 0 ? (
                              <tr>
                                <td colSpan={8} className="p-8 text-center text-[var(--fg-sec)]">
                                  No registered users matched the filter criteria.
                                </td>
                              </tr>
                            ) : (
                              usersList.map((u) => (
                                <tr key={u._id || u.id} className="hover:bg-[var(--bg-sec)]/50 transition-colors">
                                  <td className="p-3.5">
                                    <div className="flex items-center gap-3">
                                      <div className="w-8 h-8 rounded-full bg-rose-500/10 border border-rose-500/20 flex items-center justify-center font-bold text-rose-600 text-xs shrink-0">
                                        {u.firstName ? u.firstName.charAt(0).toUpperCase() : u.email.charAt(0).toUpperCase()}
                                      </div>
                                      <div>
                                        <p className="font-semibold text-[var(--fg)]">
                                          {u.firstName} {u.lastName || ''}
                                        </p>
                                        <p className="text-[10px] text-[var(--fg-sec)] font-mono">
                                          ID: {u.id || u._id}
                                        </p>
                                      </div>
                                    </div>
                                  </td>
                                  <td className="p-3.5 text-[var(--fg)]">
                                    <span>{u.email}</span>
                                    {u.emailVerified && (
                                      <span className="ml-1.5 inline-block text-[10px] text-emerald-500 font-bold" title="Email Verified">
                                        ✓
                                      </span>
                                    )}
                                  </td>
                                  <td className="p-3.5 text-[var(--fg-sec)]">
                                    {u.city || 'N/A'}, {u.country || 'USA'}
                                  </td>
                                  <td className="p-3.5 text-[var(--fg-sec)]">
                                    {u.createdAt ? new Date(u.createdAt).toLocaleDateString() : 'N/A'}
                                  </td>
                                  <td className="p-3.5">
                                    <span
                                      className={`px-2 py-0.5 rounded text-[10px] font-bold border ${
                                        u.status === 'Suspended'
                                          ? 'bg-rose-500/10 text-rose-600 border-rose-500/30'
                                          : 'bg-emerald-500/10 text-emerald-600 border-emerald-500/30'
                                      }`}
                                    >
                                      {u.status || 'Active'}
                                    </span>
                                  </td>
                                  <td className="p-3.5 font-semibold text-[var(--fg)]">
                                    {u.totalBookings || 0}
                                  </td>
                                  <td className="p-3.5 font-bold text-[var(--fg)]">
                                    ${(u.totalSpent || 0).toFixed(2)}
                                  </td>
                                  <td className="p-3.5 text-right space-x-1.5 flex justify-end items-center">
                                    <button
                                      onClick={() => handleOpenUserDetails(u._id || u.id)}
                                      className="px-2.5 py-1 bg-[var(--bg-sec)] hover:bg-[var(--border)] text-[var(--fg)] border border-[var(--border)] rounded-lg text-[11px] font-medium transition-colors"
                                      title="View Detailed Profile & Orders"
                                    >
                                      Details
                                    </button>
                                    {u.role !== 'super_admin' && (
                                      <>
                                        <button
                                          onClick={() => handleToggleUserStatus(u)}
                                          className={`px-2 py-1 rounded-lg text-[11px] font-medium transition-colors border ${
                                            u.status === 'Suspended'
                                              ? 'bg-emerald-500/10 text-emerald-600 border-emerald-500/20 hover:bg-emerald-500/20'
                                              : 'bg-amber-500/10 text-amber-600 border-amber-500/20 hover:bg-amber-500/20'
                                          }`}
                                          title={u.status === 'Suspended' ? 'Reactivate Account' : 'Suspend Account'}
                                        >
                                          {u.status === 'Suspended' ? 'Reactivate' : 'Suspend'}
                                        </button>
                                        <button
                                          onClick={() => handleDeleteUser(u)}
                                          className="p-1 text-rose-600 hover:bg-rose-500/10 rounded-lg transition-colors"
                                          title="Delete Account"
                                        >
                                          <Trash2 className="w-3.5 h-3.5" />
                                        </button>
                                      </>
                                    )}
                                  </td>
                                </tr>
                              ))
                            )}
                          </tbody>
                        </table>
                      </div>

                      {/* Pagination Footer */}
                      <div className="p-4 border-t border-[var(--border)] flex items-center justify-between text-xs text-[var(--fg-sec)]">
                        <span>
                          Showing page {userPage} of {userPagination.totalPages} ({userPagination.total} total matching users)
                        </span>
                        <div className="flex items-center gap-1.5">
                          <button
                            onClick={() => setUserPage((p) => Math.max(1, p - 1))}
                            disabled={userPage <= 1}
                            className="p-1.5 rounded-lg border border-[var(--border)] disabled:opacity-40 hover:bg-[var(--bg-sec)]"
                          >
                            <ChevronLeft className="w-4 h-4" />
                          </button>
                          <span className="px-2 font-semibold text-[var(--fg)]">{userPage}</span>
                          <button
                            onClick={() => setUserPage((p) => Math.min(userPagination.totalPages, p + 1))}
                            disabled={userPage >= userPagination.totalPages}
                            className="p-1.5 rounded-lg border border-[var(--border)] disabled:opacity-40 hover:bg-[var(--bg-sec)]"
                          >
                            <ChevronRight className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {/* ========================================================= */}
                {/* TAB 3: TICKET & EVENT MANAGEMENT                          */}
                {/* ========================================================= */}
                {activeTab === 'tickets' && (
                  <div className="space-y-5">
                    {/* Event Stats Bar */}
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                      <div className="p-4 bg-[var(--card)] border border-[var(--border)] rounded-xl">
                        <p className="text-xs text-[var(--fg-sec)]">Total Catalog Events</p>
                        <p className="text-xl font-black text-[var(--fg)]">{eventsStats.totalEvents}</p>
                      </div>
                      <div className="p-4 bg-[var(--card)] border border-[var(--border)] rounded-xl">
                        <p className="text-xs text-[var(--fg-sec)]">Published Live</p>
                        <p className="text-xl font-black text-emerald-500">{eventsStats.publishedCount}</p>
                      </div>
                      <div className="p-4 bg-[var(--card)] border border-[var(--border)] rounded-xl">
                        <p className="text-xs text-[var(--fg-sec)]">Draft Listings</p>
                        <p className="text-xl font-black text-amber-500">{eventsStats.draftCount}</p>
                      </div>
                      <div className="p-4 bg-[var(--card)] border border-[var(--border)] rounded-xl">
                        <p className="text-xs text-[var(--fg-sec)]">Sold Out Events</p>
                        <p className="text-xl font-black text-rose-500">{eventsStats.soldOutCount}</p>
                      </div>
                    </div>

                    {/* Filter & Controls */}
                    <div className="p-4 bg-[var(--card)] border border-[var(--border)] rounded-2xl flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3 shadow-sm">
                      <div className="flex-1 relative">
                        <Search className="w-4 h-4 text-[var(--fg-sec)] absolute left-3 top-1/2 -translate-y-1/2" />
                        <input
                          type="text"
                          placeholder="Search events by title, artist, venue, or city..."
                          value={eventSearch}
                          onChange={(e) => {
                            setEventSearch(e.target.value);
                            setEventPage(1);
                          }}
                          className="w-full pl-9 pr-3 py-2 bg-[var(--bg-sec)] border border-[var(--border)] rounded-xl text-xs text-[var(--fg)] placeholder:text-[var(--fg-sec)] focus:outline-none focus:border-rose-600"
                        />
                      </div>

                      <div className="flex flex-wrap items-center gap-2">
                        {/* Category filter */}
                        <select
                          value={eventCategoryFilter}
                          onChange={(e) => {
                            setEventCategoryFilter(e.target.value);
                            setEventPage(1);
                          }}
                          className="px-3 py-2 bg-[var(--bg-sec)] border border-[var(--border)] rounded-xl text-xs text-[var(--fg)] focus:outline-none focus:border-rose-600"
                        >
                          <option value="all">All Categories</option>
                          <option value="concerts">Concerts</option>
                          <option value="sports">Sports</option>
                          <option value="arts-theater">Theater & Arts</option>
                          <option value="comedy">Comedy</option>
                          <option value="family">Family</option>
                        </select>

                        {/* Status filter */}
                        <select
                          value={eventStatusFilter}
                          onChange={(e) => {
                            setEventStatusFilter(e.target.value);
                            setEventPage(1);
                          }}
                          className="px-3 py-2 bg-[var(--bg-sec)] border border-[var(--border)] rounded-xl text-xs text-[var(--fg)] focus:outline-none focus:border-rose-600"
                        >
                          <option value="all">All Statuses</option>
                          <option value="Published">Published</option>
                          <option value="Draft">Draft</option>
                          <option value="Sold Out">Sold Out</option>
                          <option value="Cancelled">Cancelled</option>
                        </select>

                        {/* Sort */}
                        <select
                          value={eventSortBy}
                          onChange={(e) => {
                            setEventSortBy(e.target.value);
                            setEventPage(1);
                          }}
                          className="px-3 py-2 bg-[var(--bg-sec)] border border-[var(--border)] rounded-xl text-xs text-[var(--fg)] focus:outline-none focus:border-rose-600"
                        >
                          <option value="newest">Newest First</option>
                          <option value="date">Event Date</option>
                          <option value="priceAsc">Price: Low to High</option>
                          <option value="priceDesc">Price: High to Low</option>
                        </select>

                        {/* View Mode */}
                        <div className="inline-flex rounded-xl border border-[var(--border)] p-1 bg-[var(--bg-sec)]">
                          <button
                            onClick={() => setEventViewMode('grid')}
                            className={`px-2.5 py-1 rounded-lg text-xs font-semibold ${
                              eventViewMode === 'grid' ? 'bg-rose-600 text-white' : 'text-[var(--fg-sec)]'
                            }`}
                          >
                            Grid
                          </button>
                          <button
                            onClick={() => setEventViewMode('list')}
                            className={`px-2.5 py-1 rounded-lg text-xs font-semibold ${
                              eventViewMode === 'list' ? 'bg-rose-600 text-white' : 'text-[var(--fg-sec)]'
                            }`}
                          >
                            List
                          </button>
                        </div>

                        {/* Per Page */}
                        <select
                          value={eventLimit}
                          onChange={(e) => {
                            setEventLimit(Number(e.target.value));
                            setEventPage(1);
                          }}
                          className="px-3 py-2 bg-[var(--bg-sec)] border border-[var(--border)] rounded-xl text-xs text-[var(--fg)] focus:outline-none focus:border-rose-600"
                        >
                          <option value={12}>12 / page</option>
                          <option value={24}>24 / page</option>
                          <option value={50}>50 / page</option>
                          <option value={100}>100 / page</option>
                        </select>

                        {/* Direct Add Event Button */}
                        <button
                          onClick={handleOpenCreateEventWizard}
                          className="px-3.5 py-2 bg-rose-600 hover:bg-rose-700 text-white font-semibold rounded-xl text-xs transition-all shadow-md shadow-rose-600/20 flex items-center gap-1.5 shrink-0"
                        >
                          <PlusCircle className="w-3.5 h-3.5" />
                          <span>Add New Event</span>
                        </button>
                      </div>
                    </div>

                    {/* Events Display */}
                    {isLoadingEvents ? (
                      <div className="py-16 text-center text-xs text-[var(--fg-sec)] bg-[var(--card)] rounded-2xl border border-[var(--border)]">
                        <Loader2 className="w-6 h-6 animate-spin mx-auto mb-2 text-rose-600" />
                        Loading real events from MongoDB database...
                      </div>
                    ) : eventsList.length === 0 ? (
                      <div className="py-16 text-center text-xs text-[var(--fg-sec)] bg-[var(--card)] rounded-2xl border border-[var(--border)]">
                        No events matched your search or filter.
                      </div>
                    ) : eventViewMode === 'grid' ? (
                      /* Grid View */
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        {eventsList.map((event) => (
                          <div
                            key={event.id || event._id}
                            className="bg-[var(--card)] border border-[var(--border)] rounded-2xl p-4 flex flex-col justify-between hover:border-rose-500/40 transition-all shadow-sm"
                          >
                            <div>
                              <div className="relative h-40 w-full rounded-xl overflow-hidden mb-3 bg-[var(--bg-sec)]">
                                <Image
                                  src={event.image}
                                  alt={event.title}
                                  fill
                                  className="object-cover"
                                  unoptimized
                                />
                                <div className="absolute top-2 left-2 flex items-center gap-1.5">
                                  <span
                                    className={`px-2 py-0.5 rounded text-[10px] font-bold shadow ${
                                      event.status === 'Draft'
                                        ? 'bg-amber-600 text-white'
                                        : event.status === 'Sold Out'
                                        ? 'bg-red-600 text-white'
                                        : event.status === 'Cancelled'
                                        ? 'bg-gray-600 text-white'
                                        : 'bg-emerald-600 text-white'
                                    }`}
                                  >
                                    {event.status}
                                  </span>
                                  {event.uploadedByAdmin && (
                                    <span className="px-2 py-0.5 rounded bg-rose-600 text-white text-[10px] font-bold shadow">
                                      Admin Upload
                                    </span>
                                  )}
                                </div>
                                <span className="absolute bottom-2 right-2 px-2 py-0.5 rounded bg-[var(--card)]/90 backdrop-blur-md text-[var(--fg)] text-[10px] font-semibold border border-[var(--border)]">
                                  {event.category?.toUpperCase()}
                                </span>
                              </div>

                              <h4 className="font-bold text-[var(--fg)] text-sm line-clamp-1">{event.title}</h4>
                              <p className="text-xs text-[var(--fg-sec)] mt-0.5 line-clamp-1">
                                {event.artist} · {event.venue}, {event.city}
                              </p>
                              <p className="text-[11px] text-[var(--fg-sec)] mt-1 flex items-center gap-1.5">
                                <Calendar className="w-3.5 h-3.5 text-rose-500" />
                                <span>{event.date} · {event.time}</span>
                              </p>

                              {/* Ticket Types Summary Pill */}
                              {event.ticketTypes && event.ticketTypes.length > 0 && (
                                <div className="mt-3 flex flex-wrap gap-1">
                                  {event.ticketTypes.slice(0, 3).map((tt, idx) => (
                                    <span
                                      key={idx}
                                      className="px-2 py-0.5 text-[10px] rounded-md bg-[var(--bg-sec)] border border-[var(--border)] text-[var(--fg-sec)]"
                                    >
                                      {tt.name}: <strong className="text-[var(--fg)]">${tt.price}</strong> ({tt.availableQuantity || tt.totalQuantity} left)
                                    </span>
                                  ))}
                                  {event.ticketTypes.length > 3 && (
                                    <span className="px-1.5 py-0.5 text-[10px] text-[var(--fg-sec)]">
                                      +{event.ticketTypes.length - 3} more
                                    </span>
                                  )}
                                </div>
                              )}
                            </div>

                            <div className="pt-4 border-t border-[var(--border)] mt-4 flex items-center justify-between">
                              <div>
                                <span className="text-[10px] text-[var(--fg-sec)] block">Starting from</span>
                                <span className="text-base font-black text-rose-600">${event.priceFrom}+</span>
                              </div>

                              <div className="flex items-center gap-1.5">
                                <button
                                  onClick={() => setEventPreviewModal(event)}
                                  className="p-1.5 text-[var(--fg-sec)] hover:text-[var(--fg)] hover:bg-[var(--bg-sec)] rounded-lg border border-[var(--border)] transition-colors"
                                  title="Customer Preview"
                                >
                                  <Eye className="w-3.5 h-3.5" />
                                </button>
                                <button
                                  onClick={() => handleDuplicateEvent(event)}
                                  className="p-1.5 text-[var(--fg-sec)] hover:text-[var(--fg)] hover:bg-[var(--bg-sec)] rounded-lg border border-[var(--border)] transition-colors"
                                  title="Duplicate Event"
                                >
                                  <Copy className="w-3.5 h-3.5" />
                                </button>
                                <button
                                  onClick={() => handleOpenEditEventWizard(event)}
                                  className="px-2.5 py-1.5 bg-[var(--bg-sec)] hover:bg-[var(--border)] text-[var(--fg)] border border-[var(--border)] rounded-lg text-xs font-semibold transition-colors flex items-center gap-1"
                                >
                                  <Edit3 className="w-3.5 h-3.5" />
                                  <span>Edit</span>
                                </button>
                                <button
                                  onClick={() => handleDeleteEvent(event)}
                                  className="p-1.5 bg-rose-500/10 hover:bg-rose-500/20 text-rose-600 border border-rose-500/30 rounded-lg transition-colors"
                                  title="Delete Event"
                                >
                                  <Trash2 className="w-3.5 h-3.5" />
                                </button>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    ) : (
                      /* List View */
                      <div className="bg-[var(--card)] border border-[var(--border)] rounded-2xl overflow-hidden shadow-sm">
                        <table className="w-full text-left text-xs text-[var(--fg)]">
                          <thead className="bg-[var(--bg-sec)] text-[var(--fg-sec)] font-semibold border-b border-[var(--border)]">
                            <tr>
                              <th className="p-3.5">Event Details</th>
                              <th className="p-3.5">Category</th>
                              <th className="p-3.5">Venue & City</th>
                              <th className="p-3.5">Date & Time</th>
                              <th className="p-3.5">Starting Price</th>
                              <th className="p-3.5">Status</th>
                              <th className="p-3.5 text-right">Actions</th>
                            </tr>
                          </thead>
                          <tbody className="divide-y divide-[var(--border)]">
                            {eventsList.map((event) => (
                              <tr key={event.id || event._id} className="hover:bg-[var(--bg-sec)]/50 transition-colors">
                                <td className="p-3.5">
                                  <div className="flex items-center gap-3">
                                    <div className="relative w-12 h-10 rounded-lg overflow-hidden shrink-0 bg-[var(--bg-sec)]">
                                      <Image src={event.image} alt={event.title} fill className="object-cover" unoptimized />
                                    </div>
                                    <div>
                                      <p className="font-semibold text-[var(--fg)] line-clamp-1">{event.title}</p>
                                      <p className="text-[10px] text-[var(--fg-sec)]">{event.artist}</p>
                                    </div>
                                  </div>
                                </td>
                                <td className="p-3.5 uppercase text-[11px] font-semibold text-[var(--fg-sec)]">{event.category}</td>
                                <td className="p-3.5 text-[var(--fg-sec)]">{event.venue}, {event.city}</td>
                                <td className="p-3.5 text-[var(--fg-sec)]">{event.date} · {event.time}</td>
                                <td className="p-3.5 font-bold text-rose-600">${event.priceFrom}+</td>
                                <td className="p-3.5">
                                  <span
                                    className={`px-2 py-0.5 rounded text-[10px] font-bold border ${
                                      event.status === 'Draft'
                                        ? 'bg-amber-500/10 text-amber-500 border-amber-500/20'
                                        : event.status === 'Sold Out'
                                        ? 'bg-rose-500/10 text-rose-500 border-rose-500/20'
                                        : 'bg-emerald-500/10 text-emerald-500 border-emerald-500/20'
                                    }`}
                                  >
                                    {event.status}
                                  </span>
                                </td>
                                <td className="p-3.5 text-right space-x-1.5 flex justify-end items-center">
                                  <button onClick={() => setEventPreviewModal(event)} className="p-1 text-[var(--fg-sec)] hover:text-[var(--fg)]">
                                    <Eye className="w-3.5 h-3.5" />
                                  </button>
                                  <button onClick={() => handleDuplicateEvent(event)} className="p-1 text-[var(--fg-sec)] hover:text-[var(--fg)]">
                                    <Copy className="w-3.5 h-3.5" />
                                  </button>
                                  <button
                                    onClick={() => handleOpenEditEventWizard(event)}
                                    className="px-2 py-1 bg-[var(--bg-sec)] hover:bg-[var(--border)] text-[var(--fg)] border border-[var(--border)] rounded-md text-[11px] font-semibold"
                                  >
                                    Edit
                                  </button>
                                  <button onClick={() => handleDeleteEvent(event)} className="p-1 text-rose-600 hover:bg-rose-500/10 rounded">
                                    <Trash2 className="w-3.5 h-3.5" />
                                  </button>
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    )}

                    {/* Events Pagination */}
                    <div className="p-4 bg-[var(--card)] border border-[var(--border)] rounded-2xl flex items-center justify-between text-xs text-[var(--fg-sec)]">
                      <span>
                        Showing page {eventPage} of {eventPagination.totalPages} ({eventPagination.total} total matching events)
                      </span>
                      <div className="flex items-center gap-1.5">
                        <button
                          onClick={() => setEventPage((p) => Math.max(1, p - 1))}
                          disabled={eventPage <= 1}
                          className="p-1.5 rounded-lg border border-[var(--border)] disabled:opacity-40 hover:bg-[var(--bg-sec)]"
                        >
                          <ChevronLeft className="w-4 h-4" />
                        </button>
                        <span className="px-2 font-semibold text-[var(--fg)]">{eventPage}</span>
                        <button
                          onClick={() => setEventPage((p) => Math.min(eventPagination.totalPages, p + 1))}
                          disabled={eventPage >= eventPagination.totalPages}
                          className="p-1.5 rounded-lg border border-[var(--border)] disabled:opacity-40 hover:bg-[var(--bg-sec)]"
                        >
                          <ChevronRight className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                )}

                {/* ========================================================= */}
                {/* TAB 4: ORDERS & COMPLETE ORDER MANAGEMENT                 */}
                {/* ========================================================= */}
                {activeTab === 'orders' && (
                  <div className="space-y-5">
                    {/* Professional 8-Metric Orders Summary Dashboard */}
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                      {/* Total Orders */}
                      <div className="p-4 bg-[var(--card)] border border-[var(--border)] rounded-xl relative overflow-hidden">
                        <div className="flex items-center justify-between mb-1">
                          <span className="text-[11px] text-[var(--fg-sec)] font-medium">Total Orders</span>
                          <ShoppingBag className="w-4 h-4 text-rose-500" />
                        </div>
                        <p className="text-xl font-black text-[var(--fg)]">{ordersStats.totalOrders}</p>
                        <span className="text-[10px] text-[var(--fg-sec)]">All database checkout records</span>
                      </div>

                      {/* Confirmed Orders */}
                      <div className="p-4 bg-[var(--card)] border border-[var(--border)] rounded-xl relative overflow-hidden">
                        <div className="flex items-center justify-between mb-1">
                          <span className="text-[11px] text-[var(--fg-sec)] font-medium">Confirmed Paid</span>
                          <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                        </div>
                        <p className="text-xl font-black text-emerald-500">{ordersStats.confirmedOrders}</p>
                        <span className="text-[10px] text-emerald-600/80">Active tickets issued</span>
                      </div>

                      {/* Pending Payments */}
                      <div className="p-4 bg-[var(--card)] border border-[var(--border)] rounded-xl relative overflow-hidden">
                        <div className="flex items-center justify-between mb-1">
                          <span className="text-[11px] text-[var(--fg-sec)] font-medium">Pending Payments</span>
                          <Clock className="w-4 h-4 text-amber-500" />
                        </div>
                        <p className="text-xl font-black text-amber-500">{ordersStats.pendingPayments}</p>
                        <span className="text-[10px] text-[var(--fg-sec)]">Awaiting gateway capture</span>
                      </div>

                      {/* Failed Payments */}
                      <div className="p-4 bg-[var(--card)] border border-[var(--border)] rounded-xl relative overflow-hidden">
                        <div className="flex items-center justify-between mb-1">
                          <span className="text-[11px] text-[var(--fg-sec)] font-medium">Failed Payments</span>
                          <Ban className="w-4 h-4 text-red-500" />
                        </div>
                        <p className="text-xl font-black text-red-500">{ordersStats.failedPayments}</p>
                        <span className="text-[10px] text-[var(--fg-sec)]">Card declined or aborted</span>
                      </div>

                      {/* Cancelled Bookings */}
                      <div className="p-4 bg-[var(--card)] border border-[var(--border)] rounded-xl relative overflow-hidden">
                        <div className="flex items-center justify-between mb-1">
                          <span className="text-[11px] text-[var(--fg-sec)] font-medium">Cancelled Bookings</span>
                          <X className="w-4 h-4 text-gray-500" />
                        </div>
                        <p className="text-xl font-black text-gray-400">{ordersStats.cancelledOrders}</p>
                        <span className="text-[10px] text-[var(--fg-sec)]">Seats released back to event</span>
                      </div>

                      {/* Total Ticket Qty Sold */}
                      <div className="p-4 bg-[var(--card)] border border-[var(--border)] rounded-xl relative overflow-hidden">
                        <div className="flex items-center justify-between mb-1">
                          <span className="text-[11px] text-[var(--fg-sec)] font-medium">Ticket Qty Sold</span>
                          <Ticket className="w-4 h-4 text-purple-500" />
                        </div>
                        <p className="text-xl font-black text-purple-500">{ordersStats.totalTicketQuantitySold}</p>
                        <span className="text-[10px] text-[var(--fg-sec)]">Confirmed admission passes</span>
                      </div>

                      {/* Gross Sales */}
                      <div className="p-4 bg-[var(--card)] border border-[var(--border)] rounded-xl relative overflow-hidden">
                        <div className="flex items-center justify-between mb-1">
                          <span className="text-[11px] text-[var(--fg-sec)] font-medium">Gross Platform Sales</span>
                          <DollarSign className="w-4 h-4 text-rose-500" />
                        </div>
                        <p className="text-xl font-black text-rose-600">${ordersStats.grossSales.toFixed(2)}</p>
                        <span className="text-[10px] text-rose-600/80">Excludes failed & unpaid</span>
                      </div>

                      {/* Refunded Amount */}
                      <div className="p-4 bg-[var(--card)] border border-[var(--border)] rounded-xl relative overflow-hidden">
                        <div className="flex items-center justify-between mb-1">
                          <span className="text-[11px] text-[var(--fg-sec)] font-medium">Refunded Amount</span>
                          <RefreshCw className="w-4 h-4 text-purple-400" />
                        </div>
                        <p className="text-xl font-black text-purple-400">
                          ${ordersStats.refundedAmount.toFixed(2)}
                        </p>
                        <span className="text-[10px] text-[var(--fg-sec)]">{ordersStats.refundedCount} refund(s) issued</span>
                      </div>
                    </div>

                    {/* Filter, Search & Controls Bar */}
                    <div className="p-4 bg-[var(--card)] border border-[var(--border)] rounded-2xl flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3 shadow-sm">
                      <div className="flex-1 relative">
                        <Search className="w-4 h-4 text-[var(--fg-sec)] absolute left-3 top-1/2 -translate-y-1/2" />
                        <input
                          type="text"
                          placeholder="Search Order ID (#TX-...), customer name, or customer email..."
                          value={orderSearch}
                          onChange={(e) => {
                            setOrderSearch(e.target.value);
                            setOrderPage(1);
                          }}
                          className="w-full pl-9 pr-3 py-2 bg-[var(--bg-sec)] border border-[var(--border)] rounded-xl text-xs text-[var(--fg)] placeholder:text-[var(--fg-sec)] focus:outline-none focus:border-rose-600"
                        />
                      </div>

                      <div className="flex flex-wrap items-center gap-2">
                        {/* Payment Status Filter */}
                        <select
                          value={orderPaymentStatusFilter}
                          onChange={(e) => {
                            setOrderPaymentStatusFilter(e.target.value);
                            setOrderPage(1);
                          }}
                          className="px-3 py-2 bg-[var(--bg-sec)] border border-[var(--border)] rounded-xl text-xs text-[var(--fg)] focus:outline-none focus:border-rose-600"
                        >
                          <option value="all">Payment: All</option>
                          <option value="Paid">Payment: Paid</option>
                          <option value="Pending">Payment: Pending</option>
                          <option value="Failed">Payment: Failed</option>
                          <option value="Refunded">Payment: Refunded</option>
                        </select>

                        {/* Booking Status Filter */}
                        <select
                          value={orderBookingStatusFilter}
                          onChange={(e) => {
                            setOrderBookingStatusFilter(e.target.value);
                            setOrderPage(1);
                          }}
                          className="px-3 py-2 bg-[var(--bg-sec)] border border-[var(--border)] rounded-xl text-xs text-[var(--fg)] focus:outline-none focus:border-rose-600"
                        >
                          <option value="all">Booking: All</option>
                          <option value="Confirmed">Booking: Confirmed</option>
                          <option value="Refunded">Booking: Refunded</option>
                          <option value="Cancelled">Booking: Cancelled</option>
                        </select>

                        {/* Sort */}
                        <select
                          value={orderSortBy}
                          onChange={(e) => {
                            setOrderSortBy(e.target.value);
                            setOrderPage(1);
                          }}
                          className="px-3 py-2 bg-[var(--bg-sec)] border border-[var(--border)] rounded-xl text-xs text-[var(--fg)] focus:outline-none focus:border-rose-600"
                        >
                          <option value="newest">Newest First</option>
                          <option value="oldest">Oldest First</option>
                          <option value="amountHigh">Amount: High to Low</option>
                          <option value="amountLow">Amount: Low to High</option>
                        </select>

                        {/* Limit */}
                        <select
                          value={orderLimit}
                          onChange={(e) => {
                            setOrderLimit(Number(e.target.value));
                            setOrderPage(1);
                          }}
                          className="px-3 py-2 bg-[var(--bg-sec)] border border-[var(--border)] rounded-xl text-xs text-[var(--fg)] focus:outline-none focus:border-rose-600"
                        >
                          <option value={10}>10 per page</option>
                          <option value={25}>25 per page</option>
                          <option value={50}>50 per page</option>
                        </select>

                        {/* Export CSV */}
                        <button
                          onClick={handleExportOrdersCsv}
                          className="px-3 py-2 bg-[var(--bg-sec)] hover:bg-[var(--border)] text-[var(--fg)] border border-[var(--border)] rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-colors"
                          title="Export Filtered Orders to CSV"
                        >
                          <FileSpreadsheet className="w-3.5 h-3.5 text-emerald-500" />
                          <span>Export CSV</span>
                        </button>

                        <button
                          onClick={() => fetchOrders()}
                          className="p-2 bg-[var(--bg-sec)] hover:bg-[var(--border)] text-[var(--fg)] border border-[var(--border)] rounded-xl text-xs transition-colors"
                          title="Refresh Orders"
                        >
                          <RefreshCw className={`w-4 h-4 ${isLoadingOrders ? 'animate-spin' : ''}`} />
                        </button>
                      </div>
                    </div>

                    {/* API Error State with Retry Button */}
                    {ordersError && (
                      <div className="p-4 bg-rose-500/10 border border-rose-500/30 rounded-2xl flex items-center justify-between text-xs text-rose-500">
                        <div className="flex items-center gap-2">
                          <AlertTriangle className="w-4 h-4 shrink-0" />
                          <span>{ordersError}</span>
                        </div>
                        <button
                          onClick={() => fetchOrders()}
                          className="px-3 py-1.5 bg-rose-600 hover:bg-rose-700 text-white font-bold rounded-lg transition-colors"
                        >
                          Retry
                        </button>
                      </div>
                    )}

                    {/* Orders Table */}
                    <div className="bg-[var(--card)] border border-[var(--border)] rounded-2xl overflow-hidden shadow-sm">
                      <div className="overflow-x-auto">
                        <table className="w-full text-left text-xs text-[var(--fg)]">
                          <thead className="bg-[var(--bg-sec)] text-[var(--fg-sec)] font-semibold border-b border-[var(--border)]">
                            <tr>
                              <th className="p-3.5">Order Ref ID</th>
                              <th className="p-3.5">Customer</th>
                              <th className="p-3.5">Event Name</th>
                              <th className="p-3.5">Tier & Qty</th>
                              <th className="p-3.5">Total Amount</th>
                              <th className="p-3.5">Payment</th>
                              <th className="p-3.5">Booking Status</th>
                              <th className="p-3.5">Order Date & Time</th>
                              <th className="p-3.5 text-right">Actions</th>
                            </tr>
                          </thead>
                          <tbody className="divide-y divide-[var(--border)]">
                            {isLoadingOrders ? (
                              <tr>
                                <td colSpan={9} className="p-12 text-center text-[var(--fg-sec)]">
                                  <Loader2 className="w-6 h-6 animate-spin mx-auto mb-2 text-rose-600" />
                                  Loading real customer orders from MongoDB database...
                                </td>
                              </tr>
                            ) : !ordersError && ordersList.length === 0 ? (
                              <tr>
                                <td colSpan={9} className="p-12 text-center text-[var(--fg-sec)] space-y-3">
                                  <div className="w-12 h-12 rounded-full bg-[var(--bg-sec)] border border-[var(--border)] flex items-center justify-center mx-auto text-[var(--fg-sec)]">
                                    <ShoppingBag className="w-6 h-6 text-rose-500" />
                                  </div>
                                  <h4 className="text-sm font-bold text-[var(--fg)]">
                                    {ordersStats.totalOrders === 0 ? 'No Customer Orders in Database Yet' : 'No Orders Match Your Selected Filters'}
                                  </h4>
                                  <p className="text-xs text-[var(--fg-sec)] max-w-md mx-auto">
                                    {ordersStats.totalOrders === 0
                                      ? 'When customers purchase tickets on https://ticketxmaster.vercel.app/ through checkout, their orders, admission passes, and payments will appear here in real-time.'
                                      : 'Try clearing your search query or setting the payment and booking status filters back to "All".'}
                                  </p>
                                  {ordersStats.totalOrders > 0 && (
                                    <button
                                      onClick={() => {
                                        setOrderSearch('');
                                        setOrderPaymentStatusFilter('all');
                                        setOrderBookingStatusFilter('all');
                                        setOrderEventFilter('all');
                                        setOrderDateFrom('');
                                        setOrderDateTo('');
                                      }}
                                      className="px-3.5 py-1.5 bg-rose-600 hover:bg-rose-700 text-white font-semibold rounded-lg text-xs transition-colors"
                                    >
                                      Reset All Filters
                                    </button>
                                  )}
                                </td>
                              </tr>
                            ) : (
                              ordersList.map((order) => (
                                <tr key={order.orderId || order._id} className="hover:bg-[var(--bg-sec)]/50 transition-colors">
                                  <td className="p-3.5 font-mono font-bold text-rose-600">
                                    #{order.orderId}
                                  </td>
                                  <td className="p-3.5">
                                    <p className="font-semibold text-[var(--fg)]">
                                      {order.customer?.firstName} {order.customer?.lastName || ''}
                                    </p>
                                    <p className="text-[10px] text-[var(--fg-sec)]">{order.customer?.email}</p>
                                  </td>
                                  <td className="p-3.5 font-semibold text-[var(--fg)] max-w-[180px] truncate">
                                    {order.eventTitle}
                                  </td>
                                  <td className="p-3.5 text-[var(--fg-sec)]">
                                    {order.ticketType || 'Standard'} ({order.quantity || 1} tickets)
                                  </td>
                                  <td className="p-3.5 font-bold text-[var(--fg)]">
                                    ${(order.pricing?.grandTotal || 0).toFixed(2)} <span className="text-[10px] text-[var(--fg-sec)] font-normal">{order.currency || 'USD'}</span>
                                  </td>
                                  <td className="p-3.5">
                                    <span
                                      className={`px-2 py-0.5 rounded text-[10px] font-bold border ${
                                        order.payment?.status === 'Refunded'
                                          ? 'bg-purple-500/10 text-purple-400 border-purple-500/20'
                                          : order.payment?.status === 'Pending'
                                          ? 'bg-amber-500/10 text-amber-500 border-amber-500/20'
                                          : order.payment?.status === 'Failed'
                                          ? 'bg-red-500/10 text-red-500 border-red-500/20'
                                          : 'bg-emerald-500/10 text-emerald-500 border-emerald-500/20'
                                      }`}
                                    >
                                      {order.payment?.status || 'Paid'}
                                    </span>
                                  </td>
                                  <td className="p-3.5">
                                    <span
                                      className={`px-2 py-0.5 rounded text-[10px] font-bold border ${
                                        order.status === 'Refunded'
                                          ? 'bg-purple-500/10 text-purple-400 border-purple-500/20'
                                          : order.status === 'Cancelled'
                                          ? 'bg-gray-500/10 text-gray-400 border-gray-500/20'
                                          : 'bg-emerald-500/10 text-emerald-500 border-emerald-500/20'
                                      }`}
                                    >
                                      {order.status}
                                    </span>
                                  </td>
                                  <td className="p-3.5 text-[var(--fg-sec)]">
                                    {new Date(order.createdAt).toLocaleString([], {
                                      year: 'numeric',
                                      month: 'short',
                                      day: 'numeric',
                                      hour: '2-digit',
                                      minute: '2-digit'
                                    })}
                                  </td>
                                  <td className="p-3.5 text-right space-x-1.5 flex justify-end items-center">
                                    <button
                                      onClick={() => handleOpenOrderDetails(order.orderId)}
                                      className="px-2.5 py-1 bg-[var(--bg-sec)] hover:bg-[var(--border)] text-[var(--fg)] border border-[var(--border)] rounded-lg text-[11px] font-medium transition-colors"
                                      title="View Detailed Order & Passes"
                                    >
                                      View Details
                                    </button>
                                    <button
                                      onClick={() => handlePrintReceipt(order)}
                                      className="p-1 text-[var(--fg-sec)] hover:text-[var(--fg)] hover:bg-[var(--bg-sec)] rounded-lg border border-[var(--border)] transition-colors"
                                      title="Download / Print Receipt"
                                    >
                                      <Printer className="w-3.5 h-3.5" />
                                    </button>
                                  </td>
                                </tr>
                              ))
                            )}
                          </tbody>
                        </table>
                      </div>

                      {/* Pagination Footer */}
                      <div className="p-4 border-t border-[var(--border)] flex items-center justify-between text-xs text-[var(--fg-sec)]">
                        <span>
                          Showing page {orderPage} of {orderPagination.totalPages} ({orderPagination.total} total orders)
                        </span>
                        <div className="flex items-center gap-1.5">
                          <button
                            onClick={() => setOrderPage((p) => Math.max(1, p - 1))}
                            disabled={orderPage <= 1}
                            className="p-1.5 rounded-lg border border-[var(--border)] disabled:opacity-40 hover:bg-[var(--bg-sec)]"
                          >
                            <ChevronLeft className="w-4 h-4" />
                          </button>
                          <span className="px-2 font-semibold text-[var(--fg)]">{orderPage}</span>
                          <button
                            onClick={() => setOrderPage((p) => Math.min(orderPagination.totalPages, p + 1))}
                            disabled={orderPage >= orderPagination.totalPages}
                            className="p-1.5 rounded-lg border border-[var(--border)] disabled:opacity-40 hover:bg-[var(--bg-sec)]"
                          >
                            <ChevronRight className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {/* ========================================================= */}
                {/* TAB 5: ADMIN PROFILE & SECURE ACCOUNT MANAGEMENT          */}
                {/* ========================================================= */}
                {activeTab === 'settings' && (
                  <div className="max-w-4xl space-y-6">
                    {/* A. Authenticated Admin Profile Card & Inline Edit */}
                    <div className="p-6 bg-[var(--card)] border border-[var(--border)] rounded-2xl shadow-sm">
                      <div className="flex items-center justify-between mb-4 pb-3 border-b border-[var(--border)]">
                        <div className="flex items-center gap-3">
                          <div className="w-12 h-12 rounded-full bg-rose-600 border-2 border-rose-500/40 flex items-center justify-center font-bold text-white text-base shadow">
                            {adminProfileData?.firstName?.charAt(0).toUpperCase() || activeAdmin?.firstName?.charAt(0).toUpperCase() || 'A'}
                          </div>
                          <div>
                            <h3 className="text-base font-bold text-[var(--fg)]">
                              {adminProfileData?.firstName || activeAdmin?.firstName} {adminProfileData?.lastName || activeAdmin?.lastName || ''}
                            </h3>
                            <p className="text-xs text-[var(--fg-sec)]">{adminProfileData?.email || activeAdmin?.email}</p>
                          </div>
                        </div>

                        {!isEditingProfile && (
                          <button
                            onClick={() => setIsEditingProfile(true)}
                            className="px-3.5 py-1.5 bg-[var(--bg-sec)] hover:bg-[var(--border)] text-[var(--fg)] border border-[var(--border)] rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-colors"
                          >
                            <Edit3 className="w-3.5 h-3.5" />
                            <span>Edit Profile</span>
                          </button>
                        )}
                      </div>

                      {/* Display Mode vs Edit Mode */}
                      {isEditingProfile ? (
                        <form onSubmit={handleSaveProfile} className="space-y-4 text-xs pt-2">
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <div>
                              <label className="block text-[var(--fg)] font-semibold mb-1">First Name *</label>
                              <input
                                type="text"
                                required
                                value={profileForm.firstName}
                                onChange={(e) => setProfileForm({ ...profileForm, firstName: e.target.value })}
                                className="w-full px-3 py-2 bg-[var(--bg-sec)] border border-[var(--border)] rounded-xl text-[var(--fg)] focus:outline-none focus:border-rose-600"
                              />
                            </div>
                            <div>
                              <label className="block text-[var(--fg)] font-semibold mb-1">Last Name</label>
                              <input
                                type="text"
                                value={profileForm.lastName}
                                onChange={(e) => setProfileForm({ ...profileForm, lastName: e.target.value })}
                                className="w-full px-3 py-2 bg-[var(--bg-sec)] border border-[var(--border)] rounded-xl text-[var(--fg)] focus:outline-none focus:border-rose-600"
                              />
                            </div>
                          </div>

                          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                            <div>
                              <label className="block text-[var(--fg)] font-semibold mb-1">Contact Phone</label>
                              <input
                                type="text"
                                value={profileForm.phone}
                                onChange={(e) => setProfileForm({ ...profileForm, phone: e.target.value })}
                                placeholder="+1 (555) 000-0000"
                                className="w-full px-3 py-2 bg-[var(--bg-sec)] border border-[var(--border)] rounded-xl text-[var(--fg)] focus:outline-none focus:border-rose-600"
                              />
                            </div>
                            <div>
                              <label className="block text-[var(--fg)] font-semibold mb-1">City</label>
                              <input
                                type="text"
                                value={profileForm.city}
                                onChange={(e) => setProfileForm({ ...profileForm, city: e.target.value })}
                                className="w-full px-3 py-2 bg-[var(--bg-sec)] border border-[var(--border)] rounded-xl text-[var(--fg)] focus:outline-none focus:border-rose-600"
                              />
                            </div>
                            <div>
                              <label className="block text-[var(--fg)] font-semibold mb-1">Country</label>
                              <input
                                type="text"
                                value={profileForm.country}
                                onChange={(e) => setProfileForm({ ...profileForm, country: e.target.value })}
                                className="w-full px-3 py-2 bg-[var(--bg-sec)] border border-[var(--border)] rounded-xl text-[var(--fg)] focus:outline-none focus:border-rose-600"
                              />
                            </div>
                          </div>

                          <div className="flex items-center justify-end gap-2 pt-2">
                            <button
                              type="button"
                              onClick={() => setIsEditingProfile(false)}
                              className="px-3.5 py-2 bg-[var(--bg-sec)] hover:bg-[var(--border)] text-[var(--fg)] rounded-xl text-xs font-semibold"
                            >
                              Cancel
                            </button>
                            <button
                              type="submit"
                              disabled={isSavingProfile}
                              className="px-4 py-2 bg-rose-600 hover:bg-rose-700 disabled:opacity-50 text-white font-bold rounded-xl text-xs transition-colors flex items-center gap-1.5"
                            >
                              {isSavingProfile ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Check className="w-3.5 h-3.5" />}
                              <span>Save Profile Changes</span>
                            </button>
                          </div>
                        </form>
                      ) : (
                        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 text-xs">
                          <div className="p-3 rounded-xl bg-[var(--bg-sec)] border border-[var(--border)]">
                            <span className="text-[var(--fg-sec)] block mb-1">Role Privilege</span>
                            <span className="px-2 py-0.5 rounded bg-rose-500/10 text-rose-600 font-bold border border-rose-500/20 text-[10px]">
                              Super Admin (Master Root)
                            </span>
                          </div>
                          <div className="p-3 rounded-xl bg-[var(--bg-sec)] border border-[var(--border)]">
                            <span className="text-[var(--fg-sec)] block mb-1">Account Status</span>
                            <span className="px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-600 font-bold border border-emerald-500/20 text-[10px]">
                              Active & Verified
                            </span>
                          </div>
                          <div className="p-3 rounded-xl bg-[var(--bg-sec)] border border-[var(--border)]">
                            <span className="text-[var(--fg-sec)] block mb-1">Phone & Location</span>
                            <span className="font-semibold text-[var(--fg)]">
                              {adminProfileData?.phone || 'Not provided'} · {adminProfileData?.city || 'New York'}
                            </span>
                          </div>
                          <div className="p-3 rounded-xl bg-[var(--bg-sec)] border border-[var(--border)]">
                            <span className="text-[var(--fg-sec)] block mb-1">Account Established</span>
                            <span className="font-semibold text-[var(--fg)]">
                              {adminProfileData?.createdAt ? new Date(adminProfileData.createdAt).toLocaleDateString() : 'Active'}
                            </span>
                          </div>
                        </div>
                      )}
                    </div>

                    {/* B. Secure Authorized Email Management */}
                    <div className="p-6 bg-[var(--card)] border border-[var(--border)] rounded-2xl shadow-sm">
                      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                        <div>
                          <h3 className="text-sm font-bold text-[var(--fg)] flex items-center gap-2">
                            <Mail className="w-4 h-4 text-rose-600" />
                            <span>Authorized Super Admin Email</span>
                          </h3>
                          <p className="text-xs text-[var(--fg-sec)] mt-1">
                            Current address: <strong className="text-[var(--fg)]">{activeAdmin?.email}</strong>. Email changes require cryptographic 6-digit OTP verification.
                          </p>
                        </div>

                        <button
                          onClick={() => {
                            setNewEmailInput('');
                            setEmailOtpInput('');
                            setChangeEmailStep(1);
                            setEmailChangeError('');
                            setIsChangeEmailModalOpen(true);
                          }}
                          className="px-3.5 py-2 bg-[var(--bg-sec)] hover:bg-[var(--border)] text-[var(--fg)] border border-[var(--border)] rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-colors"
                        >
                          <RefreshCw className="w-3.5 h-3.5 text-rose-500" />
                          <span>Change Authorized Email</span>
                        </button>
                      </div>
                    </div>

                    {/* C. Change Master Password Card */}
                    <div className="p-6 bg-[var(--card)] border border-[var(--border)] rounded-2xl shadow-sm">
                      <h3 className="text-sm font-bold text-[var(--fg)] mb-2 flex items-center gap-2">
                        <Key className="w-4 h-4 text-rose-600" />
                        <span>Change Super Admin Master Password</span>
                      </h3>
                      <p className="text-xs text-[var(--fg-sec)] mb-4">
                        Must be at least 8 characters long and contain at least one special character (!@#$%^&* etc.).
                      </p>

                      <form onSubmit={handleChangePassword} className="space-y-4 text-xs max-w-xl">
                        <div>
                          <label className="block text-[var(--fg)] font-semibold mb-1">Current Password *</label>
                          <div className="relative">
                            <input
                              type={showCurrentPassword ? 'text' : 'password'}
                              required
                              value={passwordForm.currentPassword}
                              onChange={(e) => setPasswordForm({ ...passwordForm, currentPassword: e.target.value })}
                              placeholder="••••••••••••"
                              className="w-full px-3 pr-10 py-2.5 bg-[var(--bg-sec)] border border-[var(--border)] rounded-xl text-[var(--fg)] focus:outline-none focus:border-rose-600"
                            />
                            <button
                              type="button"
                              onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                              className="absolute right-3 top-1/2 -translate-y-1/2 text-[var(--fg-sec)] hover:text-[var(--fg)]"
                            >
                              {showCurrentPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                            </button>
                          </div>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                          <div>
                            <label className="block text-[var(--fg)] font-semibold mb-1">New Password *</label>
                            <div className="relative">
                              <input
                                type={showNewPassword ? 'text' : 'password'}
                                required
                                value={passwordForm.newPassword}
                                onChange={(e) => setPasswordForm({ ...passwordForm, newPassword: e.target.value })}
                                placeholder="••••••••••••"
                                className="w-full px-3 pr-10 py-2.5 bg-[var(--bg-sec)] border border-[var(--border)] rounded-xl text-[var(--fg)] focus:outline-none focus:border-rose-600"
                              />
                              <button
                                type="button"
                                onClick={() => setShowNewPassword(!showNewPassword)}
                                className="absolute right-3 top-1/2 -translate-y-1/2 text-[var(--fg-sec)] hover:text-[var(--fg)]"
                              >
                                {showNewPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                              </button>
                            </div>
                          </div>

                          <div>
                            <label className="block text-[var(--fg)] font-semibold mb-1">Confirm New Password *</label>
                            <div className="relative">
                              <input
                                type={showConfirmNewPassword ? 'text' : 'password'}
                                required
                                value={passwordForm.confirmPassword}
                                onChange={(e) => setPasswordForm({ ...passwordForm, confirmPassword: e.target.value })}
                                placeholder="••••••••••••"
                                className="w-full px-3 pr-10 py-2.5 bg-[var(--bg-sec)] border border-[var(--border)] rounded-xl text-[var(--fg)] focus:outline-none focus:border-rose-600"
                              />
                              <button
                                type="button"
                                onClick={() => setShowConfirmNewPassword(!showConfirmNewPassword)}
                                className="absolute right-3 top-1/2 -translate-y-1/2 text-[var(--fg-sec)] hover:text-[var(--fg)]"
                              >
                                {showConfirmNewPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                              </button>
                            </div>
                          </div>
                        </div>

                        <button
                          type="submit"
                          disabled={isSavingPassword}
                          className="px-5 py-2.5 bg-rose-600 hover:bg-rose-700 disabled:opacity-50 text-white font-bold rounded-xl text-xs transition-colors flex items-center gap-1.5"
                        >
                          {isSavingPassword ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Lock className="w-3.5 h-3.5" />}
                          <span>Update Master Password</span>
                        </button>
                      </form>
                    </div>

                    {/* D. Security Telemetry & Active Sessions */}
                    <div className="p-6 bg-[var(--card)] border border-[var(--border)] rounded-2xl shadow-sm">
                      <h3 className="text-sm font-bold text-[var(--fg)] mb-4 flex items-center gap-2">
                        <Smartphone className="w-4 h-4 text-emerald-500" />
                        <span>Active Session Telemetry & Device Protection</span>
                      </h3>

                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
                        <div className="p-3.5 rounded-xl bg-[var(--bg-sec)] border border-[var(--border)]">
                          <span className="text-[var(--fg-sec)] block mb-1">Client IP Address</span>
                          <span className="font-mono font-bold text-[var(--fg)]">
                            {adminProfileData?.sessionInfo?.currentIp || '127.0.0.1'}
                          </span>
                        </div>
                        <div className="p-3.5 rounded-xl bg-[var(--bg-sec)] border border-[var(--border)]">
                          <span className="text-[var(--fg-sec)] block mb-1">Browser & Operating Platform</span>
                          <span className="font-semibold text-[var(--fg)]">
                            {adminProfileData?.sessionInfo?.browser} ({adminProfileData?.sessionInfo?.platform})
                          </span>
                        </div>
                        <div className="p-3.5 rounded-xl bg-[var(--bg-sec)] border border-[var(--border)]">
                          <span className="text-[var(--fg-sec)] block mb-1">Session Security State</span>
                          <span className="text-emerald-500 font-bold flex items-center gap-1.5">
                            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                            Live HttpOnly JWT Encrypted
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* E. Admin Activity & Security Audit Logs Feed */}
                    <div className="p-6 bg-[var(--card)] border border-[var(--border)] rounded-2xl shadow-sm">
                      <h3 className="text-sm font-bold text-[var(--fg)] mb-3 flex items-center gap-2">
                        <History className="w-4 h-4 text-purple-500" />
                        <span>Super Admin Security Audit Log Trail</span>
                      </h3>
                      <p className="text-xs text-[var(--fg-sec)] mb-4">
                        Immutable server-side activity records associated with administrative privileges.
                      </p>

                      {adminActivityLogs.length === 0 ? (
                        <p className="text-xs text-[var(--fg-sec)] py-4 text-center border border-[var(--border)] rounded-xl">
                          No administrative audit entries logged yet.
                        </p>
                      ) : (
                        <div className="space-y-2 max-h-56 overflow-y-auto">
                          {adminActivityLogs.map((log, i) => (
                            <div key={i} className="p-3 rounded-xl bg-[var(--bg-sec)] border border-[var(--border)] text-xs flex items-center justify-between">
                              <div>
                                <span className="font-bold text-rose-500 block">{log.action}</span>
                                <span className="text-[11px] text-[var(--fg)]">{log.details}</span>
                              </div>
                              <div className="text-right shrink-0">
                                <span className="text-[10px] text-[var(--fg-sec)] block">
                                  {new Date(log.createdAt).toLocaleDateString()}
                                </span>
                                <span className="text-[10px] text-[var(--fg-sec)]">
                                  {new Date(log.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                </span>
                              </div>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>

                    {/* F. Danger Zone */}
                    <div className="p-6 rounded-2xl border border-rose-500/30 bg-rose-500/5 shadow-sm space-y-4">
                      <div>
                        <h3 className="text-sm font-bold text-rose-600 flex items-center gap-2">
                          <AlertTriangle className="w-4 h-4" />
                          <span>Danger Zone & Emergency Access</span>
                        </h3>
                        <p className="text-xs text-[var(--fg-sec)] mt-1">
                          High-impact security controls. Self-service deletion of the permanent Super Admin is prohibited to ensure master system continuity.
                        </p>
                      </div>

                      <div className="flex flex-wrap items-center gap-3 pt-1">
                        <button
                          onClick={handleSignOutAllSessions}
                          className="px-4 py-2 bg-rose-600 hover:bg-rose-700 text-white font-bold rounded-xl text-xs transition-colors flex items-center gap-1.5 shadow"
                        >
                          <LogOut className="w-3.5 h-3.5" />
                          <span>Sign Out All Active Sessions & Devices</span>
                        </button>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </main>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ========================================================= */}
      {/* 2-STEP SECURE EMAIL CHANGE MODAL                          */}
      {/* ========================================================= */}
      <AnimatePresence>
        {isChangeEmailModalOpen && (
          <div className="fixed inset-0 z-[110] flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-[var(--card)] border border-[var(--border)] rounded-2xl w-full max-w-md p-6 shadow-2xl relative space-y-4"
            >
              <div className="flex items-center justify-between pb-3 border-b border-[var(--border)]">
                <h3 className="text-sm font-bold text-[var(--fg)] flex items-center gap-2">
                  <Mail className="w-4 h-4 text-rose-600" />
                  <span>Update Super Admin Authorized Email</span>
                </h3>
                <button onClick={() => setIsChangeEmailModalOpen(false)} className="text-[var(--fg-sec)] hover:text-[var(--fg)]">
                  <X className="w-4 h-4" />
                </button>
              </div>

              {emailChangeError && (
                <div className="p-3 bg-rose-500/10 border border-rose-500/20 text-rose-600 text-xs rounded-xl flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 shrink-0" />
                  <span>{emailChangeError}</span>
                </div>
              )}

              {changeEmailStep === 1 ? (
                <form onSubmit={handleRequestEmailChange} className="space-y-4 text-xs">
                  <p className="text-[var(--fg-sec)]">
                    Enter the new email address. A 6-digit cryptographic verification code will be dispatched to confirm ownership before your credentials are updated.
                  </p>
                  <div>
                    <label className="block text-[var(--fg)] font-semibold mb-1">New Email Address *</label>
                    <input
                      type="email"
                      required
                      value={newEmailInput}
                      onChange={(e) => setNewEmailInput(e.target.value)}
                      placeholder="newadmin@ticketx.com"
                      className="w-full px-3 py-2.5 bg-[var(--bg-sec)] border border-[var(--border)] rounded-xl text-[var(--fg)] focus:outline-none focus:border-rose-600"
                    />
                  </div>

                  <div className="flex justify-end gap-2 pt-2">
                    <button
                      type="button"
                      onClick={() => setIsChangeEmailModalOpen(false)}
                      className="px-3.5 py-2 bg-[var(--bg-sec)] hover:bg-[var(--border)] text-[var(--fg)] rounded-xl font-semibold"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      disabled={isEmailChangeLoading}
                      className="px-4 py-2 bg-rose-600 hover:bg-rose-700 disabled:opacity-50 text-white font-bold rounded-xl flex items-center gap-1.5"
                    >
                      {isEmailChangeLoading ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Send className="w-3.5 h-3.5" />}
                      <span>Send Verification Code</span>
                    </button>
                  </div>
                </form>
              ) : (
                <form onSubmit={handleVerifyEmailChange} className="space-y-4 text-xs">
                  <p className="text-[var(--fg-sec)]">
                    Enter the 6-digit OTP code sent to <strong className="text-[var(--fg)]">{newEmailInput}</strong>:
                  </p>

                  <div className="text-center py-2">
                    <OtpInput length={6} value={emailOtpInput} onChange={setEmailOtpInput} disabled={isEmailChangeLoading} />
                  </div>

                  <div className="flex justify-between items-center pt-2">
                    <button
                      type="button"
                      onClick={() => setChangeEmailStep(1)}
                      className="text-xs text-[var(--fg-sec)] hover:text-[var(--fg)]"
                    >
                      ← Change Email
                    </button>
                    <button
                      type="submit"
                      disabled={isEmailChangeLoading || emailOtpInput.length < 6}
                      className="px-4 py-2 bg-rose-600 hover:bg-rose-700 disabled:opacity-50 text-white font-bold rounded-xl flex items-center gap-1.5"
                    >
                      {isEmailChangeLoading ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <CheckCircle2 className="w-3.5 h-3.5" />}
                      <span>Confirm & Update Email</span>
                    </button>
                  </div>
                </form>
              )}
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* ========================================================= */}
      {/* 3-STEP EVENT UPLOAD & EDIT WIZARD MODAL                   */}
      {/* ========================================================= */}
      <AnimatePresence>
        {isWizardOpen && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm overflow-y-auto">
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 15 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 15 }}
              className="bg-[var(--card)] border border-[var(--border)] rounded-2xl w-full max-w-3xl overflow-hidden shadow-2xl my-8 flex flex-col max-h-[90vh]"
            >
              {/* Wizard Header */}
              <div className="p-5 border-b border-[var(--border)] bg-[var(--bg-sec)] flex items-center justify-between shrink-0">
                <div>
                  <h3 className="text-base font-bold text-[var(--fg)] flex items-center gap-2">
                    <Ticket className="w-5 h-5 text-rose-600" />
                    <span>{editingEventId ? 'Edit Event & Pricing Tiers' : 'Upload & Publish New Ticket Event'}</span>
                  </h3>
                  <p className="text-xs text-[var(--fg-sec)] mt-0.5">
                    Step {wizardStep} of 3: {wizardStep === 1 ? 'Event Information' : wizardStep === 2 ? 'Ticket Types & Pricing' : 'Review & Publish Preview'}
                  </p>
                </div>
                <button
                  onClick={() => setIsWizardOpen(false)}
                  className="p-1 rounded-lg text-[var(--fg-sec)] hover:text-[var(--fg)] hover:bg-[var(--border)] transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Step Navigation Indicator */}
              <div className="px-6 py-3 border-b border-[var(--border)] bg-[var(--card)] flex items-center justify-between text-xs font-semibold shrink-0">
                <button
                  type="button"
                  onClick={() => setWizardStep(1)}
                  className={`flex items-center gap-2 ${wizardStep === 1 ? 'text-rose-600' : 'text-[var(--fg-sec)]'}`}
                >
                  <span className={`w-6 h-6 rounded-full flex items-center justify-center text-xs ${wizardStep === 1 ? 'bg-rose-600 text-white' : 'bg-[var(--border)]'}`}>1</span>
                  <span>Event Details</span>
                </button>
                <div className="w-12 h-0.5 bg-[var(--border)]" />
                <button
                  type="button"
                  onClick={() => {
                    if (validateStep1()) setWizardStep(2);
                  }}
                  className={`flex items-center gap-2 ${wizardStep === 2 ? 'text-rose-600' : 'text-[var(--fg-sec)]'}`}
                >
                  <span className={`w-6 h-6 rounded-full flex items-center justify-center text-xs ${wizardStep === 2 ? 'bg-rose-600 text-white' : 'bg-[var(--border)]'}`}>2</span>
                  <span>Ticket Types & Pricing</span>
                </button>
                <div className="w-12 h-0.5 bg-[var(--border)]" />
                <button
                  type="button"
                  onClick={() => {
                    if (validateStep1() && validateStep2()) setWizardStep(3);
                  }}
                  className={`flex items-center gap-2 ${wizardStep === 3 ? 'text-rose-600' : 'text-[var(--fg-sec)]'}`}
                >
                  <span className={`w-6 h-6 rounded-full flex items-center justify-center text-xs ${wizardStep === 3 ? 'bg-rose-600 text-white' : 'bg-[var(--border)]'}`}>3</span>
                  <span>Review & Publish</span>
                </button>
              </div>

              {/* Wizard Content Body */}
              <div className="p-6 overflow-y-auto space-y-6 flex-1 text-xs">
                {/* STEP 1: EVENT DETAILS */}
                {wizardStep === 1 && (
                  <div className="space-y-4">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-[var(--fg)] font-semibold mb-1">Event Title *</label>
                        <input
                          type="text"
                          value={eventForm.title}
                          onChange={(e) => setEventForm({ ...eventForm, title: e.target.value })}
                          placeholder="e.g. Coldplay: Music of the Spheres Tour"
                          className="w-full px-3 py-2.5 bg-[var(--bg-sec)] border border-[var(--border)] rounded-xl text-[var(--fg)] focus:outline-none focus:border-rose-600"
                        />
                        {wizardErrors.title && <p className="text-rose-500 text-[10px] mt-1">{wizardErrors.title}</p>}
                      </div>

                      <div>
                        <label className="block text-[var(--fg)] font-semibold mb-1">Artist / Performer / Organizer *</label>
                        <input
                          type="text"
                          value={eventForm.artist}
                          onChange={(e) => setEventForm({ ...eventForm, artist: e.target.value })}
                          placeholder="e.g. Coldplay"
                          className="w-full px-3 py-2.5 bg-[var(--bg-sec)] border border-[var(--border)] rounded-xl text-[var(--fg)] focus:outline-none focus:border-rose-600"
                        />
                        {wizardErrors.artist && <p className="text-rose-500 text-[10px] mt-1">{wizardErrors.artist}</p>}
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                      <div>
                        <label className="block text-[var(--fg)] font-semibold mb-1">Category *</label>
                        <select
                          value={eventForm.category}
                          onChange={(e) => setEventForm({ ...eventForm, category: e.target.value })}
                          className="w-full px-3 py-2.5 bg-[var(--bg-sec)] border border-[var(--border)] rounded-xl text-[var(--fg)] focus:outline-none focus:border-rose-600"
                        >
                          {CATEGORIES.map((c) => (
                            <option key={c.id} value={c.id}>{c.label}</option>
                          ))}
                        </select>
                      </div>

                      <div>
                        <label className="block text-[var(--fg)] font-semibold mb-1">Subcategory / Genre</label>
                        <input
                          type="text"
                          value={eventForm.subcategory}
                          onChange={(e) => setEventForm({ ...eventForm, subcategory: e.target.value })}
                          placeholder="e.g. Pop Rock, Standup, Classical"
                          className="w-full px-3 py-2.5 bg-[var(--bg-sec)] border border-[var(--border)] rounded-xl text-[var(--fg)] focus:outline-none focus:border-rose-600"
                        />
                      </div>

                      <div>
                        <label className="block text-[var(--fg)] font-semibold mb-1">Host City *</label>
                        <input
                          type="text"
                          value={eventForm.city}
                          onChange={(e) => setEventForm({ ...eventForm, city: e.target.value })}
                          placeholder="e.g. Los Angeles, Lahore, London"
                          className="w-full px-3 py-2.5 bg-[var(--bg-sec)] border border-[var(--border)] rounded-xl text-[var(--fg)] focus:outline-none focus:border-rose-600"
                        />
                        {wizardErrors.city && <p className="text-rose-500 text-[10px] mt-1">{wizardErrors.city}</p>}
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-[var(--fg)] font-semibold mb-1">Venue Name *</label>
                        <input
                          type="text"
                          value={eventForm.venue}
                          onChange={(e) => setEventForm({ ...eventForm, venue: e.target.value })}
                          placeholder="e.g. SoFi Stadium"
                          className="w-full px-3 py-2.5 bg-[var(--bg-sec)] border border-[var(--border)] rounded-xl text-[var(--fg)] focus:outline-none focus:border-rose-600"
                        />
                        {wizardErrors.venue && <p className="text-rose-500 text-[10px] mt-1">{wizardErrors.venue}</p>}
                      </div>

                      <div>
                        <label className="block text-[var(--fg)] font-semibold mb-1">Venue Street Address (Optional)</label>
                        <input
                          type="text"
                          value={eventForm.venueAddress}
                          onChange={(e) => setEventForm({ ...eventForm, venueAddress: e.target.value })}
                          placeholder="e.g. 1001 Stadium Dr, Inglewood, CA 90305"
                          className="w-full px-3 py-2.5 bg-[var(--bg-sec)] border border-[var(--border)] rounded-xl text-[var(--fg)] focus:outline-none focus:border-rose-600"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
                      <div>
                        <label className="block text-[var(--fg)] font-semibold mb-1">Event Date *</label>
                        <input
                          type="date"
                          value={eventForm.date}
                          onChange={(e) => setEventForm({ ...eventForm, date: e.target.value })}
                          className="w-full px-3 py-2.5 bg-[var(--bg-sec)] border border-[var(--border)] rounded-xl text-[var(--fg)] focus:outline-none focus:border-rose-600"
                        />
                        {wizardErrors.date && <p className="text-rose-500 text-[10px] mt-1">{wizardErrors.date}</p>}
                      </div>

                      <div>
                        <label className="block text-[var(--fg)] font-semibold mb-1">Start Time *</label>
                        <input
                          type="text"
                          value={eventForm.time}
                          onChange={(e) => setEventForm({ ...eventForm, time: e.target.value })}
                          placeholder="e.g. 07:30 PM"
                          className="w-full px-3 py-2.5 bg-[var(--bg-sec)] border border-[var(--border)] rounded-xl text-[var(--fg)] focus:outline-none focus:border-rose-600"
                        />
                        {wizardErrors.time && <p className="text-rose-500 text-[10px] mt-1">{wizardErrors.time}</p>}
                      </div>

                      <div>
                        <label className="block text-[var(--fg)] font-semibold mb-1">End Time</label>
                        <input
                          type="text"
                          value={eventForm.endTime}
                          onChange={(e) => setEventForm({ ...eventForm, endTime: e.target.value })}
                          placeholder="e.g. 11:00 PM"
                          className="w-full px-3 py-2.5 bg-[var(--bg-sec)] border border-[var(--border)] rounded-xl text-[var(--fg)] focus:outline-none focus:border-rose-600"
                        />
                      </div>

                      <div>
                        <label className="block text-[var(--fg)] font-semibold mb-1">Venue Timezone</label>
                        <select
                          value={eventForm.timezone}
                          onChange={(e) => setEventForm({ ...eventForm, timezone: e.target.value })}
                          className="w-full px-3 py-2.5 bg-[var(--bg-sec)] border border-[var(--border)] rounded-xl text-[var(--fg)] focus:outline-none focus:border-rose-600"
                        >
                          {TIMEZONES.map((tz) => (
                            <option key={tz.value} value={tz.value}>{tz.label}</option>
                          ))}
                        </select>
                      </div>
                    </div>

                    <div>
                      <div className="flex items-center justify-between mb-1">
                        <label className="text-[var(--fg)] font-semibold">Event Description * (Min 15 chars)</label>
                        <span className="text-[10px] text-[var(--fg-sec)]">{eventForm.description.length} chars</span>
                      </div>
                      <textarea
                        rows={3}
                        value={eventForm.description}
                        onChange={(e) => setEventForm({ ...eventForm, description: e.target.value })}
                        placeholder="Comprehensive details about the performance, gate openings, VIP perks, and lineup..."
                        className="w-full px-3 py-2.5 bg-[var(--bg-sec)] border border-[var(--border)] rounded-xl text-[var(--fg)] focus:outline-none focus:border-rose-600"
                      />
                      {wizardErrors.description && <p className="text-rose-500 text-[10px] mt-1">{wizardErrors.description}</p>}
                    </div>

                    {/* Image URL or Local Upload */}
                    <div>
                      <label className="block text-[var(--fg)] font-semibold mb-1">Event Cover Image *</label>
                      <div className="flex flex-col sm:flex-row gap-3">
                        <input
                          type="text"
                          value={eventForm.image}
                          onChange={(e) => setEventForm({ ...eventForm, image: e.target.value })}
                          placeholder="https://images.unsplash.com/... or direct image URL"
                          className="flex-1 px-3 py-2.5 bg-[var(--bg-sec)] border border-[var(--border)] rounded-xl text-[var(--fg)] focus:outline-none focus:border-rose-600"
                        />
                        <div className="relative">
                          <input
                            type="file"
                            accept="image/*"
                            id="cover-upload"
                            className="hidden"
                            onChange={(e) => {
                              const file = e.target.files?.[0];
                              if (file) {
                                const reader = new FileReader();
                                reader.onloadend = () => {
                                  setEventForm((prev) => ({ ...prev, image: reader.result }));
                                };
                                reader.readAsDataURL(file);
                              }
                            }}
                          />
                          <label
                            htmlFor="cover-upload"
                            className="px-4 py-2.5 bg-[var(--bg-sec)] hover:bg-[var(--border)] text-[var(--fg)] font-semibold border border-[var(--border)] rounded-xl cursor-pointer inline-flex items-center gap-1.5 transition-colors whitespace-nowrap"
                          >
                            <Download className="w-4 h-4 rotate-180" />
                            <span>Upload Local File</span>
                          </label>
                        </div>
                      </div>
                      {wizardErrors.image && <p className="text-rose-500 text-[10px] mt-1">{wizardErrors.image}</p>}

                      {eventForm.image && (
                        <div className="mt-3 relative h-36 w-full sm:w-64 rounded-xl overflow-hidden border border-[var(--border)] bg-[var(--bg-sec)]">
                          <Image src={eventForm.image} alt="Preview" fill className="object-cover" unoptimized />
                          <button
                            type="button"
                            onClick={() => setEventForm({ ...eventForm, image: '' })}
                            className="absolute top-2 right-2 p-1 rounded-md bg-black/70 text-white hover:bg-rose-600 transition-colors"
                            title="Remove Cover Image"
                          >
                            <X className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                )}

                {/* STEP 2: TICKET TYPES & PRICING */}
                {wizardStep === 2 && (
                  <div className="space-y-5">
                    {/* Live Calculation Banner */}
                    <div className="p-4 rounded-xl bg-rose-500/10 border border-rose-500/20 flex flex-wrap items-center justify-between gap-4">
                      <div>
                        <span className="text-[10px] font-bold uppercase tracking-wider text-rose-600 block">Automatic Calculation</span>
                        <p className="text-xs text-[var(--fg)]">
                          Starting Price: <strong className="text-rose-600">${calculatedStartingPrice}</strong> · Total Capacity:{' '}
                          <strong className="text-[var(--fg)]">{calculatedTotalCapacity} seats</strong> · Potential Revenue:{' '}
                          <strong className="text-emerald-500">${calculatedPotentialRevenue.toLocaleString()}</strong>
                        </p>
                      </div>

                      <button
                        type="button"
                        onClick={handleAddTicketTier}
                        className="px-3.5 py-1.5 bg-rose-600 hover:bg-rose-700 text-white font-semibold rounded-lg text-xs transition-all shadow flex items-center gap-1.5"
                      >
                        <PlusCircle className="w-3.5 h-3.5" />
                        <span>Add Ticket Type</span>
                      </button>
                    </div>

                    {wizardErrors.tiers && <p className="text-rose-500 text-xs">{wizardErrors.tiers}</p>}

                    {/* Ticket Tiers List */}
                    <div className="space-y-4">
                      {eventForm.ticketTypes.map((tier, idx) => (
                        <div
                          key={tier.id || idx}
                          className="p-4 rounded-xl bg-[var(--bg-sec)] border border-[var(--border)] relative space-y-3"
                        >
                          <div className="flex items-center justify-between">
                            <span className="text-xs font-bold text-rose-600 flex items-center gap-1.5">
                              <Ticket className="w-3.5 h-3.5" />
                              <span>Ticket Tier #{idx + 1}</span>
                            </span>

                            {eventForm.ticketTypes.length > 1 && (
                              <button
                                type="button"
                                onClick={() => handleRemoveTicketTier(idx)}
                                className="text-xs text-rose-600 hover:text-rose-700 flex items-center gap-1"
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                                <span>Remove Tier</span>
                              </button>
                            )}
                          </div>

                          <div className="grid grid-cols-1 sm:grid-cols-4 gap-3">
                            <div className="sm:col-span-2">
                              <label className="block text-[var(--fg)] font-semibold mb-1">Tier Name *</label>
                              <input
                                type="text"
                                value={tier.name}
                                onChange={(e) => handleUpdateTicketTier(idx, 'name', e.target.value)}
                                placeholder="e.g. VIP Front Stage, General Admission"
                                className="w-full px-3 py-2 bg-[var(--card)] border border-[var(--border)] rounded-lg text-[var(--fg)] focus:outline-none focus:border-rose-600"
                              />
                            </div>

                            <div>
                              <label className="block text-[var(--fg)] font-semibold mb-1">Price ($) *</label>
                              <input
                                type="number"
                                min="0"
                                step="any"
                                value={tier.price}
                                onChange={(e) => handleUpdateTicketTier(idx, 'price', e.target.value)}
                                className="w-full px-3 py-2 bg-[var(--card)] border border-[var(--border)] rounded-lg text-[var(--fg)] focus:outline-none focus:border-rose-600"
                              />
                            </div>

                            <div>
                              <label className="block text-[var(--fg)] font-semibold mb-1">Total Quantity *</label>
                              <input
                                type="number"
                                min="1"
                                value={tier.totalQuantity}
                                onChange={(e) => {
                                  const val = Number(e.target.value);
                                  handleUpdateTicketTier(idx, 'totalQuantity', val);
                                  handleUpdateTicketTier(idx, 'availableQuantity', val);
                                }}
                                className="w-full px-3 py-2 bg-[var(--card)] border border-[var(--border)] rounded-lg text-[var(--fg)] focus:outline-none focus:border-rose-600"
                              />
                            </div>
                          </div>

                          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                            <div>
                              <label className="block text-[var(--fg)] font-semibold mb-1">Max Per Customer</label>
                              <input
                                type="number"
                                min="1"
                                max="20"
                                value={tier.maxPerCustomer || 8}
                                onChange={(e) => handleUpdateTicketTier(idx, 'maxPerCustomer', Number(e.target.value))}
                                className="w-full px-3 py-2 bg-[var(--card)] border border-[var(--border)] rounded-lg text-[var(--fg)] focus:outline-none focus:border-rose-600"
                              />
                            </div>

                            <div>
                              <label className="block text-[var(--fg)] font-semibold mb-1">Section / Seating Details</label>
                              <input
                                type="text"
                                value={tier.section || ''}
                                onChange={(e) => handleUpdateTicketTier(idx, 'section', e.target.value)}
                                placeholder="e.g. Floor Pit, Mezzanine A"
                                className="w-full px-3 py-2 bg-[var(--card)] border border-[var(--border)] rounded-lg text-[var(--fg)] focus:outline-none focus:border-rose-600"
                              />
                            </div>

                            <div>
                              <label className="block text-[var(--fg)] font-semibold mb-1">Tier Status</label>
                              <select
                                value={tier.status || 'Available'}
                                onChange={(e) => handleUpdateTicketTier(idx, 'status', e.target.value)}
                                className="w-full px-3 py-2 bg-[var(--card)] border border-[var(--border)] rounded-lg text-[var(--fg)] focus:outline-none focus:border-rose-600"
                              >
                                <option value="Available">Available</option>
                                <option value="Sold Out">Sold Out</option>
                                <option value="Hidden">Hidden</option>
                              </select>
                            </div>
                          </div>

                          <div>
                            <label className="block text-[var(--fg)] font-semibold mb-1">Perks & Short Description</label>
                            <input
                              type="text"
                              value={tier.description || ''}
                              onChange={(e) => handleUpdateTicketTier(idx, 'description', e.target.value)}
                              placeholder="e.g. Includes express lane access, collectible lanyard, and VIP area..."
                              className="w-full px-3 py-2 bg-[var(--card)] border border-[var(--border)] rounded-lg text-[var(--fg)] focus:outline-none focus:border-rose-600"
                            />
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* STEP 3: REVIEW & PUBLISH */}
                {wizardStep === 3 && (
                  <div className="space-y-6">
                    <div className="p-4 rounded-xl bg-[var(--bg-sec)] border border-[var(--border)]">
                      <h4 className="text-xs font-bold text-rose-600 uppercase tracking-wider mb-2">Live Customer Preview Summary</h4>
                      <p className="text-xs text-[var(--fg-sec)]">
                        Verify your event presentation and ticket pricing tiers before publishing live to the platform.
                      </p>
                    </div>

                    {/* Preview Card */}
                    <div className="p-5 rounded-2xl bg-[var(--card)] border border-[var(--border)] shadow-md grid grid-cols-1 md:grid-cols-3 gap-6">
                      <div className="relative h-48 md:h-full w-full rounded-xl overflow-hidden bg-[var(--bg-sec)]">
                        {eventForm.image ? (
                          <Image src={eventForm.image} alt={eventForm.title} fill className="object-cover" unoptimized />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center text-[var(--fg-sec)]">No Image</div>
                        )}
                        <span className="absolute top-2 left-2 px-2.5 py-0.5 rounded-md bg-rose-600 text-white text-[10px] font-bold shadow">
                          {eventForm.category.toUpperCase()}
                        </span>
                      </div>

                      <div className="md:col-span-2 space-y-3">
                        <div>
                          <h3 className="text-lg font-black text-[var(--fg)]">{eventForm.title || 'Untitled Event'}</h3>
                          <p className="text-xs text-[var(--fg-sec)] mt-0.5 font-medium">
                            {eventForm.artist} · {eventForm.venue}, {eventForm.city}
                          </p>
                        </div>

                        <div className="flex flex-wrap items-center gap-3 text-xs text-[var(--fg-sec)]">
                          <span className="flex items-center gap-1">
                            <Calendar className="w-3.5 h-3.5 text-rose-500" />
                            <span>{eventForm.date}</span>
                          </span>
                          <span className="flex items-center gap-1">
                            <Clock className="w-3.5 h-3.5 text-rose-500" />
                            <span>{eventForm.time} ({eventForm.timezone?.split('/')[1] || 'EST'})</span>
                          </span>
                        </div>

                        <p className="text-xs text-[var(--fg-sec)] line-clamp-3 leading-relaxed">
                          {eventForm.description}
                        </p>

                        <div className="pt-3 border-t border-[var(--border)]">
                          <span className="text-[11px] font-semibold text-[var(--fg)] block mb-1.5">Configured Ticket Tiers ({eventForm.ticketTypes.length}):</span>
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                            {eventForm.ticketTypes.map((t, idx) => (
                              <div key={idx} className="p-2 rounded-lg bg-[var(--bg-sec)] border border-[var(--border)] flex items-center justify-between text-xs">
                                <div>
                                  <span className="font-semibold text-[var(--fg)] block">{t.name}</span>
                                  <span className="text-[10px] text-[var(--fg-sec)]">{t.totalQuantity} total inventory</span>
                                </div>
                                <span className="text-sm font-black text-rose-600">${t.price}</span>
                              </div>
                            ))}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* Wizard Footer Controls */}
              <div className="p-5 border-t border-[var(--border)] bg-[var(--bg-sec)] flex items-center justify-between shrink-0">
                <div>
                  {wizardStep > 1 && (
                    <button
                      type="button"
                      onClick={() => setWizardStep((s) => s - 1)}
                      className="px-4 py-2 bg-[var(--card)] hover:bg-[var(--border)] text-[var(--fg)] border border-[var(--border)] rounded-xl text-xs font-semibold transition-colors"
                    >
                      ← Back
                    </button>
                  )}
                </div>

                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => setIsWizardOpen(false)}
                    className="px-4 py-2 text-[var(--fg-sec)] hover:text-[var(--fg)] text-xs font-semibold"
                  >
                    Cancel
                  </button>

                  {wizardStep === 1 && (
                    <button
                      type="button"
                      onClick={() => {
                        if (validateStep1()) setWizardStep(2);
                      }}
                      className="px-5 py-2.5 bg-rose-600 hover:bg-rose-700 text-white font-bold rounded-xl text-xs transition-all shadow-md shadow-rose-600/20"
                    >
                      Next: Ticket Types & Pricing →
                    </button>
                  )}

                  {wizardStep === 2 && (
                    <button
                      type="button"
                      onClick={() => {
                        if (validateStep2()) setWizardStep(3);
                      }}
                      className="px-5 py-2.5 bg-rose-600 hover:bg-rose-700 text-white font-bold rounded-xl text-xs transition-all shadow-md shadow-rose-600/20"
                    >
                      Next: Review & Preview →
                    </button>
                  )}

                  {wizardStep === 3 && (
                    <>
                      <button
                        type="button"
                        disabled={isSavingEvent}
                        onClick={() => handleSaveEvent('Draft')}
                        className="px-4 py-2.5 bg-[var(--card)] hover:bg-[var(--border)] text-[var(--fg)] font-bold rounded-xl text-xs border border-[var(--border)] transition-colors"
                      >
                        {isSavingEvent ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Save as Draft'}
                      </button>

                      <button
                        type="button"
                        disabled={isSavingEvent}
                        onClick={() => handleSaveEvent('Published')}
                        className="px-5 py-2.5 bg-rose-600 hover:bg-rose-700 text-white font-bold rounded-xl text-xs transition-all shadow-md shadow-rose-600/20 flex items-center gap-1.5"
                      >
                        {isSavingEvent ? <Loader2 className="w-4 h-4 animate-spin" /> : <CheckCircle2 className="w-4 h-4" />}
                        <span>Publish Event Live</span>
                      </button>
                    </>
                  )}
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* ========================================================= */}
      {/* USER DETAILS DRAWER / MODAL                               */}
      {/* ========================================================= */}
      <AnimatePresence>
        {isUserDrawerOpen && selectedUserDetails && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm overflow-y-auto">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-[var(--card)] border border-[var(--border)] rounded-2xl w-full max-w-2xl p-6 shadow-2xl relative space-y-6"
            >
              <div className="flex items-center justify-between pb-4 border-b border-[var(--border)]">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-rose-500/10 border border-rose-500/20 flex items-center justify-center font-bold text-rose-600 text-sm">
                    {selectedUserDetails.firstName?.charAt(0).toUpperCase()}
                  </div>
                  <div>
                    <h3 className="text-base font-bold text-[var(--fg)]">
                      {selectedUserDetails.firstName} {selectedUserDetails.lastName || ''}
                    </h3>
                    <p className="text-xs text-[var(--fg-sec)] font-mono">User ID: {selectedUserDetails.id || selectedUserDetails._id}</p>
                  </div>
                </div>
                <button onClick={() => setIsUserDrawerOpen(false)} className="text-[var(--fg-sec)] hover:text-[var(--fg)]">
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Status and Summary */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
                <div className="p-3 bg-[var(--bg-sec)] rounded-xl border border-[var(--border)]">
                  <span className="text-[var(--fg-sec)] block mb-1">Account Status</span>
                  <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                    selectedUserDetails.status === 'Suspended' ? 'bg-rose-500/10 text-rose-600' : 'bg-emerald-500/10 text-emerald-600'
                  }`}>
                    {selectedUserDetails.status}
                  </span>
                </div>
                <div className="p-3 bg-[var(--bg-sec)] rounded-xl border border-[var(--border)]">
                  <span className="text-[var(--fg-sec)] block mb-1">Email Verification</span>
                  <span className="font-semibold text-[var(--fg)]">{selectedUserDetails.emailVerified ? 'Verified' : 'Pending'}</span>
                </div>
                <div className="p-3 bg-[var(--bg-sec)] rounded-xl border border-[var(--border)]">
                  <span className="text-[var(--fg-sec)] block mb-1">Total Bookings</span>
                  <span className="font-bold text-[var(--fg)]">{selectedUserDetails.totalBookings || 0}</span>
                </div>
                <div className="p-3 bg-[var(--bg-sec)] rounded-xl border border-[var(--border)]">
                  <span className="text-[var(--fg-sec)] block mb-1">Lifetime Spend</span>
                  <span className="font-bold text-rose-600">${(selectedUserDetails.totalSpent || 0).toFixed(2)}</span>
                </div>
              </div>

              {/* Contact Information */}
              <div className="text-xs space-y-1.5 p-4 rounded-xl bg-[var(--bg-sec)] border border-[var(--border)]">
                <p><strong className="text-[var(--fg)]">Email:</strong> {selectedUserDetails.email}</p>
                <p><strong className="text-[var(--fg)]">Phone:</strong> {selectedUserDetails.phone || 'Not provided'}</p>
                <p><strong className="text-[var(--fg)]">Location:</strong> {selectedUserDetails.city || 'N/A'}, {selectedUserDetails.country || 'USA'}</p>
                <p><strong className="text-[var(--fg)]">Account Created:</strong> {new Date(selectedUserDetails.createdAt).toLocaleString()}</p>
              </div>

              {/* Booking History */}
              <div>
                <h4 className="text-xs font-bold text-[var(--fg)] mb-2">Customer Booking History:</h4>
                {!selectedUserDetails.orders || selectedUserDetails.orders.length === 0 ? (
                  <p className="text-xs text-[var(--fg-sec)] py-4 text-center border border-[var(--border)] rounded-xl">
                    No confirmed orders found for this user account.
                  </p>
                ) : (
                  <div className="space-y-2 max-h-48 overflow-y-auto">
                    {selectedUserDetails.orders.map((o) => (
                      <div key={o.orderId} className="p-3 rounded-xl bg-[var(--bg-sec)] border border-[var(--border)] flex items-center justify-between text-xs">
                        <div>
                          <span className="font-bold text-rose-600 font-mono block">#{o.orderId}</span>
                          <span className="font-medium text-[var(--fg)]">{o.eventTitle}</span>
                        </div>
                        <div className="text-right">
                          <span className="font-bold text-[var(--fg)] block">${o.pricing?.grandTotal.toFixed(2)}</span>
                          <span className="text-[10px] text-[var(--fg-sec)]">{new Date(o.createdAt).toLocaleDateString()}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              <div className="pt-2 flex justify-end gap-2">
                <button
                  onClick={() => setIsUserDrawerOpen(false)}
                  className="px-4 py-2 bg-[var(--bg-sec)] hover:bg-[var(--border)] text-[var(--fg)] rounded-xl text-xs font-semibold"
                >
                  Close Profile
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* ========================================================= */}
      {/* ENHANCED ORDER DETAILS MODAL (WITH QR, TIMELINE & ACTIONS) */}
      {/* ========================================================= */}
      <AnimatePresence>
        {selectedOrderDetails && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm overflow-y-auto">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-[var(--card)] border border-[var(--border)] rounded-2xl w-full max-w-2xl p-6 shadow-2xl relative space-y-5 my-8 max-h-[90vh] flex flex-col"
            >
              {/* Modal Header */}
              <div className="flex items-center justify-between pb-4 border-b border-[var(--border)] shrink-0">
                <div>
                  <h3 className="text-base font-bold text-[var(--fg)] flex items-center gap-2">
                    <ShoppingBag className="w-5 h-5 text-rose-600" />
                    <span>Order #{selectedOrderDetails.orderId}</span>
                  </h3>
                  <p className="text-xs text-[var(--fg-sec)]">
                    Placed on {new Date(selectedOrderDetails.createdAt).toLocaleString([], {
                      year: 'numeric',
                      month: 'short',
                      day: 'numeric',
                      hour: '2-digit',
                      minute: '2-digit'
                    })}
                  </p>
                </div>
                <button onClick={() => setSelectedOrderDetails(null)} className="text-[var(--fg-sec)] hover:text-[var(--fg)]">
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="space-y-4 overflow-y-auto flex-1 pr-1 text-xs">
                {/* Status Pills */}
                <div className="flex items-center gap-2">
                  <span className={`px-2.5 py-1 rounded-md text-xs font-bold border ${
                    selectedOrderDetails.status === 'Refunded'
                      ? 'bg-purple-500/10 text-purple-400 border-purple-500/20'
                      : selectedOrderDetails.status === 'Cancelled'
                      ? 'bg-gray-500/10 text-gray-400 border-gray-500/20'
                      : 'bg-emerald-500/10 text-emerald-500 border-emerald-500/20'
                  }`}>
                    Booking: {selectedOrderDetails.status}
                  </span>

                  <span className={`px-2.5 py-1 rounded-md text-xs font-bold border ${
                    selectedOrderDetails.payment?.status === 'Refunded'
                      ? 'bg-purple-500/10 text-purple-400 border-purple-500/20'
                      : selectedOrderDetails.payment?.status === 'Pending'
                      ? 'bg-amber-500/10 text-amber-500 border-amber-500/20'
                      : selectedOrderDetails.payment?.status === 'Failed'
                      ? 'bg-red-500/10 text-red-500 border-red-500/20'
                      : 'bg-emerald-500/10 text-emerald-500 border-emerald-500/20'
                  }`}>
                    Payment: {selectedOrderDetails.payment?.status || 'Paid'}
                  </span>

                  {selectedOrderDetails.confirmationEmailCount > 0 && (
                    <span className="px-2.5 py-1 rounded-md text-[11px] font-semibold bg-[var(--bg-sec)] border border-[var(--border)] text-[var(--fg-sec)]">
                      Confirmation Sent: {selectedOrderDetails.confirmationEmailCount}x
                    </span>
                  )}
                </div>

                {/* Customer Card */}
                <div className="p-4 rounded-xl bg-[var(--bg-sec)] border border-[var(--border)]">
                  <h4 className="font-bold text-[var(--fg)] mb-2 uppercase text-[10px] tracking-wider text-rose-500">
                    Customer Information
                  </h4>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <p className="font-semibold text-[var(--fg)] text-sm">
                        {selectedOrderDetails.customer?.firstName} {selectedOrderDetails.customer?.lastName || ''}
                      </p>
                      <p className="text-[var(--fg-sec)]">{selectedOrderDetails.customer?.email}</p>
                      <p className="text-[var(--fg-sec)]">{selectedOrderDetails.customer?.phone || 'No phone provided'}</p>
                    </div>
                    <div>
                      <p className="text-[var(--fg-sec)]">Location: {selectedOrderDetails.customer?.city || 'N/A'}, {selectedOrderDetails.customer?.country || 'USA'}</p>
                      <p className="text-[var(--fg-sec)] mt-1 font-mono text-[10px]">
                        Account Ref: {selectedOrderDetails.userId ? `ID: ${selectedOrderDetails.userId}` : 'Guest Checkout'}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Event & Admission Passes */}
                <div className="p-4 rounded-xl bg-[var(--bg-sec)] border border-[var(--border)] space-y-3">
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="font-bold text-[var(--fg)] text-sm">{selectedOrderDetails.eventTitle}</h4>
                      <p className="text-[var(--fg-sec)] text-[11px]">Admission Category: {selectedOrderDetails.ticketType}</p>
                    </div>
                    <span className="font-bold text-rose-600">{selectedOrderDetails.quantity} ticket(s)</span>
                  </div>

                  {selectedOrderDetails.items && selectedOrderDetails.items.length > 0 && (
                    <div className="space-y-1.5 pt-2 border-t border-[var(--border)]">
                      <span className="text-[10px] font-bold uppercase tracking-wider text-[var(--fg-sec)] block">
                        Verified Ticket Passes & QR Validation Status:
                      </span>
                      {selectedOrderDetails.items.map((item, idx) => (
                        <div key={idx} className="p-2.5 rounded-lg bg-[var(--card)] border border-[var(--border)] flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <Ticket className="w-4 h-4 text-rose-500" />
                            <div>
                              <span className="font-mono font-bold text-[var(--fg)] block">{item.ticketId || `TKT-${idx + 1}`}</span>
                              <span className="text-[10px] text-[var(--fg-sec)]">{item.sectionName} · Seat {item.seatNumber}</span>
                            </div>
                          </div>

                          <div className="flex items-center gap-3">
                            <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                              item.validationStatus === 'Cancelled'
                                ? 'bg-red-500/10 text-red-500 border border-red-500/20'
                                : item.validationStatus === 'Used'
                                ? 'bg-gray-500/10 text-gray-400 border border-gray-500/20'
                                : 'bg-emerald-500/10 text-emerald-500 border border-emerald-500/20'
                            }`}>
                              {item.validationStatus === 'Cancelled' ? 'Revoked' : item.validationStatus === 'Used' ? 'Admitted' : 'Valid Entry'}
                            </span>
                            <span className="font-bold text-[var(--fg)]">${item.price}</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                {/* Financial Breakdown */}
                <div className="p-4 rounded-xl bg-[var(--bg-sec)] border border-[var(--border)] space-y-1.5">
                  <div className="flex justify-between text-[var(--fg-sec)]">
                    <span>Tickets Subtotal</span>
                    <span>${selectedOrderDetails.pricing?.subtotal?.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-[var(--fg-sec)]">
                    <span>Service & Processing Fee</span>
                    <span>${selectedOrderDetails.pricing?.serviceFee?.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-[var(--fg-sec)]">
                    <span>Facility Surcharge</span>
                    <span>${selectedOrderDetails.pricing?.facilityFee?.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-[var(--fg-sec)]">
                    <span>Sales Tax</span>
                    <span>${selectedOrderDetails.pricing?.tax?.toFixed(2)}</span>
                  </div>
                  <div className="pt-2 border-t border-[var(--border)] flex justify-between font-bold text-sm text-[var(--fg)]">
                    <span>Grand Total Paid</span>
                    <span className="text-rose-600">${selectedOrderDetails.pricing?.grandTotal?.toFixed(2)} {selectedOrderDetails.currency || 'USD'}</span>
                  </div>
                  <div className="pt-2 text-[11px] text-[var(--fg-sec)] flex items-center justify-between">
                    <span>Card Method: {selectedOrderDetails.payment?.cardBrand || 'Visa'} ({selectedOrderDetails.payment?.last4 ? `•••• ${selectedOrderDetails.payment.last4}` : '•••• 4242'})</span>
                    <span className="font-mono">Ref: {selectedOrderDetails.payment?.transactionId || 'txn_direct'}</span>
                  </div>
                </div>

                {/* Audit Timeline */}
                {selectedOrderDetails.timeline && selectedOrderDetails.timeline.length > 0 && (
                  <div className="p-4 rounded-xl bg-[var(--bg-sec)] border border-[var(--border)]">
                    <h4 className="font-bold text-[var(--fg)] mb-2 uppercase text-[10px] tracking-wider text-purple-400">
                      Order Lifecycle & Audit Timeline
                    </h4>
                    <div className="space-y-2">
                      {selectedOrderDetails.timeline.map((evt, idx) => (
                        <div key={idx} className="flex items-start gap-2.5 text-[11px] border-b border-[var(--border)] pb-2 last:border-b-0 last:pb-0">
                          <Activity className="w-3.5 h-3.5 text-rose-500 shrink-0 mt-0.5" />
                          <div className="flex-1">
                            <span className="font-semibold text-[var(--fg)]">{evt.action}</span>
                            <span className="text-[var(--fg-sec)] ml-2">by {evt.actor}</span>
                            {evt.note && <p className="text-[10px] text-[var(--fg-sec)] mt-0.5">{evt.note}</p>}
                          </div>
                          <span className="text-[10px] text-[var(--fg-sec)] shrink-0">
                            {new Date(evt.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* Action Buttons Footer */}
              <div className="pt-3 border-t border-[var(--border)] flex flex-wrap items-center justify-between gap-2 shrink-0">
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => handlePrintReceipt(selectedOrderDetails)}
                    className="px-3.5 py-2 bg-[var(--bg-sec)] hover:bg-[var(--border)] text-[var(--fg)] border border-[var(--border)] rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-colors"
                  >
                    <Printer className="w-3.5 h-3.5 text-rose-500" />
                    <span>Print Receipt</span>
                  </button>

                  <button
                    onClick={() => handleResendTicketEmail(selectedOrderDetails)}
                    disabled={isResendingEmail}
                    className="px-3.5 py-2 bg-[var(--bg-sec)] hover:bg-[var(--border)] text-[var(--fg)] border border-[var(--border)] rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-colors"
                  >
                    {isResendingEmail ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Send className="w-3.5 h-3.5 text-blue-500" />}
                    <span>Resend Confirmation Email</span>
                  </button>
                </div>

                <div className="flex items-center gap-2">
                  {selectedOrderDetails.status === 'Confirmed' && (
                    <>
                      <button
                        onClick={() => handleCancelOrder(selectedOrderDetails)}
                        className="px-3 py-2 bg-gray-500/10 hover:bg-gray-500/20 text-gray-300 border border-gray-500/30 rounded-xl text-xs font-semibold"
                      >
                        Cancel Booking
                      </button>
                      <button
                        onClick={() => handleRefundOrder(selectedOrderDetails)}
                        className="px-3 py-2 bg-purple-500/10 hover:bg-purple-500/20 text-purple-400 border border-purple-500/30 rounded-xl text-xs font-semibold"
                      >
                        Process Refund
                      </button>
                    </>
                  )}
                  <button
                    onClick={() => setSelectedOrderDetails(null)}
                    className="px-4 py-2 bg-[var(--bg-sec)] hover:bg-[var(--border)] text-[var(--fg)] rounded-xl text-xs font-semibold"
                  >
                    Close
                  </button>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* ========================================================= */}
      {/* CUSTOMER EVENT PREVIEW MODAL                              */}
      {/* ========================================================= */}
      <AnimatePresence>
        {eventPreviewModal && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm overflow-y-auto">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-[var(--card)] border border-[var(--border)] rounded-2xl w-full max-w-xl overflow-hidden shadow-2xl relative"
            >
              <div className="relative h-56 w-full bg-[var(--bg-sec)]">
                <Image src={eventPreviewModal.image} alt={eventPreviewModal.title} fill className="object-cover" unoptimized />
                <button
                  onClick={() => setEventPreviewModal(null)}
                  className="absolute top-3 right-3 p-1.5 rounded-full bg-black/70 text-white hover:bg-rose-600 transition-colors"
                >
                  <X className="w-4 h-4" />
                </button>
                <span className="absolute bottom-3 left-3 px-3 py-1 rounded-full bg-rose-600 text-white text-xs font-bold shadow">
                  {eventPreviewModal.category?.toUpperCase()}
                </span>
              </div>

              <div className="p-6 space-y-4 text-xs">
                <div>
                  <h3 className="text-xl font-black text-[var(--fg)]">{eventPreviewModal.title}</h3>
                  <p className="text-xs text-[var(--fg-sec)] mt-1">
                    {eventPreviewModal.artist} · {eventPreviewModal.venue}, {eventPreviewModal.city}
                  </p>
                </div>

                <div className="flex items-center gap-4 text-xs text-[var(--fg-sec)]">
                  <span className="flex items-center gap-1.5">
                    <Calendar className="w-3.5 h-3.5 text-rose-500" />
                    <span>{eventPreviewModal.date}</span>
                  </span>
                  <span className="flex items-center gap-1.5">
                    <Clock className="w-3.5 h-3.5 text-rose-500" />
                    <span>{eventPreviewModal.time}</span>
                  </span>
                </div>

                <p className="text-[var(--fg-sec)] leading-relaxed">
                  {eventPreviewModal.description}
                </p>

                <div>
                  <span className="font-bold text-[var(--fg)] block mb-2">Available Ticket Tiers:</span>
                  <div className="space-y-1.5">
                    {(eventPreviewModal.ticketTypes || []).map((t, i) => (
                      <div key={i} className="p-2.5 rounded-xl bg-[var(--bg-sec)] border border-[var(--border)] flex items-center justify-between">
                        <div>
                          <p className="font-semibold text-[var(--fg)]">{t.name}</p>
                          <p className="text-[10px] text-[var(--fg-sec)]">{t.availableQuantity || t.totalQuantity} tickets left</p>
                        </div>
                        <span className="text-sm font-black text-rose-600">${t.price}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="pt-2 flex justify-end">
                  <button
                    onClick={() => setEventPreviewModal(null)}
                    className="px-4 py-2 bg-[var(--bg-sec)] hover:bg-[var(--border)] text-[var(--fg)] rounded-xl text-xs font-semibold"
                  >
                    Close Preview
                  </button>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* ========================================================= */}
      {/* UNIVERSAL CONFIRMATION DIALOG MODAL                       */}
      {/* ========================================================= */}
      <AnimatePresence>
        {confirmModal.isOpen && (
          <div className="fixed inset-0 z-[120] flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-[var(--card)] border border-[var(--border)] rounded-2xl w-full max-w-md p-6 shadow-2xl relative space-y-4"
            >
              <div className="flex items-start gap-3">
                <div className={`p-2.5 rounded-xl shrink-0 ${
                  confirmModal.variant === 'danger'
                    ? 'bg-rose-500/10 text-rose-600 border border-rose-500/20'
                    : 'bg-amber-500/10 text-amber-600 border border-amber-500/20'
                }`}>
                  <AlertTriangle className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-[var(--fg)]">{confirmModal.title}</h3>
                  <p className="text-xs text-[var(--fg-sec)] mt-1.5 leading-relaxed">{confirmModal.message}</p>
                </div>
              </div>

              <div className="flex items-center justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setConfirmModal((prev) => ({ ...prev, isOpen: false }))}
                  className="px-4 py-2 bg-[var(--bg-sec)] hover:bg-[var(--border)] text-[var(--fg)] rounded-xl text-xs font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={confirmModal.onConfirm}
                  className={`px-4 py-2 rounded-xl text-xs font-bold text-white transition-all shadow-md ${
                    confirmModal.variant === 'danger'
                      ? 'bg-rose-600 hover:bg-rose-700 shadow-rose-600/20'
                      : 'bg-amber-600 hover:bg-amber-700 shadow-amber-600/20'
                  }`}
                >
                  {confirmModal.actionText}
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
