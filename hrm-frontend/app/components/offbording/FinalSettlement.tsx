// // "use client";

// // import { useState, useEffect } from "react";
// // import api from "@/app/src/services/api";
// // import toast from "react-hot-toast";
// // import useRole from "@/app/src/hook/userole";
// // import RoleGuard from "@/app/src/hook/rolegaurd";

// // // For simple bar chart
// // import {
// //   BarChart,
// //   Bar,
// //   XAxis,
// //   YAxis,
// //   CartesianGrid,
// //   Tooltip,
// //   ResponsiveContainer,
// // } from "recharts";

// // export default function SettlementCalculator() {
// //   const role = useRole();

// //   const [employees, setEmployees] = useState<any[]>([]);
// //   const [selectedEmployee, setSelectedEmployee] = useState<number | null>(null);

// //   const [form, setForm] = useState({
// //     salaryDue: 0,
// //     deductions: 0,
// //   });

// //   const [records, setRecords] = useState<any[]>([]);

// //   const finalAmount = form.salaryDue - form.deductions;

// //   // Fetch employees
// //   useEffect(() => {
// //     const fetchEmployees = async () => {
// //       try {
// //         const res = await api.get("/employees");
// //         setEmployees(res.data);
// //         if (res.data.length > 0) setSelectedEmployee(res.data[0].id);
// //       } catch {
// //         toast.error("Failed to fetch employees");
// //       }
// //     };
// //     fetchEmployees();
// //     fetchData();
// //   }, []);

// //   // Fetch settlements
// //   const fetchData = async () => {
// //     try {
// //       const res = await api.get("/final-settlement");
// //       setRecords(res.data);
// //     } catch {
// //       toast.error("Failed to fetch settlements");
// //     }
// //   };

// //   // Save settlement
// //   const handleSave = async () => {
// //     if (!selectedEmployee) return toast.error("Please select an employee");

// //     try {
// //       await api.post("/final-settlement", {
// //         ...form,
// //         finalAmount,
// //         employeeId: selectedEmployee,
// //       });
// //       toast.success("Saved successfully");
// //       setForm({ salaryDue: 0, deductions: 0 });
// //       fetchData();
// //     } catch (err: any) {
// //       console.error(err.response || err);
// //       toast.error("Error saving settlement");
// //     }
// //   };

// //   return (
// //     <div className="space-y-8 p-6">
// //       {/* Admin Form */}
// //       <RoleGuard allowed={["admin"]}>
// //         <div className="bg-white p-6 rounded-xl shadow-lg space-y-4">
// //           <h2 className="text-2xl font-bold mb-2">Calculate Final Settlement</h2>

// //           {/* Employee Dropdown */}
// //           <div className="flex flex-col sm:flex-row sm:items-center gap-3">
// //             <label className="font-medium min-w-[120px]">Employee:</label>
// //             <select
// //               value={selectedEmployee ?? ""}
// //               onChange={(e) => setSelectedEmployee(Number(e.target.value))}
// //               className="border p-2 rounded flex-1"
// //             >
// //               {employees.map((emp) => (
// //                 <option key={emp.id} value={emp.id}>
// //                   {emp.firstName} {emp.lastName} - ({emp.id})
// //                 </option>
// //               ))}
// //             </select>
// //           </div>

// //           {/* Salary & Deductions */}
// //           <div className="grid gap-3 sm:grid-cols-2">
// //             <div className="flex flex-col">
// //               <label className="font-medium">Salary Due</label>
// //               <input
// //                 type="number"
// //                 placeholder="Salary Due"
// //                 value={form.salaryDue}
// //                 onChange={(e) =>
// //                   setForm({ ...form, salaryDue: Number(e.target.value) })
// //                 }
// //                 className="border p-2 rounded"
// //               />
// //             </div>

// //             <div className="flex flex-col">
// //               <label className="font-medium">Deductions</label>
// //               <input
// //                 type="number"
// //                 placeholder="Deductions"
// //                 value={form.deductions}
// //                 onChange={(e) =>
// //                   setForm({ ...form, deductions: Number(e.target.value) })
// //                 }
// //                 className="border p-2 rounded"
// //               />
// //             </div>
// //           </div>

