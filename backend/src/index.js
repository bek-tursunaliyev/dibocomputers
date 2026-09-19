require("dotenv").config();
const express = require("express");
const cors = require("cors");
const path = require("path");

const { initBot } = require("./bot");
const authRoutes = require("./routes/auth");
const categoryRoutes = require("./routes/categories");
const productRoutes = require("./routes/products");
const uploadRoutes = require("./routes/upload");
const orderRoutes = require("./routes/orders");
const storyRoutes = require("./routes/stories");

const app = express();

app.use(cors());
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
  res.status(500).json({ message: err.message || "Server xatoligi" });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Backend server http://localhost:${PORT} da ishga tushdi`);
  initBot();
});
