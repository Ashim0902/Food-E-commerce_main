import React, { createContext, useContext, useState, useEffect } from 'react';

const AdminContext = createContext();

const API_URL = 'http://localhost:5000/api/admin';

export const AdminProvider = ({ children }) => {
  const [admin, setAdmin] = useState(null);
  const [token, setToken] = useState(localStorage.getItem('adminToken'));
  const [isLoading, setIsLoading] = useState(false);

  // Check if admin is authenticated
  const checkAuth = async () => {
    if (!token) {
      setAdmin(null);
      return;
    }
    
    setIsLoading(true);
    try {
      const res = await fetch(`${API_URL}/profile`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      
      if (res.ok) {
        setAdmin(data.admin);
      } else {
        setAdmin(null);
        setToken(null);
        localStorage.removeItem('adminToken');
      }
    } catch {
      setAdmin(null);
      setToken(null);
      localStorage.removeItem('adminToken');
    }
    setIsLoading(false);
  };

  useEffect(() => {
    checkAuth();
  }, [token]);

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
        localStorage.setItem('adminToken', data.token);
        setToken(data.token);
        setAdmin(data.admin);
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
    setAdmin(null);
    setToken(null);
    localStorage.removeItem('adminToken');
    // Also logout regular user if logged in
    const userToken = localStorage.getItem('token');
    if (userToken) {
      localStorage.removeItem('token');
    }
  };

  // Product management functions
  const getProducts = async (filters = {}) => {
    try {
      const queryParams = new URLSearchParams(filters);
      const res = await fetch(`${API_URL}/products?${queryParams}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      return await res.json();
    } catch (error) {
      throw new Error('Failed to fetch products');
    }
  };

  const addProduct = async (productData) => {
    try {
      const res = await fetch(`${API_URL}/products`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(productData),
      });
      return await res.json();
    } catch (error) {
      throw new Error('Failed to add product');
    }
  };

  const updateProduct = async (id, productData) => {
    try {
      const res = await fetch(`${API_URL}/products/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(productData),
      });
      return await res.json();
    } catch (error) {
      throw new Error('Failed to update product');
    }
  };

  const deleteProduct = async (id) => {
    try {
      const res = await fetch(`${API_URL}/products/${id}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` },
      });
      return await res.json();
    } catch (error) {
      throw new Error('Failed to delete product');
    }
  };

  const getDashboardStats = async () => {
    try {
      const res = await fetch(`${API_URL}/dashboard/stats`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      return await res.json();
    } catch (error) {
      throw new Error('Failed to fetch dashboard stats');
    }
  };

  return (
    <AdminContext.Provider
      value={{
        admin,
        token,
        isLoading,
        isAuthenticated: !!admin,
        login,
        logout,
        getProducts,
        addProduct,
        updateProduct,
        deleteProduct,
        getDashboardStats
      }}
    >
      {children}
    </AdminContext.Provider>
  );
};

export const useAdmin = () => {
  const context = useContext(AdminContext);
  if (!context) {
    throw new Error('useAdmin must be used within an AdminProvider');
  }
  return context;
};