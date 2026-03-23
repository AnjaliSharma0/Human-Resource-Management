
// "use client";

// import { useState, useEffect } from "react";
// import toast from "react-hot-toast";
// import api from "@/app/src/services/api";
// import { AttachMoney } from "@mui/icons-material";
// import AddSalaryGradeModal from "@/app/components/payroll/SalaryGradeModel";
// import SalaryGradesPage from "@/app/components/payroll/SalaryGradePage";

// type Employee = {
//   id: number;
//   firstName: string;
//   lastName: string;
//   salaryGrade?: {
//     basic: number;
//     hra: number;
//     allowances: number;
//     deductions: number;
//   };
// };

// type Payroll = {
//   id: number;
//   employee: { id: number; firstName: string; lastName: string };
//   month: number;
//   year: number;
//   netSalary: number;
// };

// export default function AdminPayrollPage() {
//   const [employees, setEmployees] = useState<Employee[]>([]);
//   const [payrolls, setPayrolls] = useState<Payroll[]>([]);
//   const [salaryGrades, setSalaryGrades] = useState<any[]>([]);
//   const [reload, setReload] = useState(false);
//   const [showSalaryModal, setShowSalaryModal] = useState(false);
//   // --- Inline Payroll Form State ---
//   const [selectedEmployee, setSelectedEmployee] = useState<number | null>(null);
//   const [month, setMonth] = useState<number>(new Date().getMonth() + 1);
//   const [year, setYear] = useState<number>(new Date().getFullYear());
//   const [basic, setBasic] = useState<number>();
//   const [hra, setHra] = useState<number>();
//   const [allowances, setAllowances] = useState<number>();
//   const [deductions, setDeductions] = useState<number>();
//   const [bonus, setBonus] = useState<number>();
//   const [arrears, setArrears] = useState<number>();
//   const [displayCount, setDisplayCount] = useState(10);
//   const [showSalaryGradesPage, setShowSalaryGradesPage] = useState(false);
//   // --- Fetch Employees ---
//   useEffect(() => {
//     const fetchEmployees = async () => {
//       try {
//         const res = await api.get("/employees");
//         setEmployees(res.data);
//       } catch {
//         toast.error("Error fetching employees");
//       }
//     };
//     fetchEmployees();
//   }, [reload]);

//   // --- Fetch Payrolls ---
//   const fetchPayrolls = async () => {
//     try {
//       const res = await api.get("/payrolls", {
//         headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
//       });
//       setPayrolls(res.data);
//     } catch {
//       toast.error("Error fetching payrolls");
//     }
//   };

//   // --- Fetch Salary Grades ---
//   const fetchSalaryGrades = async () => {
//     try {
//       const res = await api.get("/salary-grades");
//       setSalaryGrades(res.data);
//     } catch {
//       toast.error("Error fetching salary grades");
//     }
//   };

//   useEffect(() => {
//     fetchPayrolls();
//     fetchSalaryGrades();
//   }, [reload]);

//   // --- Generate Payroll ---
//   const generatePayroll = async () => {
//     if (!selectedEmployee) return toast.error("Select an employee");

//     const payload: any = { employeeId: selectedEmployee, month, year };
//     if (basic !== undefined) payload.basic = basic;
//     if (hra !== undefined) payload.hra = hra;
//     if (allowances !== undefined) payload.allowances = allowances;
//     if (deductions !== undefined) payload.deductions = deductions;
//     if (bonus !== undefined) payload.bonus = bonus;
//     if (arrears !== undefined) payload.arrears = arrears;

//     try {
//       await api.post("/payrolls/generate", payload);
//       toast.success("Payroll generated!");
//       setReload(!reload);

//       // Reset form
//       setSelectedEmployee(null);
//       setMonth(new Date().getMonth() + 1);
//       setYear(new Date().getFullYear());
//       setBasic(undefined);
//       setHra(undefined);
//       setAllowances(undefined);
//       setDeductions(undefined);
//       setBonus(undefined);
//       setArrears(undefined);
//     } catch (err: any) {
//       toast.error(err.response?.data?.message || "Error generating payroll");
//     }
//   };

