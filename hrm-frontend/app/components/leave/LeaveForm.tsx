
"use client";

import { useState } from "react";

interface LeaveFormProps {
  leaveTypes: { id: number; name: string }[];
  onSubmit: (data: any) => void;
}

export default function LeaveForm({ leaveTypes, onSubmit }: LeaveFormProps) {
  const [form, setForm] = useState({
    leaveTypeId: "",
    startDate: "",
    endDate: "",
    reason: "",
    duration: ""
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = () => {
    if (!form.leaveTypeId || !form.startDate || !form.endDate || !form.duration) {
      alert("Please fill all required fields");
      return;
    }

    const payload: any = {
      leaveTypeId: Number(form.leaveTypeId),
      startDate: form.startDate,
      endDate: form.endDate,
      duration: form.duration
      // .toUpperCase(), // FULL | FIRST_HALF | SECOND_HALF
    };

    if (form.reason.trim()) {
      payload.reason = form.reason.trim();
    }

    onSubmit(payload);

    // Reset form
    setForm({ leaveTypeId: "", startDate: "", endDate: "", reason: "", duration: "" });
  };

  return (
  <div className="bg-white shadow-lg rounded-xl p-6 max-w-lg mx-auto space-y-4 sm:px-8 sm:py-6">
  <h2 className="text-2xl font-semibold text-gray-800 text-center sm:text-left">
    Apply for Leave
  </h2>

  {/* Leave Type */}
  <div className="flex flex-col sm:flex-row sm:items-center sm:gap-4">
    <label className="text-gray-600 font-medium sm:w-1/3">Leave Type</label>
    <select
      name="leaveTypeId"
      value={form.leaveTypeId}
      onChange={handleChange}
      className="flex-1 border border-gray-300 p-2 rounded-lg focus:ring-2 focus:ring-blue-300 focus:outline-none"
    >
      <option value="">Select Leave Type</option>
      {leaveTypes.map((t) => (
        <option key={t.id} value={t.id}>{t.name}</option>
      ))}
    </select>
  </div>

  {/* Start & End Dates */}
  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
    <div className="flex flex-col">
      <label className="text-gray-600 font-medium">Start Date</label>
      <input
        type="date"
        name="startDate"
        value={form.startDate}
        onChange={handleChange}
        className="border border-gray-300 p-2 rounded-lg focus:ring-2 focus:ring-blue-300 focus:outline-none"
      />
    </div>

    <div className="flex flex-col">
      <label className="text-gray-600 font-medium">End Date</label>
      <input
        type="date"
        name="endDate"
        value={form.endDate}
        onChange={handleChange}
        className="border border-gray-300 p-2 rounded-lg focus:ring-2 focus:ring-blue-300 focus:outline-none"
      />
    </div>
  </div>

  {/* Duration */}
  <div className="flex flex-col sm:flex-row sm:items-center sm:gap-4">
    <label className="text-gray-600 font-medium sm:w-1/3">Duration</label>
    <select
      name="duration"
      value={form.duration}
      onChange={handleChange}
      className="flex-1 border border-gray-300 p-2 rounded-lg focus:ring-2 focus:ring-blue-300 focus:outline-none"
    >
      <option value="">Select Duration</option>
      <option value="full">Full Day</option>
      <option value="first_half">First Half</option>
      <option value="second_half">Second Half</option>
    </select>
  </div>

  {/* Reason */}
  <div className="flex flex-col sm:flex-row sm:items-center sm:gap-4">
    <label className="text-gray-600 font-medium sm:w-1/3">Reason (optional)</label>
    <input
      type="text"
      name="reason"
      value={form.reason}
      onChange={handleChange}
      placeholder="Enter reason"
      className="flex-1 border border-gray-300 p-2 rounded-lg focus:ring-2 focus:ring-blue-300 focus:outline-none"
    />
  </div>

  {/* Submit Button */}
  <button
    onClick={handleSubmit}
    className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold p-3 rounded-lg shadow-md transition duration-200"
  >
    Apply
  </button>
</div>
  );
}