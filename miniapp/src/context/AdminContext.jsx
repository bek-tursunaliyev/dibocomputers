import { createContext, useContext, useEffect, useState } from "react";
import { api } from "../lib/api";
import { getInitData } from "../lib/telegram";

const AdminContext = createContext({ isAdmin: false, adminToken: null, adminChecked: false });

export function AdminProvider({ children }) {
  const [isAdmin, setIsAdmin] = useState(false);
  const [adminToken, setAdminToken] = useState(null);
  const [adminChecked, setAdminChecked] = useState(false);

  useEffect(() => {
    const initData = getInitData();
    if (!initData) {
      setAdminChecked(true);
      return;
    }

    api
      .telegramLogin(initData)
      .then((res) => {
        if (res.isAdmin) {
          setIsAdmin(true);
          setAdminToken(res.token);
        }
      })
      .catch(() => {})
      .finally(() => setAdminChecked(true));
  }, []);

  return (
    <AdminContext.Provider value={{ isAdmin, adminToken, adminChecked }}>
      {children}
    </AdminContext.Provider>
  );
}

export function useAdmin() {
  return useContext(AdminContext);
}
