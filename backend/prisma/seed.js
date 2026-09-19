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

  const [noutbuk, kompyuter, monitor, aksessuar] = categories;

  const products = [
    {
      name: "ASUS TUF Gaming F15",
      description: "Kuchli gaming noutbuk, Intel Core i7, RTX 3050",
      price: 999,
      oldPrice: 1099,
      image: "/uploads/logo.png",
      specs: [
        "Intel Core i7-12700H",
        "16GB RAM DDR4",
        "512GB NVMe SSD",
        "RTX 3050 4GB",
        "15.6\" 144Hz FHD",
      ],
      categoryId: noutbuk.id,
      stock: 8,
      quizPurpose: "gaming",
      quizBudget: "mid",
      quizPortable: "no",
      quizScreen: "medium",
      quizBattery: "mid",
      quizMultitask: "high",
    },
    {
      name: "HP Pavilion 15",
      description: "Kundalik ish va o'qish uchun ideal noutbuk",
      price: 749,
      oldPrice: 829,
      image: "/uploads/logo.png",
      specs: [
        "Intel Core i5-1235U",
        "8GB RAM DDR4",
        "512GB NVMe SSD",
        "Intel Iris Xe Graphics",
        "15.6\" FHD IPS",
      ],
      categoryId: noutbuk.id,
      stock: 12,
      quizPurpose: "office",
      quizBudget: "mid",
      quizPortable: "no",
      quizScreen: "medium",
      quizBattery: "high",
      quizMultitask: "low",
    },
    {
      name: "Dell Gaming Desktop PC",
      description: "Yuqori unumdorlikka ega gaming kompyuter",
      price: 1199,
      oldPrice: null,
      image: "/uploads/logo.png",
      specs: [
        "Intel Core i7-13700F",
        "32GB RAM DDR5",
        "1TB NVMe SSD",
        "RTX 4060 8GB",
        "750W Gold PSU",
      ],
      categoryId: kompyuter.id,
      stock: 5,
    },
    {
      name: "Lenovo IdeaCentre",
      description: "Ofis va o'quv ishlari uchun ixcham kompyuter",
      price: 649,
      oldPrice: 719,
      image: "/uploads/logo.png",
      specs: [
        "Intel Core i5-12400",
        "16GB RAM DDR4",
        "512GB NVMe SSD",
        "Intel UHD Graphics 730",
        "Windows 11 Home",
      ],
      categoryId: kompyuter.id,
      stock: 10,
    },
    {
      name: "Samsung 24\" Monitor",
      description: "To'liq HD, IPS panelli monitor",
      price: 169,
      oldPrice: 199,
      image: "/uploads/logo.png",
      specs: ["23.8\" IPS panel", "1920x1080 FHD", "75Hz yangilanish", "HDMI + VGA"],
      categoryId: monitor.id,
      stock: 15,
    },
    {
      name: "Mexanik Klaviatura RGB",
      description: "Gamerlar uchun mexanik klaviatura, RGB yoritgich",
      price: 35,
      oldPrice: 49,
      image: "/uploads/logo.png",
      specs: ["Blue switch", "RGB yoritgich", "USB simli ulanish", "Anti-ghosting"],
      categoryId: aksessuar.id,
      stock: 20,
    },
    {
      name: "SSD NVMe 512GB",
      description: "Tezkor ma'lumot saqlash uchun SSD disk",
      price: 49,
      oldPrice: null,
      image: "/uploads/logo.png",
      specs: ["512GB hajm", "NVMe PCIe Gen3", "O'qish: 3500MB/s"],
      categoryId: aksessuar.id,
      stock: 25,
    },
    {
      name: "Simsiz Sichqoncha",
      description: "Qo'shimcha aksessuar sifatida qulay simsiz sichqoncha",
      price: 5,
      oldPrice: null,
      image: "/uploads/logo.png",
      specs: ["2.4GHz simsiz ulanish", "1600 DPI", "Batareya bilan ishlaydi"],
      categoryId: aksessuar.id,
      stock: 40,
      isAddon: true,
    },
  ];

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
