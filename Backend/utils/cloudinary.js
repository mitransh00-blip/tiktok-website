const PORT = process.env.PORT;
const MONGO_URI = process.env.MONGO_URI;

const cloudinary = require("cloudinary").v2;

cloudinary.config({
  cloud_name: "dzuzbvgrq",
  api_key: "993756825147595",
  api_secret: "GeOCX4eKycnhHRf4Bif9w7_R80I",
  secure: true,
});

module.exports = cloudinary;