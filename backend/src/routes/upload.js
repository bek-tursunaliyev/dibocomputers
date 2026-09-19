const express = require("express");
const upload = require("../middleware/upload");
const adminAuth = require("../middleware/adminAuth");

const router = express.Router();

router.post("/", adminAuth, upload.single("image"), (req, res) => {
  if (!req.file) return res.status(400).json({ message: "Rasm yuklanmadi" });
  res.json({ url: `/uploads/${req.file.filename}` });
});

module.exports = router;
