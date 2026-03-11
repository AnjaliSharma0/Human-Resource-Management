"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import {
  Box,
  Typography,
  Table,
  TableHead,
  TableBody,
  TableCell,
  TableRow,
  TableContainer,
  Paper,
  Select,
  MenuItem,
  InputLabel,
  FormControl,
  CircularProgress,
  Button,
} from "@mui/material";
import api, { setAuthToken } from "../utils/api";



interface Department {
  id: number;
  name: string;
}

interface Designation {
  id: number;
  title: string;
}

interface Employee {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  status: string;
  department: Department | null;
  designation: Designation | null;
}

export default function EmployeeListPage() {
  const router = useRouter();
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [departments, setDepartments] = useState<Department[]>([]);
  const [designations, setDesignations] = useState<Designation[]>([]);
  const [loading, setLoading] = useState(true);
  const [filterDept, setFilterDept] = useState<number | "">("");
  const [filterDesig, setFilterDesig] = useState<number | "">("");
  const [filterStatus, setFilterStatus] = useState<string | "">("");
  
  const token = localStorage.getItem("token");
  const userId = Number(localStorage.getItem("userId"));
  const userRole = localStorage.getItem("role");

  useEffect(() => {
    setAuthToken(token);

    const fetchData = async () => {
      try {
        const [empRes, deptRes, desigRes] = await Promise.all([
          api.get<Employee[]>("/employees"),
          api.get<Department[]>("/departments"),
          api.get<Designation[]>("/designations"),
        ]);
        
        // For non-admin, filter to own employee
        let data = empRes.data;
        if (userRole !== "admin") data = data.filter(e => e.id === userId);

        setEmployees(data);
        setDepartments(deptRes.data);
        setDesignations(desigRes.data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const filteredEmployees = employees.filter(emp => {
    return (
      (filterDept === "" || emp.department?.id === filterDept) &&
      (filterDesig === "" || emp.designation?.id === filterDesig) &&
      (filterStatus === "" || emp.status === filterStatus)
    );
  });

  if (loading) return <Box className="flex justify-center mt-20"><CircularProgress /></Box>;
  if (filteredEmployees.length === 0) return <Box className="text-center mt-20">No employees found</Box>;

  return (
    <Box className="max-w-6xl mx-auto p-6 space-y-6">
      <Typography variant="h5">Employees</Typography>

      {/* Filters */}
      <Box className="flex gap-4 mb-4">
        <FormControl className="min-w-[150px]">
          <InputLabel>Department</InputLabel>
          <Select value={filterDept} onChange={e => setFilterDept(e.target.value as number)}>
            <MenuItem value="">All</MenuItem>
            {departments.map(d => <MenuItem key={d.id} value={d.id}>{d.name}</MenuItem>)}
          </Select>
        </FormControl>

        <FormControl className="min-w-[150px]">
          <InputLabel>Designation</InputLabel>
          <Select value={filterDesig} onChange={e => setFilterDesig(e.target.value as number)}>
            <MenuItem value="">All</MenuItem>
            {designations.map(d => <MenuItem key={d.id} value={d.id}>{d.title}</MenuItem>)}
          </Select>
        </FormControl>

        <FormControl className="min-w-[150px]">
          <InputLabel>Status</InputLabel>
          <Select value={filterStatus} onChange={e => setFilterStatus(e.target.value)}>
            <MenuItem value="">All</MenuItem>
            <MenuItem value="active">Active</MenuItem>
            <MenuItem value="inactive">Inactive</MenuItem>
          </Select>
        </FormControl>

        {userRole === "admin" && (
          <Button variant="contained" color="primary" onClick={() => router.push("/employees/create")}>
            Add Employee
          </Button>
        )}
      </Box>

      {/* Employee Table */}
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Name</TableCell>
              <TableCell>Email</TableCell>
              <TableCell>Phone</TableCell>
              <TableCell>Department</TableCell>
              <TableCell>Designation</TableCell>
              <TableCell>Status</TableCell>
              <TableCell>Action</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {filteredEmployees.map(emp => (
              <TableRow key={emp.id} hover>
                <TableCell>{emp.firstName} {emp.lastName}</TableCell>
                <TableCell>{emp.email}</TableCell>
                <TableCell>{emp.phone}</TableCell>
                <TableCell>{emp.department?.name || "N/A"}</TableCell>
                <TableCell>{emp.designation?.title || "N/A"}</TableCell>
                <TableCell>{emp.status}</TableCell>
                <TableCell>
                  <Button variant="outlined" size="small" onClick={() => router.push(`/employees/${emp.id}/edit`)}>
                    Edit
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
}