// //           <div className="mt-2 text-lg font-semibold">
// //             Final Amount: <span className="text-green-600">₹{finalAmount}</span>
// //           </div>

// //           <button
// //             onClick={handleSave}
// //             className="mt-4 w-full bg-green-600 text-white py-2 rounded hover:bg-green-700 transition"
// //           >
// //             Save Settlement
// //           </button>
// //         </div>
// //       </RoleGuard>

// //       {/* Settlements List */}
// //       <h2 className="text-xl font-bold">All Settlements</h2>
// //       <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
// //         {records.map((rec) => (
// //           <div
// //             key={rec.id}
// //             className="p-4 border rounded-lg bg-white shadow-sm"
// //           >
// //             <p className="text-sm font-medium">EmpID:- {rec.employeeId}</p>
// //             <p className="text-sm">Salary: ₹{rec.salaryDue}</p>
// //             <p className="text-sm">Deductions: ₹{rec.deductions}</p>
// //             <p className="font-semibold mt-2 text-green-600">
// //               Final: ₹{rec.finalAmount}
// //             </p>
// //           </div>
// //         ))}
// //       </div>

// //       {/* Graph */}
// //       <div className="bg-white p-6 rounded-xl shadow-lg">
// //         <h2 className="text-xl font-bold mb-4">Settlement Summary</h2>
// //         {records.length === 0 ? (
// //           <p className="text-gray-500 text-center py-6">No settlements to show</p>
// //         ) : (
// //           <ResponsiveContainer width="100%" height={300}>
// //             <BarChart data={records} margin={{ top: 10, bottom: 10 }}>
// //               <CartesianGrid strokeDasharray="3 3" />
// //               <XAxis dataKey="employeeId" />
// //               <YAxis />
// //               <Tooltip />
              
// //               <Bar dataKey="salaryDue" fill="#4ade80" name="Salary" />
// //               <Bar dataKey="deductions" fill="#f87171" name="Deductions" />
// //               <Bar dataKey="finalAmount" fill="#3b82f6" name="Final" />
// //             </BarChart>
// //           </ResponsiveContainer>
// //         )}
// //       </div>
// //     </div>
// //   );
// // }

// "use client";

// import { useState, useEffect } from "react";
// import api from "@/app/src/services/api";
// import toast from "react-hot-toast";

// // For simple bar chart
// import {
//   BarChart,
//   Bar,
//   XAxis,
//   YAxis,
//   CartesianGrid,
//   Tooltip,
//   ResponsiveContainer,
// } from "recharts";

// export default function SettlementCalculator() {
//   const userId = Number(localStorage.getItem("userId")); // logged-in employee ID

//   const [records, setRecords] = useState<any[]>([]);

//   // Fetch settlements
//   const fetchData = async () => {
//     try {
//       const res = await api.get("/final-settlement");

//       // Filter to only show the logged-in employee
//       const employeeData = res.data.filter((rec: any) => rec.employeeId === userId);
//       setRecords(employeeData);
//     } catch {
//       toast.error("Failed to fetch settlements");
//     }
//   };

//   useEffect(() => {
//     fetchData();
//   }, []);

//   if (records.length === 0) {
//     return (
//       <div className="p-6 text-center text-gray-500">
//         No settlements available.
//       </div>
//     );
//   }

//   const totalSalary = records.reduce((sum, r) => sum + r.salaryDue, 0);
//   const totalDeductions = records.reduce((sum, r) => sum + r.deductions, 0);
//   const totalFinal = records.reduce((sum, r) => sum + r.finalAmount, 0);

//   return (
//     <div className="space-y-8 p-6">
//       {/* Employee Summary */}
//       <div className="bg-white p-6 rounded-xl shadow-lg space-y-4">
//         <h2 className="text-2xl font-bold mb-2">Your Final Settlement</h2>

