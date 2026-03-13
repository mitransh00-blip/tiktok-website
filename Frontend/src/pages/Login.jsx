import { useState } from "react";
import { useAuth } from "../context/AuthContext";
import { useLanguage } from "../context/LanguageContext";
import AnimatedLogo from "../components/AnimatedLogo";
import { useNavigate } from "react-router-dom";

export default function Login() {
  const [isLogin, setIsLogin] = useState(true);
  const [formData, setFormData] = useState({
    login: "",
    username: "",
    email: "",
    phone: "", // digits only
    password: "",
    confirmPassword: "",
    language: "en",
  });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const { login, register } = useAuth();
  const { language, setLanguage, t } = useLanguage();
  const navigate = useNavigate();

  const validateForm = () => {
    const newErrors = {};

    if (!isLogin) {
      // Registration validation
      if (!formData.username.trim()) {
        newErrors.username = t("username_required") || "Username is required";
      } else if (formData.username.length < 3) {
        newErrors.username = t("username_too_short") || "Username must be at least 3 characters";
      } else if (!/^[a-zA-Z0-9_]+$/.test(formData.username)) {
        newErrors.username =
          t("username_invalid_chars") ||
          "Username can only contain letters, numbers and underscores";
      }

      if (!formData.email.trim()) {
        newErrors.email = t("email_required") || "Email is required";
      } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
        newErrors.email = t("invalid_email") || "Please enter a valid email";
      }

      if (!formData.phone.trim()) {
        newErrors.phone = t("phone_required") || "Phone number is required";
      } else if (formData.phone.length !== 9) {
        newErrors.phone = t("invalid_phone") || "Phone must be 9 digits";
      }
    }

    if (!formData.password.trim()) {
      newErrors.password = t("password_required") || "Password is required";
    } else if (!isLogin && formData.password.length < 6) {
      newErrors.password =
        t("password_too_short") || "Password must be at least 6 characters";
    }

    if (!isLogin && formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = t("passwords_dont_match") || "Passwords do not match";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    let processedValue = value;

    // Clean phone input – only digits, max 9
    if (name === "phone") {
      processedValue = value.replace(/\D/g, "").slice(0, 9);
    }

    setFormData((prev) => ({ ...prev, [name]: processedValue }));

    // Clear error on type
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) return;

    setLoading(true);

    try {
      let result;

      if (isLogin) {
        result = await login({
          login: formData.login.trim(),
          password: formData.password.trim(),
        });
      } else {
        result = await register({
          username: formData.username.trim(),
          email: formData.email.trim(),
          phone: formData.phone ? `+237${formData.phone}` : "",
          password: formData.password.trim(),
          language: formData.language,
        });
      }

      if (result?.success) {
        navigate("/");
      } else {
        setErrors({ general: result?.msg || t("authentication_failed") || "Authentication failed" });
      }
    } catch (err) {
      console.error("Auth error:", err);
      setErrors({
        general: t("something_went_wrong") || "Something went wrong. Please try again.",
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

  const resetForm = () => {
    setFormData({
      login: "",
      username: "",
      email: "",
      phone: "",
      password: "",
      confirmPassword: "",
      language: formData.language, // keep language preference
    });
    setErrors({});
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900/40 to-slate-900 flex items-center justify-center p-4 relative overflow-hidden">
      {/* Background glow effects */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute -top-40 -right-40 w-96 h-96 bg-purple-600/20 rounded-full blur-3xl animate-pulse-slow"></div>
        <div className="absolute -bottom-40 -left-40 w-96 h-96 bg-violet-600/20 rounded-full blur-3xl animate-pulse-slow delay-1000"></div>
      </div>

      <div className="relative w-full max-w-md z-10">
        {/* Logo */}
        <div className="flex justify-center mb-10">
          <AnimatedLogo size="large" />
        </div>

        {/* Language Toggle */}
        <div className="flex justify-center mb-8">
          <button
            onClick={toggleLanguage}
            className="px-8 py-2.5 rounded-full bg-white/10 backdrop-blur-md text-white text-sm font-medium hover:bg-white/20 border border-white/10 transition-all duration-300"
          >
            {language === "en" ? "Français" : "English"}
          </button>
        </div>

        {/* Main Card */}
        <div className="bg-white/5 backdrop-blur-2xl rounded-3xl p-8 md:p-10 border border-white/10 shadow-2xl">
          <h2 className="text-2xl md:text-3xl font-bold text-white text-center mb-10">
            {isLogin ? t("welcome_back") : t("create_account")}
          </h2>

          {/* General error */}
          {errors.general && (
            <div className="mb-8 p-4 bg-red-900/30 border border-red-500/40 rounded-2xl text-red-200 text-sm text-center">
              {errors.general}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Login field – shown only during login */}
            {isLogin && (
              <input
                type="text"
                name="login"
                placeholder={t("username_or_phone_or_email") || "Username, phone or email"}
                value={formData.login}
                onChange={handleChange}
                className="w-full px-5 py-4 rounded-2xl bg-white/10 border border-white/15 text-white placeholder-gray-400 focus:outline-none focus:border-purple-500 focus:ring-2 focus:ring-purple-500/30 transition-all duration-200"
              />
            )}

            {/* Username – registration only */}
            {!isLogin && (
              <div>
                <input
                  type="text"
                  name="username"
                  placeholder={t("username")}
                  value={formData.username}
                  onChange={handleChange}
                  className={`w-full px-5 py-4 rounded-2xl bg-white/10 border ${
                    errors.username ? "border-red-500" : "border-white/15"
                  } text-white placeholder-gray-400 focus:outline-none focus:border-purple-500 focus:ring-2 focus:ring-purple-500/30 transition-all duration-200`}
                />
                {errors.username && (
                  <p className="text-red-400 text-xs mt-2 ml-1">{errors.username}</p>
                )}
              </div>
            )}

            {/* Email – registration only */}
            {!isLogin && (
              <div>
                <input
                  type="email"
                  name="email"
                  placeholder={t("email")}
                  value={formData.email}
                  onChange={handleChange}
                  className={`w-full px-5 py-4 rounded-2xl bg-white/10 border ${
                    errors.email ? "border-red-500" : "border-white/15"
                  } text-white placeholder-gray-400 focus:outline-none focus:border-purple-500 focus:ring-2 focus:ring-purple-500/30 transition-all duration-200`}
                />
                {errors.email && (
                  <p className="text-red-400 text-xs mt-2 ml-1">{errors.email}</p>
                )}
              </div>
            )}

            {/* Phone – registration only */}
            {!isLogin && (
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
                    className={`w-full pl-20 pr-5 py-4 rounded-2xl bg-white/10 border ${
                      errors.phone ? "border-red-500" : "border-white/15"
                    } text-white placeholder-gray-400 focus:outline-none focus:border-purple-500 focus:ring-2 focus:ring-purple-500/30 transition-all duration-200`}
                  />
                </div>
                {errors.phone && (
                  <p className="text-red-400 text-xs mt-2 ml-1">{errors.phone}</p>
                )}
                <p className="text-gray-500 text-xs mt-2 ml-1">
                  {t("cameroon_phone_format") || "9 digits (6–9 at start)"}
                </p>
              </div>
            )}

            {/* Password */}
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                name="password"
                placeholder={t("password")}
                value={formData.password}
                onChange={handleChange}
                className={`w-full px-5 py-4 rounded-2xl bg-white/10 border ${
                  errors.password ? "border-red-500" : "border-white/15"
                } text-white placeholder-gray-400 focus:outline-none focus:border-purple-500 focus:ring-2 focus:ring-purple-500/30 pr-14 transition-all duration-200`}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white transition-colors p-1"
              >
                {showPassword ? (
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21"
                    />
                  </svg>
                ) : (
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M15 12a3 3 0 11-6 0 3 3 0 016 0zM2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                    />
                  </svg>
                )}
              </button>
              {errors.password && (
                <p className="text-red-400 text-xs mt-2 ml-1">{errors.password}</p>
              )}
            </div>

            {/* Confirm Password – registration only */}
            {!isLogin && (
              <div>
                <input
                  type="password"
                  name="confirmPassword"
                  placeholder={t("confirm_password")}
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  className={`w-full px-5 py-4 rounded-2xl bg-white/10 border ${
                    errors.confirmPassword ? "border-red-500" : "border-white/15"
                  } text-white placeholder-gray-400 focus:outline-none focus:border-purple-500 focus:ring-2 focus:ring-purple-500/30 transition-all duration-200`}
                />
                {errors.confirmPassword && (
                  <p className="text-red-400 text-xs mt-2 ml-1">{errors.confirmPassword}</p>
                )}
              </div>
            )}

            {/* Language selection – registration only */}
            {!isLogin && (
              <div className="pt-3">
                <label className="block text-gray-300 text-sm mb-4 font-medium">
                  {t("preferred_language") || "Preferred Language"}
                </label>
                <div className="grid grid-cols-2 gap-4">
                  <label
                    className={`flex items-center justify-center gap-3 cursor-pointer px-6 py-4 rounded-2xl border transition-all duration-300 ${
                      formData.language === "en"
                        ? "bg-purple-600/30 border-purple-500 text-white shadow-md"
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
                        ? "bg-purple-600/30 border-purple-500 text-white shadow-md"
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
            )}

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full py-4 mt-4 rounded-2xl bg-gradient-to-r from-purple-600 to-violet-600 text-white font-semibold text-lg disabled:opacity-60 disabled:cursor-not-allowed hover:from-purple-500 hover:to-violet-500 transition-all duration-300 shadow-lg shadow-purple-900/40"
            >
              {loading
                ? t("please_wait") || "Please wait..."
                : isLogin
                ? t("login")
                : t("register")}
            </button>
          </form>

          {/* Switch between login/register */}
          <div className="mt-10 text-center">
            <button
              onClick={() => {
                setIsLogin(!isLogin);
                resetForm();
              }}
              className="text-gray-300 hover:text-white transition-colors text-base"
            >
              {isLogin
                ? t("no_account") || "Don't have an account? "
                : t("already_have_account") || "Already have an account? "}
              <span className="text-purple-400 font-semibold underline underline-offset-4">
                {isLogin ? t("register") : t("login")}
              </span>
            </button>
          </div>

          {/* Guest continue – only on login */}
          {isLogin && (
            <div className="mt-6 text-center">
              <button
                onClick={() => navigate("/")}
                className="text-gray-400 hover:text-gray-200 text-sm transition-colors"
              >
                {t("continue_as_guest") || "Continue as guest →"}
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}