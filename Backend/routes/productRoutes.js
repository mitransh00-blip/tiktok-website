const express = require("express");
const router = express.Router();
const Product = require("../models/Product");

/**
 * GET /products
 */
router.get("/", async (req, res) => {
  try {
    const products = await Product.find().sort({ createdAt: -1 });
    res.json(products);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

/**
 * POST /products
 */
router.post("/", async (req, res) => {
  try {
    const product = await Product.create(req.body);
    res.status(201).json(product);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

/**
 * PATCH /products/:id/buy
 */
router.patch("/:id/buy", async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);

    if (!product) return res.status(404).json({ message: "Product not found" });
    if (product.quantityLeft <= 0)
      return res.status(400).json({ message: "Out of stock" });

    product.quantityLeft -= 1;
    await product.save();

    res.json({ message: "Purchase successful", product });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;