// "use client";

// import { useEffect, useState } from "react";
// import api from "@/app/src/services/api";
// import RoleGuard from "@/app/src/hook/rolegaurd";
// import toast from "react-hot-toast";

// export default function ChecklistTracker() {
//   const [tasks, setTasks] = useState<any[]>([]);
//   const [departments, setDepartments] = useState<string[]>([]);
//   const [taskInput, setTaskInput] = useState("");
//   const [departmentInput, setDepartmentInput] = useState("");

//   // Fetch checklist tasks
//   const fetchTasks = async () => {
//     try {
//       const res = await api.get("/checklist");
//       setTasks(res.data);
//     } catch {
//       toast.error("Failed to fetch tasks");
//     }
//   };

//   // Fetch departments from backend
//   const fetchDepartments = async () => {
//     try {
//       const res = await api.get("/departments");
//       setDepartments(res.data);
//       if (res.data.length > 0) setDepartmentInput(res.data[0]); // default first dept
//     } catch {
//       toast.error("Failed to fetch departments");
//     }
//   };

//   useEffect(() => {
//     fetchTasks();
//     fetchDepartments();
//   }, []);

//   // Toggle task completion
//   const toggleTask = async (task: any) => {
//     try {
//       await api.patch(`/checklist/${task.id}`, { completed: !task.completed });
//       fetchTasks();
//     } catch {
//       toast.error("Failed to update task");
//     }
//   };

//   // Add a new task
//   const addTask = async () => {
//     if (!taskInput || !departmentInput) {
//       toast.error("Task and Department are required");
//       return;
//     }
//     try {
//       await api.post("/checklist", { task: taskInput, department: departmentInput });
//       toast.success("Task added!");
//       setTaskInput("");
//       setDepartmentInput(departments[0] || "");
//       fetchTasks();
//     } catch {
//       toast.error("Failed to add task");
//     }
//   };

//   return (
//     <div className="space-y-4">
//       {/* ADMIN TASK CREATION */}
//       <RoleGuard allowed={["admin", "manager"]}>
//         <div className="flex flex-col sm:flex-row gap-2">
//           <input
//             type="text"
//             placeholder="Task name"
//             value={taskInput}
//             onChange={(e) => setTaskInput(e.target.value)}
//             className="border px-2 py-1 rounded flex-1"
//           />
//          <select
//   value={departmentInput}
//   onChange={(e) => setDepartmentInput(e.target.value)}
//   className="border px-2 py-1 rounded flex-1"
// >
//   {departments.map((dep: any) => (
//     <option key={dep.id} value={dep.name}>
//       {dep.name}
//     </option>
//   ))}
// </select>
//           <button
//             onClick={addTask}
//             className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
//           >
//             Add Task
//           </button>
//         </div>
//       </RoleGuard>

//       {/* TASK LIST */}
//       <div className="grid gap-3">
//         {tasks.map((task) => (
//           <div
//             key={task.id}
//             className="flex flex-col sm:flex-row sm:justify-between sm:items-center p-3 border rounded"
//           >
//             <div>
//               <p className="font-medium">{task.task}</p>
//               <p className="text-sm text-gray-500">{task.department}</p>
//             </div>

//             <RoleGuard allowed={["admin", "manager"]}>
//               <input
//                 type="checkbox"
//                 checked={task.completed}
//                 onChange={() => toggleTask(task)}
//                 className="mt-2 sm:mt-0"
//               />
//             </RoleGuard>
//           </div>
//         ))}
//       </div>
//     </div>
//   );
// }


"use client";

import { useEffect, useState } from "react";
import api from "@/app/src/services/api";
import RoleGuard from "@/app/src/hook/rolegaurd";
import toast from "react-hot-toast";

interface Task {
  id: number;
  task: string;
  department: string;
  completedBy: string[]; // array of employee IDs who completed
}

interface Employee {
  id: string;
  name: string;
  department: string;
}

