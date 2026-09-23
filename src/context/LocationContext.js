'use client';

import React, { createContext, useContext, useState, useSyncExternalStore } from 'react';

const POPULAR_CITIES = [
  { id: 'lahore', name: 'Lahore', country: 'Pakistan' },
  { id: 'karachi', name: 'Karachi', country: 'Pakistan' },
  { id: 'islamabad', name: 'Islamabad', country: 'Pakistan' },
  { id: 'rawalpindi', name: 'Rawalpindi', country: 'Pakistan' },
  { id: 'dubai', name: 'Dubai', country: 'UAE' },
  { id: 'london', name: 'London', country: 'UK' },
  { id: 'toronto', name: 'Toronto', country: 'Canada' },
  { id: 'new-york', name: 'New York', country: 'USA' },
  { id: 'los-angeles', name: 'Los Angeles', country: 'USA' },
  { id: 'las-vegas', name: 'Las Vegas', country: 'USA' },
  { id: 'chicago', name: 'Chicago', country: 'USA' },
  { id: 'miami', name: 'Miami', country: 'USA' },
  { id: 'san-francisco', name: 'San Francisco', country: 'USA' },
];

const DEFAULT_LOCATION = { city: 'Lahore', country: 'Pakistan', cityId: 'lahore' };
const DEFAULT_JSON = JSON.stringify(DEFAULT_LOCATION);

function subscribeLocation(callback) {
  if (typeof window === 'undefined') return () => {};
  window.addEventListener('storage', callback);
  window.addEventListener('ticketx-location-change', callback);
  return () => {
    window.removeEventListener('storage', callback);
    window.removeEventListener('ticketx-location-change', callback);
  };
}

function getLocationSnapshot() {
  if (typeof window === 'undefined') return DEFAULT_JSON;
  try {
    const saved = localStorage.getItem('ticketx-location');
    return saved || DEFAULT_JSON;
  } catch (_) {
    return DEFAULT_JSON;
  }
}

function getLocationServerSnapshot() {
  return DEFAULT_JSON;
}

const LocationContext = createContext();

export function LocationProvider({ children }) {
  const [locationStatus, setLocationStatus] = useState('idle');
  const locationJson = useSyncExternalStore(
    subscribeLocation,
    getLocationSnapshot,
    getLocationServerSnapshot
  );

  let location = DEFAULT_LOCATION;
  try {
    location = JSON.parse(locationJson);
  } catch (_) {
    location = DEFAULT_LOCATION;
  }

  const saveLocation = (loc) => {
    try {
      localStorage.setItem('ticketx-location', JSON.stringify(loc));
      if (typeof window !== 'undefined') {
        window.dispatchEvent(new Event('ticketx-location-change'));
      }
    } catch (_) {}
  };

  const requestGeolocation = () => {
    if (typeof navigator === 'undefined' || !navigator.geolocation) {
      setLocationStatus('denied');
      return;
    }
    setLocationStatus('loading');
    navigator.geolocation.getCurrentPosition(
      () => {
        setLocationStatus('granted');
        const loc = { city: 'Current Location', country: '', cityId: 'current' };
        saveLocation(loc);
      },
      () => {
        setLocationStatus('denied');
      }
    );
  };

  const selectCity = (cityObj) => {
    const loc = { city: cityObj.name, country: cityObj.country, cityId: cityObj.id };
    saveLocation(loc);
  };

  return (
    <LocationContext.Provider
      value={{
        location,
        locationStatus,
        requestGeolocation,
        selectCity,
        popularCities: POPULAR_CITIES,
      }}
    >
      {children}
    </LocationContext.Provider>
  );
}

export const useLocation = () => useContext(LocationContext);
