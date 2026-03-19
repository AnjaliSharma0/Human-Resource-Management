"use client";

import { useState, useEffect } from "react";
import PayrollForm from "@/app/components/payroll/PayrollForm";

import api from "@/app/src/services/api";
import AddSalaryGradeModal from "@/app/components/payroll/SalaryGradeModel";

export default function CreatePayrollPage() {
  const [salaryGrades, setSalaryGrades] = useState<any[]>([]);
  const [showGradeModal, setShowGradeModal] = useState(false);

  // Fetch salary grades for dropdowns in PayrollForm
  const fetchSalaryGrades = async () => {
    try {
      const res = await api.get("/salary-grades");
      setSalaryGrades(res.data);
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    fetchSalaryGrades();
  }, []);

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Generate Payroll</h1>
        <button
          onClick={() => setShowGradeModal(true)}
          className="px-4 py-2 bg-indigo-600 text-white rounded"
        >
          Add Salary Grade
        </button>
      </div>

      {/* Payroll Form */}
      <PayrollForm salaryGrades={salaryGrades} refreshGrades={fetchSalaryGrades} />

      {/* Add Salary Grade Modal */}
      {showGradeModal && (
        <AddSalaryGradeModal
          close={() => setShowGradeModal(false)}
          reload={fetchSalaryGrades}
        />
      )}
    </div>
  );
}