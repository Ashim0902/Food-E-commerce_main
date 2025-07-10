import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  X, 
  Star, 
  Plus, 
  Minus, 
  ShoppingCart, 
  Heart,
  Share2,
  ThumbsUp,
  MessageCircle,
  Filter,
  ChevronDown,
  User,
  Calendar,
  CheckCircle
} from 'lucide-react';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';

const ProductDetailModal = ({ product, isOpen, onClose }) => {
  const { dispatch } = useCart();
  const { user, isAuthenticated } = useAuth();
  const [quantity, setQuantity] = useState(1);
  const [reviews, setReviews] = useState([]);
  const [reviewStats, setReviewStats] = useState({});
  const [loading, setLoading] = useState(false);
  const [showReviewForm, setShowReviewForm] = useState(false);
  const [reviewForm, setReviewForm] = useState({
    rating: 5,
    comment: ''
  });
  const [reviewFilters, setReviewFilters] = useState({
    sort: 'newest',
    rating: 'all'
  });
  const [userReview, setUserReview] = useState(null);

  useEffect(() => {
    if (isOpen && product) {
      fetchReviews();
      if (isAuthenticated) {
        checkUserReview();
      }
    }
  }, [isOpen, product, isAuthenticated, reviewFilters]);

  const fetchReviews = async () => {
    try {
      setLoading(true);
      const response = await fetch(
        `http://localhost:5000/api/reviews/product/${product._id}?sort=${reviewFilters.sort}&limit=10`
      );
      const data = await response.json();
      
      if (response.ok) {
        setReviews(data.reviews || []);
        setReviewStats(data);
      }
    } catch (error) {
      console.error('Failed to fetch reviews:', error);
    } finally {
      setLoading(false);
    }
  };

  const checkUserReview = async () => {
    try {
      const response = await fetch(
        `http://localhost:5000/api/reviews/product/${product._id}`,
        {
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`
          }
        }
      );
      const data = await response.json();
      
      if (response.ok) {
        const userReviewFound = data.reviews?.find(review => review.userEmail === user?.email);
        setUserReview(userReviewFound || null);
      }
    } catch (error) {
      console.error('Failed to check user review:', error);
    }
  };

  const handleAddToCart = () => {
    const cartItem = {
      ...product,
      id: product._id,
      quantity: quantity
    };
    
    for (let i = 0; i < quantity; i++) {
      dispatch({ type: 'ADD_TO_CART', payload: cartItem });
    }
    
    // Success toast
    const toast = document.createElement('div');
    toast.className = 'fixed top-4 right-4 bg-gradient-to-r from-green-500 to-green-600 text-white px-6 py-3 rounded-xl shadow-2xl z-50 transition-all duration-300';
    toast.innerHTML = `
      <div class="flex items-center gap-2">
        <div class="w-2 h-2 bg-white rounded-full animate-pulse"></div>
        <span class="font-medium">${quantity} ${product.name} added to cart!</span>
      </div>
    `;
    document.body.appendChild(toast);
    
    setTimeout(() => {
      toast.style.transform = 'translateX(100%)';
      toast.style.opacity = '0';
      setTimeout(() => document.body.removeChild(toast), 300);
    }, 2500);
  };

  const handleSubmitReview = async (e) => {
    e.preventDefault();
    
    if (!isAuthenticated) {
      alert('Please sign in to submit a review');
      return;
    }

    try {
      const response = await fetch(
        `http://localhost:5000/api/reviews/product/${product._id}`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${localStorage.getItem('token')}`
          },
          body: JSON.stringify(reviewForm)
        }
      );

      const data = await response.json();

      if (response.ok) {
        setShowReviewForm(false);
        setReviewForm({ rating: 5, comment: '' });
        fetchReviews();
        checkUserReview();
        
        // Success toast
        const toast = document.createElement('div');
        toast.className = 'fixed top-4 right-4 bg-gradient-to-r from-green-500 to-green-600 text-white px-6 py-3 rounded-xl shadow-2xl z-50 transition-all duration-300';
        toast.innerHTML = `
          <div class="flex items-center gap-2">
            <div class="w-2 h-2 bg-white rounded-full animate-pulse"></div>
            <span class="font-medium">Review submitted successfully! 🌟</span>
          </div>
        `;
        document.body.appendChild(toast);
        
        setTimeout(() => {
          toast.style.transform = 'translateX(100%)';
          toast.style.opacity = '0';
          setTimeout(() => document.body.removeChild(toast), 300);
        }, 3000);
      } else {
        alert(data.error || 'Failed to submit review');
      }
    } catch (error) {
      console.error('Submit review error:', error);
      alert('Failed to submit review');
    }
  };

  const handleMarkHelpful = async (reviewId) => {
    if (!isAuthenticated) return;

    try {
      const response = await fetch(
        `http://localhost:5000/api/reviews/${reviewId}/helpful`,
        {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`
          }
        }
      );

      if (response.ok) {
        fetchReviews();
      }
    } catch (error) {
      console.error('Mark helpful error:', error);
    }
  };

  const renderStars = (rating, size = 'w-5 h-5') => {
    return (
      <div className="flex items-center gap-1">
        {[1, 2, 3, 4, 5].map((star) => (
          <Star
            key={star}
            className={`${size} ${
              star <= rating
                ? 'text-yellow-500 fill-current'
                : 'text-gray-300'
            }`}
          />
        ))}
      </div>
    );
  };

  const renderInteractiveStars = (rating, onChange) => {
    return (
      <div className="flex items-center gap-1">
        {[1, 2, 3, 4, 5].map((star) => (
          <button
            key={star}
            type="button"
            onClick={() => onChange(star)}
            className="transition-transform hover:scale-110"
          >
            <Star
              className={`w-8 h-8 ${
                star <= rating
                  ? 'text-yellow-500 fill-current'
                  : 'text-gray-300 hover:text-yellow-400'
              }`}
            />
          </button>
        ))}
      </div>
    );
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  if (!isOpen || !product) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 px-4"
        onClick={onClose}
      >
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.9, opacity: 0 }}
          onClick={(e) => e.stopPropagation()}
          className="bg-white rounded-3xl shadow-2xl w-full max-w-6xl max-h-[90vh] overflow-y-auto"
        >
          {/* Header */}
          <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between rounded-t-3xl z-10">
            <h2 className="text-2xl font-bold text-gray-800">Product Details</h2>
            <button
              onClick={onClose}
              className="w-10 h-10 bg-gray-100 hover:bg-gray-200 rounded-full flex items-center justify-center transition-colors"
            >
              <X className="w-6 h-6 text-gray-600" />
            </button>
          </div>

          <div className="p-6">
            {/* Product Info Section */}
            <div className="grid lg:grid-cols-2 gap-8 mb-8">
              {/* Product Image */}
              <div className="space-y-4">
                <img
                  src={product.img}
                  alt={product.name}
                  className="w-full h-80 object-cover rounded-2xl shadow-lg"
                />
                <div className="flex gap-3">
                  <button className="flex-1 flex items-center justify-center gap-2 py-3 border-2 border-gray-300 rounded-xl hover:bg-gray-50 transition-colors">
                    <Heart className="w-5 h-5" />
                    Save
                  </button>
                  <button className="flex-1 flex items-center justify-center gap-2 py-3 border-2 border-gray-300 rounded-xl hover:bg-gray-50 transition-colors">
                    <Share2 className="w-5 h-5" />
                    Share
                  </button>
                </div>
              </div>

              {/* Product Details */}
              <div className="space-y-6">
                <div>
                  <div className="flex items-center gap-2 mb-2">
                    <span className="bg-orange-100 text-orange-600 px-3 py-1 rounded-full text-sm font-medium">
                      {product.category}
                    </span>
                    {product.averageRating > 0 && (
                      <div className="flex items-center gap-1">
                        {renderStars(Math.round(product.averageRating))}
                        <span className="text-gray-600 text-sm">
                          ({product.totalReviews} reviews)
                        </span>
                      </div>
                    )}
                  </div>
                  <h1 className="text-3xl font-bold text-gray-800 mb-3">{product.name}</h1>
                  <p className="text-gray-600 text-lg leading-relaxed">{product.description}</p>
                </div>

                <div className="text-4xl font-bold text-orange-600">
                  Rs. {product.price}
                </div>

                {/* Quantity Selector */}
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Quantity
                    </label>
                    <div className="flex items-center gap-3 bg-gray-100 rounded-xl p-1 w-fit">
                      <button
                        onClick={() => setQuantity(Math.max(1, quantity - 1))}
                        className="w-10 h-10 rounded-xl bg-white hover:bg-gray-50 flex items-center justify-center transition-colors shadow-sm"
                      >
                        <Minus className="w-4 h-4 text-gray-600" />
                      </button>
                      
                      <span className="w-12 text-center font-bold text-lg">{quantity}</span>
                      
                      <button
                        onClick={() => setQuantity(quantity + 1)}
                        className="w-10 h-10 rounded-xl bg-orange-500 hover:bg-orange-600 text-white flex items-center justify-center transition-colors shadow-sm"
                      >
                        <Plus className="w-4 h-4" />
                      </button>
                    </div>
                  </div>

                  <button
                    onClick={handleAddToCart}
                    className="w-full bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 text-white py-4 rounded-2xl font-bold text-lg transition-all duration-300 flex items-center justify-center gap-3 shadow-lg hover:shadow-xl transform hover:scale-105"
                  >
                    <ShoppingCart className="w-6 h-6" />
                    Add {quantity} to Cart - Rs. {product.price * quantity}
                  </button>
                </div>

                {/* Product Features */}
                <div className="bg-gray-50 rounded-2xl p-4">
                  <h4 className="font-semibold text-gray-800 mb-3">Why you'll love this dish:</h4>
                  <ul className="space-y-2 text-gray-600">
                    <li className="flex items-center gap-2">
                      <CheckCircle className="w-4 h-4 text-green-500" />
                      Made with authentic Nepali spices
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle className="w-4 h-4 text-green-500" />
                      Fresh ingredients sourced locally
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle className="w-4 h-4 text-green-500" />
                      Traditional cooking methods
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle className="w-4 h-4 text-green-500" />
                      Free delivery in Pokhara
                    </li>
                  </ul>
                </div>
              </div>
            </div>

            {/* Reviews Section */}
            <div className="border-t border-gray-200 pt-8">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-2xl font-bold text-gray-800">
                  Customer Reviews ({product.totalReviews || 0})
                </h3>
                
                {isAuthenticated && !userReview && (
                  <button
                    onClick={() => setShowReviewForm(true)}
                    className="bg-orange-500 hover:bg-orange-600 text-white px-6 py-3 rounded-xl font-semibold transition-colors flex items-center gap-2"
                  >
                    <MessageCircle className="w-5 h-5" />
                    Write Review
                  </button>
                )}
              </div>

              {/* Review Form */}
              {showReviewForm && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="bg-orange-50 rounded-2xl p-6 mb-6"
                >
                  <h4 className="text-xl font-bold text-gray-800 mb-4">Write Your Review</h4>
                  <form onSubmit={handleSubmitReview} className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Your Rating
                      </label>
                      {renderInteractiveStars(reviewForm.rating, (rating) => 
                        setReviewForm({...reviewForm, rating})
                      )}
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Your Review
                      </label>
                      <textarea
                        value={reviewForm.comment}
                        onChange={(e) => setReviewForm({...reviewForm, comment: e.target.value})}
                        rows={4}
                        className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500 resize-none"
                        placeholder="Share your experience with this dish..."
                        required
                      />
                    </div>
                    
                    <div className="flex gap-3">
                      <button
                        type="submit"
                        className="bg-orange-500 hover:bg-orange-600 text-white px-6 py-3 rounded-xl font-semibold transition-colors"
                      >
                        Submit Review
                      </button>
                      <button
                        type="button"
                        onClick={() => setShowReviewForm(false)}
                        className="bg-gray-500 hover:bg-gray-600 text-white px-6 py-3 rounded-xl font-semibold transition-colors"
                      >
                        Cancel
                      </button>
                    </div>
                  </form>
                </motion.div>
              )}

              {/* User's Existing Review */}
              {userReview && (
                <div className="bg-blue-50 rounded-2xl p-6 mb-6">
                  <div className="flex items-center justify-between mb-3">
                    <h4 className="text-lg font-bold text-gray-800">Your Review</h4>
                    <span className="text-blue-600 text-sm font-medium">Your review</span>
                  </div>
                  <div className="flex items-center gap-3 mb-3">
                    {renderStars(userReview.rating)}
                    <span className="text-gray-600 text-sm">
                      {formatDate(userReview.createdAt)}
                    </span>
                  </div>
                  <p className="text-gray-700">{userReview.comment}</p>
                </div>
              )}

              {/* Review Filters */}
              <div className="flex flex-wrap gap-4 mb-6">
                <select
                  value={reviewFilters.sort}
                  onChange={(e) => setReviewFilters({...reviewFilters, sort: e.target.value})}
                  className="border border-gray-300 rounded-xl px-4 py-2 focus:outline-none focus:ring-2 focus:ring-orange-500"
                >
                  <option value="newest">Newest First</option>
                  <option value="oldest">Oldest First</option>
                  <option value="highest">Highest Rating</option>
                  <option value="lowest">Lowest Rating</option>
                  <option value="helpful">Most Helpful</option>
                </select>
              </div>

              {/* Reviews List */}
              <div className="space-y-6">
                {loading ? (
                  <div className="text-center py-8">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-orange-500 mx-auto"></div>
                    <p className="text-gray-600 mt-2">Loading reviews...</p>
                  </div>
                ) : reviews.length === 0 ? (
                  <div className="text-center py-12">
                    <MessageCircle className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                    <h4 className="text-xl font-semibold text-gray-600 mb-2">No reviews yet</h4>
                    <p className="text-gray-500">Be the first to review this delicious dish!</p>
                  </div>
                ) : (
                  reviews.map((review) => (
                    <div key={review._id} className="bg-gray-50 rounded-2xl p-6">
                      <div className="flex items-start justify-between mb-3">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 bg-gradient-to-br from-orange-500 to-red-500 rounded-full flex items-center justify-center text-white font-semibold">
                            {review.userName.charAt(0).toUpperCase()}
                          </div>
                          <div>
                            <h5 className="font-semibold text-gray-800">{review.userName}</h5>
                            <div className="flex items-center gap-2">
                              {renderStars(review.rating, 'w-4 h-4')}
                              <span className="text-gray-500 text-sm">
                                {formatDate(review.createdAt)}
                              </span>
                            </div>
                          </div>
                        </div>
                        {review.isVerifiedPurchase && (
                          <span className="bg-green-100 text-green-600 px-2 py-1 rounded-full text-xs font-medium">
                            Verified Purchase
                          </span>
                        )}
                      </div>
                      
                      <p className="text-gray-700 mb-4 leading-relaxed">{review.comment}</p>
                      
                      <div className="flex items-center gap-4">
                        <button
                          onClick={() => handleMarkHelpful(review._id)}
                          className="flex items-center gap-2 text-gray-600 hover:text-orange-600 transition-colors"
                          disabled={!isAuthenticated}
                        >
                          <ThumbsUp className="w-4 h-4" />
                          <span className="text-sm">Helpful ({review.helpful})</span>
                        </button>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

export default ProductDetailModal;