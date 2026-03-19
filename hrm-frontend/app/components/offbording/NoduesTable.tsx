// "use client";

// import { useEffect, useState } from "react";
// import api from "@/app/src/services/api";
// import RoleGuard from "@/app/src/hook/rolegaurd";


// export default function NoDuesTable() {
//   const [list, setList] = useState([]);

//   const fetch = async () => {
//     const res = await api.get("/no-dues");
//     setList(res.data);
//   };

//   useEffect(() => {
//     fetch();
//   }, []);

//   const approve = async (id: number) => {
//     await api.patch(`/no-dues/${id}`, { cleared: true });
//     fetch();
//   };

//   return (
//     <div className="grid gap-3">
//       {list.map((item: any) => (
//         <div
//           key={item.id}
//           className="p-3 border rounded flex justify-between"
//         >
//           <span>{item.department}</span>

//           <RoleGuard allowed={["manager"]}>
//             {!item.cleared && (
//               <button onClick={() => approve(item.id)}>
//                 Approve
//               </button>
//             )}
//           </RoleGuard>
//         </div>
//       ))}
//     </div>
//   );
// }

"use client";

import { useEffect, useState } from "react";
import api from "@/app/src/services/api";
import RoleGuard from "@/app/src/hook/rolegaurd";
import useRole from "@/app/src/hook/userole";
import toast from "react-hot-toast";

export default function NoDuesTable() {
  const role = useRole();

  const [list, setList] = useState<any[]>([]);
  const [employees, setEmployees] = useState<any[]>([]);
  const [departments, setDepartments] = useState<any[]>([]);

  const [form, setForm] = useState({
    employeeId: "",
    department: "",
    description: "",
  });

  // Fetch all data
  const fetch = async () => {
    try {
      const res = await api.get("/no-dues");
      setList(res.data);

      const empRes = await api.get("/employees");
      setEmployees(empRes.data);

      const depRes = await api.get("/departments");
      setDepartments(depRes.data);
    } catch {
      toast.error("Failed to fetch data");
    }
  };

  useEffect(() => {
    fetch();
  }, []);

  // Admin creates due
  const handleCreate = async () => {
    if (!form.employeeId || !form.department) return toast.error("Select all fields");

    try {
      await api.post("/no-dues", form);
      toast.success("No-Due created");
      setForm({ employeeId: "", department: "", description: "" });
      fetch();
    } catch {
      toast.error("Failed to create due");
    }
  };

  // Manager approves
  const approve = async (id: number) => {
    try {
      await api.patch(`/no-dues/${id}`, { cleared: true });
      toast.success("Approved");
      fetch();
    } catch {
      toast.error("Approval failed");
    }
  };

  return (
    <div className="space-y-6">
      {/* Admin Form */}
      <RoleGuard allowed={["admin"]}>
        <div className="bg-white p-4 rounded shadow space-y-3">
          <h2 className="font-bold text-lg">Create No-Dues</h2>
          <div className="flex flex-col sm:flex-row gap-2">
            <select
              value={form.employeeId}
              onChange={(e) => setForm({ ...form, employeeId: e.target.value })}
              className="border p-2 rounded flex-1"
            >
              <option value="">Select Employee</option>
              {employees.map((emp) => (
                <option key={emp.id} value={emp.id}>
                  {emp.firstName} ({emp.id})
                </option>
              ))}
            </select>

            <select
              value={form.department}
              onChange={(e) => setForm({ ...form, department: e.target.value })}
              className="border p-2 rounded flex-1"
            >
              <option value="">Select Department</option>
              {departments.map((dep) => (
                <option key={dep.id} value={dep.name}>
                  {dep.name}
                </option>
              ))}
            </select>
          </div>

          <input
            type="text"
            placeholder="Description"
            value={form.description}
            onChange={(e) => setForm({ ...form, description: e.target.value })}
            className="border p-2 rounded w-full"
          />

          <button
            onClick={handleCreate}
            className="bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-700 transition"
          >
            Create No-Due
          </button>
        </div>
      </RoleGuard>

      {/* No-Dues List */}
      <div className="grid gap-3">
        {list.map((item) => (
          <div
            key={item.id}
            className="p-3 border rounded flex justify-between items-center bg-white shadow-sm"
          >
            <div>
              <p className="font-medium">{item.department}</p>
              <p className="text-sm text-gray-500">{item.description}</p>
              <p className="text-sm">
                EmployeeId: {item.employeeId} | Status:{" "}
                {item.cleared ? (
                  <span className="text-green-600 font-semibold">Cleared</span>
                ) : (
                  <span className="text-yellow-600 font-semibold">Pending</span>
                )}
              </p>
            </div>

            <RoleGuard allowed={["manager","admin"]}>
              {!item.cleared && (
                <button
                  onClick={() => approve(item.id)}
                  className="bg-green-500 text-white px-3 py-1 rounded hover:bg-green-600"
                >
                  Approve
                </button>
              )}
            </RoleGuard>
          </div>
        ))}
      </div>
    </div>
  );
}