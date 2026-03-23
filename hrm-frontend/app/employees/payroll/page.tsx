// // "use client";

// // import { useEffect, useState } from "react";
// // import api from "@/app/src/services/api";

// // type Payroll = {
// //   id: number;
// //   month: number;
// //   year: number;
// //   netSalary: number;
// // };

// // export default function EmployeePayrollPage() {
// //   const [payrolls, setPayrolls] = useState<Payroll[]>([]);

// //   useEffect(() => {
// //     api.get(`/payrolls/me`).then(res => setPayrolls(res.data));
// //   }, []);

// //   const downloadPayslip = (id: number) => {
// //     window.open(`/payrolls/payslip/${id}`, "_blank");
// //   };

// //   return (
// //     <div className="p-6">
// //       <h1 className="text-2xl font-bold">My Payrolls</h1>

// //       <table className="table-auto border-collapse border w-full mt-4">
// //         <thead>
// //           <tr className="bg-gray-200">
// //             <th className="border px-4 py-2">Month</th>
// //             <th className="border px-4 py-2">Year</th>
// //             <th className="border px-4 py-2">Net Salary</th>
// //             <th className="border px-4 py-2">Payslip</th>
// //           </tr>
// //         </thead>
// //         <tbody>
// //           {payrolls.map(p => (
// //             <tr key={p.id}>
// //               <td className="border px-4 py-2">{p.month}</td>
// //               <td className="border px-4 py-2">{p.year}</td>
// //               <td className="border px-4 py-2">{p.netSalary}</td>
// //               <td className="border px-4 py-2">
// //                 <button
// //                   onClick={() => downloadPayslip(p.id)}
// //                   className="bg-blue-600 text-white px-2 py-1 rounded"
// //                 >
// //                   Download PDF
// //                 </button>
// //               </td>
// //             </tr>
// //           ))}
// //         </tbody>
// //       </table>
// //     </div>
// //   );
// // }


// "use client";

// import { useEffect, useState } from "react";
// import api from "@/app/src/services/api";

// type Payroll = {
//   id: number;
//   month: number;
//   year: number;
//   netSalary: number;
//   basic?: number;
//   hra?: number;
//   pf?: number;
// };

// const months = [
//   "Jan","Feb","Mar","Apr","May","Jun",
//   "Jul","Aug","Sep","Oct","Nov","Dec"
// ];

// export default function EmployeePayrollPage() {
//   const [payrolls, setPayrolls] = useState<Payroll[]>([]);
//   const [filtered, setFiltered] = useState<Payroll[]>([]);
//   const [loading, setLoading] = useState(true);
//   const [employees, setEmployees]= useState([])
//   const [selectedYear, setSelectedYear] = useState("");
//   const [selectedMonth, setSelectedMonth] = useState("");

//   const [selectedPayroll, setSelectedPayroll] = useState<Payroll | null>(null);

//   useEffect(() => {
//     api.get(`/payrolls/me`).then(res => {
//       setPayrolls(res.data);
//       setFiltered(res.data);
//       console.log(res.data)
//       setLoading(false);
//       fetchEmployees()
//     });
//   }, []);
// const fetchEmployees= async()=>{
//   let res= await api.get("/employees")
//   setEmployees(res.data)
//    console.log(res.data)
// }
//   /* 🔍 FILTER */
//   useEffect(() => {
//     let temp = [...payrolls];

//     if (selectedYear) {
//       temp = temp.filter(p => p.year === Number(selectedYear));
//     }

//     if (selectedMonth) {
//       temp = temp.filter(p => p.month === Number(selectedMonth));
//     }

//     setFiltered(temp);
//   }, [selectedYear, selectedMonth, payrolls]);

//   const downloadPayslip = (id: number) => {
//     window.open(`/payrolls/payslip/${id}`, "_blank");
//   };

//   const bulkDownload = () => {
//     filtered.forEach(p => {
//       window.open(`/payrolls/payslip/${p.id}`, "_blank");
//     });
//   };

//   return (
//     <div className="min-h-screen bg-gray-50 p-4 md:p-8">

//       {/* 🔷 Header */}
//       <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
//         <div>
//           <h1 className="text-2xl md:text-3xl font-bold text-gray-800">
//             My Payrolls
//           </h1>
//           <p className="text-gray-500 text-sm">
//             View and download salary slips
//           </p>
//         </div>

//         <button
//           onClick={bulkDownload}
//           className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition"
//         >
//           Bulk Download
//         </button>
//       </div>

//       {/* 🔍 Filters */}
//       <div className="bg-white p-4 rounded-xl shadow-sm mb-6 flex flex-col md:flex-row gap-3">
//         <select
//           value={selectedYear}
//           onChange={(e) => setSelectedYear(e.target.value)}
//           className="border p-2 rounded-lg w-full md:w-40"
//         >
//           <option value="">All Years</option>
//           {[...new Set(payrolls.map(p => p.year))].map(y => (
//             <option key={y}>{y}</option>
//           ))}
//         </select>