//   const generateAllPayrolls = async () => {
//     try {
//       await api.post("/payrolls/generate-all", { month, year });
//       toast.success("All payrolls generated!");
//       setReload(!reload);
//     } catch (err: any) {
//       toast.error(err.response?.data?.message || "Error generating payrolls");
//     }
//   };

//   const downloadBankAdvice = async () => {
//     try {
//       const res = await api.get(`/payrolls/bank-advice?month=${month}&year=${year}`, {
//         responseType: "blob",
//       });
//       const url = window.URL.createObjectURL(new Blob([res.data], { type: "text/csv" }));
//       const link = document.createElement("a");
//       link.href = url;
//       link.setAttribute("download", `bank-advice-${month}-${year}.csv`);
//       document.body.appendChild(link);
//       link.click();
//       link.remove();
//     } catch (err: any) {
//       toast.error(err.response?.data?.message || "Failed to download bank advice");
//     }
//   };

//   const downloadPayslip = async (id: number) => {
//     try {
//       const res = await api.get(`/payrolls/payslip/${id}`, {
//         responseType: "blob", // important for binary PDF
//       });

//       // Create a blob and download
//       const url = window.URL.createObjectURL(new Blob([res.data], { type: "application/pdf" }));
//       const link = document.createElement("a");
//       link.href = url;
//       link.setAttribute("download", `payslip-${id}.pdf`);
//       document.body.appendChild(link);
//       link.click();
//       link.remove();
//     } catch (err: any) {
//       toast.error(err.response?.data?.message || "Failed to download payslip");
//     }
//   };

//   return (
//     <div className="p-4 sm:p-6 lg:p-8 bg-gray-50 min-h-screen space-y-8">

//       {/* HEADER */}
//       <h1 className="text-2xl sm:text-3xl font-bold text-center">Admin Payroll Management</h1>

//       {/* INLINE PAYROLL FORM */}
//       <div className="bg-white p-6 rounded-xl shadow space-y-4 m-3">
//          <button
//             onClick={() => setShowSalaryModal(true)}
//             className="bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 m-2 rounded"
//           >
//             Add Salary Grade
//           </button>
         
//             <button
//               onClick={() => setShowSalaryGradesPage(true)}
//               className="bg-purple-600 hover:bg-blue-500 text-white px-4 m-2 py-2 rounded"
//             >
//               Manage Salary Grades
//             </button>
//         </div>
//         <h2 className="font-semibold text-lg text-center bg-blue-400 ">Generate Payroll</h2>
//         <div className="flex flex-wrap align-left gap-3 mb-4">
         
//         {/* Employee Selector */}
//         <select
//           className="border p-2 rounded w-full"
//           value={selectedEmployee || ""}
//           onChange={(e) => setSelectedEmployee(Number(e.target.value))}
//         >
//           <option value="">Select Employee</option>
//           {employees.map(emp => (
//             <option key={emp.id} value={emp.id}>
//               {emp.firstName} {emp.lastName}
//             </option>
//           ))}
//         </select>

//         {/* Month & Year */}
//         <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
//           <input
//             type="number"
//             placeholder="Month"
//             className="border p-2 rounded w-full"
//             value={month}
//             onChange={(e) => setMonth(Number(e.target.value))}
//           />
//           <input
//             type="number"
//             placeholder="Year"
//             className="border p-2 rounded w-full"
//             value={year}
//             onChange={(e) => setYear(Number(e.target.value))}
//           />
//         </div>

//         {/* Salary Inputs */}
//         <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
//           <input type="number" placeholder="Basic" className="border p-2 rounded" onChange={e => setBasic(Number(e.target.value))} />
//           <input type="number" placeholder="HRA" className="border p-2 rounded" onChange={e => setHra(Number(e.target.value))} />
//           <input type="number" placeholder="Allowances" className="border p-2 rounded" onChange={e => setAllowances(Number(e.target.value))} />
//           <input type="number" placeholder="Deductions" className="border p-2 rounded" onChange={e => setDeductions(Number(e.target.value))} />
//           <input type="number" placeholder="Bonus" className="border p-2 rounded" onChange={e => setBonus(Number(e.target.value))} />
//           <input type="number" placeholder="Arrears" className="border p-2 rounded" onChange={e => setArrears(Number(e.target.value))} />
//         </div>

