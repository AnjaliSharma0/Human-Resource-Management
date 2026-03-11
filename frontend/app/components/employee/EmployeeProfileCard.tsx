"use client";
import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import EmployeeForm, { EmployeeFormData } from "./EmployeeForm";
import api from "@/app/utils/api";
import DashboardLayout from "../layout/DashboardLayout";


export default function EmployeeProfilePage() {
  const { id } = useParams();
  const router = useRouter();
  const [employee, setEmployee] = useState<EmployeeFormData & { id: number } | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchEmployee = async () => {
      try {
        const res = await api.get(`/employees/${id}/profile`);
        setEmployee(res.data);
      } catch (err) {
        alert("Failed to load employee data");
        console.error(err);
        router.push("/employees"); // redirect if error
      } finally {
        setLoading(false);
      }
    };
    fetchEmployee();
  }, [id, router]);

  if (loading) return <DashboardLayout>Loading...</DashboardLayout>;
  if (!employee) return <DashboardLayout>Employee not found</DashboardLayout>;

  return (
    <DashboardLayout>
      <h2 className="text-2xl font-bold mb-6 text-gray-700">Employee Profile</h2>
      <EmployeeForm employee={employee} isEdit />
    </DashboardLayout>
  );
}