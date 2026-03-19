"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import DashboardIcon from "@mui/icons-material/Dashboard";
import PeopleIcon from "@mui/icons-material/People";
import EventIcon from "@mui/icons-material/Event";
import PaidIcon from "@mui/icons-material/Paid";
import MenuIcon from "@mui/icons-material/Menu";
import WorkIcon from "@mui/icons-material/Work";
import ApartmentIcon from "@mui/icons-material/Apartment";
import { DateRangeOutlined, GroupWork, HelpCenterOutlined, ModelTraining, MoodBad, MoodSharp, PriorityHighOutlined } from "@mui/icons-material";
import EqualizerIcon from '@mui/icons-material/Equalizer';
import { BarChart3Icon, ChartBarIcon, DownloadIcon, FlowerIcon, ListRestartIcon, LuggageIcon } from "lucide-react";
import { Bars4Icon } from "@heroicons/react/24/solid";
export default function Sidebar() {
  const pathname = usePathname();
  const [role, setRole] = useState("employee");

  // Detect screen size and set initial collapsed state
  const [collapsed, setCollapsed] = useState(false); // desktop expanded by default
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const storedRole = localStorage.getItem("role");
    if (storedRole) setRole(storedRole);

    const handleResize = () => setIsMobile(window.innerWidth < 768); // md breakpoint
    handleResize(); // initial check
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // Collapse sidebar automatically on mobile
  useEffect(() => {
    if (isMobile) setCollapsed(true);
    else setCollapsed(false);
  }, [isMobile]);

  const adminMenu = [
    { name: "Dashboard", path: "/admin/dashboard", icon: <DashboardIcon /> },
    { name: "Employees", path: "/admin/dashboard/employee", icon: <PeopleIcon /> },
    { name: "Attendance", path: "/attendance", icon: <EventIcon /> },
    { name: "Leave", path: "/leave/manage", icon: <MoodSharp /> },
     { name: "Org-Structure", path: "/org-structure", icon: <FlowerIcon /> },
    {name:"Course", path:"/admin/training", icon:<ModelTraining/>},
    {name:"Training", path:"/admin/skill", icon:<EqualizerIcon/>},
    { name: "Payroll", path: "/admin/payroll", icon: <PaidIcon /> },
    { name: "Departments", path: "/department", icon: <ApartmentIcon /> },
    { name: "ATS", path: "/admin/jobreq", icon: <WorkIcon /> },
    {name: "Performance", path:"/performance", icon:<BarChart3Icon/>},
     { name: "Integrations", path: "/integrations", icon: <DownloadIcon /> },
      { name: "OffBording", path: "/offbording", icon: <ListRestartIcon /> },
        { name: "OnBording", path: "/onbording", icon: <ListRestartIcon /> },
        { name: "HelpDesk", path: "/helpdesk", icon: <HelpCenterOutlined /> },
    { name: "Calendar", path: "/leave/calendar", icon: <DateRangeOutlined /> },

  ];

  const employeeMenu = [
    { name: "Dashboard", path: "/employees/dashboard", icon: <DashboardIcon /> },
    { name: "Profile", path: "/employees/dashboard/profile", icon: <PeopleIcon /> },
    { name: "Attendance", path: "/attendance", icon: <EventIcon /> },
    { name: "Leave", path: "/leave/apply", icon: <MoodBad /> },
       { name: "Org-Structure", path: "/org-structure", icon: <FlowerIcon /> },
    { name: "Payroll", path: "/employees/payroll", icon: <PaidIcon /> },
    {name:"Training", path:"/employees/training", icon:<ModelTraining/>},
    { name: "All Departments", path: "/department", icon: <ApartmentIcon /> },
    {name: "Performance", path:"/performance", icon:<BarChart3Icon/>},
    {name: "Careers", path:"/careers", icon:<GroupWork/>},
    {name: "Reports", path:"/employees/reports", icon:<PriorityHighOutlined/>},
    { name: "OffBording", path: "/offbording", icon: <ListRestartIcon /> },
    { name: "OnBording", path: "/onbording", icon: <ListRestartIcon /> },
    { name: "Integrations", path: "/integrations", icon: <DownloadIcon /> },
      { name: "HelpDesk", path: "/helpdesk", icon: <HelpCenterOutlined /> },
    { name: "Calendar", path: "/leave/calendar", icon: <DateRangeOutlined /> },

  ];

  const menu = role === "admin" ? adminMenu : employeeMenu;

  return (
    <>
      {/* Sidebar */}
      <aside
        className={`bg-indigo-700 text-white fixed top-0 left-0 h-screen z-50
          transform transition-transform duration-300
          ${collapsed ? (isMobile ? "-translate-x-full" : "w-20") : "translate-x-0 w-64"}
          flex flex-col
        `}
      >
        {/* Header */}
        <div className="flex justify-between items-center p-4 border-b border-indigo-500 flex-shrink-0">
          {!collapsed && <h2 className="font-bold">HRMS</h2>}
          {/* Hamburger for mobile */}
          {isMobile && (
            <button onClick={() => setCollapsed(!collapsed)}>
              <MenuIcon />
            </button>
          )}
        </div>

        {/* Navigation */}
        <nav className="p-3 space-y-2 overflow-y-auto flex-1">
          {menu.map((item) => {
            const active = pathname.startsWith(item.path);
            return (
              <Link
                key={item.name}
                href={item.path}
                className={`flex items-center gap-3 p-2 rounded ${
                  active ? "bg-indigo-500" : "hover:bg-indigo-600"
                }`}
              >
                {item.icon}
                {!collapsed && item.name}
              </Link>
            );
          })}
        </nav>
      </aside>

      {/* Overlay for mobile */}
      {!collapsed && isMobile && (
        <div
          className="fixed inset-0 bg-black/50 z-40"
          onClick={() => setCollapsed(true)}
        />
      )}

      {/* Mobile hamburger button */}
      {collapsed && isMobile && (
        <button
          className="fixed top-4 left-4 z-50 bg-indigo-700 text-white p-2 rounded shadow"
          onClick={() => setCollapsed(false)}
        >
          <MenuIcon />
        </button>
      )}
    </>
  );
}