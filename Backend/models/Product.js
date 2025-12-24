const mongoose = require("mongoose");

const productSchema = new mongoose.Schema(
  {
    title: String,
    caption: String,
    price: Number,
    mediaUrl: String,
    quantityLeft: { type: Number, default: 1 },
    sellerId: String,
    colors: [String],
    sizes: [String],
    location: String,
  },
  { timestamps: true }
);

module.exports = mongoose.model("Product", productSchema);