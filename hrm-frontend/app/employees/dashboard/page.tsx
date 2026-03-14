"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { UserCircleIcon } from "@heroicons/react/24/solid";
import api from "@/app/src/services/api";

export default function EmployeeDashboard() {
  const [employees, setEmployees] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  // Load all employees in user's department
  const loadEmployees = async () => {
    try {
      const res = await api.get("/employees/me"); // get current user's info
      const myDepartmentId = res.data.department?.id;

      // fetch all employees
      const allRes = await api.get("/employees");
      const deptEmployees = allRes.data.filter(
        (emp: any) => emp.department?.id === myDepartmentId
      );

      setEmployees(deptEmployees);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadEmployees();
  }, []);

  if (loading) return <p className="p-6 text-gray-600">Loading...</p>;
  if (!employees.length) return <p className="p-6 text-gray-500">No employees found in your department.</p>;

  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold mb-6">Department Employees</h1>
      <div className="grid sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {employees.map((emp) => (
          <div
            key={emp.id}
            className="bg-white shadow-md rounded-xl p-4 flex flex-col items-center text-center cursor-pointer hover:shadow-lg transition"
            onClick={() => router.push(`/employee/${emp.id}`)} // redirect to profile page
          >
            <UserCircleIcon className="h-16 w-16 text-gray-400 mb-3" />
            <h2 className="font-semibold">{emp.firstName} {emp.lastName}</h2>
            <p className="text-gray-500 text-sm">{emp.designation?.title}</p>
            <p className="text-gray-400 text-sm">{emp.email}</p>
          </div>
        ))}
      </div>
    </div>
  );
}