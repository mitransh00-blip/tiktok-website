const cloudinary = require("./utils/cloudinary"); // ← Make sure this path is correct
const Post = require("./models/Post"); // ← Path to Post model
const fs = require("fs"); // Add this for file handling

const uploadMedia = async (req, res) => {
  try {
    const { userId, caption } = req.body;

    if (!req.file) {
      return res.status(400).json({ msg: "No file uploaded" });
    }

    console.log("📤 Uploading to Cloudinary:", req.file.path);

    const result = await cloudinary.uploader.upload(req.file.path, {
      resource_type: "auto",
      folder: "mitransh/products", // Optional: organize in folders
    });

    console.log("✅ Cloudinary upload successful:", result.secure_url);

    // Delete the temporary file
    fs.unlinkSync(req.file.path);
    console.log("🗑️ Temporary file deleted");

    // Save the post with the uploaded file's URL
    const newPost = new Post({
      user: userId,
      mediaUrl: result.secure_url,
      caption,
    });

    await newPost.save();
    console.log("✅ Post saved to database");

    res.json({
      success: true,
      msg: "Post uploaded successfully",
      post: newPost,
      url: result.secure_url,
    });
  } catch (err) {
    console.error("❌ Upload error:", err);
    
    // Clean up temp file if it exists
    if (req.file && req.file.path) {
      try {
        fs.unlinkSync(req.file.path);
      } catch (e) {
        console.error("Error deleting temp file:", e);
      }
    }
    
    res.status(500).json({ 
      success: false,
      msg: "Server error: " + err.message 
    });
  }
};

module.exports = { uploadMedia };