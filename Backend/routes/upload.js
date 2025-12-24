// upload.js (controller)
const cloudinary = require("../utils/cloudinary");
const Post = require("../models/Post");

const uploadMedia = async (req, res) => {
  try {
    const { userId, caption } = req.body;

    if (!req.file) {
      return res.status(400).json({ msg: "No file uploaded" });
    }

    const result = await cloudinary.uploader.upload(req.file.path, {
      resource_type: "auto",  // To handle both images and videos
    });

    // Save the post with the uploaded file's URL
    const newPost = new Post({
      user: userId,
      mediaUrl: result.secure_url,
      caption,
    });

    await newPost.save();

    // Return the response to the client
    res.json({
      msg: "Post uploaded successfully",
      post: newPost,
    });
  } catch (err) {
    console.error(err);
    res.status(500).send("Server error");
  }
};

module.exports = { uploadMedia };