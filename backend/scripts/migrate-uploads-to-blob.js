require("dotenv").config({ path: ".env.local" });
require("dotenv").config();
const fs = require("fs");
const path = require("path");
const { put } = require("@vercel/blob");
const { PrismaClient } = require("@prisma/client");

const prisma = new PrismaClient();
const uploadsDir = path.join(__dirname, "..", "uploads");

async function main() {
  const products = await prisma.product.findMany({
    where: { image: { startsWith: "/uploads/" } },
  });

  console.log(`${products.length} ta mahsulot rasmi ko'chiriladi...`);

  for (const product of products) {
    const localFile = path.join(uploadsDir, path.basename(product.image));
    if (!fs.existsSync(localFile)) {
      console.warn(`Topilmadi, o'tkazib yuborildi: ${localFile}`);
      continue;
    }

    const buffer = fs.readFileSync(localFile);
    const blob = await put(`uploads/${path.basename(product.image)}`, buffer, {
      access: "public",
    });

    await prisma.product.update({
      where: { id: product.id },
      data: { image: blob.url },
    });

    console.log(`Product #${product.id}: ${product.image} -> ${blob.url}`);
  }

  console.log("Tugadi.");
}

main()
  .catch((err) => {
    console.error(err);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
