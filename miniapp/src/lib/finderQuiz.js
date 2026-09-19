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
      { value: "low", label: "$200 - $500", range: [200, 500] },
      { value: "mid", label: "$500 - $800", range: [500, 800] },
      { value: "high", label: "$800 - $1,200", range: [800, 1200] },
      { value: "premium", label: "$1,200 dan yuqori", range: [1200, 999000] },
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

// Admin har bir mahsulotga bir nechta javob (checkbox) belgilashi mumkin —
// mos kelgan har bir savol uchun ball qo'shiladi. Narx bo'yicha taxminiy bonus
// berilmaydi — faqat admin aniq belgilagan javoblar hisobga olinadi.
export function scoreProduct(product, answers) {
  let score = 0;

  if (product.quizPurpose?.includes(answers.purpose)) score += 4;
  if (product.quizBudget?.includes(answers.budget)) score += 4;
  if (product.quizPortable?.includes(answers.portable)) score += 2;
  if (product.quizScreen?.includes(answers.screen)) score += 2;
  if (product.quizBattery?.includes(answers.battery)) score += 2;
  if (product.quizMultitask?.includes(answers.multitask)) score += 2;

  return score;
}

export function getRecommendations(products, answers) {
  const computers = products.filter(
    (p) => !p.isAddon && (p.category?.name === "Noutbuklar" || p.category?.name === "Kompyuterlar")
  );

  return computers
    .map((product) => ({ product, score: scoreProduct(product, answers) }))
    .filter((r) => r.score > 0)
    .sort((a, b) => b.score - a.score)
    .slice(0, 3)
    .map((r) => r.product);
}
