import { useEffect, useState, useCallback } from "react";
import { api } from "../lib/api";
import { formatPrice } from "../lib/format";

const STATUS_OPTIONS = [
  { value: "PENDING", label: "Kutilmoqda", color: "bg-yellow-50 text-yellow-700" },
  { value: "DELIVERED", label: "Yetkazildi", color: "bg-green-50 text-green-700" },
];

export default function Orders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  const loadOrders = useCallback(() => {
    api
      .getOrders()
      .then(setOrders)
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    loadOrders();
    const interval = setInterval(loadOrders, 8000);
    return () => clearInterval(interval);
  }, [loadOrders]);

  async function handleStatusChange(id, status) {
    setOrders((prev) => prev.map((o) => (o.id === id ? { ...o, status } : o)));
    await api.updateOrderStatus(id, status);
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Buyurtmalar</h1>
        <button onClick={loadOrders} className="text-sm text-primary font-medium">
          🔄 Yangilash
        </button>
      </div>

      <div className="bg-white rounded-2xl overflow-hidden shadow-sm">
        <table className="w-full text-sm">
          <thead className="bg-gray-50 text-gray-500 text-left">
            <tr>
              <th className="px-4 py-3">№</th>
              <th className="px-4 py-3">Mijoz</th>
              <th className="px-4 py-3">Telefon</th>
              <th className="px-4 py-3">Mahsulotlar</th>
              <th className="px-4 py-3">Manzil</th>
              <th className="px-4 py-3">Jami summa</th>
              <th className="px-4 py-3">Sana</th>
              <th className="px-4 py-3">Holati</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan={8} className="text-center py-10 text-gray-400">
                  Yuklanmoqda...
                </td>
              </tr>
            ) : orders.length === 0 ? (
              <tr>
                <td colSpan={8} className="text-center py-10 text-gray-400">
                  Hozircha buyurtmalar yo'q
                </td>
              </tr>
            ) : (
              orders.map((order) => (
                <tr key={order.id} className="border-t border-gray-100">
                  <td className="px-4 py-3 text-gray-500">#{order.id}</td>
                  <td className="px-4 py-3 font-medium text-gray-800">
                    {order.user?.firstName} {order.user?.lastName}
                    {order.user?.username && (
                      <div className="text-xs text-gray-400">@{order.user.username}</div>
                    )}
                  </td>
                  <td className="px-4 py-3 text-gray-600">{order.phone}</td>
                  <td className="px-4 py-3 text-gray-600">
                    <ul>
                      {order.items.map((item) => (
                        <li key={item.id}>
                          {item.name} x{item.quantity}
                        </li>
                      ))}
                    </ul>
                  </td>
                  <td className="px-4 py-3 text-gray-600 max-w-[180px]">{order.location}</td>
                  <td className="px-4 py-3 font-semibold text-gray-900">{formatPrice(order.totalAmount)}</td>
                  <td className="px-4 py-3 text-gray-500">
                    {new Date(order.createdAt).toLocaleString("uz-UZ")}
                  </td>
                  <td className="px-4 py-3">
                    <select
                      value={order.status}
                      onChange={(e) => handleStatusChange(order.id, e.target.value)}
                      className={`text-xs font-medium rounded-full px-3 py-1.5 border-0 outline-none ${
                        STATUS_OPTIONS.find((s) => s.value === order.status)?.color
                      }`}
                    >
                      {STATUS_OPTIONS.map((opt) => (
                        <option key={opt.value} value={opt.value}>
                          {opt.label}
                        </option>
                      ))}
                    </select>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
