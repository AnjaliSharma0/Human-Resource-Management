"use client";

import { useState, useEffect } from "react";
import { leaveApi } from "@/app/src/services/leave";
import toast from "react-hot-toast";

export default function LeaveTypeAdmin() {
  const [types, setTypes] = useState<any[]>([]);
  const [form, setForm] = useState({
    name: "",
    daysPerYear: "",
    description: ""
  });

//   if(!form.name && !form.daysPerYear && !form.description){
//     return toast.error("All fields must required!")
//   }
  const fetchTypes = async () => {
    const res = await leaveApi.getLeaveTypes();
    setTypes(res.data);
  };

  useEffect(() => {
    fetchTypes();
  }, []);

  const handleSubmit = async () => {
    try {
      await leaveApi.createLeaveType({
        ...form,
        daysPerYear: Number(form.daysPerYear)
      });
      toast.success("Leave type created");
      setForm({ name: "", daysPerYear: "", description: "" });
      fetchTypes();
    } catch(err:any) {
        console.log("Error", err.message)
      toast.error("Failed to create leave type");
    }
  };

  return  (
  <div className="min-h-screen bg-gray-100 flex items-start justify-center p-6">

    <div className="w-full max-w-3xl bg-white rounded-2xl shadow-lg p-6 space-y-6">

      {/* HEADER */}
      <div>
        <h2 className="text-2xl font-bold text-gray-800">
          Leave Type Management
        </h2>
        <p className="text-sm text-gray-500">
          Create and manage employee leave types
        </p>
      </div>

      {/* FORM */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">

        <div className="flex flex-col">
          <label className="text-sm text-gray-600 mb-1">Leave Name</label>
          <input
            placeholder="e.g. Casual Leave"
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
            className="border rounded-lg p-2 focus:ring-2 focus:ring-blue-500 outline-none"
          />
        </div>

        <div className="flex flex-col">
          <label className="text-sm text-gray-600 mb-1">Days / Year</label>
          <input
            type="number"
            placeholder="e.g. 12"
            value={form.daysPerYear}
            onChange={(e) => setForm({ ...form, daysPerYear: e.target.value })}
            className="border rounded-lg p-2 focus:ring-2 focus:ring-blue-500 outline-none"
          />
        </div>

        <div className="flex flex-col md:col-span-3">
          <label className="text-sm text-gray-600 mb-1">Description</label>
          <textarea
            placeholder="Short description..."
            value={form.description}
            onChange={(e) => setForm({ ...form, description: e.target.value })}
            className="border rounded-lg p-2 focus:ring-2 focus:ring-blue-500 outline-none"
            rows={2}
          />
        </div>

      </div>

      {/* ACTION */}
      <div className="flex justify-end">
        <button
          onClick={handleSubmit}
          disabled={!form.name || !form.daysPerYear}
          className={`px-5 py-2 rounded-lg text-white transition 
            ${!form.name || !form.daysPerYear 
              ? "bg-gray-400 cursor-not-allowed" 
              : "bg-blue-600 hover:bg-blue-700"}
          `}
        >
          + Create Leave Type
        </button>
      </div>

      {/* LIST */}
      <div>
        <h3 className="text-lg font-semibold text-gray-700 mb-3">
          Existing Leave Types
        </h3>

        <div className="grid gap-3">
          {types.length === 0 ? (
            <p className="text-gray-500 text-sm">No leave types added yet</p>
          ) : (
            types.map((t) => (
              <div
                key={t.id}
                className="flex justify-between items-center p-4 border rounded-xl hover:shadow-md transition bg-gray-50"
              >
                <div>
                  <p className="font-semibold text-gray-800">{t.name}</p>
                  <p className="text-sm text-gray-500">
                    {t.daysPerYear} days / year
                  </p>
                  {t.description && (
                    <p className="text-xs text-gray-400 mt-1">
                      {t.description}
                    </p>
                  )}
                </div>

                <span className="text-xs bg-blue-100 text-blue-600 px-3 py-1 rounded-full">
                  Active
                </span>
              </div>
            ))
          )}
        </div>
      </div>

    </div>
  </div>
);
}