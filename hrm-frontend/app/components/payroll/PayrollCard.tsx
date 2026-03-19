import { Paper } from "@mui/material";

export default function PayslipCard({ payroll }: any) {

  return (
    <Paper className="p-6 max-w-xl">

      <h2 className="text-xl font-bold mb-4">
        Payslip - {payroll.month}
      </h2>

      <div className="space-y-2">

        <p>Employee : {payroll.employee?.firstName}</p>

        <p>Basic Salary : ₹{payroll.basic}</p>

        <p>HRA : ₹{payroll.hra}</p>

        <p>Tax : ₹{payroll.tax}</p>

        <p>Deductions : ₹{payroll.deductions}</p>

        <hr />

        <p className="text-lg font-bold text-green-600">
          Net Salary : ₹{payroll.netSalary}
        </p>

      </div>

    </Paper>
  );
}