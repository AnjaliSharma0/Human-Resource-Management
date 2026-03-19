
"use client";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Paper,
} from "@mui/material";

import VisibilityIcon from "@mui/icons-material/Visibility";
import IconButton from "@mui/material/IconButton";
import { useRouter } from "next/navigation";

interface PayrollTableProps {
  payrolls: any[];
  employees?: any[]; // make it optional
  showActions?: boolean;
}

export default function PayrollTable({
  payrolls,
  employees = [], // default empty array to prevent undefined
  showActions = true,
}: PayrollTableProps) {
  const router = useRouter();


  
  // Create a map employeeId => employee full name
  const employeeMap: Record<number, string> = {};
  employees.forEach((e: any) => {
    employeeMap[e.id] = `${e.firstName}`;
  });

  return (
    <Paper className="p-4">
      <Table>
        <TableHead className="bg-green-200">
  <TableRow>
    <TableCell className="text-green-800 font-bold">Employee</TableCell>
    <TableCell className="text-green-800 font-bold">Month</TableCell>
    <TableCell className="text-green-800 font-bold">Basic</TableCell>
    <TableCell className="text-green-800 font-bold">HRA</TableCell>
    <TableCell className="text-green-800 font-bold">Tax</TableCell>
    <TableCell className="text-green-800 font-bold">Net Salary</TableCell>
    {showActions && <TableCell className="text-green-800 font-bold">Action</TableCell>}
  </TableRow>
</TableHead>

        <TableBody>
          {payrolls.length === 0 ? (
            <TableRow>
              <TableCell colSpan={showActions ? 7 : 6} className="text-center text-gray-500 py-6">
                No payroll records found
              </TableCell>
            </TableRow>
          ) : (
            payrolls.map((p: any) => (
              <TableRow key={p.id}>
                <TableCell>
                  {employeeMap[p.employeeId] || "Employee"}
                </TableCell>
                <TableCell>{p.month}</TableCell>
                <TableCell>₹{p.basic}</TableCell>
                <TableCell>₹{p.hra}</TableCell>
                <TableCell>₹{p.tax}</TableCell>
                <TableCell className="font-bold text-green-600">
                  ₹{p.netSalary}
                </TableCell>

                {showActions && (
                  <TableCell>
                    <IconButton onClick={() => {
                        if (!p.id || isNaN(Number(p.id))) {
                          console.error("Invalid ID:", p.id);
                          return;
                        }
                        router.push(`/payroll/${p.id}`);
                       }}>
                      <VisibilityIcon />
                    </IconButton>
                  </TableCell>
                )}
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
    </Paper>
  );
}