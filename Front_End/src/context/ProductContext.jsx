import React, { createContext, useContext, useState, useEffect } from 'react';

const ProductContext = createContext();

const API_URL = 'http://localhost:5000/api';

export const ProductProvider = ({ children }) => {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Fetch products from API
  const fetchProducts = async (filters = {}) => {
    setLoading(true);
    setError(null);
    
    try {
      const queryParams = new URLSearchParams();
      
      if (filters.category) queryParams.append('category', filters.category);
      if (filters.search) queryParams.append('search', filters.search);
      if (filters.sort) queryParams.append('sort', filters.sort);
      if (filters.page) queryParams.append('page', filters.page);
      if (filters.limit) queryParams.append('limit', filters.limit);

      const response = await fetch(`${API_URL}/products?${queryParams}`);
      const data = await response.json();

      if (response.ok) {
        setProducts(data.products);
        setCategories(data.categories);
        return data;
      } else {
        throw new Error(data.error || 'Failed to fetch products');
      }
    } catch (error) {
      console.error('Fetch products error:', error);
      setError(error.message);
      return { products: [], categories: [] };
    } finally {
      setLoading(false);
    }
  };

  // Get single product
  const getProduct = async (id) => {
    try {
      const response = await fetch(`${API_URL}/products/${id}`);
      const data = await response.json();

      if (response.ok) {
        return data.product;
      } else {
        throw new Error(data.error || 'Product not found');
      }
    } catch (error) {
      console.error('Get product error:', error);
      throw error;
    }
  };

  // Initial load
  useEffect(() => {
    fetchProducts();
  }, []);

  return (
    <ProductContext.Provider
      value={{
        products,
        categories,
        loading,
        error,
        fetchProducts,
        getProduct,
        refreshProducts: () => fetchProducts()
      }}
    >
      {children}
    </ProductContext.Provider>
  );
};

export const useProducts = () => {
  const context = useContext(ProductContext);
  if (!context) {
    throw new Error('useProducts must be used within a ProductProvider');
  }
  return context;
};