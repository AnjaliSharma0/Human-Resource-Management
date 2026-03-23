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

  <div className="min-h-screen bg-gray-100 flex justify-center items-start p-6">

    <div className="w-full max-w-2xl bg-white rounded-2xl shadow-lg p-6 space-y-6">

      {/* HEADER */}
      <div>
        <h2 className="text-2xl font-bold text-gray-800">
          Assign Leave Balance
        </h2>
        <p className="text-sm text-gray-500">
          Allocate yearly leave balance to employees
        </p>
      </div>

      {/* FORM */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

        {/* Employee */}
        <div className="flex flex-col">
          <label className="text-sm text-gray-600 mb-1">Employee</label>
          <select
            name="employeeId"
            value={form.employeeId}
            onChange={handleChange}
            className="border rounded-lg p-2 focus:ring-2 focus:ring-blue-500 outline-none"
          >
            <option value="">Select Employee</option>
            {employees.map((e) => (
              <option key={e.id} value={e.id}>
                {e.firstName} {e.lastName}
              </option>
            ))}
          </select>
        </div>

        {/* Leave Type */}
        <div className="flex flex-col">
          <label className="text-sm text-gray-600 mb-1">Leave Type</label>
          <select
            name="leaveTypeId"
            value={form.leaveTypeId}
            onChange={handleChange}
            className="border rounded-lg p-2 focus:ring-2 focus:ring-blue-500 outline-none"
          >
            <option value="">Select Leave Type</option>
            {leaveTypes.map((t) => (
              <option key={t.id} value={t.id}>
                {t.name} ({t.daysPerYear} days)
              </option>
            ))}
          </select>
        </div>

        {/* Year */}
        <div className="flex flex-col">
          <label className="text-sm text-gray-600 mb-1">Year</label>
          <input
            name="year"
            value={form.year}
            onChange={handleChange}
            className="border rounded-lg p-2 focus:ring-2 focus:ring-blue-500 outline-none"
          />
        </div>

        {/* Accrued */}
        <div className="flex flex-col">
          <label className="text-sm text-gray-600 mb-1">Accrued Days</label>
          <input
            type="number"
            name="accrued"
            value={form.accrued}
            onChange={(e) =>
              setForm({ ...form, accrued: Number(e.target.value) })
            }
            className="border rounded-lg p-2 focus:ring-2 focus:ring-blue-500 outline-none"
          />
        </div>

      </div>

      {/* BUTTON */}
      <div className="flex justify-end">
        <button
          onClick={handleSubmit}
          disabled={!form.employeeId || !form.leaveTypeId}
          className={`px-5 py-2 rounded-lg text-white transition
            ${
              !form.employeeId || !form.leaveTypeId
                ? "bg-gray-400 cursor-not-allowed"
                : "bg-blue-600 hover:bg-blue-700"
            }`}
        >
          + Assign Balance
        </button>
      </div>

      {/* PREVIEW CARD */}
      {form.employeeId && form.leaveTypeId && (
        <div className="bg-blue-50 border border-blue-200 rounded-xl p-4">
          <p className="text-sm text-blue-700">
            You are assigning{" "}
            <span className="font-semibold">{form.accrued}</span> days of{" "}
            <span className="font-semibold">
              {
                leaveTypes.find((t) => t.id == form.leaveTypeId)?.name
              }
            </span>{" "}
            for year{" "}
            <span className="font-semibold">{form.year}</span>
          </p>
        </div>
      )}

    </div>
  </div>
  );
}