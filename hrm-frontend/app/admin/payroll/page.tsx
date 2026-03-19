// "use client";

// import { useState, useEffect } from "react";
// import toast from "react-hot-toast";
// import api from "@/app/src/services/api";

// type Employee = { id: number; firstName: string; lastName: string };
// type Payroll = {
//   id: number;
//   employee: { id: number; firstName: string; lastName: string };
//   month: number;
//   year: number;
//   netSalary: number;
// };

// export default function AdminPayrollPage() {
//   const [employees, setEmployees] = useState<Employee[]>([]);
//   const [selectedEmployee, setSelectedEmployee] = useState<number | null>(null);
//   const [month, setMonth] = useState<number>(new Date().getMonth() + 1);
//   const [year, setYear] = useState<number>(new Date().getFullYear());

//   const [basic, setBasic] = useState<number>();
//   const [hra, setHra] = useState<number>();
//   const [allowances, setAllowances] = useState<number>();
//   const [deductions, setDeductions] = useState<number>();
//   const [bonus, setBonus] = useState<number>();
//   const [arrears, setArrears] = useState<number>();

//   const [payrolls, setPayrolls] = useState<Payroll[]>([]);

//   useEffect(() => {
//     api.get("/employees").then(res => setEmployees(res.data));
//   }, []);

//   const fetchPayrolls = async () => {
//     const res = await api.get("/payrolls", {
//       headers: { Authorization: `Bearer ${localStorage.getItem("token")}` }
//     });
//     setPayrolls(res.data);
//   };

//   useEffect(() => {
//     fetchPayrolls();
//   }, []);

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
//       fetchPayrolls();

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
//     } catch (err: any) {
//       toast.error(err.response?.data?.message || "Error generating payrolls");
//     }
//   };

//   const downloadBankAdvice = () => {
//     window.open(`/payrolls/bank-advice?month=${month}&year=${year}`, "_blank");
//   };

//   const downloadPayslip = (id: number) => {
//     window.open(`/payrolls/payslip/${id}`, "_blank");
//   };

//   return (
//     <div className="p-4 sm:p-6 lg:p-8 bg-gray-50 min-h-screen space-y-8">

//       {/* HEADER */}
//       <h1 className="text-xl sm:text-2xl md:text-3xl font-bold">
//         Admin Payroll Management
//       </h1>

//       {/* FORM */}
//       <div className="bg-white p-4 sm:p-6 rounded-xl shadow space-y-4">

//         <h2 className="font-semibold text-lg">Generate Payroll</h2>

//         {/* Employee */}
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

//         {/* Month Year */}
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

//         {/* ACTION BUTTONS */}
//         <div className="flex flex-col sm:flex-row flex-wrap gap-3 pt-2">

//           <button
//             onClick={generatePayroll}
//             className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded w-full sm:w-auto"
//           >
//             Generate Payroll
//           </button>

//           <button
//             onClick={generateAllPayrolls}
//             className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded w-full sm:w-auto"
//           >
//             Generate All Payrolls
//           </button>

//           <button
//             onClick={downloadBankAdvice}
//             className="bg-yellow-600 hover:bg-yellow-700 text-white px-4 py-2 rounded w-full sm:w-auto"
//           >
//             Download Bank Advice
//           </button>

//         </div>
//       </div>

//       {/* PAYROLL LIST */}
//       <div className="bg-white p-4 sm:p-6 rounded-xl shadow">

//         <h2 className="text-lg font-semibold mb-4">All Payrolls</h2>

//         {/* DESKTOP TABLE */}
//         <div className="hidden md:block overflow-x-auto">
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
//               {payrolls.map(p => (
//                 <tr key={p.id} className="border-t hover:bg-gray-50">
//                   <td className="p-3">{p.employee.firstName} {p.employee.lastName}</td>
//                   <td className="p-3">{p.month}</td>
//                   <td className="p-3">{p.year}</td>
//                   <td className="p-3 font-medium">₹{p.netSalary}</td>
//                   <td className="p-3">
//                     <button
//                       onClick={() => downloadPayslip(p.id)}
//                       className="bg-blue-600 text-white px-3 py-1 rounded text-sm"
//                     >
//                       Download PDF
//                     </button>
//                   </td>
//                 </tr>
//               ))}
//             </tbody>
//           </table>
//         </div>

//         {/* MOBILE CARDS */}
//         <div className="md:hidden space-y-4">
//           {payrolls.map(p => (
//             <div key={p.id} className="border rounded-lg p-4 shadow-sm space-y-2">
//               <p><strong>Employee:</strong> {p.employee.firstName} {p.employee.lastName}</p>
//               <p><strong>Month:</strong> {p.month}</p>
//               <p><strong>Year:</strong> {p.year}</p>
//               <p><strong>Net Salary:</strong> ₹{p.netSalary}</p>

