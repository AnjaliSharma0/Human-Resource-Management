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

  return (
    <div className="bg-white p-6 rounded shadow w-96">

      <h2 className="font-semibold mb-4">Create Leave Type</h2>

      <input
        placeholder="Name"
        value={form.name}
        onChange={(e) => setForm({ ...form, name: e.target.value })}
        className="border p-2 w-full mb-2"
      />

      <input
        placeholder="Days per year"
        type="number"
        value={form.daysPerYear}
        onChange={(e) => setForm({ ...form, daysPerYear: e.target.value })}
        className="border p-2 w-full mb-2"
      />

      <textarea
        placeholder="Description"
        value={form.description}
        onChange={(e) => setForm({ ...form, description: e.target.value })}
        className="border p-2 w-full mb-2"
      />

      <button
        onClick={handleSubmit}
        className="bg-blue-600 text-white px-4 py-2 rounded"
      >
        Create
      </button>

      {/* List */}
      <div className="mt-4">
        {types.map((t) => (
          <div key={t.id} className="border p-2 mb-2 rounded">
            <b>{t.name}</b> ({t.daysPerYear})
          </div>
        ))}
      </div>

    </div>
  );
}