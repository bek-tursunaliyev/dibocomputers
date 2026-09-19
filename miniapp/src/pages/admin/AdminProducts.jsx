import { useCallback, useEffect, useMemo, useState } from "react";
import { Plus, Pencil, Trash2, Search, X } from "lucide-react";
import { api, imageUrl } from "../../lib/api";
import { formatPrice } from "../../lib/format";
import { useAdmin } from "../../context/AdminContext";
import SmartImage from "../../components/SmartImage";
import AdminProductForm from "./AdminProductForm";

export default function AdminProducts() {
  const { adminToken } = useAdmin();
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [formProduct, setFormProduct] = useState(undefined);
  const [error, setError] = useState("");
  const [query, setQuery] = useState("");

  const loadData = useCallback(() => {
    Promise.all([api.getProducts(), api.getCategories()])
      .then(([p, c]) => {
        setProducts(p);
        setCategories(c);
      })
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    loadData();
  }, [loadData]);

  const visibleProducts = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return products;
    return products.filter((p) => p.name.toLowerCase().includes(q));
  }, [products, query]);

  async function handleDelete(id) {
    if (!confirm("Rostdan ham ushbu mahsulotni o'chirmoqchimisiz?")) return;
    setError("");
    try {
      await api.deleteProduct(adminToken, id);
      loadData();
    } catch (err) {
      setError(err.message);
    }
  }

  function handleSaved() {
    setFormProduct(undefined);
    loadData();
  }

  if (loading) return <p className="text-center text-gray-400 mt-10">Yuklanmoqda...</p>;

  return (
    <div>
      {error && <p className="text-sm text-red-600 bg-red-50 rounded-lg px-3 py-2 mb-3">{error}</p>}

      <button
        onClick={() => setFormProduct(null)}
        className="w-full flex items-center justify-center gap-2 bg-primary text-white font-medium py-3 rounded-2xl mb-3"
      >
        <Plus size={18} />
        Yangi mahsulot qo'shish
      </button>

      <div className="relative mb-4">
        <Search size={17} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
        <input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Mahsulot qidirish..."
          className="w-full bg-white rounded-full pl-10 pr-9 py-2.5 text-sm outline-none border border-gray-200 focus:border-primary"
        />
        {query && (
          <button
            onClick={() => setQuery("")}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400"
          >
            <X size={16} />
          </button>
        )}
      </div>

      {visibleProducts.length === 0 ? (
        <p className="text-center text-gray-400 mt-10">
          {products.length === 0 ? "Hozircha mahsulot yo'q" : "Hech narsa topilmadi"}
        </p>
      ) : (
        <div className="flex flex-col gap-3">
          {visibleProducts.map((product) => (
            <div key={product.id} className="bg-white rounded-2xl p-3 flex gap-3 items-center">
              <SmartImage
                src={imageUrl(product.image)}
                alt={product.name}
                className="w-14 h-14 rounded-xl object-cover shrink-0"
              />
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-gray-800 truncate">{product.name}</p>
                <p className="text-xs text-gray-400">
                  {product.category ? product.category.name : "Kategoriyasiz"} · Ombor: {product.stock}
                </p>
                <p className="text-sm font-bold text-primary">{formatPrice(product.price)}</p>
              </div>
              <div className="flex flex-col gap-2">
                <button onClick={() => setFormProduct(product)} className="text-primary p-1.5">
                  <Pencil size={16} />
                </button>
                <button onClick={() => handleDelete(product.id)} className="text-red-500 p-1.5">
                  <Trash2 size={16} />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {formProduct !== undefined && (
        <AdminProductForm
          product={formProduct}
          categories={categories}
          onClose={() => setFormProduct(undefined)}
          onSaved={handleSaved}
        />
      )}
    </div>
  );
}
