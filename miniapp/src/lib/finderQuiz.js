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

function getBudgetRange(value) {
  return QUESTIONS.find((q) => q.key === "budget").options.find((o) => o.value === value)?.range;
}

// Admin har bir mahsulotga mos javoblarni (quizPurpose, quizBudget, ...) belgilagan bo'lsa,
// aynan shu 6 ta savol bo'yicha to'g'ridan-to'g'ri solishtiramiz — bu taxminiy matn qidirishdan
// ancha aniqroq ishlaydi.
export function scoreProduct(product, answers) {
  let score = 0;

  if (product.quizPurpose && product.quizPurpose === answers.purpose) score += 4;
  if (product.quizBudget && product.quizBudget === answers.budget) score += 4;
  if (product.quizPortable && product.quizPortable === answers.portable) score += 2;
  if (product.quizScreen && product.quizScreen === answers.screen) score += 2;
  if (product.quizBattery && product.quizBattery === answers.battery) score += 2;
  if (product.quizMultitask && product.quizMultitask === answers.multitask) score += 2;

  // Mahsulot hali tag'lanmagan bo'lsa ham, haqiqiy narxi byudjetga mos kelsa
  // baribir arzimagan darajada tavsiyaga tushishi uchun kichik bonus beriladi.
  const range = getBudgetRange(answers.budget);
  if (range && product.price >= range[0] && product.price <= range[1]) {
    score += 1;
  }

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
