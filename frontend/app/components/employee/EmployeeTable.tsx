"use client";
import { useEffect, useState } from "react";
import api from "../../utils/api";
import { useRouter } from "next/navigation";
import { getRole, getUserId } from "../../utils/auth";
import { Button } from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";

export interface Employee { id: number; name: string; email: string; role: string; designation: string; }

export default function EmployeeTable() {
  const [employees, setEmployees] = useState<Employee[]>([]);
  const router = useRouter();
  const role = getRole();
  const currentUserId = getUserId();

  const fetchEmployees = async () => {
    const res = await api.get("/employees");
    let data: Employee[] = res.data;

    if (role === "manager") data = data.filter(e => e.role !== "admin");
    if (role === "employee") data = data.filter(e => e.id === currentUserId);

    setEmployees(data);
  };

  useEffect(() => { fetchEmployees(); }, []);

  return (
    <div className="overflow-x-auto">
      <div className="flex justify-end mb-4">
        {(role === "admin" || role === "manager") && <Button variant="contained" color="success" onClick={() => router.push("/employees/add")}>Add Employee</Button>}
      </div>
      <table className="min-w-full bg-white rounded-lg shadow-lg">
        <thead className="bg-gray-800">
          <tr>
            <th className="py-2 px-4 text-left">Name</th>
            <th className="py-2 px-4 text-left">Email</th>
            <th className="py-2 px-4 text-left">Role</th>
            <th className="py-2 px-4 text-left">Designation</th>
            <th className="py-2 px-4 text-left">Actions</th>
          </tr>
        </thead>
        <tbody>
          {employees.map(emp => (
            <tr key={emp.id} className="border-b hover:bg-gray-700  text-gray-500 transition-all">
              <td className="py-2 px-4">{emp.name}</td>
              <td className="py-2 px-4">{emp.email}</td>
              <td className="py-2 px-4">{emp.role}</td>
              <td className="py-2 px-4">{emp.designation}</td>
              <td className="py-2 px-4">
                {(role === "admin" || role === "manager" || emp.id === currentUserId) && (
                  <Button variant="outlined" color="primary" size="small" startIcon={<EditIcon />} onClick={() => router.push(`/employees/${emp.id}`)}>Edit</Button>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}