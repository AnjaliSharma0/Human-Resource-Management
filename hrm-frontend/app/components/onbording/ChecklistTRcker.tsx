"use client";

import { useEffect, useState } from "react";
import api from "@/app/src/services/api";
import RoleGuard from "@/app/src/hook/rolegaurd";
import toast from "react-hot-toast";

export default function ChecklistTracker() {
  const [tasks, setTasks] = useState<any[]>([]);
  const [departments, setDepartments] = useState<string[]>([]);
  const [taskInput, setTaskInput] = useState("");
  const [departmentInput, setDepartmentInput] = useState("");

  // Fetch checklist tasks
  const fetchTasks = async () => {
    try {
      const res = await api.get("/checklist");
      setTasks(res.data);
    } catch {
      toast.error("Failed to fetch tasks");
    }
  };

  // Fetch departments from backend
  const fetchDepartments = async () => {
    try {
      const res = await api.get("/departments");
      setDepartments(res.data);
      if (res.data.length > 0) setDepartmentInput(res.data[0]); // default first dept
    } catch {
      toast.error("Failed to fetch departments");
    }
  };

  useEffect(() => {
    fetchTasks();
    fetchDepartments();
  }, []);

  // Toggle task completion
  const toggleTask = async (task: any) => {
    try {
      await api.patch(`/checklist/${task.id}`, { completed: !task.completed });
      fetchTasks();
    } catch {
      toast.error("Failed to update task");
    }
  };

  // Add a new task
  const addTask = async () => {
    if (!taskInput || !departmentInput) {
      toast.error("Task and Department are required");
      return;
    }
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

  return (
    <div className="space-y-4">
      {/* ADMIN TASK CREATION */}
      <RoleGuard allowed={["admin", "manager"]}>
        <div className="flex flex-col sm:flex-row gap-2">
          <input
            type="text"
            placeholder="Task name"
            value={taskInput}
            onChange={(e) => setTaskInput(e.target.value)}
            className="border px-2 py-1 rounded flex-1"
          />
         <select
  value={departmentInput}
  onChange={(e) => setDepartmentInput(e.target.value)}
  className="border px-2 py-1 rounded flex-1"
>
  {departments.map((dep: any) => (
    <option key={dep.id} value={dep.name}>
      {dep.name}
    </option>
  ))}
</select>
          <button
            onClick={addTask}
            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
          >
            Add Task
          </button>
        </div>
      </RoleGuard>

      {/* TASK LIST */}
      <div className="grid gap-3">
        {tasks.map((task) => (
          <div
            key={task.id}
            className="flex flex-col sm:flex-row sm:justify-between sm:items-center p-3 border rounded"
          >
            <div>
              <p className="font-medium">{task.task}</p>
              <p className="text-sm text-gray-500">{task.department}</p>
            </div>

            <RoleGuard allowed={["admin", "manager"]}>
              <input
                type="checkbox"
                checked={task.completed}
                onChange={() => toggleTask(task)}
                className="mt-2 sm:mt-0"
              />
            </RoleGuard>
          </div>
        ))}
      </div>
    </div>
  );
}