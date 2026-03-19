"use client";

import { Paper } from "@mui/material";
import AttachMoneyIcon from "@mui/icons-material/AttachMoney";
import GroupsIcon from "@mui/icons-material/Groups";
import ReceiptIcon from "@mui/icons-material/Receipt";

export default function PayrollDashboard({ payrolls }: any) {

  const totalSalary = payrolls.reduce(
    (sum: number, p: any) => sum + p.netSalary,
    0
  );

  return (
    <div className="grid md:grid-cols-3 gap-6">

      <Paper className="p-6 flex items-center gap-4">
        <AttachMoneyIcon className="text-green-600 text-4xl"/>
        <div>
          <p className="text-gray-500">Total Payroll</p>
          <h2 className="text-2xl font-bold">₹{totalSalary}</h2>
        </div>
      </Paper>

      <Paper className="p-6 flex items-center gap-4">
        <GroupsIcon className="text-blue-600 text-4xl"/>
        <div>
          <p className="text-gray-500">Employees Paid</p>
          <h2 className="text-2xl font-bold">{payrolls.length}</h2>
        </div>
      </Paper>

      <Paper className="p-6 flex items-center gap-4">
        <ReceiptIcon className="text-purple-600 text-4xl"/>
        <div>
          <p className="text-gray-500">Payslips Generated</p>
          <h2 className="text-2xl font-bold">{payrolls.length}</h2>
        </div>
      </Paper>

    </div>
  );
}