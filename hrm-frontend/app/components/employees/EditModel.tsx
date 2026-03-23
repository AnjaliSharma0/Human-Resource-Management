// "use client";

// import { useEffect, useState } from "react";
// import toast from "react-hot-toast";
// import api from "@/app/src/services/api";

// export default function EditEmployeeModal({ employee, close, reload }: any) {

//   const [form, setForm] = useState({
//     firstName: employee.firstName || "",
//     lastName: employee.lastName || "",
//     email: employee.email || "",
//     phone: employee.phone || "",
//     dateOfBirth: employee.dateOfBirth?.slice(0, 10) || "",
//     gender: employee.gender || "Male",
//     address: employee.address || "",
//     joiningDate: employee.joiningDate?.slice(0, 10) || "",
//     status: employee.status || "Active",
//     department: employee.department || "",
//     designation: employee.designation || "",
  
//   });


//   const [departments, setDepartments] = useState([]);
//   const [designations, setDesignations] = useState([]);

//   useEffect(() => {
//     const fetchData = async () => {
//       const depRes = await api.get("/departments");
//       const desRes = await api.get("/designations");
//       setDepartments(depRes.data);
//       setDesignations(desRes.data);
//     };
//     fetchData();
//   }, []);

//   const handleChange = (e: any) => {
//     setForm({
//       ...form,
//       [e.target.name]: e.target.value
//     });
//   };

//   const updateEmployee = async () => {

//     try {

//       await api.patch(`/employees/${employee.id}`, form);

//       toast.success("Employee updated");

//       reload();
//       close();

//     } catch {

//       toast.error("Update failed");

//     }

//   };

//   return (

//     <div className="fixed inset-0 bg-black/40 flex justify-center items-center z-50">

//       <div className="bg-white rounded-xl p-6 w-[500px] shadow-xl">

//         <h2 className="text-xl font-bold mb-4">
//           Edit Employee
//         </h2>


//         <div className="grid grid-cols-2 gap-3">


//           <input
//             name="firstName"
//             value={form.firstName}
//             onChange={handleChange}
//             className="border p-2 rounded"
//             placeholder="First Name"
//           />

//           <input
//             name="lastName"
//             value={form.lastName}
//             onChange={handleChange}
//             className="border p-2 rounded"
//             placeholder="Last Name"
//           />

//           <input
//             name="email"
//             value={form.email}
//             onChange={handleChange}
//             className="border p-2 rounded"
//             placeholder="Email"
//           />

//           <input
//             name="phone"
//             value={form.phone}
//             onChange={handleChange}
//             className="border p-2 rounded"
//             placeholder="Phone"
//           />


//           <label className="text-sm text-gray-500 col-span-2">
//             Date of Birth
//           </label>

//           <input
//             type="date"
//             name="dateOfBirth"
//             value={form.dateOfBirth}
//             onChange={handleChange}
//             className="border p-2 rounded col-span-2"
//           />


//           <select
//             name="gender"
//             value={form.gender}
//             onChange={handleChange}
//             className="border p-2 rounded"
//           >

//             <option value="Male">Male</option>
//             <option value="Female">Female</option>
//             <option value="Other">Other</option>

//           </select>


//           <select
//             name="status"
//             value={form.status}
//             onChange={handleChange}
//             className="border p-2 rounded"
//           >

//             <option value="Active">Active</option>
//             <option value="Pending">Pending</option>
//             <option value="Inactive">Inactive</option>

//           </select>


//           <input
//             name="joiningDate"
//             type="date"
//             value={form.joiningDate}
//             onChange={handleChange}
//             className="border p-2 rounded col-span-2"
//           />


//           <input
//             name="address"
//             value={form.address}
//             onChange={handleChange}
//             className="border p-2 rounded col-span-2"
//             placeholder="Address"
//           />

//           <select
//             name="department"
//             value={form.department}
//             onChange={handleChange}
//             className="border p-2 rounded"
//           >
//             <option value="">Select Department</option>
//             {departments.map((d: any) => (
//               <option key={d.id} value={d.id}>{d.name}</option>
//             ))}
//           </select>

//           <select
//             name="designation"
//             value={form.designation}
//             onChange={handleChange}
//             className="border p-2 rounded"
//           >
//             <option value="">Select Designation</option>
//             {designations.map((d: any) => (
//               <option key={d.id} value={d.id}>{d.title}</option>
//             ))}
//           </select>

//         </div>


//         <div className="flex justify-end gap-3 mt-5">

//           <button
//             onClick={close}
//             className="px-4 py-2 border rounded"
//           >
//             Cancel
//           </button>

//           <button
//             onClick={updateEmployee}
//             className="px-4 py-2 bg-indigo-600 text-white rounded"
//           >
//             Update Employee
//           </button>

//         </div>

//       </div>

//     </div>

//   );

// }

"use client";

import { useState, useEffect } from "react";
import api from "@/app/src/services/api";
import toast from "react-hot-toast";

