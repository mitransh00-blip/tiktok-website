const mongoose = require("../db");

const productSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: String,
  price: { type: Number, required: true },
  mediaUrl: String,
  mediaType: { type: String, enum: ["image", "video"], default: "image" },
  quantity: { type: Number, default: 0 },
  quantityLeft: { type: Number, default: 0 },
  isActive: { type: Boolean, default: true },
  seller: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  colors: [String],
  sizes: [String],
  likes: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
  comments: [{ user: { type: mongoose.Schema.Types.ObjectId, ref: "User" }, text: String }],
  favorites: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
  views: { type: Number, default: 0 },
  viralScore: { type: Number, default: 0 },
  transactionCount: { type: Number, default: 0 }
}, { timestamps: true });

module.exports = mongoose.model("Product", productSchema);
