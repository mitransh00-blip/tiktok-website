const mongoose = require("mongoose");
require("dotenv").config();

const connectDB = async () => {
  try {
    await mongoose.connect(
      "mongodb+srv://mitransh:4sH3ivIIRmF2y1re@cluster0.xku3kgl.mongodb.net/mitransh?appName=Cluster0"
    );
    console.log("MongoDB connected!");
  } catch (err) {
    console.error("MongoDB Error:", err.message);
    process.exit(1);
  }
};

module.exports = mongoose;
module.exports.connectDB = connectDB;