//         <select
//           value={selectedMonth}
//           onChange={(e) => setSelectedMonth(e.target.value)}
//           className="border p-2 rounded-lg w-full md:w-40"
//         >
//           <option value="">All Months</option>
//           {months.map((m, i) => (
//             <option key={i + 1} value={i + 1}>{m}</option>
//           ))}
//         </select>
//       </div>

//       {/* 🧊 Skeleton Loader */}
//       {loading ? (
//         <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
//           {[1,2,3,4].map(i => (
//             <div key={i} className="bg-white p-4 rounded-xl shadow animate-pulse">
//               <div className="h-4 bg-gray-300 rounded w-1/2 mb-3"></div>
//               <div className="h-4 bg-gray-200 rounded w-1/3 mb-3"></div>
//               <div className="h-8 bg-gray-300 rounded"></div>
//             </div>
//           ))}
//         </div>
//       ) : (
//         <>
//           {/* 📱 Cards */}
//           <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
//             {filtered.map((p) => (
//               <div
//                 key={p.id}
//                 className="bg-white p-5 rounded-2xl shadow-sm border hover:shadow-lg transition"
//               >
//                 <div className="flex justify-between mb-2">
//                   <p className="font-semibold text-gray-800">
//                     {months[p.month - 1]}
//                   </p>
//                   <span className="text-sm text-gray-500">
//                     {p.year}
//                   </span>
//                 </div>

//                 <p className="text-green-600 font-bold text-lg mb-3">
//                   ₹ {p.netSalary}
//                 </p>

//                 <div className="flex gap-2">
//                   <button
//                     onClick={() => setSelectedPayroll(p)}
//                     className="flex-1 text-sm bg-gray-100 py-2 rounded-lg hover:bg-gray-200"
//                   >
//                     View
//                   </button>

//                   <button
//                     onClick={() => downloadPayslip(p.id)}
//                     className="flex-1 text-sm bg-indigo-600 text-white py-2 rounded-lg hover:bg-indigo-700"
//                   >
//                     Download
//                   </button>
//                 </div>
//               </div>
//             ))}
//           </div>

//           {filtered.length === 0 && (
//             <p className="text-center text-gray-500 mt-6">
//               No payroll records found
//             </p>
//           )}
//         </>
//       )}

//       {/* 📊 Salary Breakdown Modal */}
//       {selectedPayroll && (
//         <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
//           <div className="bg-white p-6 rounded-2xl w-[90%] max-w-md shadow-lg">
//             <h2 className="text-lg font-semibold mb-4">
//               Salary Breakdown ({months[selectedPayroll.month - 1]} {selectedPayroll.year})
//             </h2>

//             <div className="space-y-2 text-sm">
//               <div className="flex justify-between">
//                 <span>Basic</span>
//                 <span>₹ {selectedPayroll.basic || 0}</span>
//               </div>
//               <div className="flex justify-between">
//                 <span>HRA</span>
//                 <span>₹ {selectedPayroll.hra || 0}</span>
//               </div>
//               <div className="flex justify-between">
//                 <span>PF</span>
//                 <span>₹ {selectedPayroll.pf || 0}</span>
//               </div>

//               <hr />

//               <div className="flex justify-between font-semibold text-green-600">
//                 <span>Net Salary</span>
//                 <span>₹ {selectedPayroll.netSalary}</span>
//               </div>
//             </div>

//             <button
//               onClick={() => setSelectedPayroll(null)}
//               className="mt-4 w-full bg-indigo-600 text-white py-2 rounded-lg hover:bg-indigo-700"
//             >
//               Close
//             </button>
//           </div>
//         </div>
//       )}
//     </div>
//   );
// }



"use client";

import { useEffect, useState } from "react";
import api from "@/app/src/services/api";

type Payroll = {
  id: number;
  month: number;
  year: number;
  netSalary: number;
  basic?: number;
  hra?: number;
  allowances?: number;
  deductions?: number;
  bonus?: number;
  arrears?: number;
  pf?: number;
};

const months = [
  "Jan","Feb","Mar","Apr","May","Jun",
  "Jul","Aug","Sep","Oct","Nov","Dec"
];

