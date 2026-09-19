const express = require("express");
const prisma = require("../lib/prisma");
const adminAuth = require("../middleware/adminAuth");
const asyncHandler = require("../lib/asyncHandler");

const router = express.Router();

router.get(
  "/",
  asyncHandler(async (req, res) => {
    const stories = await prisma.story.findMany({ orderBy: { order: "asc" } });
    res.json(stories);
  })
);

router.post(
  "/",
  adminAuth,
  asyncHandler(async (req, res) => {
    const { label, icon, gradient, title, text, order } = req.body;
    if (!label || !title || !text) {
      return res.status(400).json({ message: "Nomi, sarlavha va matn majburiy" });
    }

    const story = await prisma.story.create({
      data: {
        label,
        icon: icon || "Sparkles",
        gradient: gradient || "from-primary to-orange-400",
        title,
        text,
        order: order !== undefined ? Number(order) : 0,
      },
    });

    res.status(201).json(story);
  })
);

router.put(
  "/:id",
  adminAuth,
  asyncHandler(async (req, res) => {
    const { label, icon, gradient, title, text, order } = req.body;

    const story = await prisma.story.update({
      where: { id: Number(req.params.id) },
      data: {
        label,
        icon,
        gradient,
        title,
        text,
        order: order !== undefined ? Number(order) : undefined,
      },
    });

    res.json(story);
  })
);

router.delete(
  "/:id",
  adminAuth,
  asyncHandler(async (req, res) => {
    await prisma.story.delete({ where: { id: Number(req.params.id) } });
    res.json({ message: "O'chirildi" });
  })
);

module.exports = router;
