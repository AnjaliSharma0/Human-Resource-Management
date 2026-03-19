"use client";

import { leaveApi } from "@/app/src/services/leave";
import { useState, useEffect } from "react";

export default function LeaveHistoryPage() {
  const [leaves, setLeaves] = useState<any[]>([]);

  useEffect(() => {
    const fetchLeaves = async () => {
      try {
        const res = await leaveApi.getMyLeaves(); // backend gets employeeId from JWT
        setLeaves(res.data);
      } catch (err) {
        console.error(err);
      }
    };
    fetchLeaves();
  }, []);

  return (
    <div className="p-6">
      <h2 className="text-xl font-semibold mb-4">My Leave History</h2>
      <table className="min-w-full border rounded">
        <thead>
          <tr className="bg-gray-100">
            <th className="p-2">Employee</th>
            <th className="p-2">Type</th>
            <th className="p-2">Start</th>
            <th className="p-2">End</th>
            <th className="p-2">Status</th>
          </tr>
        </thead>
        <tbody>
          {leaves.map((l) => (
            <tr key={l.id} className="border-t">
              <td className="p-2">{l.employee.name}</td>
              <td className="p-2">{l.leaveType.name}</td>
              <td className="p-2">{new Date(l.startDate).toLocaleDateString()}</td>
              <td className="p-2">{new Date(l.endDate).toLocaleDateString()}</td>
              <td
                className={`p-2 ${
                  l.status === "approved"
                    ? "text-green-600"
                    : l.status === "rejected"
                    ? "text-red-600"
                    : "text-yellow-600"
                }`}
              >
                {l.status}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}