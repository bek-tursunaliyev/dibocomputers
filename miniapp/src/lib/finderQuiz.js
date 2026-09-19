export const QUESTIONS = [
  {
    key: "purpose",
    question: "Kompyuterni asosan nima uchun ishlatasiz?",
    options: [
      { value: "gaming", label: "O'yin o'ynash (Gaming)" },
      { value: "office", label: "Ish va ofis vazifalari" },
      { value: "student", label: "O'qish / Talabalik" },
      { value: "design", label: "Dizayn, video/foto montaj" },
    ],
  },
  {
    key: "budget",
    question: "Byudjetingiz qancha?",
    options: [
      { value: "low", label: "$400 - $700", range: [0, 700] },
      { value: "mid", label: "$700 - $1,000", range: [700, 1000] },
      { value: "high", label: "$1,000 - $1,500", range: [1000, 1500] },
      { value: "premium", label: "$1,500 dan yuqori", range: [1500, 999000] },
    ],
  },
  {
    key: "portable",
    question: "Ko'p harakatlanasizmi (portativlik muhimmi)?",
    options: [
      { value: "yes", label: "Ha, doim o'zim bilan olib yuraman" },
      { value: "no", label: "Yo'q, asosan bir joyda ishlataman" },
    ],
  },
  {
    key: "screen",
    question: "Ekran o'lchami qanday bo'lishi kerak?",
    options: [
      { value: "small", label: "Kichik va yengil (13-14\")" },
      { value: "medium", label: "O'rtacha (15-16\")" },
      { value: "large", label: "Katta (17\" va undan yuqori)" },
    ],
  },
  {
    key: "battery",
    question: "Batareya necha soat ishlashi kerak?",
    options: [
      { value: "low", label: "Muhim emas, doim rozetka yonida" },
      { value: "mid", label: "4-6 soat" },
      { value: "high", label: "8 soatdan ko'p" },
    ],
  },
  {
    key: "multitask",
    question: "Bir vaqtda nechta og'ir dastur/oyna ochib ishlaysiz?",
    options: [
      { value: "low", label: "Kam (1-2 ta yengil dastur)" },
      { value: "mid", label: "O'rtacha (3-5 ta dastur)" },
      { value: "high", label: "Ko'p, og'ir dasturlar bilan (video, 3D, o'yin)" },
    ],
  },
];

function textOf(product) {
  return `${product.name} ${product.description || ""} ${(product.specs || []).join(" ")}`.toLowerCase();
}

export function scoreProduct(product, answers) {
  const text = textOf(product);
  let score = 0;

  if (answers.purpose === "gaming" && /(rtx|gtx|geforce|gaming)/.test(text)) score += 4;
  if (answers.purpose === "design" && /(i7|i9|ryzen 7|ryzen 9|32gb|16gb|rtx)/.test(text)) score += 3;
  if ((answers.purpose === "office" || answers.purpose === "student") && product.price <= 800) score += 3;

  const budgetOption = QUESTIONS.find((q) => q.key === "budget").options.find((o) => o.value === answers.budget);
  if (budgetOption) {
    const [min, max] = budgetOption.range;
    if (product.price >= min && product.price <= max) {
      score += 5;
    } else {
      const diff = product.price < min ? min - product.price : product.price - max;
      score -= Math.min(4, diff / 150);
    }
  }

  if (answers.portable === "yes" && /(13\.|14\.)/.test(text)) score += 2;
  if (answers.portable === "no" && /(15\.|16\.|17\.)/.test(text)) score += 1;

  if (answers.screen === "small" && /(13\.|14\.)/.test(text)) score += 2;
  if (answers.screen === "medium" && /(15\.|16\.)/.test(text)) score += 2;
  if (answers.screen === "large" && /17\./.test(text)) score += 2;

  if (answers.multitask === "high" && /(32gb|16gb)/.test(text)) score += 3;
  if (answers.multitask === "low" && /8gb/.test(text)) score += 1;

  if (answers.battery === "high" && /(iris|efficient|uhd)/.test(text)) score += 1;

  return score;
}

export function getRecommendations(products, answers) {
  const laptops = products.filter((p) => !p.isAddon && p.category?.name === "Noutbuklar");
  const pool = laptops.length > 0 ? laptops : products.filter((p) => !p.isAddon);

  return pool
    .map((product) => ({ product, score: scoreProduct(product, answers) }))
    .sort((a, b) => b.score - a.score)
    .slice(0, 3)
    .map((r) => r.product);
}
