"use client";

import { useState, useEffect } from "react";
import toast from "react-hot-toast";
import LeaveForm from "@/app/components/leave/LeaveForm";
import { leaveApi, holidayApi } from "@/app/src/services/leave";
import Loading from "@/app/components/Loading";

function getCurrentUser() {
  const id = localStorage.getItem("userId");
  const role = localStorage.getItem("role") || "employee";
  return { id: id ? Number(id) : null, role };
}

export default function EmployeeLeaveDashboard() {
  const [leaveTypes, setLeaveTypes] = useState<{ id: number; name: string }[]>([]);
  const [leaves, setLeaves] = useState<any[]>([]);
  const [balances, setBalances] = useState<any[]>([]);
  const [holidays, setHolidays] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [employeeId, setEmployeeId] = useState<number | null>(null);

  useEffect(() => {
    const user = getCurrentUser();
    setEmployeeId(user.id);
  }, []);

  const fetchData = async () => {
    if (!employeeId) {
      setLoading(false);
      return;
    }

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
  }, [employeeId]);

  const handleSubmitLeave = async (data: any) => {
    if (!employeeId) {
      toast.error("Employee not logged in");
      return;
    }

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
      toast.error(err.response?.data?.message || "Failed to apply leave");
    }
  };

  const upcomingHolidays = holidays
    .filter((h) => new Date(h.date) >= new Date())
    .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
    .slice(0, 3);

  if (loading) return <Loading message="Loading..." size="lg" />;

  return (
    <div className="p-4 sm:p-6 md:p-8 max-w-[1400px] mx-auto space-y-8">

      <h1 className="text-2xl sm:text-3xl font-bold">
        Employee Leave Dashboard
      </h1>

      {/* ================= HOLIDAYS ================= */}
      <section>
        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center mb-4 gap-2">
          <h2 className="text-lg sm:text-xl font-semibold">
            Upcoming Holidays
          </h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
          {upcomingHolidays.map((h) => (
            <div
              key={h.id}
              className="bg-green-50 border border-green-200 p-4 rounded-lg"
            >
              <p className="font-semibold text-green-700">{h.name}</p>
              <p className="text-sm text-gray-600">
                {new Date(h.date).toDateString()}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* ================= APPLY LEAVE ================= */}
      <section className="bg-white p-4 sm:p-6 rounded-xl shadow">
        <LeaveForm leaveTypes={leaveTypes} onSubmit={handleSubmitLeave} />
      </section>

      {/* ================= BALANCE ================= */}
      <section>
        <h2 className="text-lg sm:text-xl font-semibold mb-4 text-center">
          My Leave Balance
        </h2>

        {balances.length === 0 ? (
          <p className="text-gray-500 text-center">
            No leave balance assigned yet.
          </p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
            {balances.map((b) => (
              <div
                key={b.id}
                className="p-5 bg-white border rounded-lg shadow hover:shadow-md transition"
              >
                <h3 className="text-lg font-semibold mb-2">
                  {b.leaveType?.name}
                </h3>

                <div className="text-sm text-gray-600 space-y-1">
                  <p>Accrued: {b.accrued}</p>
                  <p>Used: {b.used}</p>
                </div>

                <p className="mt-3 text-xl font-bold text-indigo-600">
                  Remaining: {b.remainingDays}
                </p>

                <p className="text-xs text-gray-400 mt-1">
                  Year: {b.year}
                </p>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* ================= HISTORY ================= */}
      <section>
        <h2 className="text-lg sm:text-xl font-semibold mb-4 text-center">
          My Leave History
        </h2>

        {leaves.length === 0 ? (
          <p className="text-gray-500 text-center">
            No leave history found.
          </p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5">
            {leaves.map((l) => (
              <div
                key={l.id}
                className="bg-white border border-gray-200 rounded-xl shadow hover:shadow-lg transition p-5 flex flex-col justify-between"
              >
                {/* Header */}
                <div className="flex justify-between items-center mb-3">
                  <span className="font-semibold text-gray-800 text-sm sm:text-base">
                    {l.leaveType?.name}
                  </span>

                  <span
                    className={`px-2 sm:px-3 py-1 rounded-full text-xs font-semibold
                      ${
                        l.status === "approved"
                          ? "bg-green-100 text-green-700"
                          : l.status === "rejected"
                          ? "bg-red-100 text-red-700"
                          : "bg-yellow-100 text-yellow-700"
                      }`}
                  >
                    {l.status.toUpperCase()}
                  </span>
                </div>

                {/* Content */}
                <div className="flex flex-col gap-2 text-gray-600 text-sm">

                  <div>
                    📅 {new Date(l.startDate).toLocaleDateString()} -{" "}
                    {new Date(l.endDate).toLocaleDateString()}
                  </div>

                  <div>⏱ Duration: {l.duration}</div>

                  {l.reason && <div>💬 {l.reason}</div>}
                </div>

              </div>
            ))}
          </div>
        )}
      </section>

    </div>
  );
}