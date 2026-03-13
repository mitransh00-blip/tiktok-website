const mongoose = require("../db");

const orderSchema = new mongoose.Schema({
  buyer: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  vendor: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  product: { type: mongoose.Schema.Types.ObjectId, ref: "Product", required: true },
  quantity: { type: Number, required: true },
  size: String,
  color: String,
  totalPrice: Number,
  status: { type: String, enum: ["pending","approved","paid","delivered","cancelled","refunded"], default: "pending" },
  paymentMethod: { type: String, enum: ["mtn","orange"] },
  deliveryDeadline: Date,
  vendorPaid: { type: Boolean, default: false }
}, { timestamps: true });

module.exports = mongoose.model("Order", orderSchema);