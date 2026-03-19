// "use client";

// import { leaveApi } from "@/app/src/services/leave";
// import { useState, useEffect } from "react";
// import toast from "react-hot-toast";

// export default function LeaveBalancePage() {
//   const [balances, setBalances] = useState<any[]>([]);
//   const [loading, setLoading] = useState(true);

//   useEffect(() => {
//     const fetchBalances = async () => {
//       try {

//         // get logged user
//         const user = JSON.parse(localStorage.getItem("user") || "{}");

//         // if (!user?.id) {
//         //   toast.error("Employee not found");
//         //   return;
//         // }

//         // ✅ PASS employeeId here
//         const res = await leaveApi.getEmployeeBalance(user.id);

//         setBalances(res.data);

//       } catch (err) {
//         console.error(err);
//         toast.error("Failed to load leave balance");
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchBalances();
//   }, []);

//   if (loading) {
//     return <p className="p-6">Loading leave balance...</p>;
//   }

//   return (
//     <div className="p-6">

//       <h2 className="text-2xl font-bold mb-6">
//         My Leave Balance
//       </h2>

//       {balances.length === 0 ? (
//         <p className="text-gray-500">
//           No leave balance assigned yet.
//         </p>
//       ) : (
//         <div className="grid grid-cols-1 md:grid-cols-3 gap-4">

//            {/* Leave Balance */}
//       <section>
//         <h2 className="text-xl font-semibold mb-4">My Leave Balance</h2>
//         {balances.length === 0 ? (
//           <p className="text-gray-500">No leave balance assigned yet.</p>
//         ) : (
//           <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
//             {balances.map((b) => (
//               <div key={b.id} className="p-5 bg-white border rounded-lg shadow">
//                 <h3 className="text-lg font-semibold mb-2">{b.leaveType?.name}</h3>
//                 <div className="text-sm text-gray-600 space-y-1">
//                   <p>Accrued: {b.accrued}</p>
//                   <p>Used: {b.used}</p>
//                 </div>
//                 <p className="mt-3 text-xl font-bold text-indigo-600">
//                   Remaining: {b.remainingDays}
//                 </p>
//                 <p className="text-xs text-gray-400 mt-1">Year: {b.year}</p>
//               </div>
//             ))}
//           </div>
//         )}
//       </section>

//         </div>
//       )}

//     </div>
//   );
// }