export default function EditEmployeeModal({ employee, close, reload }: any) {
  const [form, setForm] = useState({
    firstName: employee.firstName || "",
    lastName: employee.lastName || "",
    email: employee.email || "",
    phone: employee.phone || "",
    dateOfBirth: employee.dateOfBirth?.slice(0, 10) || "",
    gender: employee.gender || "Male",
    address: employee.address || "",
    joiningDate: employee.joiningDate?.slice(0, 10) || "",
    departmentId: employee.department?.id || "",
    designationId: employee.designation?.id || "",
    bankAccountNumber: employee.bankAccountNumber || "",
    bankIFSC: employee.bankIFSC || "",
    panNumber: employee.panNumber || "",
    managerId: employee.manager?.id || "",
    salaryGradeId: employee.salaryGrade?.id || "",
    role: employee.user?.role?.toLowerCase() || "employee", // employee or manager
  });

  const [departments, setDepartments] = useState<any[]>([]);
  const [designations, setDesignations] = useState<any[]>([]);
  const [managers, setManagers] = useState<any[]>([]);
  const [salaryGrades, setSalaryGrades] = useState<any[]>([]);

  // Fetch data for dropdowns
  useEffect(() => {
    const fetchData = async () => {
      try {
        const [depRes, desRes, empRes, salRes] = await Promise.all([
          api.get("/departments"),
          api.get("/designations"),
          api.get("/employees"),
          api.get("/salary-grades"),
        ]);

        setDepartments(depRes.data);
        setDesignations(desRes.data);
        setManagers(empRes.data.filter((e: any) => e.user?.role === "manager"));
        setSalaryGrades(salRes.data);
      } catch (err) {
        console.log(err);
      }
    };
    fetchData();
  }, []);

  const handleChange = (e: any) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const submit = async () => {
    try {
      await api.patch(`/employees/${employee.id}`, {
        ...form,
        departmentId: form.departmentId ? Number(form.departmentId) : undefined,
        designationId: form.designationId ? Number(form.designationId) : undefined,
        managerId: form.managerId ? Number(form.managerId) : undefined,
        salaryGradeId: form.salaryGradeId ? Number(form.salaryGradeId) : undefined,
      });

      toast.success("Employee updated successfully");
      reload();
      close();
    } catch (err: any) {
      console.log(err.response?.data);
      toast.error(err.response?.data?.message || "Failed to update employee");
    }
  };

  const isFormIncomplete =
    !form.firstName || !form.lastName || !form.email || !form.joiningDate || !form.role;

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-xl w-full max-w-xl max-h-[90vh] overflow-y-auto p-6">
        <h2 className="text-xl font-bold mb-6">
          Edit {form.role === "manager" ? "Manager" : "Employee"}
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <input
            name="firstName"
            value={form.firstName}
            placeholder="First Name"
            className="border p-2 rounded"
            onChange={handleChange}
          />
          <input
            name="lastName"
            value={form.lastName}
            placeholder="Last Name"
            className="border p-2 rounded"
            onChange={handleChange}
          />
          <input
            name="email"
            value={form.email}
            placeholder="Email"
            className="border p-2 rounded"
            onChange={handleChange}
          />
          <input
            name="phone"
            value={form.phone}
            placeholder="Phone"
            className="border p-2 rounded"
            onChange={handleChange}
          />

          <div className="md:col-span-2">
            <label className="text-sm text-gray-500">Date of Birth</label>
            <input
              type="date"
              name="dateOfBirth"
              value={form.dateOfBirth}
              className="border p-2 rounded w-full"
              onChange={handleChange}
            />
          </div>

          <select name="gender" value={form.gender} className="border p-2 rounded" onChange={handleChange}>
            <option value="Male">Male</option>
            <option value="Female">Female</option>
            <option value="Other">Other</option>
          </select>

          <input
            name="address"
            value={form.address}
            placeholder="Address"
            className="border p-2 rounded"
            onChange={handleChange}
          />

          <div className="md:col-span-2">
            <label className="text-sm text-gray-500">Joining Date</label>
            <input
              type="date"
              name="joiningDate"
              value={form.joiningDate}
              className="border p-2 rounded w-full"
              onChange={handleChange}
            />
          </div>

          {/* Department Dropdown */}
          <select
            name="departmentId"
            value={form.departmentId}
            className="border p-2 rounded"
            onChange={handleChange}
          >
            <option value="">Select Department</option>
            {departments.map((dep) => (
              <option key={dep.id} value={dep.id}>
                {dep.name}
              </option>
            ))}
          </select>

          {/* Designation Dropdown */}
          <select
            name="designationId"
            value={form.designationId}
            className="border p-2 rounded"
            onChange={handleChange}
          >
            <option value="">Select Designation</option>
            {designations.map((des) => (
              <option key={des.id} value={des.id}>
                {des.title}
              </option>
            ))}
          </select>

          <input
            name="bankAccountNumber"
            value={form.bankAccountNumber}
            placeholder="Bank Account Number"
            className="border p-2 rounded"
            onChange={handleChange}
          />
          <input
            name="bankIFSC"
            value={form.bankIFSC}
            placeholder="Bank IFSC"
            className="border p-2 rounded"
            onChange={handleChange}
          />
          <input
            name="panNumber"
            value={form.panNumber}
            placeholder="PAN Number"
            className="border p-2 rounded"
            onChange={handleChange}
          />

          {/* Role Selection */}
          <select name="role" value={form.role} className="border p-2 rounded" onChange={handleChange}>
            <option value="employee">Employee</option>
            <option value="manager">Manager</option>
          </select>

          {/* Manager Dropdown for Employee role */}
          {form.role === "employee" && (
            <select
              name="managerId"
              value={form.managerId}
              className="border p-2 rounded"
              onChange={handleChange}
            >
              <option value="">Select Manager</option>
              {managers.map((mgr) => (
                <option key={mgr.id} value={mgr.id}>
                  {mgr.firstName} {mgr.lastName}
                </option>
              ))}
            </select>
          )}

          {/* Salary Grade Dropdown */}
          <select
            name="salaryGradeId"
            value={form.salaryGradeId}
            className="border p-2 rounded"
            onChange={handleChange}
          >
            <option value="">Select Salary Grade</option>
            {salaryGrades.map((sal) => (
              <option key={sal.id} value={sal.id}>
                {sal.grade_name}
              </option>
            ))}
          </select>
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
            Update {form.role === "manager" ? "Manager" : "Employee"}
          </button>
        </div>
      </div>
    </div>
  );
}