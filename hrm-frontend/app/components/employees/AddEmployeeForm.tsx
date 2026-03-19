
// // "use client";

// // import api from "@/app/src/services/api";
// // import { useState } from "react";
// // import toast from "react-hot-toast";

// // export default function AddEmployeeModal({ close, reload }: any) {

// //   const [form, setForm] = useState({
// //     firstName: "",
// //     lastName: "",
// //     email: "",
// //     phone: "",
// //     dateOfBirth: "",
// //     gender: "Male",
// //     address: "",
// //     joiningDate: "",
// //     departmentId: "",
// //     designationId: "",
// //     bankAccountNumber: "",
// //     bankIFSC: "",
// //     panNumber: "",
// //     managerId: "",
// //     salaryGradeId: ""
// //   });

// //   const handleChange = (e: any) => {
// //     setForm({
// //       ...form,
// //       [e.target.name]: e.target.value
// //     });
// //   };

// //   const submit = async () => {

// //     try {

// //       await api.post("/employees", {
// //         ...form,
// //         departmentId: Number(form.departmentId),
// //         designationId: Number(form.designationId),
// //       managerId: form.managerId ? Number(form.managerId) : null,
// //      salaryGradeId: form.salaryGradeId ? Number(form.salaryGradeId) : null
// //       });

// //       toast.success("Employee created");

// //       reload();
// //       close();

// //     } catch (err: any) {

// //       console.log(err.response?.data);
// //       toast.error(err.response?.data?.message || "Failed to create employee");

// //     }

// //   };

// //   //✅ Check if any required field is missing
// //   const isFormIncomplete = Object.values(form).some(
// //     (value) => value === "" || value === null
// //   );

// //   return (

// //     <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4">

// //       <div className="bg-white rounded-xl shadow-xl w-full max-w-xl max-h-[90vh] overflow-y-auto p-6">

// //         <h2 className="text-xl font-bold mb-6">
// //           Add Employee
// //         </h2>


// //         {/* FORM GRID */}

// //         <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

// //           <input
// //             name="firstName"
// //             placeholder="First Name"
// //             className="border p-2 rounded"
// //             onChange={handleChange}
// //           />

// //           <input
// //             name="lastName"
// //             placeholder="Last Name"
// //             className="border p-2 rounded"
// //             onChange={handleChange}
// //           />

// //           <input
// //             name="email"
// //             placeholder="Email"
// //             className="border p-2 rounded"
// //             onChange={handleChange}
// //           />

// //           <input
// //             name="phone"
// //             placeholder="Phone"
// //             className="border p-2 rounded"
// //             onChange={handleChange}
// //           />

// //           <div className="md:col-span-2">
// //             <label className="text-sm text-gray-500">Date of Birth</label>
// //             <input
// //               type="date"
// //               name="dateOfBirth"
// //               className="border p-2 rounded w-full"
// //               onChange={handleChange}
// //             />
// //           </div>

// //           <select
// //             name="gender"
// //             className="border p-2 rounded"
// //             onChange={handleChange}
// //           >
// //             <option value="Male">Male</option>
// //             <option value="Female">Female</option>
// //             <option value="Other">Other</option>
// //           </select>

// //           <input
// //             name="address"
// //             placeholder="Address"
// //             className="border p-2 rounded"
// //             onChange={handleChange}
// //           />

// //           <div className="md:col-span-2">
// //             <label className="text-sm text-gray-500">Joining Date</label>
// //             <input
// //               type="date"
// //               name="joiningDate"
// //               className="border p-2 rounded w-full"
// //               onChange={handleChange}
// //             />
// //           </div>

// //           <input
// //             name="departmentId"
// //             placeholder="Department ID"
// //             className="border p-2 rounded"
// //             onChange={handleChange}
// //           />

// //           <input
// //             name="designationId"
// //             placeholder="Designation ID"
// //             className="border p-2 rounded"
// //             onChange={handleChange}
// //           />
// //           <input
// //             name="bankAccountNumber"
// //             placeholder="Bank Account Number"
// //             className="border p-2 rounded"
// //             onChange={handleChange}
// //           />

// //           <input
// //             name="bankIFSC"
// //             placeholder="Bank IFSC"
// //             className="border p-2 rounded"
// //             onChange={handleChange}
// //           />

