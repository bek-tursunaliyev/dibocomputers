const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const prisma = require("../lib/prisma");
const { verifyTelegramInitData } = require("../lib/telegramAuth");

const router = express.Router();

function getAdminTelegramIds() {
  return (process.env.ADMIN_TELEGRAM_IDS || "")
    .split(",")
    .map((id) => id.trim())
    .filter(Boolean);
}

router.post("/login", async (req, res) => {
  const { username, password } = req.body;

  if (!username || !password) {
    return res.status(400).json({ message: "Login va parolni kiriting" });
  }

  const admin = await prisma.admin.findUnique({ where: { username } });
  if (!admin) {
    return res.status(401).json({ message: "Login yoki parol noto'g'ri" });
  }

  const isValid = await bcrypt.compare(password, admin.password);
  if (!isValid) {
    return res.status(401).json({ message: "Login yoki parol noto'g'ri" });
  }

  const token = jwt.sign({ id: admin.id, username: admin.username }, process.env.JWT_SECRET, {
    expiresIn: "7d",
  });

  res.json({ token, username: admin.username });
});

// Mini App: Telegram foydalanuvchisini ADMIN_TELEGRAM_IDS ro'yxati bilan solishtirib,
// admin bo'lsa avtomatik JWT token beradi (login/parol talab qilinmaydi)
router.post("/telegram-login", (req, res) => {
  const { initData } = req.body;
  const verified = verifyTelegramInitData(initData, process.env.BOT_TOKEN);

  if (!verified || !verified.user) {
    return res.json({ isAdmin: false });
  }

  const adminIds = getAdminTelegramIds();
  const isAdmin = adminIds.includes(String(verified.user.id));

  if (!isAdmin) {
    return res.json({ isAdmin: false });
  }

  const token = jwt.sign(
    { telegramId: String(verified.user.id), username: verified.user.username || "admin", viaTelegram: true },
    process.env.JWT_SECRET,
    { expiresIn: "12h" }
  );

  res.json({ isAdmin: true, token });
});

module.exports = router;