//               <button
//                 onClick={() => downloadPayslip(p.id)}
//                 className="w-full bg-blue-600 text-white py-2 rounded mt-2"
//               >
//                 Download Payslip
//               </button>
//             </div>
//           ))}
//         </div>

//       </div>

//     </div>
//   );
// }


"use client";

import { useState, useEffect } from "react";
import toast from "react-hot-toast";
import api from "@/app/src/services/api";
import { AttachMoney } from "@mui/icons-material";
import PayrollForm from "@/app/components/payroll/PayrollForm";
import AddSalaryGradeModal from "@/app/components/payroll/SalaryGradeModel";

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

export default function AdminPayrollPage() {
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [payrolls, setPayrolls] = useState<Payroll[]>([]);
  const [showSalaryModal, setShowSalaryModal] = useState(false);
  const [showPayrollForm, setShowPayrollForm] = useState(false);
  const [reload, setReload] = useState(false);
  const [salaryGrades, setSalaryGrades]= useState([])



  useEffect(() => {
    const fetchEmployees = async () => {
      try {
        const res = await api.get("/employees");
        setEmployees(res.data);
      } catch (err) {
        toast.error("Error fetching employees");
      }
    };

    fetchEmployees();
  }, [reload]);


        const fetchPayrolls = async () => {
          try {
            const res = await api.get("/payrolls", {
              headers: { Authorization: `Bearer ${localStorage.getItem("token")}` }
            });
            setPayrolls(res.data);
          } catch {
            toast.error("Error fetching payrolls");
          }
        };
      const fetchSalaryGrades= async ()=>{
            try {
               const res= await api.get("/salary-grades")
               setSalaryGrades(res.data)
               console.log(res.data)
            } catch (error:any) {
              console.log(error.message)
              toast.error("Error in fetching salaryGrades")
            }
      }

  useEffect(() => { 

    fetchPayrolls();
    fetchSalaryGrades()
   }, [reload]);

  const generateAllPayrolls = async () => {
    try {
      await api.post("/payrolls/generate-all", { month: new Date().getMonth() + 1, year: new Date().getFullYear() });
      toast.success("All payrolls generated!");
      setReload(!reload);
    } catch {
      toast.error("Error generating all payrolls");
    }
  };

  const downloadBankAdvice = () => {
    window.open(`/payrolls/bank-advice?month=${new Date().getMonth() + 1}&year=${new Date().getFullYear()}`, "_blank");
  };

  const downloadPayslip = (id: number) => {
    window.open(`/payrolls/payslip/${id}`, "_blank");
  };

  return (
    <div className="p-4 sm:p-6 lg:p-8 bg-gray-50 min-h-screen space-y-8">

      {/* HEADER */}
      <h1 className="text-2xl sm:text-3xl font-bold">Admin Payroll Management</h1>

      {/* ACTION BUTTONS */}
      <div className="flex flex-wrap gap-3">
        <button
          onClick={() => setShowSalaryModal(true)}
          className="bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded"
        >
          Add Salary Grade
        </button>

        <button
          onClick={() => setShowPayrollForm(true)}
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded"
        >
          Create Payroll
        </button>

        <button
          onClick={generateAllPayrolls}
          className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded"
        >
          Generate All Payrolls
        </button>

        <button
          onClick={downloadBankAdvice}
          className="bg-yellow-600 hover:bg-yellow-700 text-white px-4 py-2 rounded"
        >
          Download Bank Advice
        </button>
      </div>

      {/* MODALS */}
      {showSalaryModal && (
        <AddSalaryGradeModal 
          close={() => setShowSalaryModal(false)} 
          reload={() => setReload(!reload)} 
        />
      )}

      {showPayrollForm && (
        <PayrollForm 
          employees={employees} 
          close={() => setShowPayrollForm(false)} 
          reload={() => setReload(!reload)} 
        />
      )}

      {/* PAYROLL LIST */}
      <div className="bg-white p-4 sm:p-6 rounded-xl shadow">
        
        <h2 className="text-lg font-semibold mb-4">All Payrolls</h2>

        <div className="overflow-x-auto">
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
              {payrolls.map(p => (
                <tr key={p.id} className="border-t hover:bg-gray-50">
                  <td className="p-3">{p.employee.firstName} {p.employee.lastName}</td>
                  <td className="p-3">{p.month}</td>
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
        </div>
      </div>

  
    <div className="p-6 bg-white shadow rounded-lg">
      <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
        <AttachMoney /> Salary Grades
      </h2>

      <div className="space-y-3">
        {salaryGrades.map((sal:any) => (
          <div
            key={sal.id}
            className="flex items-center justify-between p-4 border rounded hover:bg-gray-50 transition"
          >
            <p className="font-medium text-gray-800">{sal.grade_name}</p>
            <div className="flex gap-4 text-gray-600">
              <span>Basic: ₹{sal.basic}</span>
              <span>HRA: ₹{sal.hra}</span>
              <span>Allowances: ₹{sal.allowances}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  
   


    </div>
  );
}