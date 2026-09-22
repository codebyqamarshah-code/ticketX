'use client';

import React, { createContext, useContext, useState } from 'react';

const AuthContext = createContext();

const DEMO_USERS = [
  {
    id: 'usr-001',
    firstName: 'Alex',
    lastName: 'Morgan',
    email: 'alex.morgan@example.com',
    password: 'password123',
    phone: '(555) 234-5678',
    city: 'Los Angeles',
    country: 'USA',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400&q=80',
  },
];

function getInitialActiveUser() {
  if (typeof window === 'undefined') return null;
  try {
    const saved = localStorage.getItem('ticketx-active-user');
    if (saved) {
      const parsed = JSON.parse(saved);
      if (parsed && parsed.email) return parsed;
    }
  } catch (_) {}
  return null;
}

export function AuthProvider({ children }) {
  const [user, setUser] = useState(getInitialActiveUser);
  const [isAuthenticated, setIsAuthenticated] = useState(() => !!getInitialActiveUser());
  const [loading, setLoading] = useState(false);

  // Helper to get registered users database
  const getRegisteredUsers = () => {
    try {
      const saved = localStorage.getItem('ticketx-users-db');
      return saved ? JSON.parse(saved) : DEMO_USERS;
    } catch (_) {
      return DEMO_USERS;
    }
  };

  // Real Sign In
  const signIn = (email, password) => {
    const usersDb = getRegisteredUsers();
    const cleanEmail = email?.trim().toLowerCase();

    // Find matching user
    const foundUser = usersDb.find(
      (u) => u.email.toLowerCase() === cleanEmail
    );

    if (!foundUser) {
      // If user does not exist in DB yet, allow login with any valid password for demo flexibility, but register them dynamically
      const newUser = {
        id: `usr-${Math.floor(1000 + Math.random() * 9000)}`,
        firstName: email.split('@')[0] || 'User',
        lastName: '',
        email: cleanEmail,
        password: password,
        phone: '',
        city: 'New York',
        country: 'USA',
        avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=400&q=80',
      };
      
      const updatedDb = [...usersDb, newUser];
      localStorage.setItem('ticketx-users-db', JSON.stringify(updatedDb));
      localStorage.setItem('ticketx-active-user', JSON.stringify(newUser));
      setUser(newUser);
      setIsAuthenticated(true);
      return { success: true, user: newUser };
    }

    // Check password if configured
    if (foundUser.password && foundUser.password !== password) {
      return { success: false, message: 'Incorrect password. Please try again.' };
    }

    localStorage.setItem('ticketx-active-user', JSON.stringify(foundUser));
    setUser(foundUser);
    setIsAuthenticated(true);
    return { success: true, user: foundUser };
  };

  // Real Sign Up
  const signUp = (firstName, lastName, email, password) => {
    const usersDb = getRegisteredUsers();
    const cleanEmail = email?.trim().toLowerCase();

    const existingUser = usersDb.find(
      (u) => u.email.toLowerCase() === cleanEmail
    );

    if (existingUser) {
      // User already exists, log them in directly
      localStorage.setItem('ticketx-active-user', JSON.stringify(existingUser));
      setUser(existingUser);
      setIsAuthenticated(true);
      return { success: true, user: existingUser, message: 'Account already exists. Signed in successfully!' };
    }

    const newUser = {
      id: `usr-${Math.floor(10000 + Math.random() * 90000)}`,
      firstName: firstName || 'Fan',
      lastName: lastName || '',
      email: cleanEmail,
      password: password,
      phone: '',
      city: 'Los Angeles',
      country: 'USA',
      avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=400&q=80',
    };

    const updatedDb = [...usersDb, newUser];
    localStorage.setItem('ticketx-users-db', JSON.stringify(updatedDb));
    localStorage.setItem('ticketx-active-user', JSON.stringify(newUser));

    setUser(newUser);
    setIsAuthenticated(true);
    return { success: true, user: newUser };
  };

  // Sign Out
  const signOut = () => {
    setUser(null);
    setIsAuthenticated(false);
    localStorage.removeItem('ticketx-active-user');
  };

  // Update Profile
  const updateProfile = (updatedFields) => {
    setUser((prev) => {
      const next = { ...prev, ...updatedFields };
      localStorage.setItem('ticketx-active-user', JSON.stringify(next));

      // Update in db as well
      const usersDb = getRegisteredUsers();
      const idx = usersDb.findIndex((u) => u.id === next.id);
      if (idx !== -1) {
        usersDb[idx] = next;
        localStorage.setItem('ticketx-users-db', JSON.stringify(usersDb));
      }

      return next;
    });
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated,
        loading,
        signIn,
        signUp,
        signOut,
        updateProfile,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