//         <div className="grid gap-4 sm:grid-cols-3">
//           <div className="p-4 bg-green-50 rounded text-center">
//             <p className="text-gray-500">Total Salary</p>
//             <p className="text-lg font-semibold text-green-600">₹{totalSalary}</p>
//           </div>
//           <div className="p-4 bg-red-50 rounded text-center">
//             <p className="text-gray-500">Total Deductions</p>
//             <p className="text-lg font-semibold text-red-600">₹{totalDeductions}</p>
//           </div>
//           <div className="p-4 bg-blue-50 rounded text-center">
//             <p className="text-gray-500">Total Final</p>
//             <p className="text-lg font-semibold text-blue-600">₹{totalFinal}</p>
//           </div>
//         </div>
//       </div>

//       {/* Detailed Settlements */}
//       <div className="grid gap-4 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
//         {records.map((rec) => (
//           <div
//             key={rec.id}
//             className="p-4 border rounded-lg bg-white shadow-sm"
//           >
//             <p className="text-sm">Salary: ₹{rec.salaryDue}</p>
//             <p className="text-sm">Deductions: ₹{rec.deductions}</p>
//             <p className="font-semibold mt-2 text-blue-600">
//               Final: ₹{rec.finalAmount}
//             </p>
//           </div>
//         ))}
//       </div>

//       {/* Graph */}
//       <div className="bg-white p-6 rounded-xl shadow-lg">
//         <h2 className="text-xl font-bold mb-4">Your Settlement Graph</h2>
//         <ResponsiveContainer width="100%" height={300}>
//           <BarChart data={records} margin={{ top: 10, bottom: 10 }}>
//             <CartesianGrid strokeDasharray="3 3" />
//             <XAxis dataKey="id" />
//             <YAxis />
//             <Tooltip />
//             <Bar dataKey="salaryDue" fill="#4ade80" name="Salary" />
//             <Bar dataKey="deductions" fill="#f87171" name="Deductions" />
//             <Bar dataKey="finalAmount" fill="#3b82f6" name="Final" />
//           </BarChart>
//         </ResponsiveContainer>
//       </div>
//     </div>
//   );
// }

"use client";

import { useState, useEffect } from "react";
import api from "@/app/src/services/api";
import toast from "react-hot-toast";
import useRole from "@/app/src/hook/userole";
import { Dialog, DialogTitle, DialogContent, DialogActions, Button, TextField, Select, MenuItem } from "@mui/material";

// For simple bar chart
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

