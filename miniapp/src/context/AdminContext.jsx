import { createContext, useContext, useEffect, useState } from "react";
import { api } from "../lib/api";
import { getInitData } from "../lib/telegram";

const AdminContext = createContext({ isAdmin: false, adminToken: null });

export function AdminProvider({ children }) {
  const [isAdmin, setIsAdmin] = useState(false);
  const [adminToken, setAdminToken] = useState(null);

  useEffect(() => {
    const initData = getInitData();
    if (!initData) return;

    api
      .telegramLogin(initData)
      .then((res) => {
        if (res.isAdmin) {
          setIsAdmin(true);
          setAdminToken(res.token);
        }
      })
      .catch(() => {});
  }, []);

  return (
    <AdminContext.Provider value={{ isAdmin, adminToken }}>{children}</AdminContext.Provider>
  );
}

export function useAdmin() {
  return useContext(AdminContext);
}
