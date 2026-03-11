import Link from "next/link";
import HomeIcon from "@mui/icons-material/Home";
import PeopleIcon from "@mui/icons-material/People";
import AccessTimeIcon from "@mui/icons-material/AccessTime";
import EventIcon from "@mui/icons-material/Event";

export default function Sidebar() {
  const menu = [
    { name: "Dashboard", href: "/", icon: <HomeIcon /> },
    { name: "Employees", href: "/employees", icon: <PeopleIcon /> },
    { name: "Attendance", href: "/attendance", icon: <AccessTimeIcon /> },
    { name: "Leave", href: "/leave", icon: <EventIcon /> },
    { name: "Payroll", href: "/payroll", icon: <EventIcon /> },
    { name: "Performance", href: "/performance", icon: <EventIcon /> },
  ];

  return (
    <div className="w-64 bg-white border-r">
      <div className="p-6 font-bold text-xl border-b">HRMS</div>
      <nav className="mt-6">
        {menu.map((item) => (
          <Link
            key={item.name}
            href={item.href}
            className="flex items-center px-6 py-3 text-gray-700 hover:bg-gray-100"
          >
            {item.icon}
            <span className="ml-3">{item.name}</span>
          </Link>
        ))}
      </nav>
    </div>
  );
}