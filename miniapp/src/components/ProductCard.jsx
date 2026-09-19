import { useState } from "react";
import { Check, ShoppingCart } from "lucide-react";
import { formatPrice } from "../lib/format";
import { imageUrl } from "../lib/api";
import { useCart } from "../context/CartContext";
import { hapticFeedback } from "../lib/telegram";
import SmartImage from "./SmartImage";

export default function ProductCard({ product, onClick }) {
  const { addItem } = useCart();
  const [added, setAdded] = useState(false);

  function handleBuy(e) {
    e.stopPropagation();
    addItem(product, 1);
    hapticFeedback("light");
    setAdded(true);
    setTimeout(() => setAdded(false), 1500);
  }

  return (
    <div
      onClick={() => onClick(product)}
      className="bg-white rounded-2xl overflow-hidden shadow-sm text-left flex flex-col active:scale-[0.98] transition-transform cursor-pointer"
    >
      <div className="aspect-square bg-gray-100">
        <SmartImage src={imageUrl(product.image)} alt={product.name} className="w-full h-full object-cover" />
      </div>
      <div className="p-3 flex flex-col gap-1.5">
        <p className="text-sm font-medium text-gray-800 line-clamp-2">{product.name}</p>
        <div className="flex items-center gap-2">
          {product.oldPrice && (
            <span className="text-xs text-gray-400 line-through">{formatPrice(product.oldPrice)}</span>
          )}
          <span className="text-sm font-bold text-primary">{formatPrice(product.price)}</span>
        </div>

        <button
          onClick={handleBuy}
          disabled={added}
          className={`mt-1 w-full flex items-center justify-center gap-1.5 py-2 rounded-xl text-xs font-semibold transition-colors ${
            added ? "bg-green-500 text-white" : "bg-primary/10 text-primary active:bg-primary/20"
          }`}
        >
          {added ? (
            <>
              <Check size={14} strokeWidth={2.5} />
              Qo'shildi
            </>
          ) : (
            <>
              <ShoppingCart size={14} strokeWidth={2.25} />
              Sotib olish
            </>
          )}
        </button>
      </div>
    </div>
  );
}
