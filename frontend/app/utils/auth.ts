

import {jwtDecode} from "jwt-decode";

export const saveToken = (token: string) => {
  if (typeof window !== "undefined") {
    localStorage.setItem("token", token);
  }
};

export const getToken = () => {
  if (typeof window !== "undefined") {
    return localStorage.getItem("token");
  }
  return null;
};

export const decodeToken = (token: string) => {
  try {
    return jwtDecode<{ role: string; email: string; name: string }>(token);
  } catch (err) {
    return null;
  }
};

export const logout = () => localStorage.removeItem("token");

// helper to get user role directly
export const getUserRole = (): string | null => {
  const token = getToken();
  if (!token) return null;
  const decoded = decodeToken(token);
  return decoded?.role || null;
};


export const getRole = () => {
    if (typeof window === "undefined") return null;
  const token = localStorage.getItem("token");
  if (!token) return null;
  try {
    const payload: any = JSON.parse(atob(token.split(".")[1]));
    return payload.role;
  } catch {
    return null;
  }
};



export const getUserId = (): number | null => {
    if (typeof window === "undefined") return null;
  const token = localStorage.getItem("token");
  if (!token) return null;
  try {
    const payload: any = JSON.parse(atob(token.split(".")[1]));
    return payload.id;
  } catch {
    return null;
  }
};