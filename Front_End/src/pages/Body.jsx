import React, { useState, useEffect } from "react";
import { Link, useSearchParams, useNavigate } from "react-router-dom";
import { ShoppingBag, ArrowRight, Search as SearchIcon, Star, Clock, Truck } from "lucide-react";
import { motion } from "framer-motion";
import { useProducts } from "../context/ProductContext";
import FoodCard from "../components/FoodCard";
import ProductDetailModal from "../components/ProductDetailModal";

// Enhanced loading spinner
const FoodSpinner = () => (
  <div className="flex items-center justify-center">
    <motion.div
      className="w-6 h-6 sm:w-8 sm:h-8 border-4 border-orange-200 border-t-orange-500 rounded-full"
      animate={{ rotate: 360 }}
      transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
    />
  </div>
);

const floatingElements = [
  { emoji: "🍕", position: { top: "15%", left: "5%" }, delay: 0 },
  { emoji: "🍜", position: { top: "35%", left: "8%" }, delay: 1.5 },
  { emoji: "🍔", position: { top: "20%", right: "5%" }, delay: 0.75 },
  { emoji: "🥗", position: { top: "40%", right: "8%" }, delay: 2 },
  { emoji: "🍟", position: { top: "60%", left: "4%" }, delay: 2.5 },
  { emoji: "🍗", position: { top: "65%", right: "12%" }, delay: 3 },
];

const initialVisible = 6;

