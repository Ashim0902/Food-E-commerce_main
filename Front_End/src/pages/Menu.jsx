import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Search as SearchIcon, Filter, SortAsc } from "lucide-react";
import { useProducts } from "../context/ProductContext";
import FoodCard from "../components/FoodCard";
import ProductDetailModal from "../components/ProductDetailModal";

const Menu = () => {
  const { products, categories, loading, fetchProducts } = useProducts();
  
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const menuCategories = [
    "All",
    ...categories
  ];

  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [priceSort, setPriceSort] = useState("");
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [showProductModal, setShowProductModal] = useState(false);

  // Fetch products when filters change
  useEffect(() => {
    fetchProducts({ search: searchTerm, category: selectedCategory === "All" ? "" : selectedCategory, sort: priceSort });
  }, [searchTerm, selectedCategory, priceSort]);

  // Filter by search term
  let filteredMenu = products.filter((item) =>
    item.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Filter by selected category (skip if "All")
  filteredMenu = filteredMenu.filter(
    (item) => selectedCategory === "All" || item.category === selectedCategory
  );

  // Sort by price
  if (priceSort === "asc") {
    filteredMenu = filteredMenu.slice().sort((a, b) => a.price - b.price);
  } else if (priceSort === "desc") {
    filteredMenu = filteredMenu.slice().sort((a, b) => b.price - a.price);
  }

  const handleProductClick = (product) => {
    setSelectedProduct(product);
    setShowProductModal(true);
  };

  const closeProductModal = () => {
    setSelectedProduct(null);
    setShowProductModal(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-white to-red-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8 sm:py-12">
        {/* Hero Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-8 sm:mb-12"
        >
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-black text-gray-800 mb-4 sm:mb-6">
            Our <span className="bg-gradient-to-r from-orange-600 to-red-600 bg-clip-text text-transparent">Menu</span>
          </h1>
          <p className="text-base sm:text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed px-4">
            Discover our exquisite collection of authentic Nepali dishes, prepared with traditional recipes and the finest ingredients from the heart of Nepal.
          </p>
        </motion.div>

        {/* Search and Filters */}
        <div className="bg-white/80 backdrop-blur-sm rounded-3xl shadow-xl p-4 sm:p-8 mb-8 sm:mb-12">
          {/* Search Bar */}
          <div className="mb-6 sm:mb-8 relative w-full md:w-2/3 lg:w-1/2 mx-auto">
            <SearchIcon className="absolute left-3 sm:left-4 top-1/2 -translate-y-1/2 text-orange-500 w-5 h-5 sm:w-6 sm:h-6" />
            <input
              type="text"
              placeholder="Search for your favorite Nepali dishes..."
              className="w-full pl-10 sm:pl-14 pr-4 sm:pr-6 py-3 sm:py-4 rounded-2xl border-2 border-gray-200 bg-white text-gray-800 placeholder-gray-400
                        focus:outline-none focus:ring-4 focus:ring-orange-300 focus:ring-opacity-50 focus:border-orange-500
                        transition-all duration-300 shadow-lg hover:shadow-xl text-sm sm:text-lg"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          {/* Filters */}
          <div className="flex flex-col sm:flex-row justify-center items-center gap-4 sm:gap-6">
            <div className="flex items-center gap-2 sm:gap-3 w-full sm:w-auto">
              <Filter className="w-4 h-4 sm:w-5 sm:h-5 text-gray-600" />
              <select
                className="flex-1 sm:flex-none border-2 border-orange-300 rounded-xl px-4 sm:px-6 py-2 sm:py-3 focus:outline-none focus:ring-2 focus:ring-orange-500 bg-white text-gray-700 font-medium shadow-lg text-sm sm:text-base"
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
              >
                {menuCategories.map((cat) => (
                  <option key={cat} value={cat}>
                    {cat}
                  </option>
                ))}
              </select>
            </div>

            <div className="flex items-center gap-2 sm:gap-3 w-full sm:w-auto">
              <SortAsc className="w-4 h-4 sm:w-5 sm:h-5 text-gray-600" />
              <select
                className="flex-1 sm:flex-none border-2 border-orange-300 rounded-xl px-4 sm:px-6 py-2 sm:py-3 focus:outline-none focus:ring-2 focus:ring-orange-500 bg-white text-gray-700 font-medium shadow-lg text-sm sm:text-base"
                value={priceSort}
                onChange={(e) => setPriceSort(e.target.value)}
              >
                <option value="">Sort by Price</option>
                <option value="asc">Low to High</option>
                <option value="desc">High to Low</option>
              </select>
            </div>
          </div>
        </div>

        {/* Results Count */}
        {searchTerm && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center mb-6 sm:mb-8"
          >
            <p className="text-gray-600 text-base sm:text-lg">
              Found <span className="font-bold text-orange-600">{filteredMenu.length}</span> dishes
              {searchTerm && ` for "${searchTerm}"`}
            </p>
          </motion.div>
        )}

        {/* Loading State */}
        {loading && (
          <div className="text-center py-8">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500 mx-auto"></div>
            <p className="text-gray-600 mt-4">Loading delicious dishes...</p>
          </div>
        )}

        {/* Menu Grid */}
        {!loading && (
        <motion.div
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 sm:gap-8 justify-items-center"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          {filteredMenu.length === 0 ? (
            <div className="text-center py-16 sm:py-24 px-6 col-span-full">
              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                className="bg-white rounded-3xl p-8 sm:p-12 shadow-2xl max-w-md mx-auto"
              >
                <div className="text-6xl sm:text-8xl mb-6">🔍</div>
                <h2 className="text-2xl sm:text-3xl font-bold text-gray-700 mb-4">
                  No Results Found
                </h2>
                <p className="text-gray-500 mb-6 sm:mb-8 text-base sm:text-lg">
                  Sorry, we couldn't find any dishes matching "{searchTerm}".
                </p>
                <button
                  onClick={() => {
                    setSearchTerm("");
                    setSelectedCategory("All");
                    setPriceSort("");
                  }}
                  className="inline-block bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 text-white px-6 sm:px-8 py-3 sm:py-4 rounded-2xl font-bold transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105 text-sm sm:text-base"
                >
                  Clear Filters
                </button>
              </motion.div>
            </div>
          ) : (
            filteredMenu.map((item, index) => (
              <FoodCard
                key={item._id}
                item={item}
                index={index}
                onClick={() => handleProductClick(item)}
              />
            ))
          )}
        </motion.div>
        )}

        {/* Product Detail Modal */}
        <ProductDetailModal
          product={selectedProduct}
          isOpen={showProductModal}
          onClose={closeProductModal}
        />
      </div>
    </div>
  );
};

export default Menu;