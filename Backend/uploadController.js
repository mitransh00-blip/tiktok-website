const cloudinary = require("./utils/cloudinary");
const fs = require("fs");

exports.uploadMedia = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ msg: "No file uploaded" });
    }

    const result = await cloudinary.uploader.upload(req.file.path, {
      resource_type: "auto",
    });

    fs.unlinkSync(req.file.path);

    res.json({
      msg: "Upload successful",
      url: result.secure_url,
      public_id: result.public_id,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ msg: "Upload failed" });
  }
};