import { useEffect, useState } from "react";
import { api } from "../lib/api";
import ProductCard from "../components/ProductCard";
import ProductSheet from "../components/ProductSheet";

export default function Catalog() {
  const [categories, setCategories] = useState([]);
  const [products, setProducts] = useState([]);
  const [activeCategory, setActiveCategory] = useState(null);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.getCategories().then(setCategories);
  }, []);

  useEffect(() => {
    setLoading(true);
    api
      .getProducts(activeCategory)
      .then((data) => setProducts(data.filter((p) => !p.isAddon)))
      .finally(() => setLoading(false));
  }, [activeCategory]);

  return (
    <div className="pb-20">
      <header className="px-4 pt-5 pb-3">
        <h1 className="text-xl font-bold text-gray-900">Katalog</h1>
      </header>

      <div className="flex gap-2 overflow-x-auto no-scrollbar px-4 pb-3">
        <button
          onClick={() => setActiveCategory(null)}
          className={`shrink-0 px-4 py-2 rounded-full text-sm font-medium ${
            activeCategory === null ? "bg-primary text-white" : "bg-white text-gray-600"
          }`}
        >
          Barchasi
        </button>
        {categories.map((cat) => (
          <button
            key={cat.id}
            onClick={() => setActiveCategory(cat.id)}
            className={`shrink-0 px-4 py-2 rounded-full text-sm font-medium ${
              activeCategory === cat.id ? "bg-primary text-white" : "bg-white text-gray-600"
            }`}
          >
            {cat.emoji} {cat.name}
          </button>
        ))}
      </div>

      {loading ? (
        <p className="text-center text-gray-400 mt-10">Yuklanmoqda...</p>
      ) : (
        <div className="grid grid-cols-2 gap-3 px-4">
          {products.map((product) => (
            <ProductCard key={product.id} product={product} onClick={setSelectedProduct} />
          ))}
          {products.length === 0 && (
            <p className="col-span-2 text-center text-gray-400 mt-10">Mahsulot topilmadi</p>
          )}
        </div>
      )}

      <ProductSheet product={selectedProduct} onClose={() => setSelectedProduct(null)} />
    </div>
  );
}
