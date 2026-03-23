"use client";

import { useEffect, useState } from "react";
import api from "@/app/src/services/api";
import toast from "react-hot-toast";

type Employee = {
  id: number;
  firstName: string;
  lastName: string;
  salaryGrade?: {
    id: number;
    basic: number;
    hra: number;
    pf: number;
  };
};

type SalaryGrade = {
  id: number;
  basic: number;
  hra: number;
  pf: number;
};

export default function AssignSalaryGradePage() {
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [grades, setGrades] = useState<SalaryGrade[]>([]);
  const [selectedGrades, setSelectedGrades] = useState<{ [key: number]: number }>({});
  const [loading, setLoading] = useState(true);

  // 🚀 Load data
  useEffect(() => {
    Promise.all([
      api.get("/employees"),
      api.get("/salary-grades"),
    ])
      .then(([empRes, gradeRes]) => {
        setEmployees(empRes.data);
        setGrades(gradeRes.data);
      })
      .catch(() => toast.error("Failed to load data"))
      .finally(() => setLoading(false));
  }, []);

  // 🎯 Handle assign
  const assignGrade = async (empId: number) => {
    const gradeId = selectedGrades[empId];

    if (!gradeId) {
      return toast.error("Please select a salary grade");
    }

    try {
      await api.patch(`/employees/${empId}/salary-grade`, {
        salaryGradeId: gradeId,
      });

      toast.success("Salary grade assigned");

      // 🔄 update UI instantly
      const grade = grades.find(g => g.id === gradeId);

      setEmployees(prev =>
        prev.map(emp =>
          emp.id === empId
            ? { ...emp, salaryGrade: grade }
            : emp
        )
      );
    } catch (err) {
      toast.error("Failed to assign grade");
    }
  };

  if (loading) return <p className="p-6">Loading...</p>;

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">
        Assign Salary Grades
      </h1>

      <div className="overflow-x-auto">
        <table className="w-full border rounded-lg overflow-hidden">
          <thead className="bg-gray-100">
            <tr>
              <th className="p-3 text-left">Employee</th>
              <th className="p-3 text-left">Current Grade</th>
              <th className="p-3 text-left">Select Grade</th>
              <th className="p-3 text-left">Action</th>
            </tr>
          </thead>

          <tbody>
            {employees.map(emp => (
              <tr key={emp.id} className="border-t">
                {/* 👤 Employee */}
                <td className="p-3">
                  {emp.firstName} {emp.lastName}
                </td>

                {/* 📊 Current Grade */}
                <td className="p-3 text-sm text-gray-600">
                  {emp.salaryGrade ? (
                    <>
                      ₹{emp.salaryGrade.basic} + ₹{emp.salaryGrade.hra} - ₹{emp.salaryGrade.pf}
                    </>
                  ) : (
                    <span className="text-red-500">Not Assigned</span>
                  )}
                </td>

                {/* 🎯 Dropdown */}
                <td className="p-3">
                  <select
                    className="border p-2 rounded w-full"
                    onChange={(e) =>
                      setSelectedGrades(prev => ({
                        ...prev,
                        [emp.id]: Number(e.target.value),
                      }))
                    }
                    defaultValue=""
                  >
                    <option value="">Select Grade</option>
                    {grades.map(g => (
                      <option key={g.id} value={g.id}>
                        Basic: ₹{g.basic} | HRA: ₹{g.hra}
                      </option>
                    ))}
                  </select>
                </td>

                {/* 🚀 Assign */}
                <td className="p-3">
                  <button
                    onClick={() => assignGrade(emp.id)}
                    className="bg-indigo-600 text-white px-4 py-2 rounded hover:bg-indigo-700"
                  >
                    Assign
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}