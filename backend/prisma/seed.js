require("dotenv").config();
const { PrismaClient } = require("@prisma/client");
const bcrypt = require("bcryptjs");

const prisma = new PrismaClient();

async function main() {
  console.log("Seed boshlandi...");

  const categories = await Promise.all([
    prisma.category.upsert({
      where: { id: 1 },
      update: {},
      create: { id: 1, name: "Noutbuklar", emoji: "💻" },
    }),
    prisma.category.upsert({
      where: { id: 2 },
      update: {},
      create: { id: 2, name: "Kompyuterlar", emoji: "🖥️" },
    }),
    prisma.category.upsert({
      where: { id: 3 },
      update: {},
      create: { id: 3, name: "Monitorlar", emoji: "🖼️" },
    }),
    prisma.category.upsert({
      where: { id: 4 },
      update: {},
      create: { id: 4, name: "Aksessuarlar", emoji: "🖱️" },
    }),
  ]);

  const [noutbuk] = categories;

  // DiboComputers Telegram kanalidagi (@dibonamangan) haqiqiy e'lonlardan olingan mahsulotlar
  const products = [
    {
      name: "ASUS TUF GAMING F15",
      description: "Gaming noutbuk, holati yaxshi, 1 oy kafolat bilan",
      price: 680,
      oldPrice: null,
      image: "/uploads/logo.png",
      specs: [
        "Intel Core i7-12650H",
        "16GB DDR5 RAM",
        "512GB NVMe SSD",
        "NVIDIA GeForce RTX 3050",
        "15.6\" FHD (1920x1080)",
        "Windows 11 x64",
      ],
      categoryId: noutbuk.id,
      stock: 1,
      quizPurpose: ["gaming"],
      quizBudget: ["mid"],
      quizPortable: ["no"],
      quizScreen: ["medium"],
      quizBattery: ["mid"],
      quizMultitask: ["high"],
    },
    {
      name: "MacBook Air",
      description: "Apple M1, 2020-yil modeli, holati yaxshi, 1 oy kafolat bilan",
      price: 490,
      oldPrice: null,
      image: "/uploads/logo.png",
      specs: [
        "Apple M1 protsessor",
        "8GB RAM",
        "256GB SSD",
        "13.6\" Retina displey",
        "Batareya holati: 92% (206 sikl)",
      ],
      categoryId: noutbuk.id,
      stock: 1,
      quizPurpose: ["student", "design"],
      quizBudget: ["low"],
      quizPortable: ["yes"],
      quizScreen: ["small"],
      quizBattery: ["high"],
      quizMultitask: ["mid"],
    },
    {
      name: "HP Victus",
      description: "Gaming noutbuk, 144Hz ekran, holati yaxshi, 1 oy kafolat bilan",
      price: 500,
      oldPrice: null,
      image: "/uploads/logo.png",
      specs: [
        "Intel Core i5-13420H",
        "16GB DDR4 RAM",
        "512GB NVMe SSD",
        "NVIDIA GeForce RTX 3050 6GB",
        "15.6\" FHD 144Hz",
        "Windows 11 x64",
      ],
      categoryId: noutbuk.id,
      stock: 1,
      quizPurpose: ["gaming"],
      quizBudget: ["low", "mid"],
      quizPortable: ["no"],
      quizScreen: ["medium"],
      quizBattery: ["low"],
      quizMultitask: ["high"],
    },
  ];

  // Ilgari qo'yilgan demo (haqiqiy bo'lmagan) mahsulotlarni bazadan tozalash
  const demoProductNames = [
    "ASUS TUF Gaming F15",
    "HP Pavilion 15",
    "Dell Gaming Desktop PC",
    "Lenovo IdeaCentre",
    "Samsung 24\" Monitor",
    "Mexanik Klaviatura RGB",
    "SSD NVMe 512GB",
    "Simsiz Sichqoncha",
  ];
  for (const name of demoProductNames) {
    await prisma.product.deleteMany({ where: { name } });
  }

  for (const product of products) {
    const existing = await prisma.product.findFirst({ where: { name: product.name } });
    if (existing) {
      await prisma.product.update({ where: { id: existing.id }, data: product });
    } else {
      await prisma.product.create({ data: product });
    }
  }

  const stories = [
    {
      label: "Yangiliklar",
      icon: "Newspaper",
      gradient: "from-blue-500 to-cyan-400",
      title: "Yangi mahsulotlar keldi!",
      text: "Har hafta yangi noutbuk va kompyuterlar bilan katalogimiz to'ldirilib boriladi.",
      order: 1,
    },
    {
      label: "Chegirmalar",
      icon: "BadgePercent",
      gradient: "from-primary to-orange-400",
      title: "-15% gacha chegirmalar",
      text: "Tanlangan mahsulotlarga maxsus chegirmalar. Ulgurib qoling!",
      order: 2,
    },
    {
      label: "Gaming",
      icon: "Gamepad2",
      gradient: "from-purple-600 to-fuchsia-500",
      title: "Gaming kompyuterlar",
      text: "RTX videokartali kuchli o'yin kompyuterlari va noutbuklari mavjud.",
      order: 3,
    },
    {
      label: "Ofis",
      icon: "Briefcase",
      gradient: "from-slate-700 to-slate-500",
      title: "Ofis va o'qish uchun",
      text: "Kundalik ishlar uchun ishonchli va arzon narxdagi kompyuterlar.",
      order: 4,
    },
    {
      label: "Aksessuar",
      icon: "Mouse",
      gradient: "from-emerald-500 to-teal-400",
      title: "Aksessuarlar",
      text: "Sichqoncha, klaviatura va boshqa kerakli qo'shimchalar bir joyda.",
      order: 5,
    },
  ];

  for (const story of stories) {
    const existing = await prisma.story.findFirst({ where: { label: story.label } });
    if (!existing) {
      await prisma.story.create({ data: story });
    }
  }

  const adminUsername = process.env.ADMIN_USERNAME || "admin";
  const adminPassword = process.env.ADMIN_PASSWORD || "admin123";
  const hashedPassword = await bcrypt.hash(adminPassword, 10);

  await prisma.admin.upsert({
    where: { username: adminUsername },
    update: {},
    create: { username: adminUsername, password: hashedPassword },
  });

  console.log("Seed muvaffaqiyatli yakunlandi!");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
