"use client";

import { useEffect, useState } from "react";
import api from "@/app/src/services/api";
import toast from "react-hot-toast";
import AddSalaryGradeModal from "./SalaryGradeModel";


interface SalaryGrade {
  id: number;
  grade_name: string;
  basic: number;
  hra: number;
  allowances?: number;
  deductions?: number;
  pf_rate: number;
  esi_rate: number;
}

export default function SalaryGradesPage() {
  const [grades, setGrades] = useState<SalaryGrade[]>([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedGrade, setSelectedGrade] = useState<SalaryGrade | undefined>(undefined);

  const fetchGrades = async () => {
    try {
      const res = await api.get("/salary-grades");
      setGrades(res.data);
    } catch (err: any) {
      toast.error(err.response?.data?.message || "Failed to fetch salary grades");
    }
  };

  useEffect(() => {
    fetchGrades();
  }, []);

  const openAddModal = () => {
    setSelectedGrade(undefined);
    setModalOpen(true);
  };

  const openEditModal = (grade: SalaryGrade) => {
    setSelectedGrade(grade);
    setModalOpen(true);
  };

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold">Salary Grades</h1>
        <button
          onClick={openAddModal}
          className="px-4 py-2 bg-indigo-600 text-white rounded"
        >
          Add Grade
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {grades.map((grade) => (
          <div key={grade.id} className="border p-4 rounded shadow hover:shadow-lg">
            <h2 className="font-bold text-lg">{grade.grade_name}</h2>
            <p>Basic: ₹{grade.basic}</p>
            <p>HRA: ₹{grade.hra}</p>
            <p>Allowances: ₹{grade.allowances || 0}</p>
            <p>Deductions: ₹{grade.deductions || 0}</p>
            <p>PF Rate: {grade.pf_rate}%</p>
            <p>ESI Rate: {grade.esi_rate}%</p>

            <div className="flex gap-2 mt-2">
              <button
                onClick={() => openEditModal(grade)}
                className="px-3 py-1 bg-yellow-500 text-white rounded"
              >
                Edit
              </button>
            </div>
          </div>
        ))}
      </div>

      {modalOpen && (
        <AddSalaryGradeModal
          close={() => setModalOpen(false)}
          reload={fetchGrades}
          salaryGrade={selectedGrade}
        />
      )}
    </div>
  );
}