import { useNavigate } from "react-router-dom";
import { useLanguage } from "../context/LanguageContext";
import AnimatedLogo from "./AnimatedLogo";

export default function GuestModal({ isOpen, onClose, action = "like" }) {
  const { t } = useLanguage();
  const navigate = useNavigate();

  if (!isOpen) return null;

  const handleLogin = () => {
    onClose();
    navigate("/login");
  };

  const handleRegister = () => {
    onClose();
    navigate("/register");
  };

  const getActionMessage = () => {
    switch (action) {
      case "like":
        return t("login_to_like") || "Login to like this product";
      case "comment":
        return t("login_to_comment") || "Login to comment";
      case "favorite":
        return t("login_to_favorite") || "Login to add to cart";
      case "request":
        return t("login_to_request") || "Login to request this product";
      case "follow":
        return t("login_to_follow") || "Login to follow this vendor";
      default:
        return t("login_to_continue") || "Login to continue";
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black/70 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Modal Content */}
      <div className="relative w-full max-w-sm scale-in">
        <div className="bg-gradient-to-br from-slate-900 via-purple-900/50 to-slate-900 rounded-3xl p-6 border border-white/20 shadow-2xl">
          {/* Close Button */}
          <button
            onClick={onClose}
            className="absolute top-4 right-4 text-gray-400 hover:text-white transition-colors"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>

          {/* Logo */}
          <div className="flex justify-center mb-4">
            <AnimatedLogo size="medium" />
          </div>

          {/* Icon */}
          <div className="flex justify-center mb-4">
            <div className="w-20 h-20 rounded-full bg-purple-500/20 flex items-center justify-center">
              <svg className="w-10 h-10 text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
              </svg>
            </div>
          </div>

          {/* Message */}
          <h3 className="text-xl font-bold text-white text-center mb-2">
            {t("oops") || "Oops!"}
          </h3>
          <p className="text-gray-300 text-center mb-6">
            {getActionMessage()}
          </p>

          {/* Buttons */}
          <div className="space-y-3">
            <button
              onClick={handleLogin}
              className="w-full py-3.5 rounded-xl bg-gradient-to-r from-purple-600 to-violet-600 text-white font-semibold hover:from-purple-500 hover:to-violet-500 transition-all transform hover:scale-[1.02] active:scale-[0.98]"
            >
              {t("login")}
            </button>
            
            <button
              onClick={handleRegister}
              className="w-full py-3.5 rounded-xl bg-white/10 border border-white/20 text-white font-semibold hover:bg-white/20 transition-all"
            >
              {t("create_account")}
            </button>
          </div>

          {/* Skip */}
          <button
            onClick={onClose}
            className="w-full mt-4 text-gray-400 hover:text-white text-sm transition-colors"
          >
            {t("continue_browsing") || "Continue browsing"}
          </button>
        </div>
      </div>
    </div>
  );
}

