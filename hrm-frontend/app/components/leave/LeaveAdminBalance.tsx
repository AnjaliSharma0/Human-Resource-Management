"use client";

import { useState, useEffect } from "react";
import { leaveApi } from "@/app/src/services/leave";
import toast from "react-hot-toast";

export default function LeaveBalanceAdmin() {

  const [leaveTypes, setLeaveTypes] = useState<any[]>([]);
  const [employees, setEmployees] = useState<any[]>([]);

  const [form, setForm] = useState({
    employeeId: "",
    leaveTypeId: "",
    year: "2026",
    accrued:0
  });

  const handleChange = (e: any) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  useEffect(() => {
    fetchLeaveTypes();
    fetchEmployees();
  }, []);

  const fetchLeaveTypes = async () => {
    const res = await leaveApi.getLeaveTypes();
    setLeaveTypes(res.data);
  };

  const fetchEmployees = async () => {
    const res = await leaveApi.getEmployees(); // adjust API
    setEmployees(res.data);
  };

  const handleSubmit = async () => {
    if (!form.employeeId || !form.leaveTypeId) {
      toast.error("All fields are required");
      return;
    }

    try {
     await leaveApi.createLeaveBalance({
  employeeId: Number(form.employeeId),
  leaveTypeId: Number(form.leaveTypeId),
  year: Number(form.year),
  accrued: Number(form.accrued), // ← make sure this is included

      });

      toast.success("Leave balance created");

      setForm({
        employeeId: "",
        leaveTypeId: "",
        year: "2026",
        accrued:0
      });

    } catch (err: any) {
      toast.error(err?.response?.data?.message || "Error creating balance");
    }
  };

  return (
    <div className="p-6 bg-white rounded shadow max-w-md">

      <h2 className="text-xl font-bold mb-4">
        Assign Leave Balance
      </h2>

      <div className="flex flex-col gap-3">

        {/* Employee */}
        <select
          name="employeeId"
          value={form.employeeId}
          onChange={handleChange}
          className="border p-2"
        >
          <option value="">Select Employee</option>
          {employees.map((e) => (
            <option key={e.id} value={e.id}>
              {e.firstName} {e.lastName}
            </option>
          ))}
        </select>

        {/* Leave Type */}
        <select
          name="leaveTypeId"
          value={form.leaveTypeId}
          onChange={handleChange}
          className="border p-2"
        >
          <option value="">Select Leave Type</option>
          {leaveTypes.map((t) => (
            <option key={t.id} value={t.id}>
              {t.name} ({t.daysPerYear} days)
            </option>
          ))}
        </select>

        {/* Year */}
        <input
          name="year"
          value={form.year}
          onChange={handleChange}
          className="border p-2"
        />
              <input
                type="number"
                name="accrued"
                value={form.accrued}
                onChange={(e) => setForm({ ...form, accrued: Number(e.target.value) })}
              />
        <button
          onClick={handleSubmit}
          className="bg-blue-600 text-white p-2 rounded"
        >
          Create Balance
        </button>

      </div>

    </div>
  );
}