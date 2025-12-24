const express = require("express");
const multer = require("multer");
const { uploadMedia } = require("../uploadController");

const router = express.Router();

// Multer disk storage
const storage = multer.diskStorage({
  filename: (req, file, cb) => {
    cb(null, Date.now() + "-" + file.originalname);
  },
});

const upload = multer({ storage });

// Upload route
router.post("/", upload.single("file"), uploadMedia);

module.exports = router;