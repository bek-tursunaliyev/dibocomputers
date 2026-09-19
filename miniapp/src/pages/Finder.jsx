import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Wand2, ArrowLeft, RotateCcw } from "lucide-react";
import { api } from "../lib/api";
import { QUESTIONS, getRecommendations } from "../lib/finderQuiz";
import ProductCard from "../components/ProductCard";
import ProductSheet from "../components/ProductSheet";

export default function Finder() {
  const navigate = useNavigate();
  const [step, setStep] = useState(0);
  const [answers, setAnswers] = useState({});
  const [results, setResults] = useState(null);
  const [loading, setLoading] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);

  const question = QUESTIONS[step];
  const isLast = step === QUESTIONS.length - 1;

  async function handleSelect(value) {
    const nextAnswers = { ...answers, [question.key]: value };
    setAnswers(nextAnswers);

    if (!isLast) {
      setStep((s) => s + 1);
      return;
    }

    setLoading(true);
    try {
      const products = await api.getProducts();
      setResults(getRecommendations(products, nextAnswers));
    } finally {
      setLoading(false);
    }
  }

  function handleRestart() {
    setStep(0);
    setAnswers({});
    setResults(null);
  }

  if (loading) {
    return (
      <div className="h-screen flex items-center justify-center">
        <p className="text-gray-400">Tavsiya tayyorlanmoqda...</p>
      </div>
    );
  }

  if (results) {
    return (
      <div className="pb-20">
        <header className="px-4 pt-5 pb-3 flex items-center gap-3">
          <button onClick={() => navigate(-1)} className="text-gray-500">
            <ArrowLeft size={22} />
          </button>
          <h1 className="text-lg font-bold text-gray-900">Sizga tavsiyalar</h1>
        </header>

        {results.length === 0 ? (
          <p className="text-center text-gray-400 mt-10 px-4">
            Hozircha mos mahsulot topilmadi. Katalogni ko'rib chiqing.
          </p>
        ) : (
          <div className="grid grid-cols-2 gap-3 px-4">
            {results.map((product) => (
              <ProductCard key={product.id} product={product} onClick={setSelectedProduct} />
            ))}
          </div>
        )}

        <button
          onClick={handleRestart}
          className="mx-4 mt-5 flex items-center justify-center gap-2 w-[calc(100%-32px)] py-3 rounded-2xl border border-gray-200 text-gray-600 text-sm font-medium"
        >
          <RotateCcw size={16} />
          Testni qayta boshlash
        </button>

        <ProductSheet product={selectedProduct} onClose={() => setSelectedProduct(null)} />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col px-6 pt-8 pb-24">
      <div className="flex items-center gap-3 mb-6">
        <button onClick={() => navigate(-1)} className="text-gray-500">
          <ArrowLeft size={22} />
        </button>
        <div className="flex gap-1.5 flex-1">
          {QUESTIONS.map((_, i) => (
            <div
              key={i}
              className={`h-1.5 flex-1 rounded-full ${i <= step ? "bg-primary" : "bg-gray-200"}`}
            />
          ))}
        </div>
      </div>

      <div className="flex flex-col items-center text-center mb-8">
        <div className="w-16 h-16 rounded-2xl bg-primary/10 flex items-center justify-center mb-4">
          <Wand2 size={28} className="text-primary" />
        </div>
        <p className="text-xs text-gray-400 mb-2">
          Savol {step + 1} / {QUESTIONS.length}
        </p>
        <h1 className="text-xl font-bold text-gray-900">{question.question}</h1>
      </div>

      <div className="flex flex-col gap-3">
        {question.options.map((option) => (
          <button
            key={option.value}
            onClick={() => handleSelect(option.value)}
            className="w-full text-left px-5 py-4 rounded-2xl bg-white border border-gray-200 text-gray-800 font-medium active:border-primary active:bg-primary/5"
          >
            {option.label}
          </button>
        ))}
      </div>
    </div>
  );
}
