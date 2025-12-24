const cloudinary = require("./utils/cloudinary");

cloudinary.api.resources((err, res) => {
  if (err) {
    console.error("Cloudinary Error:", err);
  } else {
    console.log("Cloudinary Connected!", res);
  }
});