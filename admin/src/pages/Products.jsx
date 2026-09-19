import { useEffect, useState, useCallback } from "react";
import { api, imageUrl } from "../lib/api";
import { formatPrice } from "../lib/format";
import ProductModal from "../components/ProductModal";

export default function Products() {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modalProduct, setModalProduct] = useState(undefined);

  const loadData = useCallback(() => {
    Promise.all([api.getProducts(), api.getCategories()]).then(([p, c]) => {
      setProducts(p);
      setCategories(c);
      setLoading(false);
    });
  }, []);

  useEffect(() => {
    loadData();
  }, [loadData]);

  async function handleDelete(id) {
    if (!confirm("Rostdan ham ushbu mahsulotni o'chirmoqchimisiz?")) return;
    await api.deleteProduct(id);
    loadData();
  }

  function handleSaved() {
    setModalProduct(undefined);
    loadData();
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Mahsulotlar</h1>
        <button
          onClick={() => setModalProduct(null)}
          className="bg-primary text-white text-sm font-medium px-4 py-2.5 rounded-xl"
        >
          + Yangi mahsulot
        </button>
      </div>

      <div className="bg-white rounded-2xl overflow-hidden shadow-sm">
        <table className="w-full text-sm">
          <thead className="bg-gray-50 text-gray-500 text-left">
            <tr>
              <th className="px-4 py-3">Rasm</th>
              <th className="px-4 py-3">Nomi</th>
              <th className="px-4 py-3">Kategoriya</th>
              <th className="px-4 py-3">Narxi</th>
              <th className="px-4 py-3">Ombor</th>
              <th className="px-4 py-3">Amallar</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan={6} className="text-center py-10 text-gray-400">
                  Yuklanmoqda...
                </td>
              </tr>
            ) : (
              products.map((product) => (
                <tr key={product.id} className="border-t border-gray-100">
                  <td className="px-4 py-3">
                    <img
                      src={imageUrl(product.image)}
                      alt={product.name}
                      className="w-12 h-12 rounded-lg object-cover"
                    />
                  </td>
                  <td className="px-4 py-3 font-medium text-gray-800">
                    {product.name}
                    {product.isAddon && (
                      <span className="ml-2 text-[10px] bg-blue-50 text-blue-600 px-2 py-0.5 rounded-full">
                        addon
                      </span>
                    )}
                  </td>
                  <td className="px-4 py-3 text-gray-600">
                    {product.category ? `${product.category.emoji} ${product.category.name}` : "—"}
                  </td>
                  <td className="px-4 py-3 font-semibold text-gray-900">{formatPrice(product.price)}</td>
                  <td className="px-4 py-3 text-gray-600">{product.stock}</td>
                  <td className="px-4 py-3">
                    <div className="flex gap-2">
                      <button
                        onClick={() => setModalProduct(product)}
                        className="text-primary text-xs font-medium"
                      >
                        Tahrirlash
                      </button>
                      <button
                        onClick={() => handleDelete(product.id)}
                        className="text-red-500 text-xs font-medium"
                      >
                        O'chirish
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {modalProduct !== undefined && (
        <ProductModal
          product={modalProduct}
          categories={categories}
          onClose={() => setModalProduct(undefined)}
          onSaved={handleSaved}
        />
      )}
    </div>
  );
}
