const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000/api";

async function request(path, options = {}) {
  const res = await fetch(`${API_URL}${path}`, {
    headers: { "Content-Type": "application/json", "ngrok-skip-browser-warning": "true" },
    ...options,
  });

  if (!res.ok) {
    const error = await res.json().catch(() => ({ message: "Xatolik yuz berdi" }));
    throw new Error(error.message || "Xatolik yuz berdi");
  }

  return res.json();
}

export const api = {
  getCategories: () => request("/categories"),
  getProducts: (categoryId) => request(`/products${categoryId ? `?categoryId=${categoryId}` : ""}`),
  getAddons: () => request("/products?addonsOnly=true"),
  getProduct: (id) => request(`/products/${id}`),
  createOrder: (payload) =>
    request("/orders", { method: "POST", body: JSON.stringify(payload) }),
  getMyOrders: (telegramId) => request(`/orders/mine?telegramId=${telegramId}`),
  getStories: () => request("/stories"),
  telegramLogin: (initData) =>
    request("/auth/telegram-login", { method: "POST", body: JSON.stringify({ initData }) }),
};

export function imageUrl(path) {
  if (!path) return "/logo.png";
  if (path.startsWith("http")) return path;
  const base = API_URL.replace("/api", "");
  return `${base}${path}`;
}
