
"use client";

import api from "@/app/src/services/api";
import { useState } from "react";
import toast from "react-hot-toast";

export default function AddEmployeeModal({ close, reload }: any) {

  const [form, setForm] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    dateOfBirth: "",
    gender: "Male",
    address: "",
    joiningDate: "",
    departmentId: "",
    designationId: ""
  });

  const handleChange = (e: any) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value
    });
  };

  const submit = async () => {

    try {

      await api.post("/employees", {
        ...form,
        departmentId: Number(form.departmentId),
        designationId: Number(form.designationId)
      });

      toast.success("Employee created");

      reload();
      close();

    } catch (err: any) {

      console.log(err.response?.data);
      toast.error(err.response?.data?.message || "Failed to create employee");

    }

  };

  //✅ Check if any required field is missing
  const isFormIncomplete = Object.values(form).some(
    (value) => value === "" || value === null
  );

  return (

    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4">

      <div className="bg-white rounded-xl shadow-xl w-full max-w-xl max-h-[90vh] overflow-y-auto p-6">

        <h2 className="text-xl font-bold mb-6">
          Add Employee
        </h2>


        {/* FORM GRID */}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

          <input
            name="firstName"
            placeholder="First Name"
            className="border p-2 rounded"
            onChange={handleChange}
          />

          <input
            name="lastName"
            placeholder="Last Name"
            className="border p-2 rounded"
            onChange={handleChange}
          />

          <input
            name="email"
            placeholder="Email"
            className="border p-2 rounded"
            onChange={handleChange}
          />

          <input
            name="phone"
            placeholder="Phone"
            className="border p-2 rounded"
            onChange={handleChange}
          />

          <div className="md:col-span-2">
            <label className="text-sm text-gray-500">Date of Birth</label>
            <input
              type="date"
              name="dateOfBirth"
              className="border p-2 rounded w-full"
              onChange={handleChange}
            />
          </div>

          <select
            name="gender"
            className="border p-2 rounded"
            onChange={handleChange}
          >
            <option value="Male">Male</option>
            <option value="Female">Female</option>
            <option value="Other">Other</option>
          </select>

          <input
            name="address"
            placeholder="Address"
            className="border p-2 rounded"
            onChange={handleChange}
          />

          <div className="md:col-span-2">
            <label className="text-sm text-gray-500">Joining Date</label>
            <input
              type="date"
              name="joiningDate"
              className="border p-2 rounded w-full"
              onChange={handleChange}
            />
          </div>

          <input
            name="departmentId"
            placeholder="Department ID"
            className="border p-2 rounded"
            onChange={handleChange}
          />

          <input
            name="designationId"
            placeholder="Designation ID"
            className="border p-2 rounded"
            onChange={handleChange}
          />

        </div>


        {/* BUTTONS */}

        <div className="flex justify-end gap-3 mt-6">

          <button
            onClick={close}
            className="px-4 py-2 bg-gray-200 rounded"
          >
            Cancel
          </button>
          <button
            onClick={submit}
            disabled={isFormIncomplete} // ✅ Disable if form incomplete
            className={`px-4 py-2 rounded text-white ${isFormIncomplete ? "bg-gray-400 cursor-not-allowed" : "bg-indigo-600"
              }`}
          >
            Create Employee
          </button>
        </div>

      </div>

    </div>

  );

}