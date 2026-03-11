"use client";

import { ReactNode, useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { getRole, logout } from "../../utils/auth";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import LogoutIcon from "@mui/icons-material/Logout";
import MenuIcon from "@mui/icons-material/Menu";
import { IconButton } from "@mui/material";

type Props = { children: ReactNode };

export default function DashboardLayout({ children }: Props) {
  const router = useRouter();
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [role, setRole] = useState<string | null>(null);
  const [mounted, setMounted] = useState(false); // ✅ track client mount

  useEffect(() => {
    setMounted(true); // mark as mounted
    const r = getRole();
    if (!r) router.push("/auth/login");
    else setRole(r);
  }, [router]);

  const handleLogout = () => {
    logout();
    router.push("/auth/login");
  };

  const handleProfile = () => {
    router.push("/profile");
  };

  const navItems = [
    { name: "Dashboard", path: "/dashboard", roles: ["admin", "manager", "employee"] },
    { name: "Employees", path: "/employees", roles: ["admin", "manager"] },
    { name: "Attendance", path: "/attendance", roles: ["admin", "manager", "employee"] },
    { name: "Leave", path: "/leave", roles: ["admin", "manager", "employee"] },
    { name: "Payroll", path: "/payroll", roles: ["admin"] },
    { name: "Performance", path: "/performance", roles: ["admin", "manager"] },
    { name: "Recruitment", path: "/recruitment", roles: ["admin"] },
    { name: "Training", path: "/training", roles: ["admin", "manager"] },
    { name: "Expenses", path: "/expenses", roles: ["admin", "manager"] },
  ];

  // ✅ Only render after mounting
  if (!mounted) return null;

  return (
    <div className="flex min-h-screen bg-gray-100">
      {/* Sidebar */}
      <aside className={`bg-white shadow-lg transition-all duration-300 ${sidebarOpen ? "w-64" : "w-20"}`}>
        <div className="flex items-center justify-between px-4 py-4">
          <h2 className={`text-xl font-bold text-gray-700 transition-all duration-300 ${sidebarOpen ? "opacity-100" : "opacity-0"}`}>HRMS</h2>
          <IconButton className="text-gray-700" onClick={() => setSidebarOpen(!sidebarOpen)}>
            <MenuIcon />
          </IconButton>
        </div>

        <nav className="mt-6 text-gray-700 m-4">
          {navItems
            .filter((item) => item.roles.includes(role!))
            .map((item) => (
              <div
                key={item.name}
                className={`flex items-center gap-3 p-3 cursor-pointer hover:bg-blue-500 hover:text-white transition-all duration-300 ${sidebarOpen ? "justify-start" : "justify-center"}`}
                onClick={() => router.push(item.path)}
              >
                {sidebarOpen && <span className="font-medium">{item.name}</span>}
              </div>
            ))}
        </nav>
      </aside>

      {/* Main content */}
      <div className="flex-1 flex flex-col">
        <header className="flex justify-end items-center bg-white shadow-md px-6 py-4 gap-4">
          <IconButton onClick={handleProfile} className="bg-blue-500 text-white hover:bg-blue-600 transition-all">
            <AccountCircleIcon />
          </IconButton>
          <IconButton onClick={handleLogout} className="bg-red-500 text-white hover:bg-red-600 transition-all">
            <LogoutIcon />
          </IconButton>
        </header>

        <main className="p-6">{children}</main>
      </div>
    </div>
  );
}