//         {/* Action Buttons */}
//         <div className="flex flex-col sm:flex-row flex-wrap gap-3 pt-2">
//           <button onClick={generatePayroll} className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded w-full sm:w-auto">
//             Generate Payroll
//           </button>
//           <button onClick={generateAllPayrolls} className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded w-full sm:w-auto">
//             Generate All Payrolls
//           </button>
//           <button onClick={downloadBankAdvice} className="bg-yellow-600 hover:bg-yellow-700 text-white px-4 py-2 rounded w-full sm:w-auto">
//             Download Bank Advice
//           </button>
//         </div>
//       </div>

//       {/* PAYROLL LIST */}
//       <div className="bg-white p-4 sm:p-6 rounded-xl shadow">
//         <h2 className="text-lg font-semibold mb-4">All Payrolls</h2>

//         <div className="overflow-x-auto">
//           <table className="w-full">
//             <thead className="bg-gray-100 text-left">
//               <tr>
//                 <th className="p-3">Employee</th>
//                 <th className="p-3">Month</th>
//                 <th className="p-3">Year</th>
//                 <th className="p-3">Net Salary</th>
//                 <th className="p-3">Payslip</th>
//               </tr>
//             </thead>
//             <tbody>
//               {payrolls
//                 .slice(0, displayCount)
//                 .map((p) => (
//                   <tr key={p.id} className="border-t hover:bg-gray-50">
//                     <td className="p-3">{p.employee.firstName} {p.employee.lastName}</td>
//                     <td className="p-3">{p.month}</td>
//                     <td className="p-3">{p.year}</td>
//                     <td className="p-3 font-medium">₹{p.netSalary}</td>
//                     <td className="p-3">
//                       <button
//                         onClick={() => downloadPayslip(p.id)}
//                         className="bg-blue-600 text-white px-3 py-1 rounded text-sm"
//                       >
//                         Download PDF
//                       </button>
//                     </td>
//                   </tr>
//                 ))}
//             </tbody>
//           </table>

//           {/* SHOW MORE / LESS BUTTON */}
//           {payrolls.length > displayCount && (
//             <div className="flex justify-center mt-4">
//               <button
//                 onClick={() => setDisplayCount(displayCount + 10)}
//                 className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded"
//               >
//                 Show More
//               </button>
//             </div>
//           )}

//           {displayCount > 10 && (
//             <div className="flex justify-center mt-2">
//               <button
//                 onClick={() => setDisplayCount(10)}
//                 className="bg-gray-300 hover:bg-gray-400 text-gray-700 px-4 py-2 rounded"
//               >
//                 Show Less
//               </button>
//             </div>
//           )}

//         </div>
//       </div>

//       {/* SALARY GRADES */}
//       <div className="p-6 bg-white shadow rounded-lg">
//         <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
//           <AttachMoney /> Salary Grades
//         </h2>

//         <div className="space-y-3">
//           {salaryGrades.map((sal: any) => (
//             <div key={sal.id} className="flex items-center justify-between p-4 border rounded hover:bg-gray-50 transition">
//               <p className="font-medium text-gray-800">{sal.grade_name}</p>
//               <div className="flex gap-4 text-gray-600">
//                 <span>Basic: ₹{sal.basic}</span>
//                 <span>HRA: ₹{sal.hra}</span>
//                 <span>Allowances: ₹{sal.allowances}</span>
//               </div>
//             </div>
//           ))}
//         </div>
//       </div>
//       {showSalaryModal && (
//         <AddSalaryGradeModal
//           close={() => setShowSalaryModal(false)}
//           reload={() => setReload(!reload)}
//         />
//       )}
//       {showSalaryGradesPage && (
//         <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
//           <div className="bg-white w-full max-w-5xl p-6 rounded-lg shadow-lg relative">
//             <button
//               onClick={() => setShowSalaryGradesPage(false)}
//               className="absolute top-4 right-4 text-gray-600 hover:text-gray-900 text-lg font-bold"
//             >
//               ✕
//             </button>

