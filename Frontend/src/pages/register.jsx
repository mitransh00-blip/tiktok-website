import { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import { useLanguage } from "../context/LanguageContext";
import AnimatedLogo from "../components/AnimatedLogo";
import { useNavigate, Link } from "react-router-dom";

export default function Register() {
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    phone: "", // digits only
    password: "",
    confirmPassword: "",
    language: "en",
  });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [toast, setToast] = useState({ show: false, message: "", type: "success" });
  const [shake, setShake] = useState(false);

  const { register } = useAuth();
  const { language, setLanguage, t } = useLanguage();
  const navigate = useNavigate();

  // Auto-hide toast after 4 seconds
  useEffect(() => {
    if (toast.show) {
      const timer = setTimeout(() => setToast({ show: false, message: "", type: "" }), 4000);
      return () => clearTimeout(timer);
    }
  }, [toast.show]);

  // Trigger shake animation when general error appears
  useEffect(() => {
    if (errors.general) {
      setShake(true);
      const timer = setTimeout(() => setShake(false), 600);
      return () => clearTimeout(timer);
    }
  }, [errors.general]);

  const validateForm = () => {
    const newErrors = {};

    if (!formData.username.trim()) {
      newErrors.username = t("username_required") || "Username is required";
    } else if (formData.username.length < 3) {
      newErrors.username = t("username_too_short") || "At least 3 characters";
    } else if (!/^[a-zA-Z0-9_]+$/.test(formData.username)) {
      newErrors.username = t("username_invalid_chars") || "Letters, numbers, underscores only";
    }

    if (!formData.email.trim()) {
      newErrors.email = t("email_required") || "Email is required";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = t("invalid_email") || "Invalid email format";
    }

    if (!formData.phone.trim()) {
      newErrors.phone = t("phone_required") || "Phone number is required";
    } else {
      const phoneDigits = formData.phone.replace(/\D/g, "");
      if (phoneDigits.length !== 9 || !/^[6-9]/.test(phoneDigits)) {
        newErrors.phone =
          t("invalid_phone") || "9 digits starting with 6,7,8 or 9";
      }
    }

    if (!formData.password.trim()) {
      newErrors.password = t("password_required") || "Password is required";
    } else if (formData.password.length < 6) {
      newErrors.password = t("password_too_short") || "At least 6 characters";
    }

    if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = t("passwords_dont_match") || "Passwords do not match";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    let processed = value;

    if (name === "phone") {
      processed = value.replace(/\D/g, "").slice(0, 9);
    }

    setFormData((prev) => ({ ...prev, [name]: processed }));

    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) return;

    setLoading(true);
    setErrors({}); // clear previous errors

    try {
      const result = await register({
        username: formData.username.trim(),
        email: formData.email.trim(),
        phone: formData.phone ? `+237${formData.phone}` : "",
        password: formData.password.trim(),
        language: formData.language,
      });

      if (result?.success) {
        setToast({
          show: true,
          message: t("registration_success") || "Account created! Redirecting...",
          type: "success",
        });
        setTimeout(() => navigate("/"), 1800);
      } else {
        setErrors({ general: result?.msg || ("registration_failed") || "Registration failed" });
      }
    } catch (err) {
      console.error("Register error:", err);
      setErrors({
        general: t("something_went_wrong") || "Something went wrong. Try again.",
      });
    } finally {
      setLoading(false);
    }
  };

  const toggleLanguage = () => {
    const newLang = language === "en" ? "fr" : "en";
    setLanguage(newLang);
    setFormData((prev) => ({ ...prev, language: newLang }));
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-purple-950/30 to-slate-950 flex items-center justify-center p-4 relative overflow-hidden">
      {/* Background glows */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute -top-52 -right-52 w-[500px] h-[500px] bg-purple-700/15 rounded-full blur-3xl animate-pulse-slow"></div>
        <div className="absolute -bottom-52 -left-52 w-[500px] h-[500px] bg-violet-700/15 rounded-full blur-3xl animate-pulse-slow delay-1000"></div>
      </div>

      <div className="relative w-full max-w-md z-10">
        {/* Logo + Language Toggle */}
        <div className="flex flex-col items-center mb-10">
          <AnimatedLogo size="large" />
          <button
            onClick={toggleLanguage}
            className="mt-6 px-8 py-2.5 rounded-full bg-white/5 backdrop-blur-lg border border-white/10 text-white text-sm font-medium hover:bg-white/15 transition-all duration-300"
          >
            {language === "en" ? "Français" : "English"}
          </button>
        </div>

        {/* Main Form Card */}
        <div
          className={`bg-white/5 backdrop-blur-2xl rounded-3xl p-8 md:p-10 border border-white/10 shadow-2xl transition-all duration-500 ${
            shake ? "animate-shake" : ""
          }`}
        >
          <h2 className="text-3xl font-bold text-white text-center mb-10">
            {t("create_account") || "Create Account"}
          </h2>

          {/* Toast Notification */}
          {toast.show && (
            <div
              className={`fixed top-6 left-1/2 -translate-x-1/2 z-50 px-6 py-3 rounded-2xl shadow-xl text-white text-center animate-fade-in-out ${
                toast.type === "success" ? "bg-green-600/90" : "bg-red-600/90"
              }`}
            >
              {toast.message}
            </div>
          )}

          {/* General error */}
          {errors.general && (
            <div className="mb-8 p-4 bg-red-900/40 border border-red-500/50 rounded-2xl text-red-200 text-sm text-center">
              {errors.general}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Username */}
            <div>
              <input
                type="text"
                name="username"
                placeholder={t("username")}
                value={formData.username}
                onChange={handleChange}
                className={`w-full px-5 py-4 rounded-2xl bg-white/8 border ${
                  errors.username ? "border-red-500" : "border-white/15"
                } text-white placeholder-gray-400 focus:outline-none focus:border-purple-500 focus:ring-2 focus:ring-purple-500/30 transition-all duration-200`}
              />
              {errors.username && (
                <p className="text-red-400 text-xs mt-2 ml-1">{errors.username}</p>
              )}
            </div>

            {/* Email */}
            <div>
              <input
                type="email"
                name="email"
                placeholder={t("email")}
                value={formData.email}
                onChange={handleChange}
                className={`w-full px-5 py-4 rounded-2xl bg-white/8 border ${
                  errors.email ? "border-red-500" : "border-white/15"
                } text-white placeholder-gray-400 focus:outline-none focus:border-purple-500 focus:ring-2 focus:ring-purple-500/30 transition-all duration-200`}
              />
              {errors.email && (
                <p className="text-red-400 text-xs mt-2 ml-1">{errors.email}</p>
              )}
            </div>

            {/* Phone */}
            <div>
              <div className="relative">
                <span className="absolute left-5 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none select-none">
                  +237
                </span>
                <input
                  type="tel"
                  name="phone"
                  placeholder={t("phone_number")}
                  value={formData.phone}
                  onChange={handleChange}
                  inputMode="numeric"
                  className={`w-full pl-20 pr-5 py-4 rounded-2xl bg-white/8 border ${
                    errors.phone ? "border-red-500" : "border-white/15"
                  } text-white placeholder-gray-400 focus:outline-none focus:border-purple-500 focus:ring-2 focus:ring-purple-500/30 transition-all duration-200`}
                />
              </div>
              {errors.phone && (
                <p className="text-red-400 text-xs mt-2 ml-1">{errors.phone}</p>
              )}
              <p className="text-gray-500 text-xs mt-2 ml-1">
                {t("cameroon_phone_format") || "9 digits starting with 6–9"}
              </p>
            </div>

            {/* Password */}
            <div className="relative">
              <input
                type="password"
                name="password"
                placeholder={t("password")}
                value={formData.password}
                onChange={handleChange}
                className={`w-full px-5 py-4 rounded-2xl bg-white/8 border ${
                  errors.password ? "border-red-500" : "border-white/15"
                } text-white placeholder-gray-400 focus:outline-none focus:border-purple-500 focus:ring-2 focus:ring-purple-500/30 transition-all duration-200`}
              />
              {errors.password && (
                <p className="text-red-400 text-xs mt-2 ml-1">{errors.password}</p>
              )}
            </div>

            {/* Confirm Password */}
            <div>
              <input
                type="password"
                name="confirmPassword"
                placeholder={t("confirm_password")}
                value={formData.confirmPassword}
                onChange={handleChange}
                className={`w-full px-5 py-4 rounded-2xl bg-white/8 border ${
                  errors.confirmPassword ? "border-red-500" : "border-white/15"
                } text-white placeholder-gray-400 focus:outline-none focus:border-purple-500 focus:ring-2 focus:ring-purple-500/30 transition-all duration-200`}
              />
              {errors.confirmPassword && (
                <p className="text-red-400 text-xs mt-2 ml-1">{errors.confirmPassword}</p>
              )}
            </div>

            {/* Language Selection */}
            <div className="pt-3">
              <label className="block text-gray-300 text-sm mb-4 font-medium">
                {t("preferred_language") || "Preferred Language"}
              </label>
              <div className="grid grid-cols-2 gap-4">
                <label
                  className={`flex items-center justify-center gap-3 cursor-pointer px-6 py-4 rounded-2xl border transition-all duration-300 ${
                    formData.language === "en"
                      ? "bg-purple-700/30 border-purple-500 text-white shadow-md shadow-purple-900/30"
                      : "bg-white/5 border-white/15 text-gray-300 hover:bg-white/10"
                  }`}
                >
                  <input
                    type="radio"
                    name="language"
                    value="en"
                    checked={formData.language === "en"}
                    onChange={handleChange}
                    className="hidden"
                  />
                  English
                </label>

                <label
                  className={`flex items-center justify-center gap-3 cursor-pointer px-6 py-4 rounded-2xl border transition-all duration-300 ${
                    formData.language === "fr"
                      ? "bg-purple-700/30 border-purple-500 text-white shadow-md shadow-purple-900/30"
                      : "bg-white/5 border-white/15 text-gray-300 hover:bg-white/10"
                  }`}
                >
                  <input
                    type="radio"
                    name="language"
                    value="fr"
                    checked={formData.language === "fr"}
                    onChange={handleChange}
                    className="hidden"
                  />
                  Français
                </label>
              </div>
            </div>

            {/* Submit Button with Spinner */}
            <button
              type="submit"
              disabled={loading}
              className="relative w-full py-4 mt-6 rounded-2xl bg-gradient-to-r from-purple-600 to-violet-600 text-white font-semibold text-lg disabled:opacity-60 disabled:cursor-not-allowed hover:from-purple-500 hover:to-violet-500 transition-all duration-300 shadow-xl shadow-purple-900/40 flex items-center justify-center gap-3"
            >
              {loading ? (
                <>
                  <svg
                    className="animate-spin h-5 w-5 text-white"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    />
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8v8h8a8 8 0 01-16 0z"
                    />
                  </svg>
                  {t("creating_account") || "Creating account..."}
                </>
              ) : (
                t("register") || "Create Account"
              )}
            </button>
          </form>

          {/* Already have account link */}
          <div className="mt-10 text-center">
            <p className="text-gray-400 text-sm">
              {t("already_have_account") || "Already have an account?"}{" "}
              <Link
                to="/login"
                className="text-purple-400 hover:text-purple-300 font-semibold transition-colors"
              >
                {t("login") || "Sign in"}
              </Link>
            </p>
          </div>
        </div>
      </div>

      {/* Global shake animation keyframes */}
      <style jsx global>{`
        @keyframes shake {
          0% { transform: translateX(0); }
          25% { transform: translateX(-6px); }
          50% { transform: translateX(6px); }
          75% { transform: translateX(-6px); }
          100% { transform: translateX(0); }
        }
        .animate-shake {
          animation: shake 0.6s cubic-bezier(0.36, 0.07, 0.19, 0.97) both;
        }
        @keyframes fade-in-out {
          0% { opacity: 0; transform: translateY(-20px); }
          10% { opacity: 1; transform: translateY(0); }
          90% { opacity: 1; transform: translateY(0); }
          100% { opacity: 0; transform: translateY(-20px); }
        }
        .animate-fade-in-out {
          animation: fade-in-out 4s ease-in-out forwards;
        }
        .animate-pulse-slow {
          animation: pulse 8s cubic-bezier(0.4, 0, 0.6, 1) infinite;
        }
      `}</style>
    </div>
  );
}