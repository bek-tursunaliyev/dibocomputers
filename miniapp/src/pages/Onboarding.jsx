import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Laptop, ShoppingBag, Rocket } from "lucide-react";

const slides = [
  {
    Icon: Laptop,
    title: "Yangi kompyuter izlayapsizmi?",
    text: "Kerakli texnikalarni bir joydan toping.",
  },
  {
    Icon: ShoppingBag,
    title: "Bu qanday ishlaydi?",
    text: "Mahsulotni tanlang, buyurtma bering va tezda xarid qiling.",
  },
  {
    Icon: Rocket,
    title: "Minglab xaridorlar",
    text: "Minglab xaridorlar DiboComputers orqali texnika xarid qilmoqda.",
  },
];

export default function Onboarding({ onFinish }) {
  const [index, setIndex] = useState(0);
  const navigate = useNavigate();
  const isLast = index === slides.length - 1;

  function handleNext() {
    if (isLast) {
      localStorage.setItem("onboarding_done", "1");
      onFinish();
      navigate("/");
    } else {
      setIndex((i) => i + 1);
    }
  }

  const slide = slides[index];

  return (
    <div className="h-screen flex flex-col items-center justify-between bg-white px-8 py-16">
      <div />
      <div className="flex flex-col items-center text-center gap-5">
        <div className="w-28 h-28 rounded-3xl bg-primary/10 flex items-center justify-center">
          <slide.Icon size={56} className="text-primary" strokeWidth={1.5} />
        </div>
        <h1 className="text-2xl font-bold text-gray-900">{slide.title}</h1>
        <p className="text-gray-500 max-w-xs">{slide.text}</p>
      </div>

      <div className="w-full flex flex-col items-center gap-6">
        <div className="flex gap-2">
          {slides.map((_, i) => (
            <div
              key={i}
              className={`h-2 rounded-full transition-all ${
                i === index ? "w-6 bg-primary" : "w-2 bg-gray-200"
              }`}
            />
          ))}
        </div>
        <button
          onClick={handleNext}
          className="w-full bg-primary text-white font-semibold py-4 rounded-2xl"
        >
          {isLast ? "Boshlash" : "Keyingisi"}
        </button>
      </div>
    </div>
  );
}
