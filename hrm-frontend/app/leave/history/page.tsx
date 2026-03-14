"use client";

import LeaveTable from "@/app/components/leave/LeaveTable";
import { leaveApi } from "@/app/src/services/leave";
import { useEffect, useState } from "react";


export default function HistoryPage() {
  const [leaves, setLeaves] = useState<any[]>([]);
 const [role, setRole] = useState<string>("employee");

    useEffect(() => {
    // Get role from localStorage
    const storedRole = localStorage.getItem("role");
    if (storedRole) setRole(storedRole);

    const fetchLeaves = async () => {
      try {
        const employeeId = localStorage.getItem("employeeId") || "1"; // fallback
        const res = await leaveApi.getEmployeeLeaves(Number(employeeId));
        setLeaves(res.data);
      } catch (err) {
        console.error(err);
      }
    };

    fetchLeaves();
  }, []);

  const handleAction = async (id: number, status: "Approved" | "Rejected") => {
    try {
      await leaveApi.updateLeaveStatus(id, status);
      // Refresh leaves after update
      const employeeId = localStorage.getItem("employeeId") || "1";
      const res = await leaveApi.getEmployeeLeaves(Number(employeeId));
      setLeaves(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="p-4">
      <h2 className="text-xl font-semibold mb-4">My Leave History</h2>
      <table className="min-w-full border rounded">
        <thead>
          <tr className="bg-gray-100 dark:bg-gray-700">
            <th className="p-2">Type</th>
            <th className="p-2">Start</th>
            <th className="p-2">End</th>
            <th className="p-2">Status</th>
          </tr>
        </thead>
        <tbody>
          {leaves.map((l) => (
            <tr key={l.id} className="border-t">
              <td className="p-2">{l.leaveType.name}</td>
              <td className="p-2">{l.startDate}</td>
              <td className="p-2">{l.endDate}</td>
              <td className={`p-2 ${l.status === "Approved" ? "text-green-600" : l.status === "Rejected" ? "text-red-600" : "text-yellow-600"}`}>
                {l.status}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}