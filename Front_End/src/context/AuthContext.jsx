import React, { createContext, useContext, useState, useEffect } from 'react';
import { useAdmin } from './AdminContext';

const AuthContext = createContext();

const API_URL = 'http://localhost:5000/api';

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem('token'));
  const [isLoading, setIsLoading] = useState(false);

  // Check if user is authenticated by fetching user data
  const checkAuth = async () => {
    if (!token) {
      setUser(null);
      return;
    }
    setIsLoading(true);
    try {
      const res = await fetch(`${API_URL}/me`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      if (res.ok) {
        setUser(data.user);
      } else {
        setUser(null);
        setToken(null);
        localStorage.removeItem('token');
      }
    } catch {
      setUser(null);
      setToken(null);
      localStorage.removeItem('token');
    }
    setIsLoading(false);
  };

  useEffect(() => {
    checkAuth();
  }, [token]);

  // Signup function
  const signup = async ({ name, email, password }) => {
    setIsLoading(true);
    try {
      const res = await fetch(`${API_URL}/signup`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, password }),
      });
      const data = await res.json();
      if (res.ok && data.success) {
        localStorage.setItem('token', data.token);
        setToken(data.token);
        setUser(data.user);
        setIsLoading(false);
        return { success: true };
      } else {
        setIsLoading(false);
        return { success: false, error: data.error || 'Signup failed' };
      }
    } catch (error) {
      setIsLoading(false);
      return { success: false, error: 'Network error' };
    }
  };

  // Login function
  const login = async (email, password) => {
    setIsLoading(true);
    try {
      const res = await fetch(`${API_URL}/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });
      const data = await res.json();
      if (res.ok && data.success) {
        localStorage.setItem('token', data.token);
        setToken(data.token);
        setUser(data.user);
        setIsLoading(false);
        return { success: true };
      } else {
        setIsLoading(false);
        return { success: false, error: data.error || 'Login failed' };
      }
    } catch (error) {
      setIsLoading(false);
      return { success: false, error: 'Network error' };
    }
  };

  // Logout function
  const logout = () => {
    setUser(null);
    setToken(null);
    localStorage.removeItem('token');
    // Also logout admin if logged in
    const adminToken = localStorage.getItem('adminToken');
    if (adminToken) {
      localStorage.removeItem('adminToken');
      window.location.reload(); // Refresh to update admin context
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        isLoading,
        isAuthenticated: !!user,
        signup,
        login,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

// Custom hook for easy use in components
export const useAuth = () => useContext(AuthContext);
