import { useState } from "react";
import { CircleCheckBig } from "lucide-react";
import { formatPrice } from "../lib/format";
import { imageUrl } from "../lib/api";
import { useCart } from "../context/CartContext";
import { hapticFeedback } from "../lib/telegram";

export default function ProductSheet({ product, onClose }) {
  const [quantity, setQuantity] = useState(1);
  const { addItem } = useCart();

  if (!product) return null;

  function handleAdd() {
    addItem(product, quantity);
    hapticFeedback("medium");
    onClose();
  }

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center">
      <div className="absolute inset-0 bg-black/50" onClick={onClose} />
      <div className="relative bg-white w-full max-h-[88vh] rounded-t-3xl overflow-y-auto animate-slide-up">
        <div className="w-10 h-1.5 bg-gray-300 rounded-full mx-auto mt-3" />

        <div className="aspect-[4/3] bg-gray-100 mt-3">
          <img src={imageUrl(product.image)} alt={product.name} className="w-full h-full object-cover" />
        </div>

        <div className="p-5 pb-32">
          <h2 className="text-xl font-bold text-gray-900">{product.name}</h2>
          {product.description && <p className="text-sm text-gray-500 mt-1">{product.description}</p>}

          <div className="flex items-center gap-2 mt-3">
            {product.oldPrice && (
              <span className="text-sm text-gray-400 line-through">{formatPrice(product.oldPrice)}</span>
            )}
            <span className="text-2xl font-bold text-primary">{formatPrice(product.price)}</span>
          </div>

          {product.specs && product.specs.length > 0 && (
            <ul className="mt-4 space-y-2">
              {product.specs.map((spec, idx) => (
                <li key={idx} className="flex items-start gap-2 text-sm text-gray-700">
                  <CircleCheckBig size={16} className="text-primary mt-0.5 shrink-0" strokeWidth={2} />
                  {spec}
                </li>
              ))}
            </ul>
          )}

          <div className="flex items-center gap-4 mt-6">
            <span className="text-sm text-gray-600">Miqdori:</span>
            <div className="flex items-center border border-gray-200 rounded-full">
              <button
                onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                className="w-9 h-9 flex items-center justify-center text-lg text-gray-600"
              >
                −
              </button>
              <span className="w-8 text-center font-medium">{quantity}</span>
              <button
                onClick={() => setQuantity((q) => q + 1)}
                className="w-9 h-9 flex items-center justify-center text-lg text-gray-600"
              >
                +
              </button>
            </div>
          </div>
        </div>

        <div className="fixed bottom-0 left-0 right-0 p-4 bg-white border-t border-gray-100 safe-bottom">
          <button
            onClick={handleAdd}
            className="w-full bg-primary text-white font-semibold py-3.5 rounded-2xl flex items-center justify-center gap-2 active:opacity-90"
          >
            Savatchaga qo'shish — {formatPrice(product.price * quantity)}
          </button>
        </div>
      </div>
    </div>
  );
}
