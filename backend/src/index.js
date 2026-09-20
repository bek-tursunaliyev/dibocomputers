require("dotenv").config();
const express = require("express");
const cors = require("cors");
const path = require("path");

const { initBot, getBot, WEBHOOK_PATH, WEBHOOK_SECRET } = require("./bot");
const authRoutes = require("./routes/auth");
const categoryRoutes = require("./routes/categories");
const productRoutes = require("./routes/products");
const uploadRoutes = require("./routes/upload");
const orderRoutes = require("./routes/orders");
const storyRoutes = require("./routes/stories");

const app = express();

app.use(cors());

const bot = getBot();
if (bot) {
  // express.json()dan OLDIN ulanadi - Telegraf so'rov tanasini o'zi o'qiydi
  app.use(bot.webhookCallback(WEBHOOK_PATH, { secretToken: WEBHOOK_SECRET }));
}

app.use(express.json());
app.use("/uploads", express.static(path.join(__dirname, "..", "uploads")));

app.use("/api/auth", authRoutes);
app.use("/api/categories", categoryRoutes);
app.use("/api/products", productRoutes);
app.use("/api/upload", uploadRoutes);
app.use("/api/orders", orderRoutes);
app.use("/api/stories", storyRoutes);

app.get("/api/health", (req, res) => res.json({ status: "ok" }));

app.use((err, req, res, next) => {
  console.error(err);

  if (err.code === "P2025") {
    return res.status(404).json({ message: "Ma'lumot topilmadi (u allaqachon o'chirilgan bo'lishi mumkin)" });
  }
  if (err.code === "P2003") {
    return res.status(409).json({ message: "Bu yozuv boshqa ma'lumotlar bilan bog'langani uchun amalni bajarib bo'lmadi" });
  }

  res.status(500).json({ message: err.message || "Server xatoligi" });
});

if (require.main === module) {
  const PORT = process.env.PORT || 5000;
  app.listen(PORT, () => {
    console.log(`Backend server http://localhost:${PORT} da ishga tushdi`);
    initBot();
  });
} else {
  initBot();
}

module.exports = app;
