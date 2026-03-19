"use client";

import { useState, useEffect } from "react";
import axios from "axios";
import {
  TextField,
  Button,
  Typography,
  Box,
  Card,
  CardContent,
  CardActions,
  MenuItem,
  Stack,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions
} from "@mui/material";
import ModeEditIcon from '@mui/icons-material/ModeEdit';
import toast from "react-hot-toast";
import api from "../src/services/api";
import { useRouter } from "next/navigation";
import DeleteIcon from '@mui/icons-material/Delete';
import { BackwardIcon } from "@heroicons/react/24/solid";
interface Department {
  id: number;
  name: string;
}

interface Designation {
  id: number;
  title: string;
  department: Department;
}

export default function DesignationPage() {
  const [departments, setDepartments] = useState<Department[]>([]);
  const [designations, setDesignations] = useState<Designation[]>([]);
  const [title, setTitle] = useState("");
  const [departmentId, setDepartmentId] = useState<number | "">("");
  const [editingId, setEditingId] = useState<number | null>(null);
  const route = useRouter()

  const [openDialog, setOpenDialog] = useState(false);
  const [selectedDept, setSelectedDept] = useState<any>(null);

  const openConfirm = (desig: any) => {
    setSelectedDept(desig);
    setOpenDialog(true);
  };

  const confirmDelete = () => {
    if (!selectedDept) return;
    handleDelete(selectedDept.id);
    setOpenDialog(false);
  };
  const fetchDepartments = async () => {
    try {
      const res = await api.get("/departments")
      setDepartments(Array.isArray(res.data) ? res.data : []);
      console.log(departments)
    } catch (err) {
      console.error(err);
      toast.error("Failed to fetch departments");
    }
  };

  const fetchDesignations = async () => {
    try {
      const res = await api.get("/designations");

      setDesignations(Array.isArray(res.data) ? res.data : []);
    } catch (err) {
      console.error(err);
      toast.error("Failed to fetch designations");
    }
  };

  useEffect(() => {
    fetchDepartments();
    fetchDesignations();
  }, []);


  const handleSubmit = async () => {
    if (!title || !departmentId) return toast.error("All fields are required");

    try {
      if (editingId) {
        await api.patch(`/designations/${editingId}`, { title, departmentId });
        toast.success("Designation updated");
        route.push("/department")
      } else {
        await api.post("/designations", { title, departmentId });
        toast.success("Designation created");
        route.push("/department")
      }

      setTitle("");
      setDepartmentId("");
      setEditingId(null);
      fetchDesignations();
    } catch (err) {
      console.error(err);
      toast.error("Error saving designation");
    }
  };

  const handleEdit = (des: Designation) => {
    setEditingId(des.id);
    setTitle(des.title);
    setDepartmentId(des.department.id);
  };

  const handleDelete = async (id: number) => {
    try {
      await api.delete(`/designations/${id}`);
      toast.success("Designation deleted");
      route.push("/department")
      fetchDesignations();
    } catch (err) {
      console.error(err);
      toast.error("Error deleting designation");
    }
  };

  return (
    <Box p={4}>
      <div className="flex justify-between m-4">
        <Typography variant="h4" mb={3}>Designations</Typography>
        <Button size="small"
          className="text-white bg-red-600 hover:bg-red-700"
          onClick={() => route.push("/department")}
        >
          <BackwardIcon />
        </Button>
      </div>

      <Stack direction={{ xs: "column", sm: "row" }} spacing={2} mb={4}>
        <TextField
          label="Title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          fullWidth
        />
        <TextField
          select
          label="Department"
          value={departmentId}
          onChange={(e) => setDepartmentId(Number(e.target.value))}
          fullWidth
        >
          {departments.map((dept) => (
            <MenuItem key={dept.id} value={dept.id}>{dept.name}</MenuItem>
          ))}
        </TextField>
        <Button
          variant="contained"
          onClick={handleSubmit}
          sx={{ minWidth: 120 }}
        >
          {editingId ? "Update" : "Create"}
        </Button>
      </Stack>

      {/* <Stack spacing={2}>
        {designations.map((des) => (
          <Card
            key={des.id}
            sx={{
              "&:hover": { boxShadow: 6 },
              transition: "0.3s"
            }}
          >
            <CardContent>
              <Typography variant="h6">{des.title}</Typography>
              <Typography color="text.secondary">{des.department.name}</Typography>
            </CardContent>
            <CardActions>
              <Button size="small" onClick={() => handleEdit(des)}>Edit</Button>
              <Button size="small" color="error" onClick={() => handleDelete(des.id)}>Delete</Button>
            </CardActions>
          </Card>
        ))}
      </Stack> */}

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {designations.map((desig: any) => (
          <Card key={desig.id} className="w-full">
            <CardContent>
              <Typography variant="h6">Designation: {desig.title}</Typography>
              <Typography color="text.secondary">Department: {desig.department.name}</Typography>
            </CardContent>
            <CardActions>
              

                <Button size="small" onClick={() => handleEdit(desig)}><ModeEditIcon/></Button>
                <Button size="small" color="error" onClick={() => openConfirm(desig)}><DeleteIcon /></Button>

             </CardActions>
          </Card>
        ))}
      </div>

      {/* Confirmation Dialog */}
      <Dialog open={openDialog} onClose={() => setOpenDialog(false)}>
        <DialogTitle>Confirm Delete</DialogTitle>
        <DialogContent>
          <Typography>Are you sure you want to delete "{selectedDept?.name}"?</Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenDialog(false)}>Cancel</Button>
          <Button color="error" onClick={confirmDelete}>Delete</Button>
        </DialogActions>
      </Dialog>
    </Box>


  );
}