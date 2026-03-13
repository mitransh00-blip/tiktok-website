import { useState, useEffect } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useLanguage } from "../context/LanguageContext";
import AnimatedLogo from "../components/AnimatedLogo";
import api from "../services/api";

export default function Profile() {
  const { id } = useParams();
  const { user, token, logout } = useAuth();
  const { t } = useLanguage();
  const navigate = useNavigate();
  const [profileUser, setProfileUser] = useState(null);
  const [products, setProducts] = useState([]);
  const [cartProducts, setCartProducts] = useState([]);
  const [likedProducts, setLikedProducts] = useState([]);
  const [activeSection, setActiveSection] = useState("products");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    if (id) {
      fetchProfile(id);
    } else if (user) {
      setProfileUser(user);
      fetchMyProducts();
    }
    setLoading(false);
  }, [id, user]);

  useEffect(() => {
    if (!profileUser) return;
    
    if (activeSection === "products") {
      if (id) {
        fetchVendorProducts(id);
      } else {
        fetchMyProducts();
      }
    } else if (activeSection === "cart") {
      fetchCartProducts();
    } else if (activeSection === "liked") {
      fetchLikedProducts();
    }
  }, [activeSection, id, profileUser]);

  const fetchProfile = async (userId) => {
    try {
      const res = await api.get(`/users/${userId}`);
      setProfileUser(res.data);
      fetchVendorProducts(userId);
    } catch (err) {
      console.error("Error fetching profile:", err);
    } finally {
      setLoading(false);
    }
  };

  const fetchVendorProducts = async (userId) => {
    try {
      const res = await api.get(`/products/vendor/${userId}`);
      setProducts(res.data);
    } catch (err) {
      console.error("Error fetching products:", err);
    }
  };

  const fetchMyProducts = async () => {
    try {
      const res = await api.get("/products/my-products");
      setProducts(res.data);
    } catch (err) {
      console.error("Error fetching products:", err);
    }
  };

  const fetchCartProducts = async () => {
    if (!token) return;
    try {
      const res = await api.get("/products/user/favorites");
      setCartProducts(res.data);
    } catch (err) {
      console.error("Error fetching cart:", err);
    }
  };

  const fetchLikedProducts = async () => {
    if (!token) return;
    try {
      const res = await api.get("/products/user/liked");
      setLikedProducts(res.data);
    } catch (err) {
      console.error("Error fetching liked:", err);
    }
  };

  const handleFollow = async () => {
    if (!token) {
      navigate("/login");
      return;
    }
    try {
      await api.post(`/users/follow/${id}`);
      fetchProfile(id);
    } catch (err) {
      console.error("Error following:", err);
    }
  };

  const getDisplayProducts = () => {
    switch (activeSection) {
      case "cart":
        return cartProducts;
      case "liked":
        return likedProducts;
      default:
        return products;
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center">
        <div className="text-purple-400">Loading...</div>
      </div>
    );
  }

  if (!profileUser) {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center">
        <div className="text-gray-400">User not found</div>
      </div>
    );
  }

  const isOwnProfile = !id || id === user?.id;

  return (
    <div className="min-h-screen bg-slate-950 pt-16 pb-20">
      <div className="max-w-lg mx-auto px-4 py-6">
        <div className="flex items-center justify-between mb-6">
          <Link to="/">
            <AnimatedLogo size="small" />
          </Link>
          {isOwnProfile && (
            <button
              onClick={logout}
              className="px-4 py-2 rounded-xl bg-red-500/20 text-red-400 text-sm"
            >
              {t("logout")}
            </button>
          )}
        </div>

        <div className="flex items-center gap-6 mb-8">
          <div className="w-24 h-24 rounded-full bg-purple-500 overflow-hidden">
            {profileUser.profilePic ? (
              <img src={profileUser.profilePic} alt="profile" className="w-full h-full object-cover" />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-white text-3xl font-bold">
                {profileUser.username?.[0]?.toUpperCase() || "U"}
              </div>
            )}
          </div>

          <div className="flex-1">
            <h2 className="text-2xl font-bold text-white mb-1">@{profileUser.username}</h2>
            <p className="text-gray-400 text-sm mb-3">{profileUser.email}</p>
            
            <div className="flex gap-6">
              <div className="text-center">
                <div className="text-white font-bold">{profileUser.followers?.length || 0}</div>
                <div className="text-gray-400 text-xs">{t("followers")}</div>
              </div>
              <div className="text-center">
                <div className="text-white font-bold">{profileUser.following?.length || 0}</div>
                <div className="text-gray-400 text-xs">{t("following")}</div>
              </div>
              <div className="text-center">
                <div className="text-white font-bold">{profileUser.totalLikes || 0}</div>
                <div className="text-gray-400 text-xs">Likes</div>
              </div>
            </div>
          </div>
        </div>

        {profileUser.bio && (
          <p className="text-gray-300 mb-6">{profileUser.bio}</p>
        )}

        {!isOwnProfile && (
          <button
            onClick={handleFollow}
            className="w-full py-3 rounded-xl bg-gradient-to-r from-purple-600 to-violet-600 text-white font-semibold mb-6"
          >
            {user?.following?.includes(id) ? "Unfollow" : "Follow"}
          </button>
        )}

        <div className="flex border-b border-white/10 mb-6">
          <button
            onClick={() => setActiveSection("products")}
            className={`flex-1 py-3 text-center font-medium flex items-center justify-center gap-2 ${
              activeSection === "products" ? "text-white border-b-2 border-purple-500" : "text-gray-400"
            }`}
          >
            <i className="bi bi-grid-3x3"></i>
            {isOwnProfile ? t("my_products") : t("products")}
          </button>
          {isOwnProfile && (
            <>
              <button
                onClick={() => setActiveSection("cart")}
                className={`flex-1 py-3 text-center font-medium flex items-center justify-center gap-2 ${
                  activeSection === "cart" ? "text-white border-b-2 border-purple-500" : "text-gray-400"
                }`}
              >
                <i className="bi bi-cart"></i>
                {t("cart")}
              </button>
              <button
                onClick={() => setActiveSection("liked")}
                className={`flex-1 py-3 text-center font-medium flex items-center justify-center gap-2 ${
                  activeSection === "liked" ? "text-white border-b-2 border-purple-500" : "text-gray-400"
                }`}
              >
                <i className="bi bi-heart"></i>
                {t("liked")}
              </button>
            </>
          )}
        </div>

        <div className="grid grid-cols-3 gap-1">
          {getDisplayProducts().map((product) => (
            <div
              key={product._id}
              className="aspect-square bg-white/5 relative cursor-pointer"
              onClick={() => {
                const index = products.findIndex(p => p._id === product._id);
                if (index >= 0) {
                  navigate(`/?product=${product._id}`);
                }
              }}
            >
              <img
                src={product.mediaUrl || "https://via.placeholder.com/200"}
                alt={product.title}
                className="w-full h-full object-cover"
              />
              <div className="absolute bottom-0 left-0 right-0 bg-black/50 p-1">
                <span className="text-white text-xs">{product.price} XAF</span>
              </div>
            </div>
          ))}
        </div>

        {getDisplayProducts().length === 0 && (
          <p className="text-center text-gray-400 py-8">
            {activeSection === "cart" ? t("no_cart_items") : 
             activeSection === "liked" ? t("no_liked_items") : 
             t("no_products")}
          </p>
        )}
      </div>

      <div className="fixed bottom-0 left-0 right-0 bg-slate-950/90 backdrop-blur-lg border-t border-white/10">
        <div className="max-w-lg mx-auto px-4 py-3 flex items-center justify-between">
          <Link to="/" className="flex flex-col items-center gap-1">
            <svg className="w-6 h-6 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"/>
            </svg>
          </Link>

          <Link to="/upload" className="w-14 h-14 -mt-6 bg-gradient-to-r from-purple-500 to-violet-600 rounded-2xl flex items-center justify-center">
            <svg className="w-8 h-8 text-white" fill="currentColor" viewBox="0 0 24 24">
              <path d="M19 13h-6v6h-2v-6H5v-2h6V5h2v6h6v2z"/>
            </svg>
          </Link>

          <Link to="/inbox" className="flex flex-col items-center gap-1">
            <svg className="w-6 h-6 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z"/>
            </svg>
          </Link>

          <Link to="/profile" className="flex flex-col items-center gap-1">
            <div className="w-6 h-6 rounded-full bg-purple-500 overflow-hidden">
              {user?.profilePic ? (
                <img src={user.profilePic} alt="profile" className="w-full h-full object-cover" />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-white text-xs font-bold">
                  {user?.username?.[0]?.toUpperCase() || "U"}
                </div>
              )}
            </div>
          </Link>
        </div>
      </div>
    </div>
  );
}

