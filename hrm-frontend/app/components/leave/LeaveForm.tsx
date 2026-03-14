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
    duration:""
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = () => {
    if (!form.leaveTypeId || !form.startDate || !form.endDate) return;
    onSubmit(form);
    setForm({ leaveTypeId: "", startDate: "", endDate: "", reason: "",duration:"" });
  };

  return (
    <div className="flex flex-col  gap-3">
      <select
        name="leaveTypeId"
        value={form.leaveTypeId}
        onChange={handleChange}
        className="border p-2 rounded"
      >
        <option value="">Select Leave Type</option>
        {leaveTypes.map((t) => (
          <option key={t.id} value={t.id}>{t.name}</option>
        ))}
      </select>
      <input
        type="date"
        name="startDate"
        value={form.startDate}
        onChange={handleChange}
        className="border p-2 rounded"
      />
      <input
        type="date"
        name="endDate"
        value={form.endDate}
        onChange={handleChange}
        className="border p-2 rounded"
      />
      <select
  name="duration"
  value={form.duration}
  onChange={handleChange}
  className="border p-2 rounded"
>
  <option value="">Select Duration</option>
  <option value="full">Full Day</option>
  <option value="first_half">First Half</option>
  <option value="second_half">Second Half</option>
</select>
      <input
        type="text"
        name="reason"
        value={form.reason}
        onChange={handleChange}
        placeholder="Reason (optional)"
        className="border p-2 rounded"
      />
      <button
        onClick={handleSubmit}
        className="bg-blue-500 text-white p-2 rounded hover:bg-blue-600"
      >
        Apply
      </button>
    </div>
  );
}