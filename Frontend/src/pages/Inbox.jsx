import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useLanguage } from "../context/LanguageContext";
import AnimatedLogo from "../components/AnimatedLogo";
import api from "../services/api";

export default function Inbox() {
  const { user, token } = useAuth();
  const { t } = useLanguage();
  const navigate = useNavigate();
  const [notifications, setNotifications] = useState([]);
  const [activeTab, setActiveTab] = useState("notifications");

  useEffect(() => {
    if (token) {
      fetchNotifications();
    }
  }, [token]);

  const fetchNotifications = async () => {
    try {
      const res = await api.get("/notifications");
      setNotifications(res.data);
    } catch (err) {
      console.error("Error fetching notifications:", err);
    }
  };

  if (!token) {
    navigate("/login");
    return null;
  }

  return (
    <div className="min-h-screen bg-slate-950 pt-16 pb-20">
      <div className="max-w-lg mx-auto px-4">
        <div className="flex items-center justify-between py-6">
          <Link to="/">
            <AnimatedLogo size="small" />
          </Link>
          <h1 className="text-xl font-bold text-white">{t("notifications")}</h1>
        </div>

        <div className="flex border-b border-white/10 mb-4">
          <button
            onClick={() => setActiveTab("notifications")}
            className={`flex-1 py-3 text-center font-medium ${
              activeTab === "notifications" ? "text-white border-b-2 border-purple-500" : "text-gray-400"
            }`}
          >
            {t("notifications")}
          </button>
          <button
            onClick={() => setActiveTab("messages")}
            className={`flex-1 py-3 text-center font-medium ${
              activeTab === "messages" ? "text-white border-b-2 border-purple-500" : "text-gray-400"
            }`}
          >
            {t("messages")}
          </button>
        </div>

        <div className="space-y-2">
          {notifications.length > 0 ? (
            notifications.map((notif) => (
              <div
                key={notif._id}
                className={`p-4 rounded-xl bg-white/5 ${!notif.isRead ? "border-l-2 border-purple-500" : ""}`}
              >
                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 rounded-full bg-purple-500 flex items-center justify-center text-white font-bold">
                    {notif.sender?.username?.[0]?.toUpperCase() || "?"}
                  </div>
                  <div className="flex-1">
                    <p className="text-white text-sm">{notif.message}</p>
                    <p className="text-gray-400 text-xs mt-1">
                      {new Date(notif.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="text-center py-12">
              <p className="text-gray-400">{t("no_notifications")}</p>
            </div>
          )}
        </div>
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
            <svg className="w-6 h-6 text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
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

