"use client";

import api from "@/app/src/services/api";
import { createPayroll } from "@/app/src/services/payroll";
import { TextField, Button, Paper, MenuItem, Select, InputLabel, FormControl } from "@mui/material";
import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import toast from "react-hot-toast";


interface PayrollFormProps {
  salaryGrades?: any[];
  employees?: { id: number; firstName: string; lastName: string }[];
   refreshGrades?: () => void;
  close?: () => void;
  reload?: () => void;
}
interface SalaryGrade {
  id: number;
  grade_name: string;
}

export default function PayrollForm({ salaryGrades = [] }: PayrollFormProps) {
  const route = useRouter();
  const token = localStorage.getItem("token");
  const [salaryGradesDrop, setSalaryGradesDrop]= useState<SalaryGrade[]>([])
  const [form, setForm] = useState({
    employeeId: "",
    month: "",
    salaryGradeId: "",
    basic: "",
    hra: "",
    tax: "",
    deductions: "",
  });
useEffect(()=>{
  fetchSalaryGrades()
  
},[])
  const fetchSalaryGrades= async ()=>{
            try {
               const res= await api.get("/salary-grades")
               setSalaryGradesDrop(res.data)
               console.log(res.data)
            } catch (error:any) {
              console.log(error.message)
              toast.error("Error in fetching salaryGrades")
            }
      }
  // Auto-fill basic and HRA when salary grade changes
  useEffect(() => {
    if (!form.salaryGradeId) return;

    const selectedGrade = salaryGrades.find(g => g.id === Number(form.salaryGradeId));
    if (selectedGrade) {
      setForm(prev => ({
        ...prev,
        basic: selectedGrade.basic,
        hra: selectedGrade.hra,
        deductions: selectedGrade.deductions ?? 0,
        // tax can be computed later if needed
      }));
    }
  }, [form.salaryGradeId, salaryGrades]);

  const handleBack = () => {
    route.push("/payroll"); // Adjust this path if needed
  };

  const handleChange = (e: any) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const submit = async () => {
    try {
      await createPayroll(
        {
          ...form,
          employeeId: Number(form.employeeId),
          salaryGradeId: form.salaryGradeId ? Number(form.salaryGradeId) : undefined,
          basic: Number(form.basic),
          hra: Number(form.hra),
          tax: Number(form.tax),
          deductions: Number(form.deductions),
        },
        token!
      );

      toast.success("Payroll Generated");

      setForm({
        employeeId: "",
        month: "",
        salaryGradeId: "",
        basic: "",
        hra: "",
        tax: "",
        deductions: "",
      });
    } catch {
      toast.error("Error generating payroll");
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <Paper className="p-6 max-w-xl w-full">
        <div className="grid gap-4">

          <div className="mt-4">
            <Button variant="contained" color="error" onClick={handleBack}>
              Back
            </Button>
          </div>

          <TextField
            label="Employee ID"
            name="employeeId"
            value={form.employeeId}
            onChange={handleChange}
          />

          <TextField
            label="Month"
            name="month"
            placeholder="March 2026"
            value={form.month}
            onChange={handleChange}
          />

          {/* Salary Grade Dropdown */}
          <FormControl fullWidth>
            <InputLabel>Salary Grade</InputLabel>
            <Select
              name="salaryGradeId"
              value={form.salaryGradeId}
              onChange={handleChange}
            >
              {salaryGradesDrop.map(sal => (
                <MenuItem key={sal.id} value={sal.id}>
                  {sal.grade_name}
                </MenuItem>
              ))}
            </Select>
          </FormControl>

          <TextField
            label="Basic Salary"
            name="basic"
            type="number"
            value={form.basic}
            onChange={handleChange}
          />

          <TextField
            label="HRA"
            name="hra"
            type="number"
            value={form.hra}
            onChange={handleChange}
          />

          <TextField
            label="Tax"
            name="tax"
            type="number"
            value={form.tax}
            onChange={handleChange}
          />

          <TextField
            label="Deductions"
            name="deductions"
            type="number"
            value={form.deductions}
            onChange={handleChange}
          />

          <Button variant="contained" onClick={submit}>
            Generate Payroll
          </Button>
        </div>
      </Paper>
    </div>
  );
}