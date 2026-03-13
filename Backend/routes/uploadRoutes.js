const express = require("express");
const multer = require("multer");
const { uploadMedia } = require("../uploadController"); // ← FIXED: ../utils
const auth = require("../middleware/auth");

const router = express.Router();

// Configure multer for temporary storage
const storage = multer.diskStorage({
  filename: (req, file, cb) => {
    cb(null, Date.now() + "-" + file.originalname);
  },
});

const upload = multer({ storage });

// Upload route
router.post("/", upload.single("file"), uploadMedia);

module.exports = router;