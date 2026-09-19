import { useEffect, useState } from "react";
import { ScrollText, MapPin, Phone, ArrowRight } from "lucide-react";
import { api } from "../lib/api";
import { getTelegramUser } from "../lib/telegram";
import { formatPrice } from "../lib/format";
import { BRAND } from "../config";

const STATUS_LABEL = {
  PENDING: { text: "Kutilmoqda", color: "text-yellow-600 bg-yellow-50" },
  DELIVERED: { text: "Yetkazildi", color: "text-green-600 bg-green-50" },
};

export default function Profile() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const user = getTelegramUser();

  useEffect(() => {
    api
      .getMyOrders(user.id)
      .then(setOrders)
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="pb-20">
      <header className="px-4 pt-5 pb-3 flex items-center gap-3">
        <div className="w-14 h-14 rounded-full bg-primary text-white flex items-center justify-center text-xl font-bold">
          {user.first_name?.[0] || "M"}
        </div>
        <div>
          <p className="font-semibold text-gray-900">
            {user.first_name} {user.last_name}
          </p>
          <p className="text-sm text-gray-500">@{user.username || "mehmon"}</p>
        </div>
      </header>

      <div className="px-4">
        <h2 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
          <ScrollText size={18} className="text-primary" />
          Mening buyurtmalarim
        </h2>

        {loading ? (
          <p className="text-gray-400 text-center mt-6">Yuklanmoqda...</p>
        ) : orders.length === 0 ? (
          <p className="text-gray-400 text-center mt-6">Sizda hali buyurtmalar yo'q</p>
        ) : (
          <div className="flex flex-col gap-3">
            {orders.map((order) => (
              <div key={order.id} className="bg-white rounded-2xl p-4">
                <div className="flex justify-between items-center mb-2">
                  <span className="text-sm text-gray-500">
                    {new Date(order.createdAt).toLocaleDateString("uz-UZ")}
                  </span>
                  <span
                    className={`text-xs font-medium px-2.5 py-1 rounded-full ${STATUS_LABEL[order.status].color}`}
                  >
                    {STATUS_LABEL[order.status].text}
                  </span>
                </div>
                <ul className="text-sm text-gray-700 mb-2">
                  {order.items.map((item) => (
                    <li key={item.id}>
                      {item.name} x{item.quantity}
                    </li>
                  ))}
                </ul>
                <p className="font-bold text-primary text-sm">{formatPrice(order.totalAmount)}</p>
              </div>
            ))}
          </div>
        )}

        <div className="bg-white rounded-2xl p-4 mt-6 flex flex-col gap-2">
          <p className="font-semibold text-gray-900 flex items-center gap-2">
            <MapPin size={16} className="text-primary" />
            {BRAND.name}
          </p>
          <p className="text-sm text-gray-500 pl-6">{BRAND.address}</p>
          {BRAND.phones.map((phone) => (
            <p key={phone} className="text-sm text-gray-500 flex items-center gap-2">
              <Phone size={14} className="text-primary" />
              {phone}
            </p>
          ))}
          <a
            href={BRAND.telegramChannel}
            target="_blank"
            rel="noreferrer"
            className="text-sm text-primary mt-1 flex items-center gap-1"
          >
            Telegram kanalimiz
            <ArrowRight size={14} />
          </a>
        </div>
      </div>
    </div>
  );
}