// //           <input
// //             name="panNumber"
// //             placeholder="PAN Number"
// //             className="border p-2 rounded"
// //             onChange={handleChange}
// //           />

// //           <input
// //             name="managerId"
// //             placeholder="Manager ID"
// //             className="border p-2 rounded"
// //             onChange={handleChange}
// //           />

// //           <input
// //             name="salaryGradeId"
// //             placeholder="Salary Grade ID"
// //             className="border p-2 rounded"
// //             onChange={handleChange}
// //           />
// //         </div>


// //         {/* BUTTONS */}

// //         <div className="flex justify-end gap-3 mt-6">

// //           <button
// //             onClick={close}
// //             className="px-4 py-2 bg-gray-200 rounded"
// //           >
// //             Cancel
// //           </button>
// //           <button
// //             onClick={submit}
// //             disabled={isFormIncomplete} // ✅ Disable if form incomplete
// //             className={`px-4 py-2 rounded text-white ${isFormIncomplete ? "bg-gray-400 cursor-not-allowed" : "bg-indigo-600"
// //               }`}
// //           >
// //             Create Employee
// //           </button>
// //         </div>

// //       </div>

// //     </div>

// //   );

// // }



// "use client";

// import { useState, useEffect } from "react";
// import api from "@/app/src/services/api";
// import toast from "react-hot-toast";

// export default function AddEmployeeModal({ close, reload }: any) {
//   const [form, setForm] = useState({
//     firstName: "",
//     lastName: "",
//     email: "",
//     phone: "",
//     dateOfBirth: "",
//     gender: "Male",
//     address: "",
//     joiningDate: "",
//     departmentId: "",
//     designationId: "",
//     bankAccountNumber: "",
//     bankIFSC: "",
//     panNumber: "",
//     managerId: "",
//     salaryGradeId: "",
//     role: "EMPLOYEE"
//   });

//   const [managers, setManagers] = useState<any[]>([]);
//   const [departments, setDepartments] = useState<any[]>([]);
//   const [designations, setDesignations] = useState<any[]>([]);

//   // fetch managers, departments, and designations
//   useEffect(() => {
//     const fetchData = async () => {
//       try {
//         const [empRes, deptRes, desigRes] = await Promise.all([
//           api.get("/employees"),
//           api.get("/departments"),
//           api.get("/designations"),
//         ]);

//         const mgrs = empRes.data.filter((e: any) => e.role === "MANAGER");
//         setManagers(mgrs);
//         setDepartments(deptRes.data);
//         setDesignations(desigRes.data);
//       } catch (err) {
//         console.log(err);
//       }
//     };
//     fetchData();
//   }, []);

//   const handleChange = (e: any) => {
//     setForm({
//       ...form,
//       [e.target.name]: e.target.value
//     });
//   };

//   const submit = async () => {
//     try {
//       await api.post("/employees", {
//         ...form,
//         departmentId: form.departmentId ? Number(form.departmentId) : undefined,
//         designationId: form.designationId ? Number(form.designationId) : undefined,
//         managerId: form.managerId ? Number(form.managerId) : undefined,
//         salaryGradeId: form.salaryGradeId ? Number(form.salaryGradeId) : undefined,
//       });

//       toast.success(`${form.role} created successfully`);
//       reload();
//       close();
//     } catch (err: any) {
//       console.log(err.response?.data);
//       toast.error(err.response?.data?.message || "Failed to create employee");
//     }
//   };

//   const isFormIncomplete = !form.firstName || !form.lastName || !form.email || !form.joiningDate || !form.role;

//   return (
//     <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4">
//       <div className="bg-white rounded-xl shadow-xl w-full max-w-xl max-h-[90vh] overflow-y-auto p-6">
//         <h2 className="text-xl font-bold mb-6">Add {form.role === "MANAGER" ? "Manager" : "Employee"}</h2>

//         <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//           <input name="firstName" placeholder="First Name" className="border p-2 rounded" onChange={handleChange} />
//           <input name="lastName" placeholder="Last Name" className="border p-2 rounded" onChange={handleChange} />
//           <input name="email" placeholder="Email" className="border p-2 rounded" onChange={handleChange} />
//           <input name="phone" placeholder="Phone" className="border p-2 rounded" onChange={handleChange} />