export default function EmployeePayrollPage() {
  const [payrolls, setPayrolls] = useState<Payroll[]>([]);
  const [filtered, setFiltered] = useState<Payroll[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedYear, setSelectedYear] = useState("");
  const [selectedMonth, setSelectedMonth] = useState("");
  const [selectedPayroll, setSelectedPayroll] = useState<Payroll | null>(null);

  useEffect(() => {
    api.get(`/payrolls/me`).then(res => {
      setPayrolls(res.data);
      setFiltered(res.data);
      setLoading(false);
    });
  }, []);

  /* 🔍 FILTER */
  useEffect(() => {
    let temp = [...payrolls];
    if (selectedYear) temp = temp.filter(p => p.year === Number(selectedYear));
    if (selectedMonth) temp = temp.filter(p => p.month === Number(selectedMonth));
    setFiltered(temp);
  }, [selectedYear, selectedMonth, payrolls]);

  const downloadPayslip = (id: number) => {
    window.open(`/payrolls/payslip/${id}`, "_blank");
  };

  const bulkDownload = () => {
    filtered.forEach(p => {
      window.open(`/payrolls/payslip/${p.id}`, "_blank");
    });
  };

  // Helper to compute net salary dynamically if breakdown exists
  const calculateNetSalary = (p: Payroll) => {
    return (p.basic || 0) + (p.hra || 0) + (p.allowances || 0) + (p.bonus || 0) + (p.arrears || 0) - (p.deductions || 0);
  };

  return (
    <div className="min-h-screen bg-gray-50 p-4 md:p-8">

      {/* 🔷 Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-gray-800">
            My Payrolls
          </h1>
          <p className="text-gray-500 text-sm">
            View and download salary slips
          </p>
        </div>

        {/* <button
          onClick={bulkDownload}
          className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition"
        >
          Bulk Download
        </button> */}
      </div>

      {/* 🔍 Filters */}
      <div className="bg-white p-4 rounded-xl shadow-sm mb-6 flex flex-col md:flex-row gap-3">
        <select
          value={selectedYear}
          onChange={(e) => setSelectedYear(e.target.value)}
          className="border p-2 rounded-lg w-full md:w-40"
        >
          <option value="">All Years</option>
          {[...new Set(payrolls.map(p => p.year))].map(y => (
            <option key={y}>{y}</option>
          ))}
        </select>

        <select
          value={selectedMonth}
          onChange={(e) => setSelectedMonth(e.target.value)}
          className="border p-2 rounded-lg w-full md:w-40"
        >
          <option value="">All Months</option>
          {months.map((m, i) => (
            <option key={i + 1} value={i + 1}>{m}</option>
          ))}
        </select>
      </div>

      {/* 🧊 Skeleton Loader */}
      {loading ? (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
          {[1,2,3,4].map(i => (
            <div key={i} className="bg-white p-4 rounded-xl shadow animate-pulse">
              <div className="h-4 bg-gray-300 rounded w-1/2 mb-3"></div>
              <div className="h-4 bg-gray-200 rounded w-1/3 mb-3"></div>
              <div className="h-8 bg-gray-300 rounded"></div>
            </div>
          ))}
        </div>
      ) : (
        <>
          {/* 📱 Cards */}
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {filtered.map((p) => (
              <div
                key={p.id}
                className="bg-white p-5 rounded-2xl shadow-sm border hover:shadow-lg transition"
              >
                <div className="flex justify-between mb-2">
                  <p className="font-semibold text-gray-800">
                    {months[p.month - 1]}
                  </p>
                  <span className="text-sm text-gray-500">
                    {p.year}
                  </span>
                </div>

                <p className="text-green-600 font-bold text-lg mb-3">
                  ₹ {p.netSalary}
                </p>

                <div className="flex gap-2">
                  <button
                    onClick={() => setSelectedPayroll(p)}
                    className="flex-1 text-sm bg-gray-100 py-2 rounded-lg hover:bg-gray-200"
                  >
                    View
                  </button>

                  {/* <button
                    onClick={() => downloadPayslip(p.id)}
                    className="flex-1 text-sm bg-indigo-600 text-white py-2 rounded-lg hover:bg-indigo-700"
                  >
                    Download
                  </button> */}
                </div>
              </div>
            ))}
          </div>

          {filtered.length === 0 && (
            <p className="text-center text-gray-500 mt-6">
              No payroll records found
            </p>
          )}
        </>
      )}

      {/* 📊 Salary Breakdown Modal */}
      {selectedPayroll && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-2xl w-[90%] max-w-md shadow-lg">
            <h2 className="text-lg font-semibold mb-4">
              Salary Breakdown ({months[selectedPayroll.month - 1]} {selectedPayroll.year})
            </h2>

            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span>Basic</span>
                <span>₹ {selectedPayroll.basic || 0}</span>
              </div>
              <div className="flex justify-between">
                <span>HRA</span>
                <span>₹ {selectedPayroll.hra || 0}</span>
              </div>
              <div className="flex justify-between">
                <span>Allowances</span>
                <span>₹ {selectedPayroll.allowances || 0}</span>
              </div>
              <div className="flex justify-between">
                <span>Deductions</span>
                <span>₹ {selectedPayroll.deductions || 0}</span>
              </div>
              <div className="flex justify-between">
                <span>Bonus</span>
                <span>₹ {selectedPayroll.bonus || 0}</span>
              </div>
              <div className="flex justify-between">
                <span>Arrears</span>
                <span>₹ {selectedPayroll.arrears || 0}</span>
              </div>
              <div className="flex justify-between">
                <span>PF</span>
                <span>₹ {selectedPayroll.pf || 0}</span>
              </div>

              <hr />

              <div className="flex justify-between font-semibold text-green-600">
                <span>Net Salary</span>
                <span>₹ {selectedPayroll.netSalary || calculateNetSalary(selectedPayroll)}</span>
              </div>
            </div>

            <button
              onClick={() => setSelectedPayroll(null)}
              className="mt-4 w-full bg-indigo-600 text-white py-2 rounded-lg hover:bg-indigo-700"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
}