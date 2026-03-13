

"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";

import DashboardIcon from "@mui/icons-material/Dashboard";
import PeopleIcon from "@mui/icons-material/People";
import BusinessIcon from "@mui/icons-material/Business";
import EventIcon from "@mui/icons-material/Event";
import PaidIcon from "@mui/icons-material/Paid";
import MenuIcon from "@mui/icons-material/Menu";

export default function Sidebar() {

  const [collapsed,setCollapsed] = useState(false);

  const pathname = usePathname();
  const [role, setRole] = useState("employee");

  useEffect(() => {
    const storedRole = localStorage.getItem("role");
    if (storedRole) {
      setRole(storedRole);
    }
  }, []);

  const adminMenu = [
    {name:"Dashboard",path:"/admin/dashboard",icon:<DashboardIcon/>},
    {name:"Employees",path:"/admin/dashboard/employee",icon:<PeopleIcon/>},
    {name:"Departments",path:"/admin/dashboard/departments",icon:<BusinessIcon/>},
    {name:"Attendance",path:"/attendance",icon:<EventIcon/>},
    {name:"Payroll",path:"/admin/dashboard/payroll",icon:<PaidIcon/>},
  ];

  const managerMenu = [
    {name:"Dashboard",path:"/dashboard/manager",icon:<DashboardIcon/>},
    {name:"Team",path:"/dashboard/manager/team",icon:<PeopleIcon/>},
    {name:"Attendance",path:"/attendance",icon:<EventIcon/>},
  ];

  const employeeMenu = [
    {name:"Dashboard",path:"/employees/dashboard",icon:<DashboardIcon/>},
    {name:"Profile",path:"/employees/dashboard/profile",icon:<PeopleIcon/>},
    {name:"Attendance",path:"/attendance",icon:<EventIcon/>},
  ];

  const menu =
    role === "admin"
      ? adminMenu
      : role === "manager"
      ? managerMenu
      : employeeMenu;

  return (

    <aside
      className={`bg-indigo-700 text-white transition-all duration-300 ${
        collapsed ? "w-20" : "w-64"
      }`}
    >

      <div className="flex justify-between items-center p-4 border-b border-indigo-500">

        {!collapsed && <h2 className="font-bold">HRMS</h2>}

        <button onClick={()=>setCollapsed(!collapsed)}>
          <MenuIcon/>
        </button>

      </div>

      <nav className="p-3 space-y-2">

        {menu.map((item)=>{

         const active = pathname.startsWith(item.path);

          return(

          <Link
          key={item.name}
          href={item.path}
          className={`flex items-center gap-3 p-2 rounded
          ${active ? "bg-indigo-500" : "hover:bg-indigo-600"}`}
          >

          {item.icon}

          {!collapsed && item.name}

          </Link>

          );

        })}

      </nav>

    </aside>

  );
}