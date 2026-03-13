import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useLanguage } from '../context/LanguageContext';
import { useAuth } from '../context/AuthContext';
import api from '../services/api';

export default function ProductFeed({ products, type, onProductClick }) {
  const { t } = useLanguage();
  const { isAuthenticated, user } = useAuth();
  const containerRef = useRef(null);
  const [currentIndex, setCurrentIndex] = useState(0);

  const handleScroll = (e) => {
    const container = containerRef.current;
    if (!container) return;
    
    const scrollPosition = e.target.scrollTop;
    const itemHeight = window.innerHeight - 80; // Account for navbar
    const newIndex = Math.round(scrollPosition / itemHeight);
    setCurrentIndex(newIndex);
  };

  const handleLike = async (productId, e) => {
    e.stopPropagation();
    if (!isAuthenticated) return;
    
    try {
      await api.post(`/products/${productId}/like`);
    } catch (err) {
      console.error('Error liking product:', err);
    }
  };

  const handleFavorite = async (productId, e) => {
    e.stopPropagation();
    if (!isAuthenticated) return;
    
    try {
      await api.post(`/products/${productId}/favorite`);
    } catch (err) {
      console.error('Error favoriting product:', err);
    }
  };

  const handleComment = (product, e) => {
    e.stopPropagation();
    // Open comment modal
  };

  const handleShare = (product, e) => {
    e.stopPropagation();
    if (navigator.share) {
      navigator.share({
        title: product.title,
        text: `Check out this product on MITRANSH: ${product.title}`,
        url: `/product/${product._id}`,
      });
    }
  };

  const handleRequest = (product, e) => {
    e.stopPropagation();
    if (!isAuthenticated) return;
    onProductClick(product, 'request');
  };

  const handleViewProfile = (product, e) => {
    e.stopPropagation();
    window.location.href = `/vendor/${product.seller._id}`;
  };

  if (!products || products.length === 0) {
    return (
      <div className="h-screen flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-400 text-lg">{t('noProducts')}</p>
          <p className="text-gray-500 text-sm mt-2">{t('beFirstToUpload')}</p>
        </div>
      </div>
    );
  }

  return (
    <div 
      ref={containerRef}
      className="h-screen overflow-y-scroll snap-y snap-mandatory scroll-smooth"
      onScroll={handleScroll}
      style={{ scrollbarWidth: 'none' }}
    >
      {products.map((product, index) => (
        <div
          key={product._id}
          className="h-screen snap-start relative flex items-center justify-center"
        >
          {/* Product Media */}
          <div 
            className="absolute inset-0 cursor-pointer"
            onClick={() => onProductClick(product, 'view')}
          >
            {product.mediaType === 'video' ? (
              <video
                src={product.mediaUrl}
                className="w-full h-full object-cover"
                autoPlay
                loop
                muted
                playsInline
              />
            ) : (
              <img
                src={product.mediaUrl}
                alt={product.title}
                className="w-full h-full object-cover"
              />
            )}
          </div>

          {/* Gradient Overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-black/30 pointer-events-none" />

          {/* Product Info - Bottom Left */}
          <div className="absolute bottom-20 left-4 right-20 text-white">
            {/* Vendor Info */}
            <div className="flex items-center gap-3 mb-3">
              <div 
                className="w-10 h-10 rounded-full bg-mitransh-500 flex items-center justify-center text-white font-bold cursor-pointer"
                onClick={(e) => handleViewProfile(product, e)}
              >
                {product.seller?.username?.charAt(0).toUpperCase() || 'U'}
              </div>
              <div>
                <p 
                  className="font-semibold cursor-pointer hover:underline"
                  onClick={(e) => handleViewProfile(product, e)}
                >
                  @{product.seller?.username || 'user'}
                </p>
                <p className="text-xs text-gray-300">{t('followers')}: {product.seller?.followers?.length || 0}</p>
              </div>
            </div>

            {/* Product Title & Description */}
            <h3 className="font-bold text-lg mb-1">{product.title}</h3>
            <p className="text-sm text-gray-200 line-clamp-2 mb-2">
              {product.description || product.caption}
            </p>
            
            {/* Price and Details */}
            <div className="flex flex-wrap gap-2 mb-2">
              <span className="px-3 py-1 bg-mitransh-600/80 rounded-full text-sm font-bold">
                {product.price} XAF
              </span>
              {product.colors?.length > 0 && (
                <span className="px-3 py-1 bg-white/20 rounded-full text-xs">
                  {product.colors.join(', ')}
                </span>
              )}
              {product.sizes?.length > 0 && (
                <span className="px-3 py-1 bg-white/20 rounded-full text-xs">
                  {product.sizes.join(', ')}
                </span>
              )}
            </div>

            {/* Engagement Stats */}
            <div className="flex gap-4 text-xs text-gray-300">
              <span>❤️ {product.likes?.length || 0}</span>
              <span>💬 {product.comments?.length || 0}</span>
              <span>👁️ {product.views || 0}</span>
            </div>
          </div>

          {/* Action Buttons - Right Side */}
          <div className="absolute right-3 bottom-24 flex flex-col items-center gap-4">
            {/* Profile */}
            <motion.button
              className="w-12 h-12 rounded-full bg-white/10 p-1"
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={(e) => handleViewProfile(product, e)}
            >
              <div className="w-full h-full rounded-full bg-mitransh-500 flex items-center justify-center text-white font-bold">
                {product.seller?.username?.charAt(0).toUpperCase() || 'U'}
              </div>
            </motion.button>

            {/* Like */}
            <motion.button
              className="flex flex-col items-center gap-1"
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={(e) => handleLike(product._id, e)}
            >
              <div className="w-12 h-12 rounded-full bg-white/10 flex items-center justify-center text-2xl">
                {product.likes?.includes(user?.id) ? '❤️' : '🤍'}
              </div>
              <span className="text-xs text-white">{product.likes?.length || 0}</span>
            </motion.button>

            {/* Comment */}
            <motion.button
              className="flex flex-col items-center gap-1"
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={(e) => handleComment(product, e)}
            >
              <div className="w-12 h-12 rounded-full bg-white/10 flex items-center justify-center text-2xl">
                💬
              </div>
              <span className="text-xs text-white">{product.comments?.length || 0}</span>
            </motion.button>

            {/* Favorite / Add to Cart */}
            <motion.button
              className="flex flex-col items-center gap-1"
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={(e) => handleFavorite(product._id, e)}
            >
              <div className="w-12 h-12 rounded-full bg-white/10 flex items-center justify-center text-2xl">
                {product.favorites?.includes(user?.id) ? '🛒' : '🔖'}
              </div>
              <span className="text-xs text-white">{t('favorite')}</span>
            </motion.button>

            {/* Share */}
            <motion.button
              className="flex flex-col items-center gap-1"
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={(e) => handleShare(product, e)}
            >
              <div className="w-12 h-12 rounded-full bg-white/10 flex items-center justify-center text-2xl">
                ➤
              </div>
              <span className="text-xs text-white">{t('share')}</span>
            </motion.button>

            {/* Request / Order */}
            <motion.button
              className="flex flex-col items-center gap-1"
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={(e) => handleRequest(product, e)}
            >
              <div className="w-12 h-12 rounded-full bg-gradient-to-r from-mitransh-600 to-mitransh-500 flex items-center justify-center text-2xl">
                🛍️
              </div>
              <span className="text-xs text-white">{t('request')}</span>
            </motion.button>
          </div>

          {/* Page Indicator */}
          <div className="absolute top-20 right-4 text-white/50 text-xs">
            {currentIndex + 1} / {products.length}
          </div>
        </div>
      ))}
    </div>
  );
}

