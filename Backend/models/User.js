const mongoose = require("../db");

const userSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  phone: String,
  profilePic: String,
  language: { type: String, enum: ["en", "fr"], default: "en" },
  isVendor: { type: Boolean, default: false },
  isAdmin: { type: Boolean, default: false },
  isBanned: { type: Boolean, default: false },
  followers: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
  following: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
  totalLikes: { type: Number, default: 0 },
  totalTransactions: { type: Number, default: 0 },
  bio: String,
  location: String,
  mtnNumber: String,
  orangeNumber: String,
  viralScore: { type: Number, default: 0 }
}, { timestamps: true });

module.exports = mongoose.model("User", userSchema);
