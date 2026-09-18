'use client';

import React, { createContext, useContext, useEffect, useState } from 'react';

const POPULAR_CITIES = [
  { id: 'los-angeles', name: 'Los Angeles', country: 'USA' },
  { id: 'new-york', name: 'New York', country: 'USA' },
  { id: 'las-vegas', name: 'Las Vegas', country: 'USA' },
  { id: 'chicago', name: 'Chicago', country: 'USA' },
  { id: 'miami', name: 'Miami', country: 'USA' },
  { id: 'san-francisco', name: 'San Francisco', country: 'USA' },
  { id: 'london', name: 'London', country: 'UK' },
  { id: 'toronto', name: 'Toronto', country: 'Canada' },
  { id: 'lahore', name: 'Lahore', country: 'Pakistan' },
  { id: 'dubai', name: 'Dubai', country: 'UAE' },
];

const DEFAULT_LOCATION = { city: 'New York', country: 'USA', cityId: 'new-york' };

function getInitialLocation() {
  if (typeof window === 'undefined') return DEFAULT_LOCATION;
  const saved = localStorage.getItem('ticketx-location');
  if (saved) {
    try { return JSON.parse(saved); } catch (_) {}
  }
  return DEFAULT_LOCATION;
}

const LocationContext = createContext();

export function LocationProvider({ children }) {
  const [location, setLocation] = useState(DEFAULT_LOCATION);
  const [locationStatus, setLocationStatus] = useState('idle');

  useEffect(() => {
    const initial = getInitialLocation();
    setLocation(initial); // eslint-disable-line react-hooks/set-state-in-effect
  }, []);

  const requestGeolocation = () => {
    if (!navigator.geolocation) { setLocationStatus('denied'); return; }
    setLocationStatus('loading');
    navigator.geolocation.getCurrentPosition(
      () => {
        setLocationStatus('granted');
        const loc = { city: 'Current Location', country: '', cityId: 'current' };
        setLocation(loc);
        localStorage.setItem('ticketx-location', JSON.stringify(loc));
      },
      () => { setLocationStatus('denied'); }
    );
  };

  const selectCity = (cityObj) => {
    const loc = { city: cityObj.name, country: cityObj.country, cityId: cityObj.id };
    setLocation(loc);
    localStorage.setItem('ticketx-location', JSON.stringify(loc));
  };

  return (
    <LocationContext.Provider value={{ location, locationStatus, requestGeolocation, selectCity, popularCities: POPULAR_CITIES }}>
      {children}
    </LocationContext.Provider>
  );
}

export const useLocation = () => useContext(LocationContext);
