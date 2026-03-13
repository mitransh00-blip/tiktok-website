const express = require("express");
const router = express.Router();
const Product = require("../models/Product");
const User = require("../models/User");
const auth = require("../middleware/auth");

// GET all products - with type support for Market, Preference, Explore
router.get("/", async (req, res) => {
  try {
    const { type, userId } = req.query; // 'market', 'preference', 'explore'
    let products;
    
    if (type === "preference" && userId) {
      // Show products from followed vendors only
      const user = await User.findById(userId);
      if (user && user.following.length > 0) {
        products = await Product.find({ 
          seller: { $in: user.following },
          isActive: true 
        })
        .populate("seller", "username profilePic")
        .sort({ viralScore: -1, createdAt: -1 });
      } else {
        products = [];
      }
    } else if (type === "explore") {
      // Show all products - multiple at once (grid view)
      products = await Product.find({ isActive: true })
        .populate("seller", "username profilePic")
        .sort({ createdAt: -1 })
        .limit(50);
    } else if (type === "market" || !type) {
      // Market - viral algorithm based on transactions
      // More transactions = higher in feed = more viral
      products = await Product.find({ isActive: true })
        .populate("seller", "username profilePic")
        .sort({ viralScore: -1, transactionCount: -1, createdAt: -1 })
        .limit(100);
    } else {
      // Default: all active products
      products = await Product.find({ isActive: true })
        .populate("seller", "username profilePic")
        .sort({ createdAt: -1 });
    }
    
    res.json(products);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// SEARCH products - search by title, description, seller username
router.get("/search", async (req, res) => {
  try {
    const { q, limit = 20 } = req.query;
    
    if (!q || q.trim().length === 0) {
      return res.json([]);
    }
    
    const searchQuery = q.trim();
    
    // Search in title, description, and seller's username
    const products = await Product.find({ 
      isActive: true,
      $or: [
        { title: { $regex: searchQuery, $options: 'i' } },
        { description: { $regex: searchQuery, $options: 'i' } }
      ]
    })
    .populate("seller", "username profilePic")
    .sort({ viralScore: -1, transactionCount: -1 })
    .limit(parseInt(limit));
    
    // Also search by seller username
    const sellers = await User.find({
      username: { $regex: searchQuery, $options: 'i' }
    }).select("_id");
    
    const sellerIds = sellers.map(s => s._id);
    
    const sellerProducts = await Product.find({
      seller: { $in: sellerIds },
      isActive: true
    })
    .populate("seller", "username profilePic")
    .sort({ viralScore: -1 });
    
    // Combine and remove duplicates
    const combinedProducts = [...products];
    sellerProducts.forEach(sp => {
      if (!combinedProducts.find(p => p._id.toString() === sp._id.toString())) {
        combinedProducts.push(sp);
      }
    });
    
    res.json(combinedProducts.slice(0, parseInt(limit)));
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// GET single product
router.get("/:id", async (req, res) => {
  try {
    const product = await Product.findById(req.params.id)
      .populate("seller", "username profilePic bio location");
    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }
    // Increment views
    product.views += 1;
    await product.save();
    res.json(product);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// POST create product (vendor only)
router.post("/", auth, async (req, res) => {
  try {
    console.log("📝 Creating product for user:", req.user.id);
    
    const { title, description, price, mediaUrl, mediaType, quantity, colors, sizes, location } = req.body;
    
    // Validate required fields
    if (!title || !price || !mediaUrl) {
      return res.status(400).json({ message: "Title, price, and media are required" });
    }
    
    // Check if user is a vendor
    const user = await User.findById(req.user.id);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    
    if (!user.isVendor) {
      return res.status(403).json({ message: "You must be a vendor to upload products" });
    }
    
    const product = new Product({
      title,
      description,
      price,
      mediaUrl,
      mediaType: mediaType || "image",
      quantity: quantity || 1,
      quantityLeft: quantity || 1,
      colors: colors || [],
      sizes: sizes || [],
      location,
      seller: req.user.id,
    });
    
    await product.save();
    console.log("✅ Product created:", product._id);
    res.status(201).json(product);
  } catch (err) {
    console.error("❌ Product creation error:", err);
    res.status(400).json({ message: err.message });
  }
});

// PUT update product
router.put("/:id", auth, async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    
    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }
    
    if (product.seller.toString() !== req.user.id) {
      return res.status(403).json({ message: "Not authorized" });
    }
    
    const { title, description, price, quantity, colors, sizes, location, isActive } = req.body;
    
    if (title) product.title = title;
    if (description !== undefined) product.description = description;
    if (price) product.price = price;
    if (quantity) {
      product.quantity = quantity;
      product.quantityLeft = quantity;
    }
    if (colors) product.colors = colors;
    if (sizes) product.sizes = sizes;
    if (location !== undefined) product.location = location;
    if (isActive !== undefined) product.isActive = isActive;
    
    await product.save();
    res.json(product);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// DELETE product
router.delete("/:id", auth, async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    
    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }
    
    if (product.seller.toString() !== req.user.id) {
      return res.status(403).json({ message: "Not authorized" });
    }
    
    await product.deleteOne();
    res.json({ message: "Product deleted" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// POST like product
router.post("/:id/like", auth, async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    
    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }
    
    const likeIndex = product.likes.indexOf(req.user.id);
    
    if (likeIndex > -1) {
      // Unlike
      product.likes.splice(likeIndex, 1);
    } else {
      // Like
      product.likes.push(req.user.id);
    }
    
    await product.save();
    res.json({ likes: product.likes.length, liked: likeIndex === -1 });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// POST favorite product (add to cart)
router.post("/:id/favorite", auth, async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    
    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }
    
    const favIndex = product.favorites.indexOf(req.user.id);
    
    if (favIndex > -1) {
      // Remove from favorites
      product.favorites.splice(favIndex, 1);
    } else {
      // Add to favorites
      product.favorites.push(req.user.id);
    }
    
    await product.save();
    res.json({ favorites: product.favorites.length, favorited: favIndex === -1 });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// POST comment on product
router.post("/:id/comment", auth, async (req, res) => {
  try {
    const { text } = req.body;
    
    const product = await Product.findById(req.params.id);
    
    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }
    
    const comment = {
      user: req.user.id,
      text,
      createdAt: new Date(),
    };
    
    product.comments.push(comment);
    await product.save();
    
    res.json(product.comments);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// GET vendor's products
router.get("/vendor/:id", async (req, res) => {
  try {
    const products = await Product.find({ seller: req.params.id, isActive: true })
      .sort({ createdAt: -1 });
    res.json(products);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// GET user's liked products
router.get("/user/liked", auth, async (req, res) => {
  try {
    const products = await Product.find({ likes: req.user.id, isActive: true })
      .populate("seller", "username profilePic")
      .sort({ createdAt: -1 });
    res.json(products);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// GET user's favorited products (cart)
router.get("/user/favorites", auth, async (req, res) => {
  try {
    const products = await Product.find({ favorites: req.user.id, isActive: true })
      .populate("seller", "username profilePic")
      .sort({ createdAt: -1 });
    res.json(products);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// GET current user's products (my products)
router.get("/my-products", auth, async (req, res) => {
  try {
    const products = await Product.find({ seller: req.user.id })
      .populate("seller", "username profilePic")
      .sort({ createdAt: -1 });
    res.json(products);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
