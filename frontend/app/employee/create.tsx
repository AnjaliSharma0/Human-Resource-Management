"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import {
  Box,
  Typography,
  Card,
  CardContent,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Button,
  CircularProgress,
  SelectChangeEvent,
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
}

export default function CreateEmployeePage() {
  const router = useRouter();
  const [departments, setDepartments] = useState<Department[]>([]);
  const [designations, setDesignations] = useState<Designation[]>([]);
  const [managers, setManagers] = useState<Employee[]>([]);
  const [loading, setLoading] = useState(true);

  const [form, setForm] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    dateOfBirth: "",
    gender: "",
    address: "",
    joiningDate: "",
    departmentId: "",
    designationId: "",
    managerId: "",
  });

  // Fetch departments, designations, and managers
  useEffect(() => {
    const token = localStorage.getItem("token");
    setAuthToken(token);

    const fetchData = async () => {
      try {
        const [deptRes, desigRes, mgrRes] = await Promise.all([
          api.get<Department[]>("/departments"),
          api.get<Designation[]>("/designations"),
          api.get<Employee[]>("/employees"),
        ]);
        setDepartments(deptRes.data);
        setDesignations(desigRes.data);
        setManagers(mgrRes.data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // For TextField
  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  // For MUI Select
  const handleSelectChange = (e: SelectChangeEvent<string>) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async () => {
    try {
      await api.post("/employees", {
        ...form,
        departmentId: Number(form.departmentId),
        designationId: Number(form.designationId),
        managerId: form.managerId ? Number(form.managerId) : null,
      });
      router.push("/employees");
    } catch (err) {
      console.error(err);
      alert("Error creating employee");
    }
  };

  if (loading)
    return (
      <Box className="flex justify-center mt-20">
        <CircularProgress />
      </Box>
    );

  return (
    <Box className="max-w-4xl mx-auto p-6">
      <Typography variant="h5" className="mb-4">
        Create New Employee
      </Typography>

      <Card className="p-4">
        <CardContent className="space-y-4">
          {/* Personal Info */}
          <Box className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <TextField
              label="First Name"
              name="firstName"
              value={form.firstName}
              onChange={handleInputChange}
              fullWidth
            />
            <TextField
              label="Last Name"
              name="lastName"
              value={form.lastName}
              onChange={handleInputChange}
              fullWidth
            />
            <TextField
              label="Email"
              name="email"
              value={form.email}
              onChange={handleInputChange}
              fullWidth
            />
            <TextField
              label="Phone"
              name="phone"
              value={form.phone}
              onChange={handleInputChange}
              fullWidth
            />
            <TextField
              label="Date of Birth"
              type="date"
              name="dateOfBirth"
              value={form.dateOfBirth}
              onChange={handleInputChange}
              fullWidth
              InputLabelProps={{ shrink: true }}
            />
            <TextField
              label="Joining Date"
              type="date"
              name="joiningDate"
              value={form.joiningDate}
              onChange={handleInputChange}
              fullWidth
              InputLabelProps={{ shrink: true }}
            />
            <TextField
              label="Gender"
              name="gender"
              value={form.gender}
              onChange={handleInputChange}
              fullWidth
            />
            <TextField
              label="Address"
              name="address"
              value={form.address}
              onChange={handleInputChange}
              fullWidth
            />
          </Box>

          {/* Department, Designation, Manager */}
          <Box className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <FormControl fullWidth>
              <InputLabel>Department</InputLabel>
              <Select
                name="departmentId"
                value={form.departmentId}
                onChange={handleSelectChange}
              >
                <MenuItem value="">Select Department</MenuItem>
                {departments.map((d) => (
                  <MenuItem key={d.id} value={d.id}>
                    {d.name}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>

            <FormControl fullWidth>
              <InputLabel>Designation</InputLabel>
              <Select
                name="designationId"
                value={form.designationId}
                onChange={handleSelectChange}
              >
                <MenuItem value="">Select Designation</MenuItem>
                {designations.map((d) => (
                  <MenuItem key={d.id} value={d.id}>
                    {d.title}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>

            <FormControl fullWidth>
              <InputLabel>Manager</InputLabel>
              <Select
                name="managerId"
                value={form.managerId}
                onChange={handleSelectChange}
              >
                <MenuItem value="">No Manager</MenuItem>
                {managers.map((m) => (
                  <MenuItem key={m.id} value={m.id}>
                    {m.firstName} {m.lastName}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Box>

          <Button
            variant="contained"
            color="primary"
            onClick={handleSubmit}
            className="mt-4"
          >
            Create Employee
          </Button>
        </CardContent>
      </Card>
    </Box>
  );
}