export default function ChecklistTracker() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [departments, setDepartments] = useState<string[]>([]);
  const [taskInput, setTaskInput] = useState("");
  const [departmentInput, setDepartmentInput] = useState("");
  const [role, setRole] = useState<string>("");
  const [employeeId, setEmployeeId] = useState<string>("");

  // const fetchTasks = async () => {
  //   try {
  //     const res = await api.get("/checklist");
  //     setTasks(res.data);
  //     console.log("checklist",res.data)
  //   } catch {
  //     toast.error("Failed to fetch tasks");
  //   }
  // };
  const fetchTasks = async () => {
  try {
    const res = await api.get("/checklist");
    // Normalize department and completedBy
    const normalizedTasks = res.data.map((t: any) => {
      let deptName = t.department;
      try {
        const deptObj = JSON.parse(t.department);
        deptName = deptObj.name;
      } catch {}
      return {
        ...t,
        department: deptName,
        completedBy: t.completed
          ? t.employeeId
            ? [t.employeeId]
            : []
          : [],
      };
    });
    setTasks(normalizedTasks);
  } catch {
    toast.error("Failed to fetch tasks");
  }
};

  const fetchDepartments = async () => {
    try {
      const res = await api.get("/departments");
      setDepartments(res.data.map((d: any) => d.name));
      if (res.data.length > 0) setDepartmentInput(res.data[0].name);
    } catch {
      toast.error("Failed to fetch departments");
    }
  };

  const fetchEmployees = async () => {
    try {
      const res = await api.get("/employees");
      setEmployees(res.data);
    } catch {
      toast.error("Failed to fetch employees");
    }
  };

  const fetchUserRole = () => {
    const storedRole = localStorage.getItem("role") || "employee";
    setRole(storedRole);
    const storedId = localStorage.getItem("userId") || "";
    setEmployeeId(storedId);
  };

  useEffect(() => {
    fetchTasks();
    fetchDepartments();
    fetchEmployees();
    fetchUserRole();
  }, []);

  // Toggle completion for employee (either self or admin marking others)
  const toggleTaskForEmployee = async (taskId: number, empId: string) => {
    try {
      await api.patch(`/checklist/${taskId}/toggle`, { employeeId: empId });
      fetchTasks();
    } catch {
      toast.error("Failed to update task");
    }
  };

  const addTask = async () => {
    if (!taskInput || !departmentInput) return toast.error("Task and Department required");
    try {
      await api.post("/checklist", { task: taskInput, department: departmentInput });
      toast.success("Task added!");
      setTaskInput("");
      setDepartmentInput(departments[0] || "");
      fetchTasks();
    } catch {
      toast.error("Failed to add task");
    }
  };

  // EMPLOYEE VIEW: filter tasks for self
const employeeTasks = tasks.filter((t) => {
  const completedBy = t.completedBy || [];
  const empDept = employees.find((e) => e.id === employeeId)?.department;
  return completedBy.includes(employeeId) || t.department === empDept;
});

  return (
    <div className="space-y-6">
      {/* ADMIN/ MANAGER TASK CREATION */}
      {["admin", "manager"].includes(role) && (
        <div className="flex flex-col sm:flex-row items-center gap-3 bg-gray-50 p-4 rounded shadow-sm">
          <input
            type="text"
            placeholder="Task name"
            value={taskInput}
            onChange={(e) => setTaskInput(e.target.value)}
            className="border px-3 py-2 rounded flex-1 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <select
            value={departmentInput}
            onChange={(e) => setDepartmentInput(e.target.value)}
            className="border px-3 py-2 rounded flex-1 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            {departments.map((dep) => (
              <option key={dep} value={dep}>
                {dep}
              </option>
            ))}
          </select>
          <button
            onClick={addTask}
            className="bg-blue-600 text-white px-5 py-2 rounded hover:bg-blue-700 transition"
          >
            Add Task
          </button>
        </div>
      )}

      {/* EMPLOYEE VIEW */}
      {role === "employee" && (
        <div className="space-y-3">
          <h3 className="font-semibold text-lg">Your Tasks</h3>
          <div className="grid gap-3">
            {employeeTasks.map((task) => {
              const completed = task.completedBy.includes(employeeId);
              return (
                <div
                  key={task.id}
                  className={`flex justify-between items-center p-4 border rounded-lg shadow-sm hover:shadow-md transition ${
                    completed ? "bg-green-50" : "bg-white"
                  }`}
                >
                  <div>
                    <p className={`font-medium ${completed ? "line-through text-gray-500" : "text-gray-800"}`}>
                      {task.task}
                    </p>
                    <p className="text-sm text-gray-400">{task.department}</p>
                  </div>
                  <input
                    type="checkbox"
                    checked={completed}
                    onChange={() => toggleTaskForEmployee(task.id, employeeId)}
                    className="w-5 h-5 accent-green-600"
                  />
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* ADMIN/MANAGER VIEW */}
      {["admin", "manager"].includes(role) &&
        departments.map((dept) => {
          const deptTasks = tasks.filter((t) => t.department === dept);
          const deptEmployees = employees.filter((e) => e.department === dept);

          if (deptTasks.length === 0) return null;

          return (
            <div key={dept} className="space-y-2">
              <h3 className="font-semibold text-lg">{dept} Department</h3>
              <div className="overflow-x-auto border rounded-lg">
                <table className="min-w-full table-auto">
                  <thead className="bg-gray-100">
                    <tr>
                      <th className="p-2 text-left">Task</th>
                      {deptEmployees.map((emp) => (
                        <th key={emp.id} className="p-2 text-center">
                          {emp.name}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {deptTasks.map((task) => (
                      <tr key={task.id} className="border-t hover:bg-gray-50">
                        <td className="p-2">{task.task}</td>
                        {deptEmployees.map((emp) => {
                          const completed = task.completedBy.includes(emp.id);
                          return (
                            <td key={emp.id} className="p-2 text-center">
                              <input
                                type="checkbox"
                                checked={completed}
                                onChange={() => toggleTaskForEmployee(task.id, emp.id)}
                                className="w-5 h-5 accent-green-600"
                              />
                            </td>
                          );
                        })}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          );
        })}
    </div>
  );
}