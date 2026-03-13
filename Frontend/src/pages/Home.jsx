import { useState, useEffect, useCallback } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useLanguage } from "../context/LanguageContext";
import AnimatedLogo from "../components/AnimatedLogo";
import OrderRequestModal from "../components/OrderRequestModal";
import PaymentModal from "../components/PaymentModal";
import api from "../services/api";

export default function Home() {
  const [activeTab, setActiveTab] = useState("market");
  const [products, setProducts] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [loading, setLoading] = useState(true);
  const [showSearch, setShowSearch] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [modalProduct, setModalProduct] = useState(null);
  const [modalType, setModalType] = useState(null);
  const [paymentOrder, setPaymentOrder] = useState(null);
  
  const { user, token } = useAuth();
  const { t, language, setLanguage } = useLanguage();
  const navigate = useNavigate();

  const fetchProducts = useCallback(async () => {
    setLoading(true);
    try {
      const userId = user?.id || "";
      const res = await api.get(`/products?type=${activeTab}&userId=${userId}`);
      setProducts(res.data);
      setCurrentIndex(0);
    } catch (err) {
      console.error("Error fetching products:", err);
    } finally {
      setLoading(false);
    }
  }, [activeTab, user]);

  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  const handleSearch = async (query) => {
    setSearchQuery(query);
    if (query.trim().length > 0) {
      try {
        const res = await api.get(`/products/search?q=${encodeURIComponent(query)}`);
        setSearchResults(res.data);
      } catch (err) {
        console.error("Search error:", err);
      }
    } else {
      setSearchResults([]);
    }
  };

  const handleScroll = (e) => {
    if (activeTab === "explore") return; // Explore uses grid view, not scroll
    
    const direction = e.deltaY > 0 ? 1 : -1;
    if (direction > 0 && currentIndex < products.length - 1) {
      setCurrentIndex(prev => prev + 1);
    } else if (direction < 0 && currentIndex > 0) {
      setCurrentIndex(prev => prev - 1);
    }
  };

  const handleLike = async (productId) => {
    if (!token) {
      navigate("/login");
      return;
    }
    try {
      await api.post(`/products/${productId}/like`);
      // Refresh products
      fetchProducts();
    } catch (err) {
      console.error("Error liking product:", err);
    }
  };

  const handleFavorite = async (productId) => {
    if (!token) {
      navigate("/login");
      return;
    }
    try {
      await api.post(`/products/${productId}/favorite`);
    } catch (err) {
      console.error("Error favoriting product:", err);
    }
  };

  const handleShare = (product) => {
    if (navigator.share) {
      navigator.share({
        title: product.title,
        text: `Check out this product on MITRANSH: ${product.title} - ${product.price} XAF`,
        url: `/product/${product._id}`,
      });
    }
  };

  const handleRequest = (product) => {
    if (!token) {
      navigate("/login");
      return;
    }
    setModalProduct(product);
    setModalType("request");
  };

  const handleViewProfile = (sellerId) => {
    navigate(`/profile/${sellerId}`);
  };

  const handleOrderSuccess = (order, type) => {
    if (type === "request" && order) {
      setModalProduct(null);
      setModalType(null);
      // If order is already approved, show payment
      if (order.status === "approved") {
        setPaymentOrder(order);
        setModalType("payment");
      }
    }
  };

  const handlePaymentSuccess = (order) => {
    setPaymentOrder(null);
    setModalType(null);
  };

  const currentProduct = products[currentIndex];

  // Render Market/Preference (TikTok-style vertical scroll)
  const renderFeed = () => {
    if (loading) {
      return (
        <div className="h-full flex items-center justify-center">
          <div className="text-purple-400 text-lg animate-pulse">{t("loading")}</div>
        </div>
      );
    }

    if (products.length === 0) {
      return (
        <div className="h-full flex items-center justify-center">
          <div className="text-center px-4">
            <p className="text-gray-400 text-lg mb-2">
              {activeTab === "preference" ? t("follow_vendors") : t("no_products")}
            </p>
            {token && (
              <button 
                onClick={() => navigate("/upload")} 
                className="px-6 py-2 bg-purple-500 text-white rounded-full hover:bg-purple-600 transition-colors"
              >
                {t("upload_product")}
              </button>
            )}
          </div>
        </div>
      );
    }

    return (
      <div className="h-full relative" onWheel={handleScroll}>
        {/* Product Media */}
        {currentProduct && (
          <>
            {currentProduct.mediaType === "video" ? (
              <video
                src={currentProduct.mediaUrl}
                className="w-full h-full object-cover"
                autoPlay
                loop
                muted
                playsInline
              />
            ) : (
              <img
                src={currentProduct.mediaUrl || "https://via.placeholder.com/400x700"}
                alt={currentProduct.title}
                className="w-full h-full object-cover"
              />
            )}

            {/* Gradient Overlay */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-black/30 pointer-events-none" />

            {/* Product Info - Bottom Left */}
            <div className="absolute bottom-20 left-4 right-24 text-white">
              {/* Vendor Info */}
              <div 
                className="flex items-center gap-3 mb-3 cursor-pointer"
                onClick={() => handleViewProfile(currentProduct.seller?._id)}
              >
                <div className="w-12 h-12 rounded-full bg-purple-500 flex items-center justify-center text-white font-bold overflow-hidden border-2 border-white">
                  {currentProduct.seller?.profilePic ? (
                    <img 
                      src={currentProduct.seller.profilePic} 
                      alt="profile" 
                      className="w-full h-full object-cover" 
                    />
                  ) : (
                    currentProduct.seller?.username?.[0]?.toUpperCase() || "V"
                  )}
                </div>
                <div>
                  <p className="font-semibold text-lg">@{currentProduct.seller?.username || "vendor"}</p>
                  <p className="text-xs text-gray-300">
                    {currentProduct.seller?.followers?.length || 0} {t("followers")}
                  </p>
                </div>
              </div>

              {/* Product Title & Description */}
              <h3 className="font-bold text-xl mb-1">{currentProduct.title}</h3>
              {currentProduct.description && (
                <p className="text-sm text-gray-200 line-clamp-2 mb-2">
                  {currentProduct.description}
                </p>
              )}
              
              {/* Price and Details */}
              <div className="flex flex-wrap gap-2 mb-2">
                <span className="px-3 py-1 bg-purple-600/80 rounded-full text-sm font-bold">
                  {currentProduct.price} {t("xaf")}
                </span>
                {currentProduct.colors?.length > 0 && (
                  <span className="px-3 py-1 bg-white/20 rounded-full text-xs">
                    {currentProduct.colors.join(", ")}
                  </span>
                )}
                {currentProduct.sizes?.length > 0 && (
                  <span className="px-3 py-1 bg-white/20 rounded-full text-xs">
                    {currentProduct.sizes.join(", ")}
                  </span>
                )}
              </div>

              {/* Engagement Stats */}
              <div className="flex gap-4 text-sm text-gray-300">
                <span><i className="bi bi-heart-fill me-1"></i> {currentProduct.likes?.length || 0}</span>
                <span><i className="bi bi-chat-fill me-1"></i> {currentProduct.comments?.length || 0}</span>
                <span><i className="bi bi-eye-fill me-1"></i> {currentProduct.views || 0}</span>
              </div>
            </div>

            {/* Action Buttons - Right Side (TikTok Style) */}
            <div className="absolute right-3 bottom-24 flex flex-col items-center gap-5">
              {/* Profile */}
              <button 
                className="flex flex-col items-center gap-1"
                onClick={() => handleViewProfile(currentProduct.seller?._id)}
              >
                <div className="w-14 h-14 rounded-full bg-white/10 p-1">
                  <div className="w-full h-full rounded-full bg-purple-500 flex items-center justify-center text-white font-bold overflow-hidden">
                    {currentProduct.seller?.profilePic ? (
                      <img 
                        src={currentProduct.seller.profilePic} 
                        alt="profile" 
                        className="w-full h-full object-cover" 
                      />
                    ) : (
                      currentProduct.seller?.username?.[0]?.toUpperCase() || "V"
                    )}
                  </div>
                </div>
              </button>

              {/* Like */}
              <button 
                className="flex flex-col items-center gap-1"
                onClick={() => handleLike(currentProduct._id)}
              >
                <div className="w-14 h-14 rounded-full bg-white/10 flex items-center justify-center text-2xl">
                  <i className={`bi ${currentProduct.likes?.includes(user?.id) ? 'bi-heart-fill text-red-500' : 'bi-heart'}`}></i>
                </div>
                <span className="text-xs text-white font-medium">
                  {currentProduct.likes?.length || 0}
                </span>
              </button>

              {/* Comment */}
              <button className="flex flex-col items-center gap-1">
                <div className="w-14 h-14 rounded-full bg-white/10 flex items-center justify-center text-2xl">
                  <i className="bi bi-chat"></i>
                </div>
                <span className="text-xs text-white font-medium">
                  {currentProduct.comments?.length || 0}
                </span>
              </button>

              {/* Favorite / Cart */}
              <button 
                className="flex flex-col items-center gap-1"
                onClick={() => handleFavorite(currentProduct._id)}
              >
                <div className="w-14 h-14 rounded-full bg-white/10 flex items-center justify-center text-2xl">
                  <i className={`bi ${currentProduct.favorites?.includes(user?.id) ? 'bi-cart-fill text-purple-400' : 'bi-bookmark'}`}></i>
                </div>
                <span className="text-xs text-white font-medium">{t("favorite")}</span>
              </button>

              {/* Share */}
              <button 
                className="flex flex-col items-center gap-1"
                onClick={() => handleShare(currentProduct)}
              >
                <div className="w-14 h-14 rounded-full bg-white/10 flex items-center justify-center text-2xl">
                  <i className="bi bi-share"></i>
                </div>
                <span className="text-xs text-white font-medium">{t("share")}</span>
              </button>

              {/* Request / Order */}
              <button 
                className="flex flex-col items-center gap-1"
                onClick={() => handleRequest(currentProduct)}
              >
                <div className="w-14 h-14 rounded-full bg-gradient-to-r from-purple-600 to-violet-600 flex items-center justify-center text-2xl shadow-lg shadow-purple-500/30">
                  <i className="bi bi-bag-plus"></i>
                </div>
                <span className="text-xs text-white font-medium">{t("request")}</span>
              </button>
            </div>

            {/* Page Indicator */}
            <div className="absolute top-20 right-4 text-white/50 text-xs bg-black/30 px-2 py-1 rounded">
              {currentIndex + 1} / {products.length}
            </div>
          </>
        )}
      </div>
    );
  };

  // Render Explore (Grid view)
  const renderExplore = () => {
    if (loading) {
      return (
        <div className="h-full flex items-center justify-center">
          <div className="text-purple-400 text-lg animate-pulse">{t("loading")}</div>
        </div>
      );
    }

    if (products.length === 0) {
      return (
        <div className="h-full flex items-center justify-center">
          <div className="text-center px-4">
            <p className="text-gray-400 text-lg mb-2">{t("no_products")}</p>
            {token && (
              <button 
                onClick={() => navigate("/upload")} 
                className="px-6 py-2 bg-purple-500 text-white rounded-full"
              >
                {t("upload_product")}
              </button>
            )}
          </div>
        </div>
      );
    }

    return (
      <div className="h-full overflow-y-auto p-2">
        <div className="grid grid-cols-3 gap-1">
          {products.map((product) => (
            <div
              key={product._id}
              className="aspect-[3/4] bg-white/5 relative cursor-pointer overflow-hidden"
              onClick={() => {
                const index = products.findIndex(p => p._id === product._id);
                setCurrentIndex(index);
                setActiveTab("market");
              }}
            >
              <img
                src={product.mediaUrl || "https://via.placeholder.com/200"}
                alt={product.title}
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
              <div className="absolute bottom-1 left-1 right-1">
                <p className="text-white text-xs font-bold truncate">@{product.seller?.username}</p>
                <p className="text-purple-300 text-sm font-bold">{product.price} XAF</p>
              </div>
              {/* Viral Badge */}
              {product.viralScore > 100 && (
                <div className="absolute top-1 right-1 bg-purple-600 text-white text-xs px-2 py-0.5 rounded-full">
                  <i className="bi bi-fire"></i>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-slate-950">
      {/* Top Navigation */}
      <div className="fixed top-0 left-0 right-0 z-50 bg-slate-950/90 backdrop-blur-lg border-b border-white/10">
        <div className="max-w-lg mx-auto px-4 py-3 flex items-center justify-between">
          {/* Live Icon */}
          <button className="flex items-center gap-2 text-red-500 hover:text-red-400 transition-colors">
            <i className="bi bi-broadcast animate-pulse"></i>
            <span className="text-sm font-medium">{t("live")}</span>
          </button>

          {/* Tabs */}
          <div className="flex gap-6">
            <button
              onClick={() => { setActiveTab("market"); setShowSearch(false); }}
              className={`text-sm font-bold pb-1 transition-all ${
                activeTab === "market" 
                  ? "text-white border-b-2 border-purple-500" 
                  : "text-gray-400 hover:text-gray-300"
              }`}
            >
              {t("market")}
            </button>
            <button
              onClick={() => { setActiveTab("preference"); setShowSearch(false); }}
              className={`text-sm font-bold pb-1 transition-all ${
                activeTab === "preference" 
                  ? "text-white border-b-2 border-purple-500" 
                  : "text-gray-400 hover:text-gray-300"
              }`}
            >
              {t("preference")}
            </button>
            <button
              onClick={() => { setActiveTab("explore"); setShowSearch(false); }}
              className={`text-sm font-bold pb-1 transition-all ${
                activeTab === "explore" 
                  ? "text-white border-b-2 border-purple-500" 
                  : "text-gray-400 hover:text-gray-300"
              }`}
            >
              {t("explore")}
            </button>
          </div>

          {/* Search */}
          <button 
            onClick={() => setShowSearch(!showSearch)}
            className="text-white hover:text-purple-400 transition-colors"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </button>
        </div>

        {/* Search Bar */}
        {showSearch && (
          <div className="px-4 pb-3">
            <div className="relative">
              <input
                type="text"
                placeholder={t("search_placeholder")}
                value={searchQuery}
                onChange={(e) => handleSearch(e.target.value)}
                className="w-full px-4 py-2 pl-10 rounded-xl bg-white/10 border border-white/20 text-white placeholder-gray-400 focus:outline-none focus:border-purple-500"
              />
              <svg 
                className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" 
                fill="none" 
                stroke="currentColor" 
                viewBox="0 0 24 24"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>
            {/* Search Results */}
            {searchResults.length > 0 && (
              <div className="mt-2 bg-gray-900 rounded-xl overflow-hidden max-h-60 overflow-y-auto">
                {searchResults.map((product) => (
                  <div
                    key={product._id}
                    className="flex items-center gap-3 p-3 hover:bg-white/5 cursor-pointer"
                    onClick={() => {
                      const index = products.findIndex(p => p._id === product._id);
                      if (index >= 0) {
                        setCurrentIndex(index);
                        setActiveTab("market");
                      }
                      setShowSearch(false);
                      setSearchQuery("");
                    }}
                  >
                    <img
                      src={product.mediaUrl || "https://via.placeholder.com/50"}
                      alt={product.title}
                      className="w-12 h-12 object-cover rounded-lg"
                    />
                    <div className="flex-1">
                      <p className="text-white text-sm font-medium truncate">{product.title}</p>
                      <p className="text-purple-400 text-xs">@{product.seller?.username}</p>
                    </div>
                    <span className="text-white text-sm font-bold">{product.price} XAF</span>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>

      {/* Main Content */}
      <div className="h-screen pt-16 pb-20">
        {activeTab === "explore" ? renderExplore() : renderFeed()}
      </div>

      {/* Bottom Navigation */}
      <div className="fixed bottom-0 left-0 right-0 bg-slate-950/90 backdrop-blur-lg border-t border-white/10 z-50">
        <div className="max-w-lg mx-auto px-4 py-3 flex items-center justify-between">
          {/* Logo/Home */}
          <Link to="/" className="flex flex-col items-center gap-1">
            <AnimatedLogo size="small" />
          </Link>

          {/* Upload */}
          <Link 
            to={token ? "/upload" : "/login"} 
            className="w-14 h-14 -mt-6 bg-gradient-to-r from-purple-500 to-violet-600 rounded-2xl flex items-center justify-center shadow-lg shadow-purple-500/30 hover:scale-105 transition-transform"
          >
            <svg className="w-8 h-8 text-white" fill="currentColor" viewBox="0 0 24 24">
              <path d="M19 13h-6v6h-2v-6H5v-2h6V5h2v6h6v2z"/>
            </svg>
          </Link>

          {/* Inbox */}
          <Link 
            to={token ? "/inbox" : "/login"} 
            className="flex flex-col items-center gap-1"
          >
            <div className="relative">
              <svg className="w-7 h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z"/>
              </svg>
            </div>
          </Link>

          {/* Profile */}
          <Link 
            to={token ? "/profile" : "/login"} 
            className="flex flex-col items-center gap-1"
          >
            <div className="w-8 h-8 rounded-full bg-purple-500 overflow-hidden">
              {user?.profilePic ? (
                <img src={user.profilePic} alt="profile" className="w-full h-full object-cover" />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-white font-bold text-sm">
                  {user?.username?.[0]?.toUpperCase() || "U"}
                </div>
              )}
            </div>
          </Link>
        </div>
      </div>

      {/* Modals */}
      {modalProduct && modalType === "request" && (
        <OrderRequestModal
          product={modalProduct}
          onClose={() => { setModalProduct(null); setModalType(null); }}
          onSuccess={handleOrderSuccess}
        />
      )}

      {paymentOrder && modalType === "payment" && (
        <PaymentModal
          order={paymentOrder}
          onClose={() => { setPaymentOrder(null); setModalType(null); }}
          onSuccess={handlePaymentSuccess}
        />
      )}
    </div>
  );
}

