const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000/api";

async function request(path, options = {}) {
  const res = await fetch(`${API_URL}${path}`, {
    ...options,
    headers: {
      "ngrok-skip-browser-warning": "true",
      ...(options.body instanceof FormData ? {} : { "Content-Type": "application/json" }),
      ...options.headers,
    },
  });

  if (!res.ok) {
    const error = await res.json().catch(() => ({ message: "Xatolik yuz berdi" }));
    throw new Error(error.message || "Xatolik yuz berdi");
  }

  return res.json();
}

function authHeaders(token) {
  return { Authorization: `Bearer ${token}` };
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

  // Admin (Telegram orqali aniqlangan token bilan)
  getOrdersAdmin: (token) => request("/orders", { headers: authHeaders(token) }),
  updateOrderStatus: (token, id, status) =>
    request(`/orders/${id}/status`, {
      method: "PATCH",
      headers: authHeaders(token),
      body: JSON.stringify({ status }),
    }),

  createProduct: (token, data) =>
    request("/products", { method: "POST", headers: authHeaders(token), body: JSON.stringify(data) }),
  updateProduct: (token, id, data) =>
    request(`/products/${id}`, { method: "PUT", headers: authHeaders(token), body: JSON.stringify(data) }),
  deleteProduct: (token, id) =>
    request(`/products/${id}`, { method: "DELETE", headers: authHeaders(token) }),

  createStory: (token, data) =>
    request("/stories", { method: "POST", headers: authHeaders(token), body: JSON.stringify(data) }),
  updateStory: (token, id, data) =>
    request(`/stories/${id}`, { method: "PUT", headers: authHeaders(token), body: JSON.stringify(data) }),
  deleteStory: (token, id) =>
    request(`/stories/${id}`, { method: "DELETE", headers: authHeaders(token) }),

  uploadImage: (token, file) => {
    const formData = new FormData();
    formData.append("image", file);
    return request("/upload", { method: "POST", headers: authHeaders(token), body: formData });
  },
};

export function imageUrl(path) {
  if (!path) return "/logo.png";
  if (path.startsWith("http")) return path;
  const base = API_URL.replace("/api", "");
  return `${base}${path}`;
}
