"use client";
import { useForm } from "react-hook-form";
import { Button, TextField, MenuItem, Stack } from "@mui/material";
import { useRouter } from "next/navigation";
import { getRole, getUserId } from "../../utils/auth";
import api from "../../utils/api";

export interface EmployeeFormData {
  name: string;
  email: string;
  role: string;
  designation: string;
}

type Props = {
  employee?: EmployeeFormData & { id: number };
  isEdit?: boolean;
};

export default function EmployeeForm({ employee, isEdit = false }: Props) {
  const role = getRole();
  const currentUserId = getUserId();
  const { register, handleSubmit } = useForm<EmployeeFormData>({ defaultValues: employee });
  const router = useRouter();

  const onSubmit = async (data: EmployeeFormData) => {
    try {
      if (!employee || !isEdit) {
        await api.post("/employees", data);
      } else {
        if (role === "employee" && employee.id !== currentUserId) return alert("Access denied");
        await api.patch(`/employees/${employee.id}`, data);
      }
      router.push("/employees");
    } catch (err) {
      alert("Operation failed!");
      console.error(err);
    }
  };

  const handleDelete = async () => {
    if (!employee) return;
    if (!confirm(`Are you sure you want to delete ${employee.name}? This action cannot be undone.`)) return;
    try {
      await api.delete(`/employees/${employee.id}`);
      alert("Employee deleted successfully");
      router.push("/employees");
    } catch (err) {
      alert("Delete failed!");
      console.error(err);
    }
  };

  const canEditAll = role === "admin" || role === "manager" || (role === "employee" && employee?.id === currentUserId);

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 bg-white p-6 rounded-lg shadow-md">
      <TextField {...register("name")} label="Name" fullWidth variant="outlined" required disabled={!canEditAll} />
      <TextField {...register("email")} label="Email" fullWidth variant="outlined" required disabled={!canEditAll} />
      <TextField
        {...register("role")}
        select
        label="Role"
        fullWidth
        variant="outlined"
        required
        disabled={!(role === "admin")}
      >
        <MenuItem value="employee">Employee</MenuItem>
        <MenuItem value="manager">Manager</MenuItem>
        <MenuItem value="admin">Admin</MenuItem>
      </TextField>
      <TextField {...register("designation")} label="Designation" fullWidth variant="outlined" required disabled={!canEditAll} />

      <Stack direction="row" spacing={2}>
        <Button type="submit" variant="contained" color="primary">
          {isEdit ? "Update" : "Add"} Employee
        </Button>

        {/* Delete button visible only to admin and in edit mode */}
        {role === "admin" && isEdit && (
          <Button type="button" variant="outlined" color="error" onClick={handleDelete}>
            Delete Employee
          </Button>
        )}
      </Stack>
    </form>
  );
}