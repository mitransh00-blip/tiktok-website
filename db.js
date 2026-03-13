const mongoose = require("mongoose");
require("dotenv").config();

mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
.then(() => console.log("✅ Connected to mitransh database"))
.catch(err => console.error("❌ MongoDB connection error:", err));

module.exports = mongoose;