"use client";

import { jwtDecode } from "jwt-decode";
import { createContext, useState, useEffect } from "react";


export const AuthContext = createContext<any>(null);

export default function AuthProvider({ children }: any) {

  const [user, setUser] = useState(null);

  useEffect(() => {

    const token = localStorage.getItem("token");

    if (token) {
      const decoded: any = jwtDecode(token);
      setUser(decoded);
    }

  }, []);

  return (
    <AuthContext.Provider value={{ user, setUser }}>
      {children}
    </AuthContext.Provider>
  );
}