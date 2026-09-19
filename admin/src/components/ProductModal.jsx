import { useEffect, useState } from "react";
import { api, imageUrl } from "../lib/api";

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
};

export default function ProductModal({ product, categories, onClose, onSaved }) {
  const [form, setForm] = useState(emptyForm);
  const [uploading, setUploading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (product) {
      setForm({
        name: product.name || "",
        description: product.description || "",
        price: product.price || "",
        oldPrice: product.oldPrice || "",
        image: product.image || "",
        categoryId: product.categoryId || "",
        stock: product.stock || "",
        isAddon: product.isAddon || false,
        specs: (product.specs || []).join("\n"),
      });
    } else {
      setForm(emptyForm);
    }
  }, [product]);

  async function handleImageChange(e) {
    const file = e.target.files[0];
    if (!file) return;
    setUploading(true);
    try {
      const { url } = await api.uploadImage(file);
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
      };

      if (product) {
        await api.updateProduct(product.id, payload);
      } else {
        await api.createProduct(payload);
      }
      onSaved();
    } catch (err) {
      setError(err.message);
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4">
      <form onSubmit={handleSubmit} className="bg-white rounded-2xl w-full max-w-lg p-6 max-h-[90vh] overflow-y-auto">
        <h2 className="text-lg font-bold text-gray-900 mb-4">
          {product ? "Mahsulotni tahrirlash" : "Yangi mahsulot qo'shish"}
        </h2>

        {error && <p className="text-sm text-red-600 bg-red-50 rounded-lg px-3 py-2 mb-4">{error}</p>}

        <div className="flex items-center gap-4 mb-4">
          <img
            src={form.image ? imageUrl(form.image) : "/logo.png"}
            alt="preview"
            className="w-20 h-20 rounded-xl object-cover border border-gray-100"
          />
          <label className="text-sm text-primary font-medium cursor-pointer">
            {uploading ? "Yuklanmoqda..." : "Rasm tanlash"}
            <input type="file" accept="image/*" className="hidden" onChange={handleImageChange} />
          </label>
        </div>

        <div className="grid grid-cols-2 gap-3 mb-3">
          <div className="col-span-2">
            <label className="text-sm text-gray-600">Nomi</label>
            <input
              required
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              className="w-full mt-1 border border-gray-200 rounded-xl px-3 py-2 text-sm outline-none focus:border-primary"
            />
          </div>

          <div className="col-span-2">
            <label className="text-sm text-gray-600">Tavsif</label>
            <textarea
              value={form.description}
              onChange={(e) => setForm({ ...form, description: e.target.value })}
              rows={2}
              className="w-full mt-1 border border-gray-200 rounded-xl px-3 py-2 text-sm outline-none focus:border-primary"
            />
          </div>

          <div>
            <label className="text-sm text-gray-600">Narxi (so'm)</label>
            <input
              required
              type="number"
              value={form.price}
              onChange={(e) => setForm({ ...form, price: e.target.value })}
              className="w-full mt-1 border border-gray-200 rounded-xl px-3 py-2 text-sm outline-none focus:border-primary"
            />
          </div>

          <div>
            <label className="text-sm text-gray-600">Eski narx (ixtiyoriy)</label>
            <input
              type="number"
              value={form.oldPrice}
              onChange={(e) => setForm({ ...form, oldPrice: e.target.value })}
              className="w-full mt-1 border border-gray-200 rounded-xl px-3 py-2 text-sm outline-none focus:border-primary"
            />
          </div>

          <div>
            <label className="text-sm text-gray-600">Kategoriya</label>
            <select
              value={form.categoryId}
              onChange={(e) => setForm({ ...form, categoryId: e.target.value })}
              className="w-full mt-1 border border-gray-200 rounded-xl px-3 py-2 text-sm outline-none focus:border-primary"
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
              className="w-full mt-1 border border-gray-200 rounded-xl px-3 py-2 text-sm outline-none focus:border-primary"
            />
          </div>

          <div className="col-span-2">
            <label className="text-sm text-gray-600">Xususiyatlari (har birini yangi qatordan yozing)</label>
            <textarea
              value={form.specs}
              onChange={(e) => setForm({ ...form, specs: e.target.value })}
              rows={3}
              className="w-full mt-1 border border-gray-200 rounded-xl px-3 py-2 text-sm outline-none focus:border-primary"
            />
          </div>

          <label className="col-span-2 flex items-center gap-2 text-sm text-gray-600">
            <input
              type="checkbox"
              checked={form.isAddon}
              onChange={(e) => setForm({ ...form, isAddon: e.target.checked })}
            />
            Bu mahsulot savatchada qo'shimcha taklif (addon) sifatida ko'rsatilsin
          </label>
        </div>

        <div className="flex gap-3 mt-5">
          <button type="button" onClick={onClose} className="flex-1 py-2.5 rounded-xl border border-gray-200 text-gray-600 text-sm font-medium">
            Bekor qilish
          </button>
          <button
            type="submit"
            disabled={saving}
            className="flex-1 py-2.5 rounded-xl bg-primary text-white text-sm font-medium disabled:opacity-60"
          >
            {saving ? "Saqlanmoqda..." : "Saqlash"}
          </button>
        </div>
      </form>
    </div>
  );
}
