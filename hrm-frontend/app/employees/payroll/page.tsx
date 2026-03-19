"use client";

import { useEffect, useState } from "react";
import api from "@/app/src/services/api";

type Payroll = {
  id: number;
  month: number;
  year: number;
  netSalary: number;
};

export default function EmployeePayrollPage() {
  const [payrolls, setPayrolls] = useState<Payroll[]>([]);

  useEffect(() => {
    api.get(`/payrolls/me`).then(res => setPayrolls(res.data));
  }, []);

  const downloadPayslip = (id: number) => {
    window.open(`/payrolls/payslip/${id}`, "_blank");
  };

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold">My Payrolls</h1>

      <table className="table-auto border-collapse border w-full mt-4">
        <thead>
          <tr className="bg-gray-200">
            <th className="border px-4 py-2">Month</th>
            <th className="border px-4 py-2">Year</th>
            <th className="border px-4 py-2">Net Salary</th>
            <th className="border px-4 py-2">Payslip</th>
          </tr>
        </thead>
        <tbody>
          {payrolls.map(p => (
            <tr key={p.id}>
              <td className="border px-4 py-2">{p.month}</td>
              <td className="border px-4 py-2">{p.year}</td>
              <td className="border px-4 py-2">{p.netSalary}</td>
              <td className="border px-4 py-2">
                <button
                  onClick={() => downloadPayslip(p.id)}
                  className="bg-blue-600 text-white px-2 py-1 rounded"
                >
                  Download PDF
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}