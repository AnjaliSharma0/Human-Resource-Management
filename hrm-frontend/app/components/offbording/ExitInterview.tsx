// "use client";

// import { useState, useEffect } from "react";
// import api from "@/app/src/services/api";
// import toast from "react-hot-toast";
// import useRole from "@/app/src/hook/userole";
// import RoleGuard from "@/app/src/hook/rolegaurd";

// // Recharts imports
// import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from "recharts";

// export default function ExitInterviewForm() {
//   const role = useRole();

//   const [form, setForm] = useState({
//     feedback: "",
//     rating: 5,
//   });

//   const [list, setList] = useState<any[]>([]);
//   const [loading, setLoading] = useState(false);

//   const fetchData = async () => {
//     try {
//       const res = await api.get("/exit-interview");
//       setList(res.data);
//     } catch {
//       toast.error("Failed to fetch");
//     }
//   };

//   useEffect(() => {
//     fetchData();
//   }, []);

//   const handleSubmit = async () => {
//     if (!form.feedback) {
//       return toast.error("Feedback required");
//     }
//     const employeeId = localStorage.getItem("userId");
//     try {
//       setLoading(true);
//       await api.post("/exit-interview", {
//         ...form,
//         employeeId: Number(employeeId),
//       });
//       toast.success("Submitted");
//       setForm({ feedback: "", rating: 5 });
//       fetchData();
//     } catch {
//       toast.error("Submission failed");
//     } finally {
//       setLoading(false);
//     }
//   };

//   // Prepare chart data
//   const chartData = [1, 2, 3, 4, 5].map((r) => ({
//     rating: `⭐ ${r}`,
//     count: list.filter((i) => i.rating === r).length,
//   }));

//   const avgRating =
//     list.length > 0
//       ? (list.reduce((acc, i) => acc + i.rating, 0) / list.length).toFixed(1)
//       : 0;

//   return (
//     <div className="space-y-8">
//       {/* Employee Form */}
//       <RoleGuard allowed={["employee"]}>
//         <div className="bg-white p-6 rounded-xl shadow-md max-w-lg mx-auto">
//           <h2 className="text-xl font-semibold mb-4">Submit Exit Interview</h2>

//           <textarea
//             placeholder="Write your feedback..."
//             value={form.feedback}
//             onChange={(e) => setForm({ ...form, feedback: e.target.value })}
//             className="w-full border p-3 rounded mb-3 resize-none"
//             rows={4}
//           />

//           <select
//             value={form.rating}
//             onChange={(e) => setForm({ ...form, rating: Number(e.target.value) })}
//             className="w-full border p-2 rounded mb-3"
//           >
//             {[1, 2, 3, 4, 5].map((r) => (
//               <option key={r} value={r}>
//                 Rating {r}
//               </option>
//             ))}
//           </select>

//           <button
//             onClick={handleSubmit}
//             disabled={loading}
//             className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700 transition"
//           >
//             {loading ? "Submitting..." : "Submit"}
//           </button>
//         </div>
//       </RoleGuard>

//       {/* Admin / Manager Visuals */}
//       <RoleGuard allowed={["admin", "manager"]}>
//         <div className="grid gap-6">
//           {/* Summary Cards */}
//           <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
//             <div className="bg-white p-4 rounded-xl shadow flex flex-col items-center">
//               <p className="text-gray-500">Total Interviews</p>
//               <p className="text-2xl font-bold">{list.length}</p>
//             </div>
//             <div className="bg-white p-4 rounded-xl shadow flex flex-col items-center">
//               <p className="text-gray-500">Average Rating</p>
//               <p className="text-2xl font-bold">{avgRating} ⭐</p>
//             </div>
//             <div className="bg-white p-4 rounded-xl shadow flex flex-col items-center">
//               <p className="text-gray-500">5-Star Ratings</p>
//               <p className="text-2xl font-bold">{list.filter((i) => i.rating === 5).length}</p>
//             </div>
//           </div>

//           {/* Ratings Bar Chart */}
//           <div className="bg-white p-4 rounded-xl shadow">
//             <h3 className="font-semibold mb-3">Ratings Distribution</h3>
//             <ResponsiveContainer width="100%" height={200}>
//               <BarChart data={chartData}>
//                 <CartesianGrid strokeDasharray="3 3" />
//                 <XAxis dataKey="rating" />
//                 <YAxis allowDecimals={false} />
//                 <Tooltip />
//                 <Bar dataKey="count" fill="#3b82f6" radius={[5, 5, 0, 0]} />
//               </BarChart>
//             </ResponsiveContainer>
//           </div>

