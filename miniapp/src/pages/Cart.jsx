import { useEffect, useState } from "react";
import { CircleCheckBig } from "lucide-react";
import { useCart } from "../context/CartContext";
import { formatPrice } from "../lib/format";
import { imageUrl, api } from "../lib/api";
import { getInitData, getTelegramUser, closeTelegramApp, hapticFeedback } from "../lib/telegram";
import SmartImage from "../components/SmartImage";

export default function Cart() {
  const { items, updateQuantity, removeItem, addItem, total, clearCart } = useCart();
  const [addon, setAddon] = useState(null);
  const [addonChecked, setAddonChecked] = useState(false);
  const [location, setLocation] = useState("");
  const [phone, setPhone] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    api.getAddons().then((addons) => {
      if (addons.length > 0) setAddon(addons[0]);
    });
  }, []);

  function toggleAddon(checked) {
    setAddonChecked(checked);
    if (!addon) return;
    if (checked) {
      addItem(addon, 1);
    } else {
      removeItem(addon.id);
    }
  }

  async function handleConfirm() {
    if (!location.trim() || !phone.trim()) {
      alert("Iltimos, manzil va telefon raqamingizni kiriting");
      return;
    }
    setSubmitting(true);
    try {
      const user = getTelegramUser();
      await api.createOrder({
        initData: getInitData(),
        items: items.map((i) => ({ productId: i.productId, name: i.name, price: i.price, quantity: i.quantity })),
        location,
        phone,
      });
      hapticFeedback("heavy");
      clearCart();
      setSuccess(true);
      setTimeout(() => closeTelegramApp(), 2000);
    } catch (err) {
      alert(err.message || "Xatolik yuz berdi");
    } finally {
      setSubmitting(false);
    }
  }

  if (success) {
    return (
      <div className="h-screen flex flex-col items-center justify-center px-8 text-center gap-4">
        <div className="w-20 h-20 rounded-full bg-green-100 flex items-center justify-center">
          <CircleCheckBig size={44} className="text-green-500" strokeWidth={2} />
        </div>
        <h2 className="text-xl font-bold text-gray-900">Buyurtmangiz qabul qilindi!</h2>
        <p className="text-gray-500">Admin tez orada siz bilan bog'lanadi. Ilova avtomatik yopiladi...</p>
      </div>
    );
  }

  return (
    <div className="pb-40">
      <header className="px-4 pt-5 pb-3">
        <h1 className="text-xl font-bold text-gray-900">Savatcha</h1>
      </header>

      {items.length === 0 ? (
        <p className="text-center text-gray-400 mt-10">Savatchangiz bo'sh</p>
      ) : (
        <div className="px-4 flex flex-col gap-3">
          {items.map((item) => (
            <div key={item.productId} className="bg-white rounded-2xl p-3 flex gap-3 items-center">
              <SmartImage src={imageUrl(item.image)} className="w-16 h-16 rounded-xl object-cover" alt={item.name} />
              <div className="flex-1">
                <p className="text-sm font-medium text-gray-800 line-clamp-2">{item.name}</p>
                <p className="text-primary font-bold text-sm mt-1">{formatPrice(item.price)}</p>
              </div>
              <div className="flex items-center border border-gray-200 rounded-full">
                <button
                  onClick={() => updateQuantity(item.productId, item.quantity - 1)}
                  className="w-8 h-8 flex items-center justify-center text-gray-600"
                >
                  −
                </button>
                <span className="w-6 text-center text-sm">{item.quantity}</span>
                <button
                  onClick={() => updateQuantity(item.productId, item.quantity + 1)}
                  className="w-8 h-8 flex items-center justify-center text-gray-600"
                >
                  +
                </button>
              </div>
            </div>
          ))}

          {addon && (
            <div className="bg-white rounded-2xl p-4 flex items-center gap-3">
              <div className="flex-1">
                <p className="text-sm text-gray-700">
                  Bunga qo'shimcha ravishda <b>{addon.name}</b>ni {formatPrice(addon.price)}ga qo'shasizmi?
                </p>
              </div>
              <button
                onClick={() => toggleAddon(!addonChecked)}
                className={`w-12 h-7 rounded-full flex items-center px-1 transition-colors ${
                  addonChecked ? "bg-primary justify-end" : "bg-gray-200 justify-start"
                }`}
              >
                <span className="w-5 h-5 bg-white rounded-full block" />
              </button>
            </div>
          )}

          <div className="bg-white rounded-2xl p-4 flex flex-col gap-3">
            <div>
              <label className="text-sm text-gray-600">Yetkazib berish manzili</label>
              <input
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                placeholder="Shahar, ko'cha, uy raqami"
                className="w-full mt-1 border border-gray-200 rounded-xl px-3 py-2.5 text-sm outline-none focus:border-primary"
              />
            </div>
            <div>
              <label className="text-sm text-gray-600">Telefon raqamingiz</label>
              <input
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="+998 90 123 45 67"
                className="w-full mt-1 border border-gray-200 rounded-xl px-3 py-2.5 text-sm outline-none focus:border-primary"
              />
            </div>
          </div>
        </div>
      )}

      {items.length > 0 && (
        <div className="fixed bottom-16 left-0 right-0 p-4 bg-white border-t border-gray-100 safe-bottom">
          <div className="flex justify-between mb-3 text-sm text-gray-600">
            <span>Jami:</span>
            <span className="font-bold text-gray-900">{formatPrice(total)}</span>
          </div>
          <button
            onClick={handleConfirm}
            disabled={submitting}
            className="w-full bg-primary text-white font-semibold py-3.5 rounded-2xl disabled:opacity-60"
          >
            {submitting ? "Yuborilmoqda..." : "Buyurtmani tasdiqlash"}
          </button>
        </div>
      )}
    </div>
  );
}