export default function SettlementCalculator() {
  const role = useRole(); // "admin" or "employee"
  const userId = Number(localStorage.getItem("userId")); // logged-in employee ID

  const [employees, setEmployees] = useState<any[]>([]);
  const [records, setRecords] = useState<any[]>([]);

  // Admin modal state
  const [openModal, setOpenModal] = useState(false);
  const [form, setForm] = useState({
    employeeId: 0,
    salaryDue: 0,
    deductions: 0,
  });

  const finalAmount = form.salaryDue - form.deductions;

  // Fetch employees and settlements
  useEffect(() => {
    const fetchEmployees = async () => {
      if (role === "admin") {
        try {
          const res = await api.get("/employees");
          setEmployees(res.data);
          if (res.data.length > 0) setForm((f) => ({ ...f, employeeId: res.data[0].id }));
        } catch {
          toast.error("Failed to fetch employees");
        }
      }
    };
    fetchEmployees();
    fetchData();
  }, [role]);

  const fetchData = async () => {
    try {
      const res = await api.get("/final-settlement");

      if (role === "employee") {
        const employeeData = res.data.filter((rec: any) => rec.employeeId === userId);
        setRecords(employeeData);
      } else {
        setRecords(res.data);
      }
    } catch {
      toast.error("Failed to fetch settlements");
    }
  };

  // Admin: Save settlement
  const handleSave = async () => {
    if (!form.employeeId) return toast.error("Select an employee");

    try {
      await api.post("/final-settlement", {
        employeeId: form.employeeId,
        salaryDue: form.salaryDue,
        deductions: form.deductions,
        finalAmount,
      });
      toast.success("Settlement saved!");
      setForm({ employeeId: employees[0]?.id || 0, salaryDue: 0, deductions: 0 });
      setOpenModal(false);
      fetchData();
    } catch (err: any) {
      console.error(err.response || err);
      toast.error("Error saving settlement");
    }
  };

  if (records.length === 0) {
    return (
      <div className="p-6 text-center text-gray-500">
        No settlements available.
      </div>
    );
  }

  // Totals
  const totalSalary = records.reduce((sum, r) => sum + r.salaryDue, 0);
  const totalDeductions = records.reduce((sum, r) => sum + r.deductions, 0);
  const totalFinal = records.reduce((sum, r) => sum + r.finalAmount, 0);

  return (
    <div className="space-y-8 p-6">

      {/* Admin Button for Modal */}
      {role === "admin" && (
        <Button variant="contained" color="primary" onClick={() => setOpenModal(true)}>
          Add Settlement
        </Button>
      )}

      {/* Summary */}
      <div className="bg-white p-6 rounded-xl shadow-lg space-y-4">
        <h2 className="text-2xl font-bold mb-2">
          {role === "employee" ? "Your Final Settlement" : "All Settlements Summary"}
        </h2>
        <div className="grid gap-4 sm:grid-cols-3">
          <div className="p-4 bg-green-50 rounded text-center">
            <p className="text-gray-500">Total Salary</p>
            <p className="text-lg font-semibold text-green-600">₹{totalSalary}</p>
          </div>
          <div className="p-4 bg-red-50 rounded text-center">
            <p className="text-gray-500">Total Deductions</p>
            <p className="text-lg font-semibold text-red-600">₹{totalDeductions}</p>
          </div>
          <div className="p-4 bg-blue-50 rounded text-center">
            <p className="text-gray-500">Total Final</p>
            <p className="text-lg font-semibold text-blue-600">₹{totalFinal}</p>
          </div>
        </div>
      </div>

      {/* Detailed Settlements */}
      <div className="grid gap-4 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
        {records.map((rec) => (
          <div
            key={rec.id}
            className="p-4 border rounded-lg bg-white shadow-sm"
          >
            {role === "admin" && (
              <p className="text-sm font-medium">EmpID: {rec.employeeId}</p>
            )}
            <p className="text-sm">Salary: ₹{rec.salaryDue}</p>
            <p className="text-sm">Deductions: ₹{rec.deductions}</p>
            <p className="font-semibold mt-2 text-blue-600">
              Final: ₹{rec.finalAmount}
            </p>
          </div>
        ))}
      </div>

      {/* Graph */}
      <div className="bg-white p-6 rounded-xl shadow-lg">
        <h2 className="text-xl font-bold mb-4">
          {role === "employee" ? "Your Settlement Graph" : "Settlements Graph"}
        </h2>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={records} margin={{ top: 10, bottom: 10 }}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey={role === "employee" ? "id" : "employeeId"} />
            <YAxis />
            <Tooltip />
            <Bar dataKey="salaryDue" fill="#4ade80" name="Salary" />
            <Bar dataKey="deductions" fill="#f87171" name="Deductions" />
            <Bar dataKey="finalAmount" fill="#3b82f6" name="Final" />
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Admin Modal */}
      <Dialog open={openModal} onClose={() => setOpenModal(false)} fullWidth>
        <DialogTitle>Add Settlement</DialogTitle>
        <DialogContent className="space-y-4">
          <div>
            <label className="font-medium">Employee:</label>
            <Select
              fullWidth
              value={form.employeeId}
              onChange={(e) => setForm({ ...form, employeeId: Number(e.target.value) })}
            >
              {employees.map((emp) => (
                <MenuItem key={emp.id} value={emp.id}>
                  {emp.firstName} {emp.lastName} - ({emp.id})
                </MenuItem>
              ))}
            </Select>
          </div>
          <TextField
            label="Salary Due"
            type="number"
            fullWidth
            value={form.salaryDue}
            onChange={(e) => setForm({ ...form, salaryDue: Number(e.target.value) })}
          />
          <TextField
            label="Deductions"
            type="number"
            fullWidth
            value={form.deductions}
            onChange={(e) => setForm({ ...form, deductions: Number(e.target.value) })}
          />
          <p className="font-semibold mt-2">Final Amount: ₹{finalAmount}</p>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenModal(false)}>Cancel</Button>
          <Button variant="contained" onClick={handleSave}>Save</Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}