//           <div className="md:col-span-2">
//             <label className="text-sm text-gray-500">Date of Birth</label>
//             <input type="date" name="dateOfBirth" className="border p-2 rounded w-full" onChange={handleChange} />
//           </div>

//           <select name="gender" className="border p-2 rounded" onChange={handleChange}>
//             <option value="Male">Male</option>
//             <option value="Female">Female</option>
//             <option value="Other">Other</option>
//           </select>

//           <input name="address" placeholder="Address" className="border p-2 rounded" onChange={handleChange} />

//           <div className="md:col-span-2">
//             <label className="text-sm text-gray-500">Joining Date</label>
//             <input type="date" name="joiningDate" className="border p-2 rounded w-full" onChange={handleChange} />
//           </div>

//           {/* Department Dropdown */}
//           <select name="departmentId" className="border p-2 rounded" onChange={handleChange}>
//             <option value="">Select Department</option>
//             {departments.map((d: any) => (
//               <option key={d.id} value={d.id}>{d.name}</option>
//             ))}
//           </select>

//           {/* Designation Dropdown */}
//           <select name="designationId" className="border p-2 rounded" onChange={handleChange}>
//             <option value="">Select Designation</option>
//             {designations.map((d: any) => (
//               <option key={d.id} value={d.id}>{d.title}</option>
//             ))}
//           </select>

//           <input name="bankAccountNumber" placeholder="Bank Account Number" className="border p-2 rounded" onChange={handleChange} />
//           <input name="bankIFSC" placeholder="Bank IFSC" className="border p-2 rounded" onChange={handleChange} />
//           <input name="panNumber" placeholder="PAN Number" className="border p-2 rounded" onChange={handleChange} />

//           {/* Role Selection */}
//           <select name="role" className="border p-2 rounded" onChange={handleChange}>
//             <option value="EMPLOYEE">Employee</option>
//             <option value="MANAGER">Manager</option>
//           </select>

//           {/* Only show manager dropdown if role is EMPLOYEE */}
//           {form.role === "EMPLOYEE" && (
//             <select name="managerId" className="border p-2 rounded" onChange={handleChange}>
//               <option value="">Select Manager</option>
//               {managers.map((mgr: any) => (
//                 <option key={mgr.id} value={mgr.id}>{mgr.firstName} {mgr.lastName}</option>
//               ))}
//             </select>
//           )}

//           <input name="salaryGradeId" placeholder="Salary Grade ID" className="border p-2 rounded" onChange={handleChange} />

//         </div>

