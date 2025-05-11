import React, { createContext, useState, useEffect } from 'react';
import { apiFetch } from '../utils/api';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Check session on app load
  useEffect(() => {
    const checkSession = async () => {
      try {
        const data = await apiFetch('/api/auth/session');
        if (data.status === 'active') {
          setUser({ username: data.username, role: data.role });
        }
      } catch (err) {
        console.error('Session check failed:', err);
      } finally {
        setLoading(false);
      }
    };
    checkSession();
  }, []);

  const login = async (username, password) => {
    const body = new URLSearchParams({ username, password });
    const response = await fetch('http://localhost:8082/api/auth/login', {
      method: 'POST',
      body,
      credentials: 'include',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    });
    const data = await response.json();
    if (data.status === 'success') {
      setUser({ username, role: data.role });
    }
    return data;
  };

  const logout = async () => {
    await apiFetch('/api/auth/logout', { method: 'POST' });
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
};