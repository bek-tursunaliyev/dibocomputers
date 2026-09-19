import { useCallback, useEffect, useState } from "react";
import { api } from "../../lib/api";
import { formatPrice } from "../../lib/format";
import { useAdmin } from "../../context/AdminContext";

const STATUS_OPTIONS = [
  { value: "PENDING", label: "Kutilmoqda", color: "bg-yellow-50 text-yellow-700" },
  { value: "DELIVERED", label: "Yetkazildi", color: "bg-green-50 text-green-700" },
];

export default function AdminOrders() {
  const { adminToken } = useAdmin();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  const loadOrders = useCallback(() => {
    api
      .getOrdersAdmin(adminToken)
      .then(setOrders)
      .finally(() => setLoading(false));
  }, [adminToken]);

  useEffect(() => {
    loadOrders();
    const interval = setInterval(loadOrders, 10000);
    return () => clearInterval(interval);
  }, [loadOrders]);

  async function handleStatusChange(id, status) {
    setOrders((prev) => prev.map((o) => (o.id === id ? { ...o, status } : o)));
    await api.updateOrderStatus(adminToken, id, status);
  }

  if (loading) return <p className="text-center text-gray-400 mt-10">Yuklanmoqda...</p>;

  if (orders.length === 0) {
    return <p className="text-center text-gray-400 mt-10">Hozircha buyurtmalar yo'q</p>;
  }

  return (
    <div className="flex flex-col gap-3">
      {orders.map((order) => (
        <div key={order.id} className="bg-white rounded-2xl p-4">
          <div className="flex justify-between items-start mb-2">
            <div>
              <p className="font-medium text-gray-800">
                {order.user?.firstName} {order.user?.lastName}
              </p>
              <p className="text-xs text-gray-400">{order.phone}</p>
            </div>
            <select
              value={order.status}
              onChange={(e) => handleStatusChange(order.id, e.target.value)}
              className={`text-xs font-medium rounded-full px-2.5 py-1 border-0 outline-none ${
                STATUS_OPTIONS.find((s) => s.value === order.status)?.color
              }`}
            >
              {STATUS_OPTIONS.map((opt) => (
                <option key={opt.value} value={opt.value}>
                  {opt.label}
                </option>
              ))}
            </select>
          </div>

          <ul className="text-sm text-gray-600 mb-2">
            {order.items.map((item) => (
              <li key={item.id}>
                {item.name} x{item.quantity}
              </li>
            ))}
          </ul>

          <p className="text-xs text-gray-400 mb-1">{order.location}</p>
          <div className="flex justify-between items-center">
            <span className="text-xs text-gray-400">{new Date(order.createdAt).toLocaleString("uz-UZ")}</span>
            <span className="font-bold text-primary">{formatPrice(order.totalAmount)}</span>
          </div>
        </div>
      ))}
    </div>
  );
}
