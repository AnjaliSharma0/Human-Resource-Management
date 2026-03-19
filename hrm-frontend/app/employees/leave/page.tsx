"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import toast from "react-hot-toast";
import LeaveForm from "@/app/components/leave/LeaveForm";
import { leaveApi, holidayApi } from "@/app/src/services/leave";
import Loading from "@/app/components/Loading";

export default function EmployeeLeaveDashboard() {
  const [leaveTypes, setLeaveTypes] = useState<{ id: number; name: string }[]>([]);
  const [leaves, setLeaves] = useState<any[]>([]);
  const [balances, setBalances] = useState<any[]>([]);
  const [holidays, setHolidays] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  // Normally get employee ID from logged-in user
  const user = JSON.parse(localStorage.getItem("user") || "{}");
  const employeeId = user?.id;

  const fetchData = async () => {
    // if (!employeeId) {
    //   toast.error("Employee not found");
    //   return;
    //}
    try {
      const [leaveRes, balanceRes, holidayRes, typeRes] = await Promise.all([
        leaveApi.getEmployeeLeaves(employeeId),
        leaveApi.getEmployeeBalance(employeeId),
        holidayApi.getHolidays(),
        leaveApi.getLeaveTypes(),
      ]);

      setLeaves(leaveRes.data || []);
      setBalances(balanceRes.data || []);
      setHolidays(holidayRes.data || []);
      setLeaveTypes(typeRes.data || []);
    } catch (err) {
      console.error(err);
      toast.error("Failed to load employee data");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleSubmitLeave = async (data: any) => {
    if (!employeeId) return;
    try {
      const payload = {
        employeeId,
        leaveTypeId: Number(data.leaveTypeId),
        startDate: data.startDate,
        endDate: data.endDate,
        duration: data.duration || "full",
        reason: data.reason || "",
      };
      await leaveApi.applyLeave(payload);
      toast.success("Leave applied successfully");
      fetchData();
    } catch (err: any) {
      console.error(err.response?.data);
      toast.error(err.response?.data?.message || "Failed to apply leave");
    }
  };

  const upcomingHolidays = holidays
    .filter((h) => new Date(h.date) >= new Date())
    .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
    .slice(0, 3);

   if (loading) return <Loading message="Loading..." size="lg"/>

  return (
    <div className="p-6 space-y-8">
      <h1 className="text-3xl font-bold mb-6">Employee Leave Dashboard</h1>

      {/* Upcoming Holidays */}
      <section>
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold">Upcoming Holidays</h2>
          <button className="bg-green-800 hover:bg-green-500 text-white px-4 py-2 rounded-lg">
            <Link href="/leave/balance">See Full Leave Balance</Link>
          </button>
        </div>
        <div className="grid md:grid-cols-3 gap-4">
          {upcomingHolidays.map((h) => (
            <div key={h.id} className="bg-green-50 border border-green-200 p-4 rounded-lg">
              <p className="font-semibold text-green-700">{h.name}</p>
              <p className="text-sm text-gray-600">{new Date(h.date).toDateString()}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Apply Leave */}
      <section className="bg-white shadow rounded-lg p-6">
        <h2 className="text-xl font-semibold mb-4">Apply Leave</h2>
        <LeaveForm leaveTypes={leaveTypes} onSubmit={handleSubmitLeave} />
      </section>

      {/* Leave Balance */}
      <section>
        <h2 className="text-xl font-semibold mb-4">My Leave Balance</h2>
        {balances.length === 0 ? (
          <p className="text-gray-500">No leave balance assigned yet.</p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {balances.map((b) => (
              <div key={b.id} className="p-5 bg-white border rounded-lg shadow">
                <h3 className="text-lg font-semibold mb-2">{b.leaveType?.name}</h3>
                <div className="text-sm text-gray-600 space-y-1">
                  <p>Accrued: {b.accrued}</p>
                  <p>Used: {b.used}</p>
                </div>
                <p className="mt-3 text-xl font-bold text-indigo-600">
                  Remaining: {b.remainingDays}
                </p>
                <p className="text-xs text-gray-400 mt-1">Year: {b.year}</p>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* Leave History */}
      <section>
        <h2 className="text-xl font-semibold mb-4">My Leave History</h2>
        <table className="min-w-full border rounded">
          <thead>
            <tr className="bg-gray-100">
              <th className="p-2 border">Type</th>
              <th className="p-2 border">Start</th>
              <th className="p-2 border">End</th>
              <th className="p-2 border">Duration</th>
              <th className="p-2 border">Status</th>
            </tr>
          </thead>
          <tbody>
            {leaves.map((l) => (
              <tr key={l.id} className="border-t">
                <td className="p-2">{l.leaveType?.name}</td>
                <td className="p-2">{new Date(l.startDate).toLocaleDateString()}</td>
                <td className="p-2">{new Date(l.endDate).toLocaleDateString()}</td>
                <td className="p-2">{l.duration}</td>
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
      </section>
    </div>
  );
}