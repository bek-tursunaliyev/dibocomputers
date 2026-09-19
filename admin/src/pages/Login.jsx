import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { api } from "../lib/api";

export default function Login() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const { token } = await api.login(username, password);
      localStorage.setItem("admin_token", token);
      navigate("/orders");
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="h-screen flex items-center justify-center bg-gray-50">
      <form onSubmit={handleSubmit} className="bg-white rounded-2xl shadow-sm p-8 w-full max-w-sm">
        <div className="flex flex-col items-center mb-6">
          <img src="/logo.png" alt="logo" className="w-16 h-16 rounded-2xl object-cover mb-3" />
          <h1 className="text-lg font-bold text-gray-900">DiboComputers Admin</h1>
        </div>

        {error && <p className="text-sm text-red-600 bg-red-50 rounded-lg px-3 py-2 mb-4">{error}</p>}

        <label className="text-sm text-gray-600">Login</label>
        <input
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          className="w-full mt-1 mb-4 border border-gray-200 rounded-xl px-3 py-2.5 text-sm outline-none focus:border-primary"
          required
        />

        <label className="text-sm text-gray-600">Parol</label>
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="w-full mt-1 mb-6 border border-gray-200 rounded-xl px-3 py-2.5 text-sm outline-none focus:border-primary"
          required
        />

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-primary text-white font-semibold py-3 rounded-xl disabled:opacity-60"
        >
          {loading ? "Kirilmoqda..." : "Kirish"}
        </button>
      </form>
    </div>
  );
}
