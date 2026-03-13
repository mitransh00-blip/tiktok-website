const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
require("dotenv").config();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Database connection
mongoose.connect(process.env.MONGO_URI || "mongodb://localhost:27017/mitransh")
  .then(() => console.log("✅ MongoDB Connected"))
  .catch(err => console.error("❌ MongoDB Error:", err));

// Routes
app.use("/api/auth", require("./Backend/auth/authRoutes"));
app.use("/api/products", require("./Backend/routes/productRoutes"));
app.use("/api/orders", require("./Backend/routes/orderRoutes"));
app.use("/api/notifications", require("./Backend/routes/notificationRoutes"));

// Health check
app.get("/", (req, res) => {
  res.json({ message: "MITRANSH API Running", status: "OK" });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 MITRANSH Server running on port ${PORT}`);
});
