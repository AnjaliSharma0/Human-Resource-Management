"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

import DarkModeIcon from "@mui/icons-material/DarkMode";
import LogoutIcon from "@mui/icons-material/Logout";


export default function Navbar() {
    const router = useRouter();
    const [open, setOpen] = useState(false);
    const [role, setRole] = useState<string | null>(null);

    // Fetch role from localStorage when component mounts
    useEffect(() => {
        const storedRole = localStorage.getItem("role");
        setRole(storedRole);
    }, []);

    const toggleDark = () => {
        document.documentElement.classList.toggle("dark");
    };

    const logout = () => {
        localStorage.removeItem("token");
        localStorage.removeItem("role");
        router.push("/auth/login");
         // Redirect to login and force reload
  window.location.href = "/auth/login";
    };

    const goToDashboard = () => {
        if (role === "admin") {
            router.push("/admin/dashboard");
        } else if (role === "employee") {
            router.push("/employees/dashboard");
        } else if (role === "manager") {
            router.push("/manager/dashboard");
        } else {
            router.push("/auth/login"); // fallback if role not found
        }
    };

    return (
        <header className="sticky top-0 z-40 backdrop-blur-xl bg-white/70 border-b border-gray-200 shadow-sm px-6 py-3 flex justify-between items-center">

  {/* 🔹 Left: Logo */}
  <div
    onClick={goToDashboard}
    className="flex items-center gap-2 cursor-pointer group"
  >
    <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-blue-500 to-indigo-500 flex items-center justify-center text-white font-bold shadow-md group-hover:scale-110 transition">
      H
    </div>
    <span className="text-lg font-semibold text-gray-800 group-hover:text-blue-600 transition">
      HRMS
    </span>
  </div>

  {/* 🔹 Right Section */}
  <div className="flex items-center gap-4 relative">

    {/* 🌙 Dark Mode */}
    <button
      onClick={toggleDark}
      className="p-2 rounded-full bg-gray-100 hover:bg-gray-200 
                 hover:scale-110 active:scale-95 transition-all duration-200 shadow-sm"
    >
      <DarkModeIcon className="text-gray-600" />
    </button>

    {/* 👤 Profile */}
    <button
      onClick={() => setOpen(!open)}
      className="flex items-center gap-2 px-3 py-1.5 rounded-full 
                 bg-gradient-to-r from-gray-100 to-gray-200 
                 hover:from-blue-50 hover:to-indigo-50 
                 hover:shadow-md transition-all duration-300"
    >
      {/* Avatar */}
      <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-blue-500 to-indigo-500 
                      text-white flex items-center justify-center text-sm font-bold shadow">
        {role?.charAt(0)?.toUpperCase() || "U"}
      </div>

      <span className="text-sm text-gray-700 capitalize font-medium">
        {role || "User"}
      </span>
    </button>

    {/* 🔻 Dropdown */}
    {open && (
      <div className="absolute right-0 top-14 w-52 
                      bg-white/80 backdrop-blur-xl border border-gray-200 
                      rounded-2xl shadow-xl p-2 
                      animate-[fadeIn_0.2s_ease-in-out]">

        {/* Profile */}
        <button
          onClick={() => router.push("/employees/dashboard/profile")}
          className="w-full flex items-center gap-2 px-4 py-2 rounded-xl 
                     text-gray-700 hover:bg-blue-50 hover:text-blue-600 
                     transition-all duration-200"
        >
          👤 Profile
        </button>

        {/* Divider */}
        <div className="h-px bg-gray-200 my-2"></div>

        {/* Logout */}
        <button
          onClick={logout}
          className="w-full flex items-center gap-2 px-4 py-2 rounded-xl 
                     text-red-500 hover:bg-red-50 
                     transition-all duration-200"
        >
          <LogoutIcon fontSize="small" />
          Logout
        </button>
      </div>
    )}
  </div>
</header>
    );
}