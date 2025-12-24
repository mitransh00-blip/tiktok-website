const express = require("express");
const multer = require("multer");
const { uploadMedia } = require("../uploadController");

const router = express.Router();

// Multer storage
const storage = multer.diskStorage({});
const upload = multer({ storage });

router.post("/", upload.single("file"), uploadMedia);

module.exports = router;