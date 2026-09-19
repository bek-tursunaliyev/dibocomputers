import { useCallback, useEffect, useState } from "react";
import { Plus, Pencil, Trash2 } from "lucide-react";
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
        className="w-full flex items-center justify-center gap-2 bg-primary text-white font-medium py-3 rounded-2xl mb-4"
      >
        <Plus size={18} />
        Yangi mahsulot qo'shish
      </button>

      {products.length === 0 ? (
        <p className="text-center text-gray-400 mt-10">Hozircha mahsulot yo'q</p>
      ) : (
        <div className="flex flex-col gap-3">
          {products.map((product) => (
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
