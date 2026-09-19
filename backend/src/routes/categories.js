const express = require("express");
const prisma = require("../lib/prisma");
const adminAuth = require("../middleware/adminAuth");

const router = express.Router();

router.get("/", async (req, res) => {
  const categories = await prisma.category.findMany({ orderBy: { id: "asc" } });
  res.json(categories);
});

router.post("/", adminAuth, async (req, res) => {
  const { name, emoji } = req.body;
  if (!name) return res.status(400).json({ message: "Nomi majburiy" });
  const category = await prisma.category.create({ data: { name, emoji: emoji || "📦" } });
  res.status(201).json(category);
});

router.delete("/:id", adminAuth, async (req, res) => {
  await prisma.category.delete({ where: { id: Number(req.params.id) } });
  res.json({ message: "O'chirildi" });
});

module.exports = router;
