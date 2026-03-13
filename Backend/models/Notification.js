const mongoose = require("../db");

const notificationSchema = new mongoose.Schema({
  recipient: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  sender: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  type: String,
  product: { type: mongoose.Schema.Types.ObjectId, ref: "Product" },
  order: { type: mongoose.Schema.Types.ObjectId, ref: "Order" },
  message: String,
  isRead: { type: Boolean, default: false }
}, { timestamps: true });

module.exports = mongoose.model("Notification", notificationSchema);