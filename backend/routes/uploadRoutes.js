const express = require("express");
const upload = require("../middleware/uploadMiddleware");
const { protect, adminOnly } = require("../middleware/authMiddleware");

const router = express.Router();

router.post("/", protect, adminOnly, upload.single("image"), (req, res) => {
  if (!req.file) return res.status(400).json({ message: "No file uploaded" });
  res.status(201).json({ imageUrl: `/uploads/${req.file.filename}` });
});

module.exports = router;
