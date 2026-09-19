import { useEffect, useMemo, useState } from "react";
import { Search, X } from "lucide-react";
import { api } from "../lib/api";
import ProductCard from "../components/ProductCard";
import ProductSheet from "../components/ProductSheet";
import { getCategoryIcon } from "../lib/categoryIcons";

export default function Catalog() {
  const [categories, setCategories] = useState([]);
  const [products, setProducts] = useState([]);
  const [activeCategory, setActiveCategory] = useState(null);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [query, setQuery] = useState("");

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

  const visibleProducts = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return products;
    return products.filter((p) => p.name.toLowerCase().includes(q));
  }, [products, query]);

  return (
    <div className="pb-20">
      <header className="px-4 pt-5 pb-3">
        <h1 className="text-xl font-bold text-gray-900">Katalog</h1>
      </header>

      <div className="px-4 pb-3">
        <div className="relative">
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
      </div>

      <div className="flex gap-2 overflow-x-auto no-scrollbar px-4 pb-3">
        <button
          onClick={() => setActiveCategory(null)}
          className={`shrink-0 px-4 py-2 rounded-full text-sm font-medium ${
            activeCategory === null ? "bg-primary text-white" : "bg-white text-gray-600"
          }`}
        >
          Barchasi
        </button>
        {categories.map((cat) => {
          const Icon = getCategoryIcon(cat.name);
          return (
            <button
              key={cat.id}
              onClick={() => setActiveCategory(cat.id)}
              className={`shrink-0 flex items-center gap-1.5 px-4 py-2 rounded-full text-sm font-medium ${
                activeCategory === cat.id ? "bg-primary text-white" : "bg-white text-gray-600"
              }`}
            >
              <Icon size={15} strokeWidth={2} />
              {cat.name}
            </button>
          );
        })}
      </div>

      {loading ? (
        <p className="text-center text-gray-400 mt-10">Yuklanmoqda...</p>
      ) : (
        <div className="grid grid-cols-2 gap-3 px-4">
          {visibleProducts.map((product) => (
            <ProductCard key={product.id} product={product} onClick={setSelectedProduct} />
          ))}
          {visibleProducts.length === 0 && (
            <p className="col-span-2 text-center text-gray-400 mt-10">Mahsulot topilmadi</p>
          )}
        </div>
      )}

      <ProductSheet product={selectedProduct} onClose={() => setSelectedProduct(null)} />
    </div>
  );
}
