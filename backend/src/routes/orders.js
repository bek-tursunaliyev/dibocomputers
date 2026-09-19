const express = require("express");
const prisma = require("../lib/prisma");
const adminAuth = require("../middleware/adminAuth");
const { verifyTelegramInitData } = require("../lib/telegramAuth");
const { sendOrderConfirmation } = require("../bot");

const router = express.Router();

// Mini App: yangi buyurtma yaratish
router.post("/", async (req, res) => {
  try {
    const { initData, items, location, phone } = req.body;

    if (!items || !items.length) {
      return res.status(400).json({ message: "Savatcha bo'sh" });
    }
    if (!location || !phone) {
      return res.status(400).json({ message: "Manzil va telefon raqam majburiy" });
    }

    let tgUser = null;
    const verified = verifyTelegramInitData(initData, process.env.BOT_TOKEN);

    if (verified && verified.user) {
      tgUser = verified.user;
    } else if (process.env.NODE_ENV !== "production") {
      // Brauzerda (Telegram tashqarisida) test qilish uchun zaxira foydalanuvchi
      tgUser = { id: "000000000", first_name: "Test", last_name: "Mijoz", username: "test_user" };
    } else {
      return res.status(401).json({ message: "Telegram autentifikatsiyasi muvaffaqiyatsiz" });
    }

    const user = await prisma.user.upsert({
      where: { telegramId: String(tgUser.id) },
      update: {
        firstName: tgUser.first_name,
        lastName: tgUser.last_name,
        username: tgUser.username,
        phone,
      },
      create: {
        telegramId: String(tgUser.id),
        firstName: tgUser.first_name,
        lastName: tgUser.last_name,
        username: tgUser.username,
        phone,
      },
    });

    const totalAmount = items.reduce((sum, item) => sum + item.price * item.quantity, 0);

    const order = await prisma.order.create({
      data: {
        userId: user.id,
        totalAmount,
        location,
        phone,
        items: {
          create: items.map((item) => ({
            productId: item.productId,
            name: item.name,
            price: item.price,
            quantity: item.quantity,
          })),
        },
      },
      include: { items: true },
    });

    sendOrderConfirmation(user.telegramId).catch((err) =>
      console.error("Bot xabar yuborishda xatolik:", err.message)
    );

    res.status(201).json(order);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Buyurtma yaratishda xatolik yuz berdi" });
  }
});

// Mini App: mijozning o'z buyurtmalari tarixi
router.get("/mine", async (req, res) => {
  const { telegramId } = req.query;
  if (!telegramId) return res.status(400).json({ message: "telegramId majburiy" });

  const user = await prisma.user.findUnique({ where: { telegramId: String(telegramId) } });
  if (!user) return res.json([]);

  const orders = await prisma.order.findMany({
    where: { userId: user.id },
    include: { items: true },
    orderBy: { createdAt: "desc" },
  });

  res.json(orders);
});

// Admin: barcha buyurtmalar ro'yxati
router.get("/", adminAuth, async (req, res) => {
  const orders = await prisma.order.findMany({
    include: { items: true, user: true },
    orderBy: { createdAt: "desc" },
  });
  res.json(orders);
});

// Admin: buyurtma holatini o'zgartirish
router.patch("/:id/status", adminAuth, async (req, res) => {
  const { status } = req.body;
  if (!["PENDING", "DELIVERED"].includes(status)) {
    return res.status(400).json({ message: "Holat noto'g'ri" });
  }

  const order = await prisma.order.update({
    where: { id: Number(req.params.id) },
    data: { status },
  });

  res.json(order);
});

module.exports = router;
