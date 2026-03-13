import { useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useLanguage } from "../context/LanguageContext";
import api from "../services/api";

export default function Upload() {
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    price: "",
    quantity: 1,
    colors: "",
    sizes: "",
    location: "",
  });
  const [media, setMedia] = useState(null);
  const [mediaPreview, setMediaPreview] = useState(null);
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState("");
  const [dragActive, setDragActive] = useState(false);
  const fileInputRef = useRef(null);
  
  const { user, token } = useAuth();
  const { t } = useLanguage();
  const navigate = useNavigate();

  if (!token) {
    navigate("/login");
    return null;
  }

  // Check if user is vendor
  if (user && !user.isVendor) {
    return (
      <div className="min-h-screen bg-slate-950 pt-20 px-4">
        <div className="max-w-lg mx-auto bg-white/5 rounded-2xl p-8 border border-white/10 text-center">
          <h2 className="text-2xl font-bold text-white mb-4">Vendor Access Required</h2>
          <p className="text-gray-400 mb-6">You need to be a vendor to upload products.</p>
          <button
            onClick={() => navigate("/profile")}
            className="px-6 py-3 rounded-xl bg-purple-600 text-white hover:bg-purple-500"
          >
            Go to Profile
          </button>
        </div>
      </div>
    );
  }

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
    setError("");
  };

  const handleFileChange = (file) => {
    if (file) {
      // Validate file type
      if (!file.type.startsWith("image/") && !file.type.startsWith("video/")) {
        setError("Please select an image or video file");
        return;
      }
      
      // Validate file size (max 50MB)
      if (file.size > 50 * 1024 * 1024) {
        setError("File size must be less than 50MB");
        return;
      }
      
      setMedia(file);
      
      // Create preview
      const reader = new FileReader();
      reader.onload = (e) => {
        setMediaPreview(e.target.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setDragActive(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFileChange(e.dataTransfer.files[0]);
    }
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    setDragActive(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    setDragActive(false);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    
    // Validate
    if (!formData.title.trim()) {
      setError("Title is required");
      return;
    }
    if (!formData.price || formData.price <= 0) {
      setError("Price must be greater than 0");
      return;
    }
    if (!media) {
      setError("Please select an image or video");
      return;
    }

    setLoading(true);

    try {
      let mediaUrl = "";
      
      // Step 1: Upload to Cloudinary via YOUR BACKEND (not directly)
      if (media) {
        setUploading(true);
        
        const formDataMedia = new FormData();
        formDataMedia.append("file", media);
        
        console.log("📤 Uploading to backend upload endpoint...");
        
        // Use your backend upload endpoint
        const uploadRes = await api.post("/upload", formDataMedia, {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        });
        
        console.log("✅ Upload response:", uploadRes.data);
        
        if (!uploadRes.data.success) {
          throw new Error(uploadRes.data.msg || "Upload failed");
        }
        
        mediaUrl = uploadRes.data.url;
        setUploading(false);
      }

      // Step 2: Save product
      console.log("📝 Creating product...");
      const productData = {
        title: formData.title.trim(),
        description: formData.description.trim(),
        price: Number(formData.price),
        quantity: Number(formData.quantity) || 1,
        colors: formData.colors ? formData.colors.split(",").map(c => c.trim()).filter(c => c) : [],
        sizes: formData.sizes ? formData.sizes.split(",").map(s => s.trim()).filter(s => s) : [],
        location: formData.location.trim(),
        mediaUrl,
        mediaType: media.type.startsWith("video/") ? "video" : "image",
      };
      
      console.log("Product data:", productData);
      
      const productRes = await api.post("/products", productData);
      console.log("✅ Product created:", productRes.data);

      alert("Product uploaded successfully!");
      navigate("/profile");
    } catch (err) {
      console.error("❌ Upload error:", err);
      setError(err.response?.data?.message || err.message || "Upload failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 pt-20 pb-10 px-4">
      <div className="max-w-lg mx-auto">
        <h1 className="text-2xl font-bold text-white mb-6 text-center">
          Upload Product
        </h1>

        {error && (
          <div className="mb-4 p-3 bg-red-500/20 border border-red-500/50 rounded-xl text-red-200 text-sm text-center">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Media Upload */}
          <div>
            <label className="block text-gray-300 text-sm mb-2">
              Media (Image or Video) *
            </label>
            <div
              className={`border-2 border-dashed rounded-2xl p-6 text-center transition-all cursor-pointer ${
                dragActive
                  ? "border-purple-500 bg-purple-500/10"
                  : "border-white/20 hover:border-white/40"
              } ${mediaPreview ? "border-purple-500" : ""}`}
              onDrop={handleDrop}
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onClick={() => fileInputRef.current?.click()}
            >
              {mediaPreview ? (
                <div className="relative">
                  {media?.type?.startsWith("video/") ? (
                    <video
                      src={mediaPreview}
                      className="max-h-64 mx-auto rounded-xl"
                      controls
                    />
                  ) : (
                    <img
                      src={mediaPreview}
                      alt="Preview"
                      className="max-h-64 mx-auto rounded-xl object-contain"
                    />
                  )}
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      setMedia(null);
                      setMediaPreview(null);
                    }}
                    className="absolute top-2 right-2 w-8 h-8 bg-red-500 rounded-full flex items-center justify-center text-white hover:bg-red-600 transition-colors"
                  >
                    ✕
                  </button>
                </div>
              ) : (
                <div className="py-8">
                  <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-purple-500/20 flex items-center justify-center">
                    <svg
                      className="w-8 h-8 text-purple-400"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                      />
                    </svg>
                  </div>
                  <p className="text-gray-400 mb-2">
                    Click or drag to upload
                  </p>
                  <p className="text-gray-500 text-xs">
                    Images or videos up to 50MB
                  </p>
                </div>
              )}
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*,video/*"
                onChange={(e) => handleFileChange(e.target.files[0])}
                className="hidden"
              />
            </div>
          </div>

          {/* Title */}
          <div>
            <label className="block text-gray-300 text-sm mb-2">Title *</label>
            <input
              type="text"
              name="title"
              value={formData.title}
              onChange={handleChange}
              required
              placeholder="Enter product title"
              className="w-full px-4 py-3 rounded-xl bg-white/10 border border-white/20 text-white placeholder-gray-500 focus:outline-none focus:border-purple-500 transition-colors"
            />
          </div>

          {/* Description */}
          <div>
            <label className="block text-gray-300 text-sm mb-2">Description</label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              rows={3}
              placeholder="Describe your product..."
              className="w-full px-4 py-3 rounded-xl bg-white/10 border border-white/20 text-white placeholder-gray-500 focus:outline-none focus:border-purple-500 transition-colors resize-none"
            />
          </div>

          {/* Price and Quantity */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-gray-300 text-sm mb-2">Price (XAF) *</label>
              <input
                type="number"
                name="price"
                value={formData.price}
                onChange={handleChange}
                required
                min="1"
                placeholder="0"
                className="w-full px-4 py-3 rounded-xl bg-white/10 border border-white/20 text-white placeholder-gray-500 focus:outline-none focus:border-purple-500 transition-colors"
              />
            </div>

            <div>
              <label className="block text-gray-300 text-sm mb-2">Quantity</label>
              <input
                type="number"
                name="quantity"
                value={formData.quantity}
                onChange={handleChange}
                min="1"
                className="w-full px-4 py-3 rounded-xl bg-white/10 border border-white/20 text-white focus:outline-none focus:border-purple-500 transition-colors"
              />
            </div>
          </div>

          {/* Colors and Sizes */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-gray-300 text-sm mb-2">Available Colors</label>
              <input
                type="text"
                name="colors"
                value={formData.colors}
                onChange={handleChange}
                placeholder="Red, Blue, Green"
                className="w-full px-4 py-3 rounded-xl bg-white/10 border border-white/20 text-white placeholder-gray-500 focus:outline-none focus:border-purple-500 transition-colors"
              />
            </div>

            <div>
              <label className="block text-gray-300 text-sm mb-2">Available Sizes</label>
              <input
                type="text"
                name="sizes"
                value={formData.sizes}
                onChange={handleChange}
                placeholder="S, M, L, XL"
                className="w-full px-4 py-3 rounded-xl bg-white/10 border border-white/20 text-white placeholder-gray-500 focus:outline-none focus:border-purple-500 transition-colors"
              />
            </div>
          </div>

          {/* Location */}
          <div>
            <label className="block text-gray-300 text-sm mb-2">Location</label>
            <input
              type="text"
              name="location"
              value={formData.location}
              onChange={handleChange}
              placeholder="e.g., Douala, Cameroon"
              className="w-full px-4 py-3 rounded-xl bg-white/10 border border-white/20 text-white placeholder-gray-500 focus:outline-none focus:border-purple-500 transition-colors"
            />
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={loading || uploading}
            className="w-full py-4 rounded-xl bg-gradient-to-r from-purple-600 to-violet-600 text-white font-semibold disabled:opacity-50 hover:from-purple-500 hover:to-violet-500 transition-all flex items-center justify-center gap-2"
          >
            {loading || uploading ? (
              <>
                <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                </svg>
                {uploading ? "Uploading media..." : "Creating product..."}
              </>
            ) : (
              "Upload Product"
            )}
          </button>
        </form>
      </div>
    </div>
  );
}