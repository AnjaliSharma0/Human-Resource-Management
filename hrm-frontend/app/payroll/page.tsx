


"use client";

import { useEffect, useState } from "react";
import { Button } from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import { useRouter } from "next/navigation";

import PayrollTable from "../components/payroll/PayrollTab";
import PayrollCharts from "../components/payroll/PayrollChart";
import { getPayrolls } from "../src/services/payroll";
import { getAllEmployees, getEmployeeInfo } from "../src/services/employee";

interface Payroll {
  id: number;
  employeeId: number;
  basic: number;
  hra: number;
  tax: number;
  netSalary: number;
  month: string;
}

interface Employee {
  id: number;
  firstName: string;
  lastName: string;
  role: "employee" | "admin";
}

export default function PayrollPage() {
  const [payrolls, setPayrolls] = useState<Payroll[]>([]);
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [currentUser, setCurrentUser] = useState<Employee | null>(null);
  const router = useRouter();

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) return;

      // 1️⃣ Fetch the logged-in user from backend
      let user: Employee;
      try {
        user = await getEmployeeInfo(); // This should return the logged-in employee
      } catch (err: any) {
        if (err.response?.status === 403) {
          // Admin fallback
          user = { id: 0, firstName: "Admin", lastName: "", role: "admin" };
        } else throw err;
      }
      setCurrentUser(user);

      // 2️⃣ Fetch all employees
      const allEmployees: Employee[] = await getAllEmployees();

      // 3️⃣ Fetch all payrolls
      const allPayrolls: Payroll[] = await getPayrolls(token);

      // 4️⃣ Filter payrolls for employees (employee sees only their own)
      const visiblePayrolls =
        user.role === "employee"
          ? allPayrolls.filter((p) => p.employeeId === user.id)
          : allPayrolls;

      setPayrolls(visiblePayrolls);
      setEmployees(allEmployees);
    } catch (err) {
      console.error("Error loading payroll data:", err);
    }
  };

  return (
    <div className="p-6">
      <div className="flex justify-between mb-6">
        <h1 className="text-2xl font-bold text-green-600">Payroll Management</h1>

        {/* Only admins can generate payroll */}
        {currentUser?.role === "admin" && (
          <Button
            variant="contained"
            startIcon={<AddIcon />}
            onClick={() => router.push("/payroll/create")}
          >
            Generate Payroll
          </Button>
        )}
      </div>

      {/* Pass both payrolls and employees to PayrollTable */}
      <PayrollTable payrolls={payrolls} employees={employees} />
      <PayrollCharts payrolls={payrolls} />
    </div>
  );
}