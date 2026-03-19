"use client";

import { useState } from "react";
import api from "@/app/src/services/api";
import toast from "react-hot-toast";

interface Props {
  close: () => void;
  reload: () => void;
}

export default function AddSalaryGradeModal({ close, reload }: Props) {
  const [form, setForm] = useState({
    grade_name: "",
    basic: "",
    hra: "",
    allowances: "",
    deductions: "",
    pf_rate: "12",
    esi_rate: "1.75",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const submit = async () => {
    try {
      await api.post("/salary-grades", {
        ...form,
        basic: Number(form.basic),
        hra: Number(form.hra),
        allowances: Number(form.allowances || 0),
        deductions: Number(form.deductions || 0),
        pf_rate: Number(form.pf_rate),
        esi_rate: Number(form.esi_rate),
      });
      toast.success("Salary grade created");
      reload();
      close();
    } catch (err: any) {
      console.log(err.response?.data);
      toast.error(err.response?.data?.message || "Failed to create salary grade");
    }
  };

  const isFormIncomplete =
    !form.grade_name || !form.basic || !form.hra;

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-xl w-full max-w-lg max-h-[90vh] overflow-y-auto p-6">
        <h2 className="text-xl font-bold mb-6">Add Salary Grade</h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <input
            name="grade_name"
            placeholder="Grade Name"
            className="border p-2 rounded"
            value={form.grade_name}
            onChange={handleChange}
          />
          <input
            name="basic"
            placeholder="Basic"
            type="number"
            className="border p-2 rounded"
            value={form.basic}
            onChange={handleChange}
          />
          <input
            name="hra"
            placeholder="HRA"
            type="number"
            className="border p-2 rounded"
            value={form.hra}
            onChange={handleChange}
          />
          <input
            name="allowances"
            placeholder="Allowances"
            type="number"
            className="border p-2 rounded"
            value={form.allowances}
            onChange={handleChange}
          />
          <input
            name="deductions"
            placeholder="Deductions"
            type="number"
            className="border p-2 rounded"
            value={form.deductions}
            onChange={handleChange}
          />
          <input
            name="pf_rate"
            placeholder="PF Rate (%)"
            type="number"
            className="border p-2 rounded"
            value={form.pf_rate}
            onChange={handleChange}
          />
          <input
            name="esi_rate"
            placeholder="ESI Rate (%)"
            type="number"
            className="border p-2 rounded"
            value={form.esi_rate}
            onChange={handleChange}
          />
        </div>

        <div className="flex justify-end gap-3 mt-6">
          <button onClick={close} className="px-4 py-2 bg-gray-200 rounded">
            Cancel
          </button>
          <button
            onClick={submit}
            disabled={isFormIncomplete}
            className={`px-4 py-2 rounded text-white ${
              isFormIncomplete ? "bg-gray-400 cursor-not-allowed" : "bg-indigo-600"
            }`}
          >
            Create Grade
          </button>
        </div>
      </div>
    </div>
  );
}