//         <div className="flex justify-end gap-3 mt-6">
//           <button onClick={close} className="px-4 py-2 bg-gray-200 rounded">Cancel</button>
//           <button
//             onClick={submit}
//             disabled={isFormIncomplete}
//             className={`px-4 py-2 rounded text-white ${isFormIncomplete ? "bg-gray-400 cursor-not-allowed" : "bg-indigo-600"}`}
//           >
//             Create {form.role === "MANAGER" ? "Manager" : "Employee"}
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
    designationId: "",
    bankAccountNumber: "",
    bankIFSC: "",
    panNumber: "",
    managerId: "",
    salaryGradeId: "",
    role: "employee", // EMPLOYEE or MANAGER
  });

  const [departments, setDepartments] = useState<any[]>([]);
  const [designations, setDesignations] = useState<any[]>([]);
  const [managers, setManagers] = useState<any[]>([]);
  const [salaryGrades, setSalaryGrades]= useState<any[]>([])
  
  // Fetch Departments, Designations, and Managers on mount
  useEffect(() => {
    const fetchData = async () => {
      try {
        const depRes = await api.get("/departments");
        const desRes = await api.get("/designations");
        const empRes = await api.get("/employees");
        const salRes= await api.get("/salary-grades")
      

        setDepartments(depRes.data);
        setDesignations(desRes.data);
        setManagers(empRes.data.filter((e: any) => e.user.role === "manager"));
        console.log(empRes.data)
        setSalaryGrades(salRes.data)
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
      await api.post("/employees", {
        ...form,
        departmentId: form.departmentId ? Number(form.departmentId) : undefined,
        designationId: form.designationId ? Number(form.designationId) : undefined,
        managerId: form.managerId ? Number(form.managerId) : undefined,
        salaryGradeId: form.salaryGradeId ? Number(form.salaryGradeId) : undefined,
      });

      toast.success(`${form.role} created successfully`);
      reload();
      close();
    } catch (err: any) {
      console.log(err.response?.data);
      toast.error(err.response?.data?.message || "Failed to create employee");
    }
  };

  const isFormIncomplete = !form.firstName || !form.lastName || !form.email || !form.joiningDate || !form.role;

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-xl w-full max-w-xl max-h-[90vh] overflow-y-auto p-6">
        <h2 className="text-xl font-bold mb-6">
          Add {form.role === "manager" ? "manager" : "employee"}
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <input name="firstName" placeholder="First Name" className="border p-2 rounded" onChange={handleChange} />
          <input name="lastName" placeholder="Last Name" className="border p-2 rounded" onChange={handleChange} />
          <input name="email" placeholder="Email" className="border p-2 rounded" onChange={handleChange} />
          <input name="phone" placeholder="Phone" className="border p-2 rounded" onChange={handleChange} />

          <div className="md:col-span-2">
            <label className="text-sm text-gray-500">Date of Birth</label>
            <input type="date" name="dateOfBirth" className="border p-2 rounded w-full" onChange={handleChange} />
          </div>

          <select name="gender" className="border p-2 rounded" onChange={handleChange}>
            <option value="Male">Male</option>
            <option value="Female">Female</option>
            <option value="Other">Other</option>
          </select>

          <input name="address" placeholder="Address" className="border p-2 rounded" onChange={handleChange} />

          <div className="md:col-span-2">
            <label className="text-sm text-gray-500">Joining Date</label>
            <input type="date" name="joiningDate" className="border p-2 rounded w-full" onChange={handleChange} />
          </div>

          {/* Department Dropdown */}
          <select name="departmentId" className="border p-2 rounded" onChange={handleChange}>
            <option value="">Select Department</option>
            {departments.map((dep) => (
              <option key={dep.id} value={dep.id}>
                {dep.name}
              </option>
            ))}
          </select>

          {/* Designation Dropdown */}
          <select name="designationId" className="border p-2 rounded" onChange={handleChange}>
            <option value="">Select Designation</option>
            {designations.map((des) => (
              <option key={des.id} value={des.id}>
                {des.title}
              </option>
            ))}
          </select>

          <input name="bankAccountNumber" placeholder="Bank Account Number" className="border p-2 rounded" onChange={handleChange} />
          <input name="bankIFSC" placeholder="Bank IFSC" className="border p-2 rounded" onChange={handleChange} />
          <input name="panNumber" placeholder="PAN Number" className="border p-2 rounded" onChange={handleChange} />

          {/* Role Selection */}
          <select name="role" className="border p-2 rounded" onChange={handleChange}>
            <option value="employee">Employee</option>
            <option value="manager">Manager</option>
          </select>

          {/* Manager Dropdown only for Employee */}
          {form.role === "employee" && (
            <select name="managerId" className="border p-2 rounded" onChange={handleChange}>
              <option value="">Select Manager</option>
              {managers.map((mgr: any) => (
                <option key={mgr.id} value={mgr.id}>
                  {mgr.firstName} {mgr.lastName}
                </option>
              ))}
            </select>
          )}

          {/* Salary Grade Dropdown */}
          <select name="salaryGradeId" className="border p-2 rounded" onChange={handleChange}>
            <option value="">Select Salary Grade</option>
            {/* Fetch this from backend similarly if you want */}
            {salaryGrades.map((sal:any)=>(
              <option key={sal.id} value={sal.id}>
                {sal.grade_name}
              </option>
            ))}
          </select>
        </div>

        <div className="flex justify-end gap-3 mt-6">
          <button onClick={close} className="px-4 py-2 bg-gray-200 rounded">Cancel</button>
          <button
            onClick={submit}
            disabled={isFormIncomplete}
            className={`px-4 py-2 rounded text-white ${isFormIncomplete ? "bg-gray-400 cursor-not-allowed" : "bg-indigo-600"}`}
          >
            Create {form.role === "manager" ? "Manager" : "Employee"}
          </button>
        </div>
      </div>
    </div>
  );
}