//           {/* Feedback List */}
//           <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
//             {list.map((item) => (
//               <div key={item.id} className="p-4 border rounded-lg bg-white shadow-sm">
//                 <p className="text-sm text-gray-500 mb-2">⭐ Rating: {item.rating}</p>
//                 <p className="text-sm">{item.feedback}</p>
//               </div>
//             ))}
//           </div>
//         </div>
//       </RoleGuard>
//     </div>
//   );
// }

"use client";

import { useState, useEffect } from "react";
import api from "@/app/src/services/api";
import toast from "react-hot-toast";
import useRole from "@/app/src/hook/userole";
import RoleGuard from "@/app/src/hook/rolegaurd";

// Recharts imports
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from "recharts";

export default function ExitInterviewForm() {
  const role = useRole();

  const [form, setForm] = useState({
    feedback: "",
    rating: 5,
  });

  const [list, setList] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  const fetchData = async () => {
    try {
      const res = await api.get("/exit-interview");
      setList(res.data);
    } catch {
      toast.error("Failed to fetch");
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleSubmit = async () => {
    if (!form.feedback) {
      return toast.error("Feedback required");
    }
    const employeeId = localStorage.getItem("userId");
    try {
      setLoading(true);
      await api.post("/exit-interview", {
        ...form,
        employeeId: Number(employeeId),
      });
      toast.success("Submitted");
      setForm({ feedback: "", rating: 5 });
      fetchData();
    } catch {
      toast.error("Submission failed");
    } finally {
      setLoading(false);
    }
  };

  // Prepare chart data
  const chartData = [1, 2, 3, 4, 5].map((r) => ({
    rating: `⭐ ${r}`,
    count: list.filter((i) => i.rating === r).length,
  }));

  const avgRating =
    list.length > 0
      ? (list.reduce((acc, i) => acc + i.rating, 0) / list.length).toFixed(1)
      : 0;

  return (
    <div className="space-y-8">
      {/* Employee Form - Only employees can submit */}
      <RoleGuard allowed={["employee"]}>
        <div className="bg-white p-6 rounded-xl shadow-md max-w-lg mx-auto">
          <h2 className="text-xl font-semibold mb-4">Submit Exit Interview</h2>

          <textarea
            placeholder="Write your feedback..."
            value={form.feedback}
            onChange={(e) => setForm({ ...form, feedback: e.target.value })}
            className="w-full border p-3 rounded mb-3 resize-none"
            rows={4}
          />

          <select
            value={form.rating}
            onChange={(e) => setForm({ ...form, rating: Number(e.target.value) })}
            className="w-full border p-2 rounded mb-3"
          >
            {[1, 2, 3, 4, 5].map((r) => (
              <option key={r} value={r}>
                Rating {r}
              </option>
            ))}
          </select>

          <button
            onClick={handleSubmit}
            disabled={loading}
            className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700 transition"
          >
            {loading ? "Submitting..." : "Submit"}
          </button>
        </div>
      </RoleGuard>

      {/* Visuals for everyone */}
      <div className="grid gap-6">
        {/* Summary Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="bg-white p-4 rounded-xl shadow flex flex-col items-center">
            <p className="text-gray-500">Total Interviews</p>
            <p className="text-2xl font-bold">{list.length}</p>
          </div>
          <div className="bg-white p-4 rounded-xl shadow flex flex-col items-center">
            <p className="text-gray-500">Average Rating</p>
            <p className="text-2xl font-bold">{avgRating} ⭐</p>
          </div>
          <div className="bg-white p-4 rounded-xl shadow flex flex-col items-center">
            <p className="text-gray-500">5-Star Ratings</p>
            <p className="text-2xl font-bold">{list.filter((i) => i.rating === 5).length}</p>
          </div>
        </div>

        {/* Ratings Bar Chart */}
        <div className="bg-white p-4 rounded-xl shadow">
          <h3 className="font-semibold mb-3">Ratings Distribution</h3>
          <ResponsiveContainer width="100%" height={200}>
            <BarChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="rating" />
              <YAxis allowDecimals={false} />
              <Tooltip />
              <Bar dataKey="count" fill="#3b82f6" radius={[5, 5, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Feedback List */}
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {list.map((item) => (
            <div key={item.id} className="p-4 border rounded-lg bg-white shadow-sm">
              <p className="text-sm text-gray-500 mb-2">⭐ Rating: {item.rating}</p>
              <p className="text-sm">{item.feedback}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}