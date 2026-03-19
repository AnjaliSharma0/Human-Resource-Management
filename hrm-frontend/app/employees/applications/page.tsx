"use client";
import { useEffect, useState } from "react";
import api from "@/app/src/services/api";
import toast from "react-hot-toast";

export default function EmployeeApplications() {
  const [applications, setApplications] = useState<any[]>([]);

  const fetchApplications = async () => {
    try {
      const res = await api.get("/candidates"); // filtered by logged-in employee
      setApplications(res.data);
    } catch {
      toast.error("Failed to fetch applications");
    }
  };

  useEffect(() => { fetchApplications(); }, []);

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">My Applications</h1>
      <table className="table-auto w-full bg-white shadow rounded">
        <thead>
          <tr className="bg-gray-200">
            <th className="p-2">Job Title</th>
            <th className="p-2">Department</th>
            <th className="p-2">Status</th>
          </tr>
        </thead>
        <tbody>
          {applications.map(a => (
            <tr key={a.id} className="border-b">
              <td className="p-2">{a.appliedFor.title}</td>
              <td className="p-2">{a.appliedFor.department}</td>
              <td className="p-2">{a.status}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}