const express = require("express");
const router = express.Router();
const Order = require("../models/Order");
const Product = require("../models/Product");
const User = require("../models/User");
const Notification = require("../models/Notification");
const auth = require("../middleware/auth");

// CREATE order request
router.post("/", auth, async (req, res) => {
  try {
    const { productId, quantity, size, color, totalPrice } = req.body;
    
    const product = await Product.findById(productId);
    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }
    
    if (product.quantityLeft < quantity) {
      return res.status(400).json({ message: "Insufficient quantity" });
    }
    
    // Create order
    const order = new Order({
      buyer: req.user.id,
      vendor: product.seller,
      product: productId,
      quantity,
      size,
      color,
      totalPrice,
      status: "pending",
    });
    
    await order.save();
    
    // Create notification for vendor
    const notification = new Notification({
      recipient: product.seller,
      sender: req.user.id,
      type: "order_request",
      product: productId,
      order: order._id,
      message: "You have a new order request!",
    });
    await notification.save();
    
    res.status(201).json(order);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// GET user's orders (as buyer)
router.get("/buyer", auth, async (req, res) => {
  try {
    const orders = await Order.find({ buyer: req.user.id })
      .populate("product")
      .populate("vendor", "username profilePic phone")
      .sort({ createdAt: -1 });
    res.json(orders);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// GET vendor's orders
router.get("/vendor", auth, async (req, res) => {
  try {
    const orders = await Order.find({ vendor: req.user.id })
      .populate("product")
      .populate("buyer", "username profilePic phone")
      .sort({ createdAt: -1 });
    res.json(orders);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// GET single order
router.get("/:id", auth, async (req, res) => {
  try {
    const order = await Order.findById(req.params.id)
      .populate("product")
      .populate("vendor", "username profilePic phone mtnNumber orangeNumber")
      .populate("buyer", "username profilePic phone");
    
    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }
    
    // Check authorization
    if (order.buyer._id.toString() !== req.user.id && 
        order.vendor._id.toString() !== req.user.id) {
      return res.status(403).json({ message: "Not authorized" });
    }
    
    res.json(order);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// VENDOR: Approve order
router.put("/:id/approve", auth, async (req, res) => {
  try {
    const order = await Order.findById(req.params.id);
    
    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }
    
    if (order.vendor.toString() !== req.user.id) {
      return res.status(403).json({ message: "Not authorized" });
    }
    
    if (order.status !== "pending") {
      return res.status(400).json({ message: "Order already processed" });
    }
    
    order.status = "approved";
    await order.save();
    
    // Notify buyer
    const notification = new Notification({
      recipient: order.buyer,
      sender: req.user.id,
      type: "order_approved",
      order: order._id,
      message: "Your order has been approved! Please make payment.",
    });
    await notification.save();
    
    res.json(order);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// BUYER: Confirm payment
router.put("/:id/pay", auth, async (req, res) => {
  try {
    const { paymentMethod } = req.body;
    const order = await Order.findById(req.params.id);
    
    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }
    
    if (order.buyer.toString() !== req.user.id) {
      return res.status(403).json({ message: "Not authorized" });
    }
    
    if (order.status !== "approved") {
      return res.status(400).json({ message: "Order must be approved first" });
    }
    
    order.paymentMethod = paymentMethod;
    order.status = "paid";
    order.paymentConfirmed = true;
    order.paidAt = new Date();
    
    // Set 7-day delivery deadline
    const deadline = new Date();
    deadline.setDate(deadline.getDate() + 7);
    order.deliveryDeadline = deadline;
    
    await order.save();
    
    // Update product quantity
    const product = await Product.findById(order.product);
    if (product) {
      product.quantityLeft -= order.quantity;
      await product.save();
    }
    
    // Notify vendor
    const notification = new Notification({
      recipient: order.vendor,
      sender: req.user.id,
      type: "order_paid",
      order: order._id,
      product: order.product,
      message: "Buyer has made payment! Please deliver the order.",
    });
    await notification.save();
    
    res.json(order);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// VENDOR: Mark as delivered
router.put("/:id/deliver", auth, async (req, res) => {
  try {
    const order = await Order.findById(req.params.id);
    
    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }
    
    if (order.vendor.toString() !== req.user.id) {
      return res.status(403).json({ message: "Not authorized" });
    }
    
    if (order.status !== "paid") {
      return res.status(400).json({ message: "Order must be paid first" });
    }
    
    order.status = "delivered";
    order.deliveredAt = new Date();
    await order.save();
    
    // Notify buyer
    const notification = new Notification({
      recipient: order.buyer,
      sender: req.user.id,
      type: "order_delivered",
      order: order._id,
      message: "Your order has been delivered! Please confirm receipt.",
    });
    await notification.save();
    
    res.json(order);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// BUYER: Confirm receipt (releases 97% to vendor)
router.put("/:id/confirm", auth, async (req, res) => {
  try {
    const order = await Order.findById(req.params.id);
    
    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }
    
    if (order.buyer.toString() !== req.user.id) {
      return res.status(403).json({ message: "Not authorized" });
    }
    
    if (order.status !== "delivered") {
      return res.status(400).json({ message: "Order must be delivered first" });
    }
    
    order.status = "confirmed";
    await order.save();
    
    // Update vendor's total transactions and viral score
    const vendor = await User.findById(order.vendor);
    if (vendor) {
      vendor.totalTransactions += 1;
      vendor.viralScore += order.totalPrice * 0.1; // Increase viral score
      await vendor.save();
    }
    
    // Update product's transaction count and viral score
    const product = await Product.findById(order.product);
    if (product) {
      product.transactionCount += 1;
      product.viralScore += order.totalPrice * 0.1;
      await product.save();
    }
    
    // Notify vendor
    const notification = new Notification({
      recipient: order.vendor,
      sender: req.user.id,
      type: "order_confirmed",
      order: order._id,
      message: "Buyer confirmed receipt! 97% of payment has been released to your account.",
    });
    await notification.save();
    
    res.json(order);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// CANCEL order
router.put("/:id/cancel", auth, async (req, res) => {
  try {
    const order = await Order.findById(req.params.id);
    
    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }
    
    // Buyer can cancel pending orders
    if (order.buyer.toString() === req.user.id) {
      if (order.status !== "pending") {
        return res.status(400).json({ message: "Can only cancel pending orders" });
      }
      order.status = "cancelled";
    } 
    // Vendor can cancel pending orders
    else if (order.vendor.toString() === req.user.id) {
      if (order.status !== "pending") {
        return res.status(400).json({ message: "Can only cancel pending orders" });
      }
      order.status = "cancelled";
    } else {
      return res.status(403).json({ message: "Not authorized" });
    }
    
    await order.save();
    res.json(order);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// CHECK: Auto-refund after 7 days (would typically be a scheduled job)
router.post("/check-expired", async (req, res) => {
  try {
    const now = new Date();
    const expiredOrders = await Order.find({
      status: "paid",
      deliveryDeadline: { $lt: now }
    });
    
    for (const order of expiredOrders) {
      order.status = "refunded";
      await order.save();
      
      // Notify both parties
      const notification = new Notification({
        recipient: order.buyer,
        sender: order.vendor,
        type: "order_refunded",
        order: order._id,
        message: "Order automatically refunded - vendor failed to deliver within 7 days.",
      });
      await notification.save();
    }
    
    res.json({ message: `Processed ${expiredOrders.length} expired orders` });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
