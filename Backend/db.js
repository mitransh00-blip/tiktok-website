const mongoose = require("mongoose");

const connectDB = async () => {
  try {
    await mongoose.connect(
      "mongodb+srv://mitransh:Godisreal123@cluster0.xku3kgl.mongodb.net/tiktokDB"
    );
    console.log("MongoDB connected!");
  } catch (err) {
    console.error("MongoDB Error:", err.message);
    process.exit(1);
  }
};

module.exports = connectDB;