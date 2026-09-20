const express = require("express");
const path = require("path");
const { put } = require("@vercel/blob");
const upload = require("../middleware/upload");
const adminAuth = require("../middleware/adminAuth");

const router = express.Router();

router.post("/", adminAuth, upload.single("image"), async (req, res, next) => {
  if (!req.file) return res.status(400).json({ message: "Rasm yuklanmadi" });

  try {
    const unique = `${Date.now()}-${Math.round(Math.random() * 1e9)}`;
    const filename = `uploads/${unique}${path.extname(req.file.originalname)}`;

    const blob = await put(filename, req.file.buffer, {
      access: "public",
      contentType: req.file.mimetype,
    });

    res.json({ url: blob.url });
  } catch (err) {
    next(err);
  }
});

module.exports = router;
