const express = require("express");
const router = express.Router();
const User = require("../models/User");
const Product = require("../models/Product");
const Order = require("../models/Order");
const auth = require("../middleware/auth");

// Middleware to check if user is admin
const requireAdmin = async (req, res, next) => {
  try {
    const user = await User.findById(req.user.id);
    if (!user || !user.isAdmin) {
      return res.status(403).json({ msg: "Admin access required" });
    }
    next();
  } catch (err) {
    res.status(500).json({ msg: "Server error" });
  }
};

// GET all users (admin only)
router.get("/users", auth, requireAdmin, async (req, res) => {
  try {
    const users = await User.find().select("-password").sort({ createdAt: -1 });
    res.json(users);
  } catch (err) {
    res.status(500).json({ msg: err.message });
  }
});

// GET all products (admin only)
router.get("/products", auth, requireAdmin, async (req, res) => {
  try {
    const products = await Product.find()
      .populate("seller", "username profilePic")
      .sort({ createdAt: -1 });
    res.json(products);
  } catch (err) {
    res.status(500).json({ msg: err.message });
  }
});

// GET all orders (admin only)
router.get("/orders", auth, requireAdmin, async (req, res) => {
  try {
    const orders = await Order.find()
      .populate("buyer", "username profilePic email phone")
      .populate("vendor", "username profilePic email phone")
      .populate("product", "title price mediaUrl")
      .sort({ createdAt: -1 });
    res.json(orders);
  } catch (err) {
    res.status(500).json({ msg: err.message });
  }
});

// GET stats (admin only)
router.get("/stats", auth, requireAdmin, async (req, res) => {
  try {
    const usersCount = await User.countDocuments();
    const productsCount = await Product.countDocuments();
    const ordersCount = await Order.countDocuments();
    
    const confirmedOrders = await Order.find({ status: "confirmed" });
    const revenue = confirmedOrders.reduce((sum, order) => sum + (order.totalPrice * 0.03), 0);
    
    res.json({
      totalUsers: usersCount,
      totalProducts: productsCount,
      totalOrders: ordersCount,
      totalRevenue: revenue,
    });
  } catch (err) {
    res.status(500).json({ msg: err.message });
  }
});

// PUT ban user (admin only)
router.put("/users/:id/ban", auth, requireAdmin, async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) {
      return res.status(404).json({ msg: "User not found" });
    }
    
    if (user.isAdmin) {
      return res.status(400).json({ msg: "Cannot ban an admin" });
    }
    
    user.isBanned = true;
    await user.save();
    res.json({ msg: "User banned", user });
  } catch (err) {
    res.status(500).json({ msg: err.message });
  }
});

// PUT unban user (admin only)
router.put("/users/:id/unban", auth, requireAdmin, async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) {
      return res.status(404).json({ msg: "User not found" });
    }
    
    user.isBanned = false;
    await user.save();
    res.json({ msg: "User unbanned", user });
  } catch (err) {
    res.status(500).json({ msg: err.message });
  }
});

// DELETE product (admin only)
router.delete("/products/:id", auth, requireAdmin, async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) {
      return res.status(404).json({ msg: "Product not found" });
    }
    
    await Product.findByIdAndDelete(req.params.id);
    res.json({ msg: "Product deleted" });
  } catch (err) {
    res.status(500).json({ msg: err.message });
  }
});

// DELETE user (admin only)
router.delete("/users/:id", auth, requireAdmin, async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) {
      return res.status(404).json({ msg: "User not found" });
    }
    
    if (user.isAdmin) {
      return res.status(400).json({ msg: "Cannot delete an admin" });
    }
    
    // Delete all products by this user
    await Product.deleteMany({ seller: req.params.id });
    
    // Delete all orders related to this user
    await Order.deleteMany({ 
      $or: [{ buyer: req.params.id }, { vendor: req.params.id }]
    });
    
    await User.findByIdAndDelete(req.params.id);
    res.json({ msg: "User deleted" });
  } catch (err) {
    res.status(500).json({ msg: err.message });
  }
});

module.exports = router;

