// "use client";
// import { useEffect, useState } from "react";
// import api from "@/app/src/services/api";
// import toast from "react-hot-toast";
// import Link from "next/link";

// type Candidate = {
//   status: string;
//   id: number;
//   email: string;
//   resumeUrl:string;
//   employee: {
//     email: string;
//      phone: string;
//   status: string;
//     id: number;
//     firstName: string;
//     lastName: string;
//   };
//   appliedFor: {
//     title: string;
//     jobRequisition:{
//       title:string
//     }
//   };
// };


// export default function AdminCandidates() {
//   const [candidates, setCandidates] = useState<Candidate[]>([]);

//   const fetchCandidates = async () => {
//     try {
//       const res = await api.get("/candidates");
//       setCandidates(res.data);
//     } catch {
//       toast.error("Failed to fetch candidates");
//     }
//   };

//   useEffect(() => {
//     fetchCandidates();
//   }, []);

//   return (
//     <div className="p-4">
//       <h1 className="text-2xl font-bold mb-4">Candidates</h1>

//       {/* Table for medium+ screens */}
//       <div className="hidden md:block overflow-x-auto">
//         <table className="table-auto w-full bg-white shadow rounded">
//           <thead>
//             <tr className="bg-gray-200">
//               <th className="p-2 text-left">Name</th>
//               <th className="p-2 text-left">Email</th>
//               <th className="p-2 text-left">Phone</th>
//               <th className="p-2 text-left">Applied For</th>
//               <th className="p-2 text-left">Status</th>
//               <th className="p-2 text-left">View Resume</th>
//             </tr>
//           </thead>
//           <tbody>
//   {candidates.map((c) => (
//     <tr key={c.id} className="border-b">
//       <td className="p-2">{c.employee.firstName} {c.employee.lastName}</td>
//       <td className="p-2">{c.employee.email}</td>
//       <td className="p-2">{c.employee.phone}</td>
//       <td className="p-2">{c.appliedFor.jobRequisition.title}</td>
//       <td className="p-2">{c.status}</td>
//       <td>
//         {c.resumeUrl ? (
//           <a
//             href={`http://localhost:3000/candidates/resume/${c.resumeUrl}`}
//             target="_blank"
//             className="text-blue-500 underline"
//           >
//             View Resume
//           </a>
//         ) : (
//           <span className="text-gray-500">No resume uploaded</span>
//         )}
//       </td>
//     </tr>
//   ))}
// </tbody>
//         </table>
//       </div>

//       {/* Card layout for small screens */}
//      <div className="md:hidden space-y-4">
//   {candidates.map((c) => (
//     <div key={c.id} className="bg-white shadow rounded p-4">
//       <p><span className="font-semibold">Name:</span> {c.employee.firstName} {c.employee.lastName}</p>
//       <p><span className="font-semibold">Email:</span> {c.employee.email}</p>
//       <p><span className="font-semibold">Phone:</span> {c.employee.phone}</p>
//       <p><span className="font-semibold">Applied For:</span> {c.appliedFor.jobRequisition.title}</p>
//       <p><span className="font-semibold">Status:</span> {c.status}</p>
//       <p>
//         <span className="font-semibold">Resume:</span>{" "}
//         {c.resumeUrl ? (
//           <a
//             href={`http://localhost:3000/candidates/resume/${c.resumeUrl}`}
//             target="_blank"
//             className="text-blue-500 underline"
//           >
//             View Resume
//           </a>
//         ) : (
//           <span className="text-gray-500">No resume uploaded</span>
//         )}
//       </p>
//     </div>
//   ))}
// </div>
//     </div>
//   );
// }

"use client";

import { useEffect, useState } from "react";
import api from "@/app/src/services/api";
import toast from "react-hot-toast";

type Candidate = {
  status: string;
  id: number;
  resumeUrl: string;
  employee: {
    email: string;
    phone: string;
    status: string;
    id: number;
    firstName: string;
    lastName: string;
  };
  appliedFor: {
    title: string;
    jobRequisition: { title: string };
  };
};

export default function AdminCandidates() {
  const [candidates, setCandidates] = useState<Candidate[]>([]);

  const fetchCandidates = async () => {
    try {
      const res = await api.get("/candidates");
      setCandidates(res.data);
    } catch {
      toast.error("Failed to fetch candidates");
    }
  };

  useEffect(() => {
    fetchCandidates();
  }, []);

  return (
    <div className="p-4 md:p-8 bg-gray-50 min-h-screen">
      <h1 className="text-3xl font-bold mb-6 text-gray-800">Candidates</h1>

      {/* Table layout for medium+ screens */}
      <div className="hidden md:block overflow-x-auto">
        <table className="table-auto w-full bg-white shadow rounded-lg border border-gray-200">
          <thead>
            <tr className="bg-gray-100 text-gray-700">
              <th className="p-3 text-left">Name</th>
              <th className="p-3 text-left">Email</th>
              <th className="p-3 text-left">Phone</th>
              <th className="p-3 text-left">Applied For</th>
              <th className="p-3 text-left">Status</th>
              <th className="p-3 text-left">Resume</th>
            </tr>
          </thead>
          <tbody>
            {candidates.map((c) => (
              <tr key={c.id} className="border-b hover:bg-gray-50 transition">
                <td className="p-3">{c.employee.firstName} {c.employee.lastName}</td>
                <td className="p-3">{c.employee.email}</td>
                <td className="p-3">{c.employee.phone}</td>
                <td className="p-3">{c.appliedFor.jobRequisition.title}</td>
                <td className="p-3">
                  <span className={`px-2 py-1 rounded-full text-sm font-semibold ${c.status === "Selected" ? "bg-green-100 text-green-700" : c.status === "Rejected" ? "bg-red-100 text-red-700" : "bg-yellow-100 text-yellow-700"}`}>
                    {c.status}
                  </span>
                </td>
                <td className="p-3">
                  {c.resumeUrl ? (
                    <a
                      href={`http://localhost:3000/candidates/resume/${c.resumeUrl}`}
                      target="_blank"
                      className="text-blue-600 underline hover:text-blue-800"
                    >
                      View Resume
                    </a>
                  ) : (
                    <span className="text-gray-500">No resume uploaded</span>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Card layout for small screens */}
      <div className="md:hidden space-y-4">
        {candidates.map((c) => (
          <div key={c.id} className="bg-white shadow-md rounded-lg p-5">
            <p><span className="font-semibold">Name:</span> {c.employee.firstName} {c.employee.lastName}</p>
            <p><span className="font-semibold">Email:</span> {c.employee.email}</p>
            <p><span className="font-semibold">Phone:</span> {c.employee.phone}</p>
            <p><span className="font-semibold">Applied For:</span> {c.appliedFor.jobRequisition.title}</p>
            <p>
              <span className="font-semibold">Status:</span>{" "}
              <span className={`px-2 py-1 rounded-full text-sm font-semibold ${c.status === "Selected" ? "bg-green-100 text-green-700" : c.status === "Rejected" ? "bg-red-100 text-red-700" : "bg-yellow-100 text-yellow-700"}`}>
                {c.status}
              </span>
            </p>
            <p>
              <span className="font-semibold">Resume:</span>{" "}
              {c.resumeUrl ? (
                <a
                  href={`http://localhost:3000/candidates/resume/${c.resumeUrl}`}
                  target="_blank"
                  className="text-blue-600 underline hover:text-blue-800"
                >
                  View Resume
                </a>
              ) : (
                <span className="text-gray-500">No resume uploaded</span>
              )}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}