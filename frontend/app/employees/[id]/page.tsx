"use client";
import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import EmployeeForm, { EmployeeFormData } from "@/app/components/employee/EmployeeForm";
import api from "@/app/utils/api";
import DashboardLayout from "@/app/components/layout/DashboardLayout";


export default function EmployeeProfilePage() {
  const { id } = useParams();
  const [employee, setEmployee] = useState<EmployeeFormData & {id:number} | null>(null);

  useEffect(() => {
    api.get(`/employees/${id}/profile`).then(res => setEmployee(res.data)).catch(() => alert("Failed to load"));
  }, [id]);

  if (!employee) return <DashboardLayout>Loading...</DashboardLayout>;

  return (
    <DashboardLayout>
      <h2 className="text-2xl font-bold mb-6 text-gray-700">Employee Profile</h2>
      <EmployeeForm employee={employee} isEdit />
    </DashboardLayout>
  );
}