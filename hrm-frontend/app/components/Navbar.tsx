"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

import DarkModeIcon from "@mui/icons-material/DarkMode";
import LogoutIcon from "@mui/icons-material/Logout";
import PersonIcon from "@mui/icons-material/Person";

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
        <header className="bg-white dark:bg-gray-300 shadow flex justify-between items-center px-6 py-4">
            <h1
                className="font-semibold bg-blue-400 hover:bg-blue-900 hover:text-white p-2 m-3 cursor-pointer rounded-lg"
                onClick={goToDashboard}
            >
                Dashboard
            </h1>

            <div className="flex items-center gap-4 relative">
                <button onClick={toggleDark}>
                    <DarkModeIcon />
                </button>

                <button onClick={() => setOpen(!open)}>
                    <PersonIcon />
                </button>

                {open && (
                    <div className="absolute right-0 top-10 bg-white dark:bg-gray-800 shadow-lg rounded-xl p-3 w-44 z-50">
                        {/* Profile Link */}
                   <p
  className="text-sm text-gray-800 dark:text-gray-200 mb-2 px-3 py-2 rounded-lg cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors duration-200"
  onClick={() => router.push("/employees/dashboard/profile")}
>
  Profile
</p>
                        {/* Logout Button */}
                        <button
                            onClick={logout}
                            className="flex items-center gap-2 text-red-500 bg-red-50 dark:bg-red-700 dark:text-red-100 hover:bg-red-100 dark:hover:bg-red-600 px-3 py-2 rounded-lg w-full transition-colors duration-200"
                        >
                            <LogoutIcon className="h-5 w-5" />
                            Logout
                        </button>
                    </div>

                )}
            </div>
        </header>
    );
}