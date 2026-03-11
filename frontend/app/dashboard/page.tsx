"use client";


import { useEffect } from "react";
import { useRouter } from "next/navigation";

import PeopleIcon from "@mui/icons-material/People";
import AccessTimeIcon from "@mui/icons-material/AccessTime";
import EventNoteIcon from "@mui/icons-material/EventNote";
import PaidIcon from "@mui/icons-material/Paid";
import { getToken } from "../utils/auth";
import DashboardLayout from "../components/layout/DashboardLayout";

export default function DashboardPage() {
  const router = useRouter();

  useEffect(() => {
    if (!getToken()) router.push("/"); // redirect to landing if not logged in
  }, [router]);

  const stats = [
    { title: "Employees", value: 120, icon: <PeopleIcon className="text-white" />, color: "bg-blue-500" },
    { title: "Attendance Today", value: 95, icon: <AccessTimeIcon className="text-white" />, color: "bg-green-500" },
    { title: "Leaves Pending", value: 8, icon: <EventNoteIcon className="text-white" />, color: "bg-yellow-500" },
    { title: "Payroll Processed", value: 110, icon: <PaidIcon className="text-white" />, color: "bg-purple-500" },
  ];

  return (
    <DashboardLayout>
      <h1 className="text-3xl font-bold mb-6 text-gray-700">HRMS Dashboard</h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat) => (
          <div key={stat.title} className={`flex items-center justify-between p-6 rounded-2xl shadow-lg transform hover:scale-105 transition-all duration-300 ${stat.color}`}>
            <div>
              <p className="text-white text-sm font-medium">{stat.title}</p>
              <p className="text-white text-2xl font-bold mt-1">{stat.value}</p>
            </div>
            <div className="p-3 rounded-full bg-white/20">{stat.icon}</div>
          </div>
        ))}
      </div>
    </DashboardLayout>
  );
}