//             <SalaryGradesPage />
//           </div>
//         </div>
//       )}

//     </div>
//   );
// }


"use client";

import { useState, useEffect } from "react";
import toast from "react-hot-toast";
import api from "@/app/src/services/api";
import { AttachMoney } from "@mui/icons-material";
import AddSalaryGradeModal from "@/app/components/payroll/SalaryGradeModel";
import SalaryGradesPage from "@/app/components/payroll/SalaryGradePage";

type Employee = {
  id: number;
  firstName: string;
  lastName: string;
  salaryGrade?: {
    basic: number;
    hra: number;
    allowances: number;
    deductions: number;
  };
};

type Payroll = {
  id: number;
  employee: { id: number; firstName: string; lastName: string };
  month: number;
  year: number;
  netSalary: number;
};

const MONTH_NAMES = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

export default function AdminPayrollPage() {
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [payrolls, setPayrolls] = useState<Payroll[]>([]);
  const [salaryGrades, setSalaryGrades] = useState<any[]>([]);
  const [reload, setReload] = useState(false);
  const [showSalaryModal, setShowSalaryModal] = useState(false);
  const [showSalaryGradesPage, setShowSalaryGradesPage] = useState(false);
  const [loadingPayrolls, setLoadingPayrolls] = useState(false);
  const [loadingGrades, setLoadingGrades] = useState(false);

  // --- Inline Payroll Form State ---
  const [selectedEmployee, setSelectedEmployee] = useState<number | null>(null);
  const [month, setMonth] = useState<number>(new Date().getMonth() + 1);
  const [year, setYear] = useState<number>(new Date().getFullYear());
  const [basic, setBasic] = useState<number>();
  const [hra, setHra] = useState<number>();
  const [allowances, setAllowances] = useState<number>();
  const [deductions, setDeductions] = useState<number>();
  const [bonus, setBonus] = useState<number>();
  const [arrears, setArrears] = useState<number>();
  const [displayCount, setDisplayCount] = useState(10);

  // --- Fetch Employees ---
  useEffect(() => {
    const fetchEmployees = async () => {
      try {
        const res = await api.get("/employees");
        setEmployees(res.data);
      } catch {
        toast.error("Error fetching employees");
      }
    };
    fetchEmployees();
  }, [reload]);

  // --- Fetch Payrolls ---
  const fetchPayrolls = async () => {
    setLoadingPayrolls(true);
    try {
      const res = await api.get("/payrolls", {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      });
      setPayrolls(res.data);
    } catch {
      toast.error("Error fetching payrolls");
    } finally {
      setLoadingPayrolls(false);
    }
  };

  // --- Fetch Salary Grades ---
  const fetchSalaryGrades = async () => {
    setLoadingGrades(true);
    try {
      const res = await api.get("/salary-grades");
      setSalaryGrades(res.data);
    } catch {
      toast.error("Error fetching salary grades");
    } finally {
      setLoadingGrades(false);
    }
  };

  useEffect(() => {
    fetchPayrolls();
    fetchSalaryGrades();
  }, [reload]);

  // --- Generate Payroll ---
  const generatePayroll = async () => {
    if (!selectedEmployee) return toast.error("Select an employee");

    const payload: any = { employeeId: selectedEmployee, month, year };
    if (basic !== undefined) payload.basic = basic;
    if (hra !== undefined) payload.hra = hra;
    if (allowances !== undefined) payload.allowances = allowances;
    if (deductions !== undefined) payload.deductions = deductions;
    if (bonus !== undefined) payload.bonus = bonus;
    if (arrears !== undefined) payload.arrears = arrears;

    try {
      await api.post("/payrolls/generate", payload);
      toast.success("Payroll generated!");
      setReload(!reload);

      // Reset form
      setSelectedEmployee(null);
      setMonth(new Date().getMonth() + 1);
      setYear(new Date().getFullYear());
      setBasic(undefined);
      setHra(undefined);
      setAllowances(undefined);
      setDeductions(undefined);
      setBonus(undefined);
      setArrears(undefined);
    } catch (err: any) {
      toast.error(err.response?.data?.message || "Error generating payroll");
    }
  };

  const generateAllPayrolls = async () => {
    try {
      await api.post("/payrolls/generate-all", { month, year });
      toast.success("All payrolls generated!");
      setReload(!reload);
    } catch (err: any) {
      toast.error(err.response?.data?.message || "Error generating payrolls");
    }
  };

  const downloadBankAdvice = async () => {
    try {
      const res = await api.get(`/payrolls/bank-advice?month=${month}&year=${year}`, {
        responseType: "blob",
      });
      const url = window.URL.createObjectURL(new Blob([res.data], { type: "text/csv" }));
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", `bank-advice-${month}-${year}.csv`);
      document.body.appendChild(link);
      link.click();
      link.remove();
    } catch (err: any) {
      toast.error(err.response?.data?.message || "Failed to download bank advice");
    }
  };

  const downloadPayslip = async (id: number) => {
    try {
      const res = await api.get(`/payrolls/payslip/${id}`, {
        responseType: "blob",
      });
      const url = window.URL.createObjectURL(new Blob([res.data], { type: "application/pdf" }));
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", `payslip-${id}.pdf`);
      document.body.appendChild(link);
      link.click();
      link.remove();
    } catch (err: any) {
      toast.error(err.response?.data?.message || "Failed to download payslip");
    }
  };

  // --- Calculate Net Salary Inline ---
  const netSalary = (basic || 0) + (hra || 0) + (allowances || 0) + (bonus || 0) + (arrears || 0) - (deductions || 0);

  return (
    <div className="p-4 sm:p-6 lg:p-8 bg-gray-50 min-h-screen space-y-8">

      {/* HEADER */}
      <h1 className="text-2xl sm:text-3xl font-bold text-center">Admin Payroll Management</h1>

      {/* INLINE PAYROLL FORM */}
      <div className="bg-white p-6 rounded-xl shadow space-y-4 m-3">
        <div className="flex gap-3 flex-wrap">
          <button
            onClick={() => setShowSalaryModal(true)}
            className="bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 m-2 rounded"
          >
            Add Salary Grade
          </button>
          <button
            onClick={() => setShowSalaryGradesPage(true)}
            className="bg-purple-600 hover:bg-blue-500 text-white px-4 m-2 py-2 rounded"
          >
            Manage Salary Grades
          </button>
        </div>

        <h2 className="font-semibold text-lg text-center bg-blue-400 p-2 rounded">Generate Payroll</h2>

        <div className="flex flex-wrap align-left gap-3 mb-4">
          {/* Employee Selector */}
          <select
            className="border p-2 rounded w-full"
            value={selectedEmployee || ""}
            onChange={(e) => setSelectedEmployee(Number(e.target.value))}
          >
            <option value="">Select Employee</option>
            {employees.map(emp => (
              <option key={emp.id} value={emp.id}>
                {emp.firstName} {emp.lastName}
              </option>
            ))}
          </select>

          {/* Month & Year */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <input
              type="number"
              placeholder="Month"
              className="border p-2 rounded w-full"
              value={month}
              onChange={(e) => setMonth(Number(e.target.value))}
            />
            <input
              type="number"
              placeholder="Year"
              className="border p-2 rounded w-full"
              value={year}
              onChange={(e) => setYear(Number(e.target.value))}
            />
          </div>

          {/* Salary Inputs */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            <input type="number" placeholder="Basic" className="border p-2 rounded" onChange={e => setBasic(Number(e.target.value))} />
            <input type="number" placeholder="HRA" className="border p-2 rounded" onChange={e => setHra(Number(e.target.value))} />
            <input type="number" placeholder="Allowances" className="border p-2 rounded" onChange={e => setAllowances(Number(e.target.value))} />
            <input type="number" placeholder="Deductions" className="border p-2 rounded" onChange={e => setDeductions(Number(e.target.value))} />
            <input type="number" placeholder="Bonus" className="border p-2 rounded" onChange={e => setBonus(Number(e.target.value))} />
            <input type="number" placeholder="Arrears" className="border p-2 rounded" onChange={e => setArrears(Number(e.target.value))} />
          </div>

          {/* Net Salary Preview */}
          <div className="text-right w-full font-semibold">
            Net Salary: ₹{netSalary}
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row flex-wrap gap-3 pt-2">
            <button onClick={generatePayroll} className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded w-full sm:w-auto">
              Generate Payroll
            </button>
            <button onClick={generateAllPayrolls} className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded w-full sm:w-auto">
              Generate All Payrolls
            </button>
            <button onClick={downloadBankAdvice} className="bg-yellow-600 hover:bg-yellow-700 text-white px-4 py-2 rounded w-full sm:w-auto">
              Download Bank Advice
            </button>
          </div>
        </div>
      </div>

      {/* PAYROLL LIST */}
      <div className="bg-white p-4 sm:p-6 rounded-xl shadow">
        <h2 className="text-lg font-semibold mb-4">All Payrolls</h2>

        <div className="overflow-x-auto">
          {loadingPayrolls ? (
            <div className="space-y-2">
              {[...Array(5)].map((_, i) => (
                <div key={i} className="h-8 bg-gray-200 rounded animate-pulse"></div>
              ))}
            </div>
          ) : (
            <table className="w-full">
              <thead className="bg-gray-100 text-left">
                <tr>
                  <th className="p-3">Employee</th>
                  <th className="p-3">Month</th>
                  <th className="p-3">Year</th>
                  <th className="p-3">Net Salary</th>
                  <th className="p-3">Payslip</th>
                </tr>
              </thead>
              <tbody>
                {payrolls
                  .slice(0, displayCount)
                  .map((p) => (
                    <tr key={p.id} className="border-t hover:bg-gray-50">
                      <td className="p-3">{p.employee.firstName} {p.employee.lastName}</td>
                      <td className="p-3">{MONTH_NAMES[p.month - 1]}</td>
                      <td className="p-3">{p.year}</td>
                      <td className="p-3 font-medium">₹{p.netSalary}</td>
                      <td className="p-3">
                        <button
                          onClick={() => downloadPayslip(p.id)}
                          className="bg-blue-600 text-white px-3 py-1 rounded text-sm"
                        >
                          Download PDF
                        </button>
                      </td>
                    </tr>
                  ))}
              </tbody>
            </table>
          )}

          {/* SHOW MORE / LESS BUTTON */}
          {payrolls.length > displayCount && (
            <div className="flex justify-center mt-4">
              <button
                onClick={() => setDisplayCount(displayCount + 10)}
                className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded"
              >
                Show More
              </button>
            </div>
          )}
          {displayCount > 10 && (
            <div className="flex justify-center mt-2">
              <button
                onClick={() => setDisplayCount(10)}
                className="bg-gray-300 hover:bg-gray-400 text-gray-700 px-4 py-2 rounded"
              >
                Show Less
              </button>
            </div>
          )}
        </div>
      </div>

      {/* SALARY GRADES */}
      <div className="p-6 bg-white shadow rounded-lg">
        <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
          <AttachMoney /> Salary Grades
        </h2>
        {loadingGrades ? (
          <div className="space-y-2">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="h-8 bg-gray-200 rounded animate-pulse"></div>
            ))}
          </div>
        ) : (
          <div className="space-y-3">
            {salaryGrades.map((sal: any) => (
              <div key={sal.id} className="flex items-center justify-between p-4 border rounded hover:bg-gray-50 transition">
                <p className="font-medium text-gray-800">{sal.grade_name}</p>
                <div className="flex gap-4 text-gray-600">
                  <span>Basic: ₹{sal.basic}</span>
                  <span>HRA: ₹{sal.hra}</span>
                  <span>Allowances: ₹{sal.allowances}</span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {showSalaryModal && (
        <AddSalaryGradeModal
          close={() => setShowSalaryModal(false)}
          reload={() => setReload(!reload)}
        />
      )}

      {showSalaryGradesPage && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white w-full max-w-5xl p-6 rounded-lg shadow-lg relative">
            <button
              onClick={() => setShowSalaryGradesPage(false)}
              className="absolute top-4 right-4 text-gray-600 hover:text-gray-900 text-lg font-bold"
            >
              ✕
            </button>
            <SalaryGradesPage />
          </div>
        </div>
      )}
    </div>
  );
}