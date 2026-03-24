
"use client";

import { useState, useEffect } from "react";
import api from "@/app/src/services/api";
import toast from "react-hot-toast";
import useRole from "@/app/src/hook/userole";
import { Dialog, DialogTitle, DialogContent, DialogActions, Button, TextField, Select, MenuItem, FormControl, InputLabel } from "@mui/material";

// For simple bar chart
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

export default function SettlementCalculator() {
  const role = useRole(); // "admin" or "employee"
  const userId = Number(localStorage.getItem("userId")); // logged-in employee ID

  const [employees, setEmployees] = useState<any[]>([]);
  const [records, setRecords] = useState<any[]>([]);

  // Admin modal state
  const [openModal, setOpenModal] = useState(false);
  const [form, setForm] = useState({
    employeeId: 0,
    salaryDue: 0,
    deductions: 0,
  });

  const finalAmount = form.salaryDue - form.deductions;
 const [errors, setErrors] = useState({
  employeeId: "",
  salaryDue: "",
  deductions: "",
});
  // Fetch employees and settlements
  useEffect(() => {
    const fetchEmployees = async () => {
      if (role === "admin") {
        try {
          const res = await api.get("/employees");
          setEmployees(res.data);
          // if (res.data.length > 0) setForm((f) => ({ ...f, employeeId: res.data[0].id }));
        } catch {
          toast.error("Failed to fetch employees");
        }
      }
    };
    fetchEmployees();
    fetchData();
  }, [role]);

  const fetchData = async () => {
    try {
      const res = await api.get("/final-settlement");

      if (role === "employee") {
        const employeeData = res.data.filter((rec: any) => rec.employeeId === userId);
        setRecords(employeeData);
      } else {
        setRecords(res.data);
      }
    } catch {
      toast.error("Failed to fetch settlements");
    }
  };

  // Admin: Save settlement
  const handleSave = async () => {
     const newErrors = { employeeId: "", salaryDue: "", deductions: "" };
  let valid = true;

  if (!form.employeeId) {
    newErrors.employeeId = "Please select an employee";
    valid = false;
  }
  if (form.salaryDue <= 0) {
    newErrors.salaryDue = "Salary must be greater than 0";
    valid = false;
  }
  if (form.deductions < 0) {
    newErrors.deductions = "Deductions cannot be negative";
    valid = false;
  }
  if (form.deductions > form.salaryDue) {
    newErrors.deductions = "Deductions cannot exceed Salary";
    valid = false;
  }

  setErrors(newErrors);
  if(!valid){return}

    try {
      await api.post("/final-settlement", {
        employeeId: form.employeeId,
        salaryDue: form.salaryDue,
        deductions: form.deductions,
        finalAmount,
      });
      toast.success("Settlement saved!");
      setForm({ employeeId: employees[0]?.id || 0, salaryDue: 0, deductions: 0 });
      setOpenModal(false);
      fetchData();
    } catch (err: any) {
      console.error(err.response || err);
      toast.error("Error saving settlement");
    }
  };

  if (records.length === 0) {
    return (
      <div className="p-6 text-center text-gray-500">
        No settlements available.
      </div>
    );
  }

  // Totals
  const totalSalary = records.reduce((sum, r) => sum + r.salaryDue, 0);
  const totalDeductions = records.reduce((sum, r) => sum + r.deductions, 0);
  const totalFinal = records.reduce((sum, r) => sum + r.finalAmount, 0);

  return (
    <div className="space-y-8 p-6">

      {/* Admin Button for Modal */}
      {role === "admin" && (
        <Button variant="contained" color="primary" onClick={() => setOpenModal(true)}>
          Add Settlement
        </Button>
      )}

      {/* Summary */}
      <div className="bg-white p-6 rounded-xl shadow-lg space-y-4">
        <h2 className="text-2xl font-bold mb-2">
          {role === "employee" ? "Your Final Settlement" : "All Settlements Summary"}
        </h2>
        <div className="grid gap-4 sm:grid-cols-3">
          <div className="p-4 bg-green-50 rounded text-center">
            <p className="text-gray-500">Total Salary</p>
            <p className="text-lg font-semibold text-green-600">₹{totalSalary}</p>
          </div>
          <div className="p-4 bg-red-50 rounded text-center">
            <p className="text-gray-500">Total Deductions</p>
            <p className="text-lg font-semibold text-red-600">₹{totalDeductions}</p>
          </div>
          <div className="p-4 bg-blue-50 rounded text-center">
            <p className="text-gray-500">Total Final</p>
            <p className="text-lg font-semibold text-blue-600">₹{totalFinal}</p>
          </div>
        </div>
      </div>

      {/* Detailed Settlements */}
      <div className="grid gap-4 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
        {records.map((rec) => (
          <div
            key={rec.id}
            className="p-4 border rounded-lg bg-white shadow-sm"
          >
            {role === "admin" && (
              <p className="text-sm font-medium">EmpID: {rec.employeeId}</p>
            )}
            <p className="text-sm">Salary: ₹{rec.salaryDue}</p>
            <p className="text-sm">Deductions: ₹{rec.deductions}</p>
            <p className="font-semibold mt-2 text-blue-600">
              Final: ₹{rec.finalAmount}
            </p>
          </div>
        ))}
      </div>

      {/* Graph */}
      <div className="bg-white p-6 rounded-xl shadow-lg">
        <h2 className="text-xl font-bold mb-4">
          {role === "employee" ? "Your Settlement Graph" : "Settlements Graph"}
        </h2>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={records} margin={{ top: 10, bottom: 10 }}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey={role === "employee" ? "id" : "employeeId"} />
            <YAxis />
            <Tooltip />
            <Bar dataKey="salaryDue" fill="#4ade80" name="Salary" />
            <Bar dataKey="deductions" fill="#f87171" name="Deductions" />
            <Bar dataKey="finalAmount" fill="#3b82f6" name="Final" />
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Admin Modal */}
   <Dialog open={openModal} onClose={() => setOpenModal(false)} fullWidth maxWidth="sm">
  <DialogTitle className="text-xl font-bold border-b pb-2 text-center">
    Add Settlement
  </DialogTitle>

  <DialogContent className="space-y-4 mt-2">
    {/* Employee Select */}
    <FormControl fullWidth variant="outlined" error={!!errors.employeeId}   sx={{ mt: 1 }}>
      <InputLabel id="employee-label">Select Employee</InputLabel>
      <Select
        labelId="employee-label"
        value={form.employeeId}
        onChange={(e) => setForm({ ...form, employeeId: Number(e.target.value) })}
        label="Select Employee"
          sx={{ mt: 1 }}
      >
        <MenuItem value={0} disabled>
          -- Select an employee --
        </MenuItem>
        {employees.map((emp) => (
          <MenuItem key={emp.id} value={emp.id}>
            {emp.firstName} {emp.lastName} - ({emp.id})
          </MenuItem>
        ))}
      </Select>
      {errors.employeeId && (
        <p className="text-red-600 text-sm mt-1">{errors.employeeId}</p>
      )}
    </FormControl>

    {/* Salary Due */}
    <TextField
      label="Salary Due"
      type="number"
      fullWidth
      value={form.salaryDue}
      onChange={(e) => setForm({ ...form, salaryDue: Number(e.target.value) })}
      variant="outlined"
      error={!!errors.salaryDue}
      helperText={errors.salaryDue}
        sx={{ mt: 2 }}
    />

    {/* Deductions */}
    <TextField
      label="Deductions"
      type="number"
      fullWidth
      value={form.deductions}
      onChange={(e) => setForm({ ...form, deductions: Number(e.target.value) })}
      variant="outlined"
      error={!!errors.deductions}
      helperText={errors.deductions}
        sx={{ mt: 2 }}
    />

    {/* Final Amount */}
    <p className="font-semibold mt-2 text-right text-lg">
      Final Amount: <span className="text-green-600">₹{finalAmount}</span>
    </p>
  </DialogContent>

  <DialogActions className="border-t pt-2">
    <Button onClick={() => setOpenModal(false)} className="text-gray-600">
      Cancel
    </Button>
    <Button
      variant="contained"
      color="primary"
      onClick={handleSave}
      disabled={form.employeeId === 0} // disables Save until an employee is selected
    >
      Save
    </Button>
  </DialogActions>
</Dialog>
    </div>
  );
}