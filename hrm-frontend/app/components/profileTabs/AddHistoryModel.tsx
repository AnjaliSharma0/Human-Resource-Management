"use client";

import api from "@/app/src/services/api";
import { useState } from "react";
import toast from "react-hot-toast";

interface AddHistoryModalProps {
  employeeId: string;
  close: () => void;
  reload: () => void;
}

export default function AddHistoryModal({ employeeId, close, reload }: AddHistoryModalProps) {
  const [form, setForm] = useState({
    companyName: "",
    designation: "",
    startDate: "",
    endDate: "",
    description: ""
  });

  const handleChange = (field: string, value: string) => {
    setForm({ ...form, [field]: value });
  };

  const submit = async () => {
    try {
      // Validate required fields
      if (!form.companyName || !form.designation || !form.startDate || !form.endDate) {
        toast.error("Please fill all required fields");
        return;
      }

      await api.post(`/employees/${employeeId}/history`, form);

      toast.success("History added");
      reload();
      close();
    } catch {
      toast.error("Failed to add history");
    }
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black/40 z-50">
      <div className="bg-white p-6 rounded-xl w-[450px] shadow-lg">
        <h2 className="text-xl font-bold mb-4">Add Employment History</h2>

        <div className="flex flex-col gap-3">
          <div>
            <label className="block text-sm font-medium mb-1">Company Name</label>
            <input
              type="text"
              className="border p-2 w-full rounded"
              value={form.companyName}
              onChange={(e) => handleChange("companyName", e.target.value)}
              placeholder="Company Name"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Designation</label>
            <input
              type="text"
              className="border p-2 w-full rounded"
              value={form.designation}
              onChange={(e) => handleChange("designation", e.target.value)}
              placeholder="Designation"
            />
          </div>

          <div className="flex gap-2">
            <div className="flex-1">
              <label className="block text-sm font-medium mb-1">Start Date</label>
              <input
                type="date"
                className="border p-2 w-full rounded"
                value={form.startDate}
                onChange={(e) => handleChange("startDate", e.target.value)}
              />
            </div>

            <div className="flex-1">
              <label className="block text-sm font-medium mb-1">End Date</label>
              <input
                type="date"
                className="border p-2 w-full rounded"
                value={form.endDate}
                onChange={(e) => handleChange("endDate", e.target.value)}
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Description</label>
            <textarea
              className="border p-2 w-full rounded"
              value={form.description}
              onChange={(e) => handleChange("description", e.target.value)}
              placeholder="Job Description"
            />
          </div>
        </div>

        <div className="flex gap-3 mt-5 justify-end">
          <button
            onClick={submit}
            className="bg-indigo-600 text-white px-4 py-2 rounded hover:bg-indigo-700"
          >
            Add
          </button>
          <button
            onClick={close}
            className="bg-gray-300 px-4 py-2 rounded hover:bg-gray-400"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
}