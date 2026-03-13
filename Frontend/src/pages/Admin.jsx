import { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useLanguage } from "../context/LanguageContext";
import AnimatedLogo from "../components/AnimatedLogo";
import api from "../services/api";

export default function Admin() {
  const { user, token, loading: authLoading } = useAuth();
  const { t, language } = useLanguage();
  const navigate = useNavigate();
  
  const [stats, setStats] = useState({
    totalUsers: 0,
    totalProducts: 0,
    totalOrders: 0,
    totalRevenue: 0,
  });
  const [users, setUsers] = useState([]);
  const [products, setProducts] = useState([]);
  const [orders, setOrders] = useState([]);
  const [activeTab, setActiveTab] = useState("dashboard");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!authLoading && (!user || !user.isAdmin)) {
      navigate("/");
    }
  }, [user, authLoading, navigate]);

  useEffect(() => {
    if (user && user.isAdmin) {
      fetchData();
    }
  }, [user, activeTab]);

  const fetchData = async () => {
    setLoading(true);
    try {
      if (activeTab === "dashboard") {
        const [usersRes, productsRes, ordersRes] = await Promise.all([
          api.get("/admin/users"),
          api.get("/admin/products"),
          api.get("/admin/orders"),
        ]);
        
        const allOrders = ordersRes.data;
        const revenue = allOrders
          .filter(o => o.status === "confirmed")
          .reduce((sum, o) => sum + (o.totalPrice * 0.03), 0);
        
        setStats({
          totalUsers: usersRes.data.length,
          totalProducts: productsRes.data.length,
          totalOrders: allOrders.length,
          totalRevenue: revenue,
        });
        setOrders(allOrders);
      } else if (activeTab === "users") {
        const res = await api.get("/admin/users");
        setUsers(res.data);
      } else if (activeTab === "products") {
        const res = await api.get("/admin/products");
        setProducts(res.data);
      }
    } catch (err) {
      console.error("Error fetching admin data:", err);
    }
    setLoading(false);
  };

  const handleBanUser = async (userId) => {
    try {
      await api.put(`/admin/users/${userId}/ban`);
      fetchData();
    } catch (err) {
      console.error("Error banning user:", err);
    }
  };

  const handleUnbanUser = async (userId) => {
    try {
      await api.put(`/admin/users/${userId}/unban`);
      fetchData();
    } catch (err) {
      console.error("Error unbanning user:", err);
    }
  };

  const handleDeleteProduct = async (productId) => {
    try {
      await api.delete(`/admin/products/${productId}`);
      fetchData();
    } catch (err) {
      console.error("Error deleting product:", err);
    }
  };

  if (authLoading) {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center">
        <div className="text-purple-400 text-xl">Loading...</div>
      </div>
    );
  }

  if (!user || !user.isAdmin) {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center">
        <div className="text-red-400 text-xl">{t("unauthorized")}</div>
      </div>
    );
  }

  const getStatusColor = (status) => {
    const colors = {
      pending: "bg-yellow-500",
      approved: "bg-blue-500",
      paid: "bg-purple-500",
      delivered: "bg-green-500",
      confirmed: "bg-green-600",
      cancelled: "bg-red-500",
      refunded: "bg-gray-500",
    };
    return colors[status] || "bg-gray-500";
  };

  return (
    <div className="min-h-screen bg-slate-950 pt-16 pb-20">
      <div className="max-w-6xl mx-auto px-4">
        {/* Header */}
        <div className="flex items-center justify-between py-6">
          <Link to="/">
            <AnimatedLogo size="small" />
          </Link>
          <h1 className="text-2xl font-bold text-white">{t("admin_dashboard")}</h1>
          <div className="w-8"></div>
        </div>

        {/* Tabs */}
        <div className="flex border-b border-white/10 mb-6">
          <button
            onClick={() => setActiveTab("dashboard")}
            className={`px-6 py-3 font-medium transition-colors ${
              activeTab === "dashboard"
                ? "text-purple-400 border-b-2 border-purple-400"
                : "text-gray-400 hover:text-white"
            }`}
          >
            Dashboard
          </button>
          <button
            onClick={() => setActiveTab("users")}
            className={`px-6 py-3 font-medium transition-colors ${
              activeTab === "users"
                ? "text-purple-400 border-b-2 border-purple-400"
                : "text-gray-400 hover:text-white"
            }`}
          >
            {t("all_users")}
          </button>
          <button
            onClick={() => setActiveTab("products")}
            className={`px-6 py-3 font-medium transition-colors ${
              activeTab === "products"
                ? "text-purple-400 border-b-2 border-purple-400"
                : "text-gray-400 hover:text-white"
            }`}
          >
            {t("all_products")}
          </button>
        </div>

        {loading ? (
          <div className="flex items-center justify-center py-20">
            <div className="text-purple-400 text-lg animate-pulse">{t("loading")}</div>
          </div>
        ) : (
          <>
            {/* Dashboard Stats */}
            {activeTab === "dashboard" && (
              <div className="space-y-6">
                {/* Stats Grid */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div className="bg-white/5 rounded-2xl p-6 border border-white/10">
                    <div className="text-gray-400 text-sm mb-2">{t("total_users")}</div>
                    <div className="text-3xl font-bold text-white">{stats.totalUsers}</div>
                  </div>
                  <div className="bg-white/5 rounded-2xl p-6 border border-white/10">
                    <div className="text-gray-400 text-sm mb-2">{t("total_products")}</div>
                    <div className="text-3xl font-bold text-white">{stats.totalProducts}</div>
                  </div>
                  <div className="bg-white/5 rounded-2xl p-6 border border-white/10">
                    <div className="text-gray-400 text-sm mb-2">{t("total_orders")}</div>
                    <div className="text-3xl font-bold text-white">{stats.totalOrders}</div>
                  </div>
                  <div className="bg-white/5 rounded-2xl p-6 border border-white/10">
                    <div className="text-gray-400 text-sm mb-2">{t("total_revenue")}</div>
                    <div className="text-3xl font-bold text-purple-400">
                      {stats.totalRevenue.toLocaleString()} XAF
                    </div>
                  </div>
                </div>

                {/* Recent Orders */}
                <div className="bg-white/5 rounded-2xl border border-white/10 overflow-hidden">
                  <div className="px-6 py-4 border-b border-white/10">
                    <h2 className="text-lg font-bold text-white">{t("recent_orders")}</h2>
                  </div>
                  <div className="divide-y divide-white/5">
                    {orders.slice(0, 10).map((order) => (
                      <div key={order._id} className="px-6 py-4 flex items-center justify-between">
                        <div>
                          <p className="text-white font-medium">Order #{order._id.slice(-8)}</p>
                          <p className="text-gray-400 text-sm">
                            {order.buyer?.username || "Unknown"} → {order.vendor?.username || "Unknown"}
                          </p>
                        </div>
                        <div className="text-right">
                          <p className="text-white font-bold">{order.totalPrice} XAF</p>
                          <span className={`inline-block px-3 py-1 rounded-full text-xs text-white ${getStatusColor(order.status)}`}>
                            {order.status}
                          </span>
                        </div>
                      </div>
                    ))}
                    {orders.length === 0 && (
                      <div className="px-6 py-8 text-center text-gray-400">
                        No orders yet
                      </div>
                    )}
                  </div>
                </div>
              </div>
            )}

            {/* Users Tab */}
            {activeTab === "users" && (
              <div className="bg-white/5 rounded-2xl border border-white/10 overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead className="bg-white/5">
                      <tr>
                        <th className="px-6 py-4 text-left text-gray-400 text-sm font-medium">User</th>
                        <th className="px-6 py-4 text-left text-gray-400 text-sm font-medium">Email</th>
                        <th className="px-6 py-4 text-left text-gray-400 text-sm font-medium">Phone</th>
                        <th className="px-6 py-4 text-left text-gray-400 text-sm font-medium">Role</th>
                        <th className="px-6 py-4 text-left text-gray-400 text-sm font-medium">Status</th>
                        <th className="px-6 py-4 text-left text-gray-400 text-sm font-medium">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-white/5">
                      {users.map((u) => (
                        <tr key={u._id} className="hover:bg-white/5">
                          <td className="px-6 py-4">
                            <div className="flex items-center gap-3">
                              <div className="w-10 h-10 rounded-full bg-purple-500 flex items-center justify-center text-white font-bold">
                                {u.username?.[0]?.toUpperCase()}
                              </div>
                              <span className="text-white font-medium">@{u.username}</span>
                            </div>
                          </td>
                          <td className="px-6 py-4 text-gray-300">{u.email}</td>
                          <td className="px-6 py-4 text-gray-300">{u.phone || "-"}</td>
                          <td className="px-6 py-4">
                            {u.isAdmin ? (
                              <span className="text-purple-400 font-medium">Admin</span>
                            ) : u.isVendor ? (
                              <span className="text-blue-400 font-medium">Vendor</span>
                            ) : (
                              <span className="text-gray-400">User</span>
                            )}
                          </td>
                          <td className="px-6 py-4">
                            {u.isBanned ? (
                              <span className="text-red-400">{t("banned")}</span>
                            ) : (
                              <span className="text-green-400">{t("active")}</span>
                            )}
                          </td>
                          <td className="px-6 py-4">
                            {!u.isAdmin && (
                              u.isBanned ? (
                                <button
                                  onClick={() => handleUnbanUser(u._id)}
                                  className="px-4 py-2 rounded-lg bg-green-500/20 text-green-400 text-sm hover:bg-green-500/30 transition-colors"
                                >
                                  {t("unban")}
                                </button>
                              ) : (
                                <button
                                  onClick={() => handleBanUser(u._id)}
                                  className="px-4 py-2 rounded-lg bg-red-500/20 text-red-400 text-sm hover:bg-red-500/30 transition-colors"
                                >
                                  {t("ban")}
                                </button>
                              )
                            )}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
                {users.length === 0 && (
                  <div className="px-6 py-8 text-center text-gray-400">
                    No users found
                  </div>
                )}
              </div>
            )}

            {/* Products Tab */}
            {activeTab === "products" && (
              <div className="bg-white/5 rounded-2xl border border-white/10 overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead className="bg-white/5">
                      <tr>
                        <th className="px-6 py-4 text-left text-gray-400 text-sm font-medium">Product</th>
                        <th className="px-6 py-4 text-left text-gray-400 text-sm font-medium">Price</th>
                        <th className="px-6 py-4 text-left text-gray-400 text-sm font-medium">Vendor</th>
                        <th className="px-6 py-4 text-left text-gray-400 text-sm font-medium">Likes</th>
                        <th className="px-6 py-4 text-left text-gray-400 text-sm font-medium">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-white/5">
                      {products.map((p) => (
                        <tr key={p._id} className="hover:bg-white/5">
                          <td className="px-6 py-4">
                            <div className="flex items-center gap-3">
                              <img
                                src={p.mediaUrl || "https://via.placeholder.com/50"}
                                alt={p.title}
                                className="w-12 h-12 rounded-lg object-cover"
                              />
                              <span className="text-white font-medium">{p.title}</span>
                            </div>
                          </td>
                          <td className="px-6 py-4 text-purple-400 font-bold">{p.price} XAF</td>
                          <td className="px-6 py-4 text-gray-300">@{p.seller?.username || "Unknown"}</td>
                          <td className="px-6 py-4 text-gray-300">{p.likes?.length || 0}</td>
                          <td className="px-6 py-4">
                            <button
                              onClick={() => handleDeleteProduct(p._id)}
                              className="px-4 py-2 rounded-lg bg-red-500/20 text-red-400 text-sm hover:bg-red-500/30 transition-colors"
                            >
                              {t("delete")}
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
                {products.length === 0 && (
                  <div className="px-6 py-8 text-center text-gray-400">
                    No products found
                  </div>
                )}
              </div>
            )}
          </>
        )}
      </div>

      {/* Bottom Navigation */}
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

