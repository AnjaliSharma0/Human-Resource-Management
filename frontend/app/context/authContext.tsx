"use client";

import { createContext, useContext, useEffect, useState } from "react";
import { jwtDecode } from "jwt-decode";
import { setAuthToken } from "../utils/api";

interface AuthContextType {
  token: string | null;
  role: string | null;
  loading: boolean;
  login: (token: string) => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType>({
  token: null,
  role: null,
  loading: true,
  login: () => {},
  logout: () => {},
});

export const AuthProvider = ({ children }: any) => {
  const [token, setToken] = useState<string | null>(null);
  const [role, setRole] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const savedToken = localStorage.getItem("token");

    if (savedToken) {
      const decoded: any = jwtDecode(savedToken);

      setToken(savedToken);
      setRole(decoded.role);

      setAuthToken(savedToken);
    }

    setLoading(false); // VERY IMPORTANT
  }, []);

  const login = (jwtToken: string) => {
    const decoded: any = jwtDecode(jwtToken);

    setToken(jwtToken);
    setRole(decoded.role);

    localStorage.setItem("token", jwtToken);
    setAuthToken(jwtToken);
  };

  const logout = () => {
    setToken(null);
    setRole(null);

    localStorage.removeItem("token");
    setAuthToken(null);
  };

  return (
    <AuthContext.Provider value={{ token, role, loading, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);