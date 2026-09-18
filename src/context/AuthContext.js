'use client';

import React, { createContext, useContext, useEffect, useState } from 'react';

const AuthContext = createContext();

const MOCK_USER = {
  id: 'usr-001',
  firstName: 'Alex',
  lastName: 'Morgan',
  email: 'alex.morgan@example.com',
  phone: '(555) 234-5678',
  city: 'Los Angeles',
  country: 'USA',
  avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400&q=80',
};

function getInitialUser() {
  if (typeof window === 'undefined') return MOCK_USER;
  const saved = localStorage.getItem('ticketx-user');
  if (saved) try { return JSON.parse(saved); } catch (_) {}
  return MOCK_USER;
}

export function AuthProvider({ children }) {
  const [user, setUser] = useState(getInitialUser);
  const [isAuthenticated, setIsAuthenticated] = useState(true);

  const signIn = (email, password) => {
    const loggedInUser = {
      ...MOCK_USER,
      email: email || MOCK_USER.email,
    };
    setUser(loggedInUser);
    setIsAuthenticated(true);
    localStorage.setItem('ticketx-user', JSON.stringify(loggedInUser));
    return true;
  };

  const signUp = (firstName, lastName, email, password) => {
    const newUser = {
      id: `usr-${Math.floor(1000 + Math.random() * 9000)}`,
      firstName: firstName || 'User',
      lastName: lastName || '',
      email: email || 'user@example.com',
      phone: '',
      city: 'Los Angeles',
      country: 'USA',
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400&q=80',
    };
    setUser(newUser);
    setIsAuthenticated(true);
    localStorage.setItem('ticketx-user', JSON.stringify(newUser));
    return true;
  };

  const signOut = () => {
    setUser(null);
    setIsAuthenticated(false);
    localStorage.removeItem('ticketx-user');
  };

  const updateProfile = (updatedFields) => {
    setUser((prev) => {
      const next = { ...prev, ...updatedFields };
      localStorage.setItem('ticketx-user', JSON.stringify(next));
      return next;
    });
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated,
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
