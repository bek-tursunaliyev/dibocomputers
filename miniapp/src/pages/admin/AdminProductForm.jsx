import { useEffect, useState } from "react";
import { ArrowLeft } from "lucide-react";
import { api, imageUrl } from "../../lib/api";
import { useAdmin } from "../../context/AdminContext";
import { QUESTIONS } from "../../lib/finderQuiz";
import SmartImage from "../../components/SmartImage";

const emptyForm = {
  name: "",
  description: "",
  price: "",
  oldPrice: "",
  image: "",
  categoryId: "",
  stock: "",
  isAddon: false,
  specs: "",
  quizPurpose: "",
  quizBudget: "",
  quizPortable: "",
  quizScreen: "",
  quizBattery: "",
  quizMultitask: "",
};

export default function AdminProductForm({ product, categories, onClose, onSaved }) {
  const { adminToken } = useAdmin();
  const [form, setForm] = useState(emptyForm);
  const [uploading, setUploading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (product) {
      setForm({
        name: product.name || "",
        description: product.description || "",
        price: product.price ?? "",
        oldPrice: product.oldPrice ?? "",
        image: product.image || "",
        categoryId: product.categoryId || "",
        stock: product.stock ?? "",
        isAddon: product.isAddon || false,
        specs: (product.specs || []).join("\n"),
        quizPurpose: product.quizPurpose || "",
        quizBudget: product.quizBudget || "",
        quizPortable: product.quizPortable || "",
        quizScreen: product.quizScreen || "",
        quizBattery: product.quizBattery || "",
        quizMultitask: product.quizMultitask || "",
      });
    }
  }, [product]);

  async function handleImageChange(e) {
    const file = e.target.files[0];
    if (!file) return;
    setUploading(true);
    setError("");
    try {
      const { url } = await api.uploadImage(adminToken, file);
      setForm((f) => ({ ...f, image: url }));
    } catch (err) {
      setError(err.message);
    } finally {
      setUploading(false);
    }
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");
    setSaving(true);
    try {
      const payload = {
        name: form.name,
        description: form.description,
        price: Number(form.price),
        oldPrice: form.oldPrice ? Number(form.oldPrice) : null,
        image: form.image,
        categoryId: form.categoryId ? Number(form.categoryId) : null,
        stock: form.stock ? Number(form.stock) : 50,
        isAddon: form.isAddon,
        specs: form.specs.split("\n").map((s) => s.trim()).filter(Boolean),
        quizPurpose: form.isAddon ? null : form.quizPurpose,
        quizBudget: form.isAddon ? null : form.quizBudget,
        quizPortable: form.isAddon ? null : form.quizPortable,
        quizScreen: form.isAddon ? null : form.quizScreen,
        quizBattery: form.isAddon ? null : form.quizBattery,
        quizMultitask: form.isAddon ? null : form.quizMultitask,
      };

      if (product) {
        await api.updateProduct(adminToken, product.id, payload);
      } else {
        await api.createProduct(adminToken, payload);
      }
      onSaved();
    } catch (err) {
      setError(err.message);
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="fixed inset-0 z-50 bg-white overflow-y-auto">
      <header className="sticky top-0 bg-white border-b border-gray-100 flex items-center gap-3 px-4 py-4">
        <button onClick={onClose} className="text-gray-500">
          <ArrowLeft size={22} />
        </button>
        <h1 className="font-bold text-gray-900">{product ? "Mahsulotni tahrirlash" : "Yangi mahsulot"}</h1>
      </header>

      <form onSubmit={handleSubmit} className="p-4 pb-10 flex flex-col gap-4">
        {error && <p className="text-sm text-red-600 bg-red-50 rounded-lg px-3 py-2">{error}</p>}

        <div className="flex items-center gap-4">
          {form.image ? (
            <SmartImage
              src={imageUrl(form.image)}
              alt="preview"
              className="w-20 h-20 rounded-xl object-cover border border-gray-100"
            />
          ) : (
            <img src="/logo.png" alt="preview" className="w-20 h-20 rounded-xl object-cover border border-gray-100" />
          )}
          <label className="text-sm text-primary font-medium">
            {uploading ? "Yuklanmoqda..." : "Rasm tanlash"}
            <input type="file" accept="image/*" className="hidden" onChange={handleImageChange} />
          </label>
        </div>

        <div>
          <label className="text-sm text-gray-600">Nomi</label>
          <input
            required
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
            className="w-full mt-1 border border-gray-200 rounded-xl px-3 py-2.5 text-sm outline-none focus:border-primary"
          />
        </div>

        <div>
          <label className="text-sm text-gray-600">Tavsif</label>
          <textarea
            value={form.description}
            onChange={(e) => setForm({ ...form, description: e.target.value })}
            rows={2}
            className="w-full mt-1 border border-gray-200 rounded-xl px-3 py-2.5 text-sm outline-none focus:border-primary"
          />
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="text-sm text-gray-600">Narxi ($)</label>
            <input
              required
              type="number"
              value={form.price}
              onChange={(e) => setForm({ ...form, price: e.target.value })}
              className="w-full mt-1 border border-gray-200 rounded-xl px-3 py-2.5 text-sm outline-none focus:border-primary"
            />
          </div>
          <div>
            <label className="text-sm text-gray-600">Eski narx ($)</label>
            <input
              type="number"
              value={form.oldPrice}
              onChange={(e) => setForm({ ...form, oldPrice: e.target.value })}
              className="w-full mt-1 border border-gray-200 rounded-xl px-3 py-2.5 text-sm outline-none focus:border-primary"
            />
          </div>
        </div>

        <div>
          <label className="text-sm text-gray-600">Kategoriya</label>
          <select
            value={form.categoryId}
            onChange={(e) => setForm({ ...form, categoryId: e.target.value })}
            className="w-full mt-1 border border-gray-200 rounded-xl px-3 py-2.5 text-sm outline-none focus:border-primary"
          >
            <option value="">Tanlanmagan</option>
            {categories.map((cat) => (
              <option key={cat.id} value={cat.id}>
                {cat.emoji} {cat.name}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="text-sm text-gray-600">Ombordagi soni</label>
          <input
            type="number"
            value={form.stock}
            onChange={(e) => setForm({ ...form, stock: e.target.value })}
            className="w-full mt-1 border border-gray-200 rounded-xl px-3 py-2.5 text-sm outline-none focus:border-primary"
          />
        </div>

        <div>
          <label className="text-sm text-gray-600">Xususiyatlari (har birini yangi qatordan)</label>
          <textarea
            value={form.specs}
            onChange={(e) => setForm({ ...form, specs: e.target.value })}
            rows={3}
            className="w-full mt-1 border border-gray-200 rounded-xl px-3 py-2.5 text-sm outline-none focus:border-primary"
          />
        </div>

        <label className="flex items-center gap-2 text-sm text-gray-600">
          <input
            type="checkbox"
            checked={form.isAddon}
            onChange={(e) => setForm({ ...form, isAddon: e.target.checked })}
          />
          Savatchada qo'shimcha taklif (addon) sifatida ko'rsatilsin
        </label>

        {!form.isAddon && (
          <div className="border-t border-gray-100 pt-4 flex flex-col gap-4">
            <p className="text-sm font-semibold text-gray-900">
              "Komputer tanlash" testi uchun javoblar
              <span className="block text-xs font-normal text-gray-400 mt-0.5">
                Bu mahsulot mijozlarga qachon tavsiya qilinishini belgilaydi — hammasini to'ldiring
              </span>
            </p>

            {QUESTIONS.map((q) => (
              <div key={q.key}>
                <label className="text-sm text-gray-600">{q.question}</label>
                <select
                  required
                  value={form[`quiz${q.key.charAt(0).toUpperCase()}${q.key.slice(1)}`]}
                  onChange={(e) =>
                    setForm({
                      ...form,
                      [`quiz${q.key.charAt(0).toUpperCase()}${q.key.slice(1)}`]: e.target.value,
                    })
                  }
                  className="w-full mt-1 border border-gray-200 rounded-xl px-3 py-2.5 text-sm outline-none focus:border-primary"
                >
                  <option value="">Tanlanmagan</option>
                  {q.options.map((opt) => (
                    <option key={opt.value} value={opt.value}>
                      {opt.label}
                    </option>
                  ))}
                </select>
              </div>
            ))}
          </div>
        )}

        <button
          type="submit"
          disabled={saving || uploading}
          className="w-full bg-primary text-white font-semibold py-3.5 rounded-2xl disabled:opacity-60 mt-2"
        >
          {saving ? "Saqlanmoqda..." : "Saqlash"}
        </button>
      </form>
    </div>
  );
}
