const express = require("express");
const prisma = require("../lib/prisma");
const adminAuth = require("../middleware/adminAuth");
const asyncHandler = require("../lib/asyncHandler");

const router = express.Router();

router.get(
  "/",
  asyncHandler(async (req, res) => {
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
  })
);

router.get(
  "/:id",
  asyncHandler(async (req, res) => {
    const product = await prisma.product.findUnique({
      where: { id: Number(req.params.id) },
      include: { category: true },
    });
    if (!product) return res.status(404).json({ message: "Mahsulot topilmadi" });
    res.json(product);
  })
);

router.post(
  "/",
  adminAuth,
  asyncHandler(async (req, res) => {
    const {
      name,
      description,
      price,
      oldPrice,
      image,
      specs,
      categoryId,
      stock,
      isAddon,
      quizPurpose,
      quizBudget,
      quizPortable,
      quizScreen,
      quizBattery,
      quizMultitask,
    } = req.body;

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
        quizPurpose: quizPurpose || null,
        quizBudget: quizBudget || null,
        quizPortable: quizPortable || null,
        quizScreen: quizScreen || null,
        quizBattery: quizBattery || null,
        quizMultitask: quizMultitask || null,
      },
    });

    res.status(201).json(product);
  })
);

router.put(
  "/:id",
  adminAuth,
  asyncHandler(async (req, res) => {
    const {
      name,
      description,
      price,
      oldPrice,
      image,
      specs,
      categoryId,
      stock,
      isAddon,
      quizPurpose,
      quizBudget,
      quizPortable,
      quizScreen,
      quizBattery,
      quizMultitask,
    } = req.body;

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
        quizPurpose: quizPurpose !== undefined ? quizPurpose || null : undefined,
        quizBudget: quizBudget !== undefined ? quizBudget || null : undefined,
        quizPortable: quizPortable !== undefined ? quizPortable || null : undefined,
        quizScreen: quizScreen !== undefined ? quizScreen || null : undefined,
        quizBattery: quizBattery !== undefined ? quizBattery || null : undefined,
        quizMultitask: quizMultitask !== undefined ? quizMultitask || null : undefined,
      },
    });

    res.json(product);
  })
);

router.delete(
  "/:id",
  adminAuth,
  asyncHandler(async (req, res) => {
    const productId = Number(req.params.id);

    // Bu mahsulot ilgari buyurtma qilingan bo'lsa ham, buyurtma tarixi
    // saqlanib qolishi uchun OrderItem'dagi bog'lanish uzib qo'yiladi (schema: onDelete SetNull)
    await prisma.product.delete({ where: { id: productId } });
    res.json({ message: "O'chirildi" });
  })
);

module.exports = router;
