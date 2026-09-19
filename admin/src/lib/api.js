const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000/api";

async function request(path, options = {}) {
  const token = localStorage.getItem("admin_token");

  const res = await fetch(`${API_URL}${path}`, {
    ...options,
    headers: {
      ...(options.body instanceof FormData ? {} : { "Content-Type": "application/json" }),
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...options.headers,
    },
  });

  if (res.status === 401) {
    localStorage.removeItem("admin_token");
    window.location.href = "/login";
    throw new Error("Sessiya tugagan");
  }

  if (!res.ok) {
    const error = await res.json().catch(() => ({ message: "Xatolik yuz berdi" }));
    throw new Error(error.message || "Xatolik yuz berdi");
  }

  return res.json();
}

export const api = {
  login: (username, password) =>
    request("/auth/login", { method: "POST", body: JSON.stringify({ username, password }) }),

  getOrders: () => request("/orders"),
  updateOrderStatus: (id, status) =>
    request(`/orders/${id}/status`, { method: "PATCH", body: JSON.stringify({ status }) }),

  getCategories: () => request("/categories"),

  getProducts: () => request("/products"),
  createProduct: (data) => request("/products", { method: "POST", body: JSON.stringify(data) }),
  updateProduct: (id, data) => request(`/products/${id}`, { method: "PUT", body: JSON.stringify(data) }),
  deleteProduct: (id) => request(`/products/${id}`, { method: "DELETE" }),

  getStories: () => request("/stories"),
  createStory: (data) => request("/stories", { method: "POST", body: JSON.stringify(data) }),
  updateStory: (id, data) => request(`/stories/${id}`, { method: "PUT", body: JSON.stringify(data) }),
  deleteStory: (id) => request(`/stories/${id}`, { method: "DELETE" }),

  uploadImage: (file) => {
    const formData = new FormData();
    formData.append("image", file);
    return request("/upload", { method: "POST", body: formData });
  },
};

export function imageUrl(path) {
  if (!path) return "/logo.png";
  if (path.startsWith("http")) return path;
  const base = API_URL.replace("/api", "");
  return `${base}${path}`;
}
