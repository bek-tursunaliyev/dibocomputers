const express = require("express");
const prisma = require("../lib/prisma");
const adminAuth = require("../middleware/adminAuth");

const router = express.Router();

router.get("/", async (req, res) => {
  const { categoryId, addonsOnly } = req.query;
  const where = {};
  if (categoryId) where.categoryId = Number(categoryId);
  if (addonsOnly === "true") where.isAddon = true;

  const products = await prisma.product.findMany({
    where,
    include: { category: true },
    orderBy: { createdAt: "desc" },
  });
  res.json(products);
});

router.get("/:id", async (req, res) => {
  const product = await prisma.product.findUnique({
    where: { id: Number(req.params.id) },
    include: { category: true },
  });
  if (!product) return res.status(404).json({ message: "Mahsulot topilmadi" });
  res.json(product);
});

router.post("/", adminAuth, async (req, res) => {
  const { name, description, price, oldPrice, image, specs, categoryId, stock, isAddon } = req.body;

  if (!name || !price) {
    return res.status(400).json({ message: "Nomi va narxi majburiy" });
  }

  const product = await prisma.product.create({
    data: {
      name,
      description,
      price: Number(price),
      oldPrice: oldPrice ? Number(oldPrice) : null,
      image,
      specs: Array.isArray(specs) ? specs : [],
      categoryId: categoryId ? Number(categoryId) : null,
      stock: stock ? Number(stock) : 50,
      isAddon: Boolean(isAddon),
    },
  });

  res.status(201).json(product);
});

router.put("/:id", adminAuth, async (req, res) => {
  const { name, description, price, oldPrice, image, specs, categoryId, stock, isAddon } = req.body;

  const product = await prisma.product.update({
    where: { id: Number(req.params.id) },
    data: {
      name,
      description,
      price: price !== undefined ? Number(price) : undefined,
      oldPrice: oldPrice !== undefined ? (oldPrice ? Number(oldPrice) : null) : undefined,
      image,
      specs: Array.isArray(specs) ? specs : undefined,
      categoryId: categoryId !== undefined ? (categoryId ? Number(categoryId) : null) : undefined,
      stock: stock !== undefined ? Number(stock) : undefined,
      isAddon: isAddon !== undefined ? Boolean(isAddon) : undefined,
    },
  });

  res.json(product);
});

router.delete("/:id", adminAuth, async (req, res) => {
  await prisma.product.delete({ where: { id: Number(req.params.id) } });
  res.json({ message: "O'chirildi" });
});

module.exports = router;