const Body = () => {
  const { products, categories, loading: productsLoading, fetchProducts } = useProducts();
  const [loaded, setLoaded] = useState(false);
  const [visibleCount, setVisibleCount] = useState(
    Object.fromEntries(categories.map((cat) => [cat, initialVisible]))
  );
  const [loadingCategory, setLoadingCategory] = useState(null);
  const [searchParams] = useSearchParams();
  const searchQuery = searchParams.get("q")?.toLowerCase() || "";
  const sortOption = searchParams.get("sort") || "match";
  const navigate = useNavigate();
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [showProductModal, setShowProductModal] = useState(false);

  // Update visible count when categories change
  useEffect(() => {
    setVisibleCount(
      Object.fromEntries(categories.map((cat) => [cat, initialVisible]))
    );
  }, [categories]);

  useEffect(() => {
    window.scrollTo(0, 0);
    const timeout = setTimeout(() => setLoaded(true), 200);
    return () => clearTimeout(timeout);
  }, []);

  const handleLoadMore = (category) => {
    setLoadingCategory(category);
    setTimeout(() => {
      setVisibleCount((prev) => ({
        ...prev,
        [category]: prev[category] + 6,
      }));
      setLoadingCategory(null);
    }, 1000);
  };

  const handleNavClick = () => {
    window.scrollTo(0, 0);
  };

  let filteredItems = products.filter((item) =>
    item.name.toLowerCase().includes(searchQuery)
  );

  if (sortOption === "low") {
    filteredItems.sort((a, b) => a.price - b.price);
  } else if (sortOption === "high") {
    filteredItems.sort((a, b) => b.price - a.price);
  }

  const filteredCategories = Array.from(
    new Set(filteredItems.map((item) => item.category).filter(Boolean))
  );

  const categorizedItems = (category) =>
    filteredItems.filter((item) =>
      category === "Uncategorized" ? !item.category : item.category === category
    );

  const topItems = products.slice(0, 6);

  // No results found UI
  if (searchQuery && filteredItems.length === 0) {
    return (
      <div className="min-h-[70vh] flex flex-col items-center justify-center text-center px-4 bg-gradient-to-br from-orange-50 to-red-50">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-3xl p-8 sm:p-12 shadow-2xl max-w-md w-full"
        >
          <SearchIcon className="w-16 h-16 sm:w-20 sm:h-20 text-orange-400 mb-6 mx-auto" />
          <h2 className="text-2xl sm:text-3xl font-bold mb-4 text-gray-800">
            No Results Found
          </h2>
          <p className="mb-8 text-gray-600 text-sm sm:text-base">
            We couldn't find any dishes matching "{searchQuery}". Try a different search term.
          </p>
          <button
            onClick={() => {
              navigate("/");
              window.scrollTo(0, 0);
            }}
            className="inline-flex items-center gap-2 px-6 sm:px-8 py-3 sm:py-4 bg-gradient-to-r from-orange-500 to-red-500 text-white rounded-2xl font-semibold hover:from-orange-600 hover:to-red-600 transition-all duration-300 shadow-lg hover:shadow-xl text-sm sm:text-base"
          >
            Go Home
            <ArrowRight className="w-4 h-4 sm:w-5 sm:h-5" />
          </button>
        </motion.div>
      </div>
    );
  }

  // Show loading state
  if (productsLoading && products.length === 0) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-orange-50 via-white to-red-50 flex items-center justify-center">
        <FoodSpinner />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-white to-red-50 relative overflow-hidden">
      {/* Floating Elements - Hidden on mobile */}
      {floatingElements.map(({ emoji, position, delay }, i) => (
        <motion.div
          key={i}
          className="text-2xl sm:text-4xl fixed select-none pointer-events-none z-10 hidden sm:block"
          style={{ ...position }}
          initial={{ opacity: 0, y: -20, scale: 0.8 }}
          animate={{
            opacity: loaded ? 0.6 : 0,
            y: loaded ? [0, -15, 0] : 0,
            scale: loaded ? [1, 1.2, 1] : 1,
          }}
          transition={{
            delay,
            duration: 4,
            repeat: Infinity,
            repeatType: "loop",
          }}
          aria-hidden="true"
        >
          {emoji}
        </motion.div>
      ))}

      {/* Hero Section */}
      {!searchQuery && (
        <motion.section
          className="relative px-4 sm:px-6 py-12 sm:py-20 max-w-7xl mx-auto"
          initial={{ opacity: 0, y: 30 }}
          animate={loaded ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8 }}
        >
          <div className="grid lg:grid-cols-2 gap-8 sm:gap-12 items-center">
            {/* Left Content */}
            <div className="text-center lg:text-left space-y-6 sm:space-y-8">
              <motion.h1 
                className="text-3xl sm:text-5xl lg:text-7xl font-black leading-tight"
                initial={{ opacity: 0, x: -50 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.2, duration: 0.8 }}
              >
                <span className="block text-gray-900">Authentic Nepali</span>
                <span className="block bg-gradient-to-r from-orange-500 via-red-500 to-pink-500 bg-clip-text text-transparent">
                  Thali Experience
                </span>
              </motion.h1>
              
              <motion.p 
                className="text-base sm:text-xl text-gray-600 max-w-lg mx-auto lg:mx-0"
                initial={{ opacity: 0, x: -50 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.4, duration: 0.8 }}
              >
                Experience the rich flavors of Nepal with our traditional dishes made from authentic recipes and the finest ingredients, delivered fresh to your doorstep in Pokhara.
              </motion.p>

              {/* Features */}
              <motion.div 
                className="flex flex-wrap gap-4 sm:gap-6 justify-center lg:justify-start"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.6, duration: 0.8 }}
              >
                <div className="flex items-center gap-2 text-gray-600">
                  <Clock className="w-4 h-4 sm:w-5 sm:h-5 text-orange-500" />
                  <span className="font-medium text-sm sm:text-base">30 min delivery</span>
                </div>
                <div className="flex items-center gap-2 text-gray-600">
                  <Star className="w-4 h-4 sm:w-5 sm:h-5 text-yellow-500" />
                  <span className="font-medium text-sm sm:text-base">4.8 rating</span>
                </div>
                <div className="flex items-center gap-2 text-gray-600">
                  <Truck className="w-4 h-4 sm:w-5 sm:h-5 text-green-500" />
                  <span className="font-medium text-sm sm:text-base">Free delivery</span>
                </div>
              </motion.div>

              {/* CTA Buttons */}
              <motion.div 
                className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.8, duration: 0.8 }}
              >
                <Link
                  to="/menu"
                  onClick={handleNavClick}
                  className="inline-flex items-center gap-2 sm:gap-3 bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 text-white px-6 sm:px-8 py-3 sm:py-4 rounded-2xl font-bold text-base sm:text-lg shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:scale-105"
                >
                  <ShoppingBag className="w-5 h-5 sm:w-6 sm:h-6" />
                  Order Now
                  <ArrowRight className="w-5 h-5 sm:w-6 sm:h-6" />
                </Link>
                <Link
                  to="/about"
                  onClick={handleNavClick}
                  className="inline-flex items-center gap-2 sm:gap-3 border-2 border-orange-400 text-orange-600 px-6 sm:px-8 py-3 sm:py-4 rounded-2xl font-bold text-base sm:text-lg hover:bg-orange-50 transition-all duration-300"
                >
                  Learn More
                </Link>
              </motion.div>
            </div>

            {/* Right Image */}
            <motion.div
              className="flex justify-center lg:justify-end"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={loaded ? { opacity: 1, scale: 1 } : {}}
              transition={{ duration: 0.8, delay: 0.3 }}
            >
              <div className="relative">
                <motion.img
                  src="https://images.unsplash.com/photo-1567620905732-2d1ec7ab7445?auto=format&fit=crop&w=800&q=80"
                  alt="Delicious Nepali thali"
                  className="w-72 h-72 sm:w-96 sm:h-96 lg:w-[500px] lg:h-[500px] object-cover rounded-3xl shadow-2xl"
                  animate={{ y: [0, -10, 0] }}
                  transition={{
                    repeat: Infinity,
                    duration: 3,
                    ease: "easeInOut",
                  }}
                />
                <div className="absolute -bottom-4 sm:-bottom-6 -right-4 sm:-right-6 bg-white rounded-2xl p-3 sm:p-4 shadow-xl">
                  <div className="flex items-center gap-2">
                    <Star className="w-4 h-4 sm:w-5 sm:h-5 text-yellow-500 fill-current" />
                    <span className="font-bold text-gray-800 text-sm sm:text-base">4.8</span>
                    <span className="text-gray-600 text-xs sm:text-sm">(2.5k reviews)</span>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </motion.section>
      )}

      {/* Top Dishes Section */}
      {!searchQuery && (
        <section className="mx-auto max-w-7xl px-4 sm:px-6 mb-12 sm:mb-16">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-center mb-8 sm:mb-12"
          >
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-800 mb-4">
              Popular <span className="text-orange-600">Dishes</span>
            </h2>
            <p className="text-gray-600 text-base sm:text-lg">Discover our most loved traditional Nepali creations</p>
          </motion.div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8 justify-items-center">
            {topItems.map((item, i) => (
              <FoodCard key={item._id} item={item} index={i} />
            ))}
          </div>
          
          <div className="text-center mt-8 sm:mt-12">
            <Link
              to="/menu"
              onClick={handleNavClick}
              className="inline-flex items-center gap-2 sm:gap-3 text-orange-600 font-bold border-2 border-orange-500 px-6 sm:px-8 py-3 sm:py-4 rounded-2xl hover:bg-orange-50 transition-all duration-300 shadow-lg hover:shadow-xl text-sm sm:text-base"
            >
              View Full Menu
              <ArrowRight className="w-4 h-4 sm:w-5 sm:h-5" />
            </Link>
          </div>
        </section>
      )}

      {/* Category Sections */}
      {(filteredCategories.length ? filteredCategories : categories).map(
        (category) => {
          const items = categorizedItems(category);
          if (items.length === 0) return null;
          return (
            <motion.section
              key={category}
              className="bg-white/80 backdrop-blur-sm rounded-3xl shadow-xl p-6 sm:p-8 mx-4 sm:mx-auto max-w-7xl mb-12 sm:mb-16"
              initial={{ opacity: 0, y: 40 }}
              animate={loaded ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6 }}
            >
              <h2 className="text-2xl sm:text-3xl font-bold text-gray-800 mb-6 sm:mb-8 text-center">
                <span className="bg-gradient-to-r from-orange-600 to-red-600 bg-clip-text text-transparent">
                  {category === "Uncategorized" ? "Special Picks" : category}
                </span>
              </h2>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8 justify-items-center">
                {items
                  <FoodCard key={item._id} item={item} index={i} onClick={() => handleProductClick(item)} />
                  .map((item, idx) => (
                    <FoodCard key={item._id} item={item} index={idx} onClick={() => handleProductClick(item)} />
                  ))}
              </div>
              
              {visibleCount[category] < items.length && (
                <div className="flex justify-center mt-8 sm:mt-12">
                  <button
                    disabled={loadingCategory === category}
                    onClick={() => handleLoadMore(category)}
                    className={`px-6 sm:px-8 py-3 sm:py-4 bg-gradient-to-r from-orange-500 to-red-500 text-white font-bold rounded-2xl transition-all duration-300 shadow-lg hover:shadow-xl text-sm sm:text-base ${
                      loadingCategory === category
                        ? "cursor-not-allowed opacity-75"
                        : "hover:from-orange-600 hover:to-red-600 transform hover:scale-105"
                    }`}
                  >
                    {loadingCategory === category ? (
                      <span className="flex items-center gap-2 sm:gap-3">
                        <FoodSpinner />
                        Loading...
                      </span>
                    ) : (
                      "Load More"
                    )}
                  </button>
                </div>
              )}
            </motion.section>
          );
        }
      )}

      {/* Product Detail Modal */}
      <ProductDetailModal
        product={selectedProduct}
        isOpen={showProductModal}
        onClose={closeProductModal}
      />
    </div>
  );
};

const handleProductClick = (product) => {
  setSelectedProduct(product);
  setShowProductModal(true);
};

const closeProductModal = () => {
  setSelectedProduct(null);
  setShowProductModal(false);
};

export default Body;