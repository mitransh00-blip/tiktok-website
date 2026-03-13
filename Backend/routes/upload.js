const express = require("express");
const multer = require("multer");
const { uploadMedia } = require("./utils/uploadController"); // ← FIXED PATH
const auth = require("../middleware/auth"); // Add auth if you want protection

const router = express.Router();

// Configure multer for temporary storage
const storage = multer.diskStorage({
  filename: (req, file, cb) => {
    cb(null, Date.now() + "-" + file.originalname);
  },
});

const upload = multer({ storage });

// Upload route - you can add auth middleware if needed
router.post("/", upload.single("file"), uploadMedia);

module.exports = router;