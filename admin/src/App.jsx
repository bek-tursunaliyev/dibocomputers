import { useEffect } from "react";
import { Navigate, Route, Routes, useLocation, useNavigate } from "react-router-dom";
import Login from "./pages/Login";
import Orders from "./pages/Orders";
import Products from "./pages/Products";
import Stories from "./pages/Stories";
import Sidebar from "./components/Sidebar";

function ProtectedLayout({ children }) {
  const token = localStorage.getItem("admin_token");
  if (!token) return <Navigate to="/login" replace />;

  return (
    <div className="flex">
      <Sidebar />
      <main className="flex-1 p-8">{children}</main>
    </div>
  );
}

function TelegramTokenHandler() {
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const token = params.get("token");
    if (token) {
      localStorage.setItem("admin_token", token);
      navigate("/orders", { replace: true });
    }
  }, [location.search, navigate]);

  return null;
}

export default function App() {
  return (
    <>
      <TelegramTokenHandler />
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route
          path="/orders"
          element={
            <ProtectedLayout>
              <Orders />
            </ProtectedLayout>
          }
        />
        <Route
          path="/products"
          element={
            <ProtectedLayout>
              <Products />
            </ProtectedLayout>
          }
        />
        <Route
          path="/stories"
          element={
            <ProtectedLayout>
              <Stories />
            </ProtectedLayout>
          }
        />
        <Route path="*" element={<Navigate to="/orders" replace />} />
      </Routes>
    </>
  );
}
