"use client";
import { useEffect, useState } from "react";
import api from "@/app/src/services/api";
import toast from "react-hot-toast";

export default function EmployeeInterviews() {
  const [interviews, setInterviews] = useState<any[]>([]);

  const fetchInterviews = async () => {
    try {
      const res = await api.get("/interviews"); // filtered by employeeId
      setInterviews(res.data);
    } catch {
      toast.error("Failed to fetch interviews");
    }
  };

  useEffect(() => { fetchInterviews(); }, []);

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">My Interviews</h1>
      <table className="table-auto w-full bg-white shadow rounded">
        <thead>
          <tr className="bg-gray-200">
            <th className="p-2">Job</th>
            <th className="p-2">Interviewer</th>
            <th className="p-2">Date & Time</th>
            <th className="p-2">Mode</th>
            <th className="p-2">Feedback</th>
          </tr>
        </thead>
        <tbody>
          {interviews.map(i => (
            <tr key={i.id} className="border-b">
              <td className="p-2">{i.candidate.appliedFor.title}</td>
              <td className="p-2">{i.interviewer.firstName} {i.interviewer.lastName}</td>
              <td className="p-2">{new Date(i.dateTime).toLocaleString()}</td>
              <td className="p-2">{i.mode}</td>
              <td className="p-2">{i.feedback || "-"}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}