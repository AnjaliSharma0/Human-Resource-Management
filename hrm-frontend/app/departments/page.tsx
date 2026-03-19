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
  Stack,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions
} from "@mui/material";
import DeleteIcon from '@mui/icons-material/Delete';
import toast from "react-hot-toast";
import api from "../src/services/api";
import { useRouter } from "next/navigation";
import { BackHand, ModeEdit } from "@mui/icons-material";
import { BackwardIcon } from "@heroicons/react/24/solid";

interface Department {
  id: number;
  name: string;
  location: string;
}

export default function DepartmentPage() {
  const [departments, setDepartments] = useState<Department[]>([]);
  const [name, setName] = useState("");
  const [location, setLocation] = useState("");
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
      const res = await api.get("/departments");
      setDepartments(Array.isArray(res.data) ? res.data : []);
    } catch (err) {
      console.error(err);
      toast.error("Failed to fetch departments");
    }
  };

  useEffect(() => {
    fetchDepartments();
  }, []);

  const handleSubmit = async () => {
    if (!name || !location) return toast.error("All fields are required");
    try {
      if (editingId) {
        await api.patch(`/departments/${editingId}`, { name, location });
        toast.success("Department updated");
        route.push("/department")
      } else {
        await api.post("/departments", { name, location });
        toast.success("Department created");
        route.push("/designations")
      }
      setName("");
      setLocation("");
      setEditingId(null);
      fetchDepartments();
    } catch (err) {
      console.error(err);
      toast.error("Error saving department");
    }
  };

  const handleEdit = (dept: Department) => {
    setEditingId(dept.id);
    setName(dept.name);
    setLocation(dept.location);
  };

  const handleDelete = async (id: number) => {
    try {
      await api.delete(`/departments/${id}`);
      toast.success("Department deleted");
      route.push("/department")
      fetchDepartments();
    } catch (err) {
      console.error(err);
      toast.error("Error deleting department");
    }
  };

  return (
    <Box p={4}>
      <div className="flex justify-between m-4">
        <Typography variant="h4" mb={3}>Departments</Typography>
        <Button
          className="text-white bg-red-600 hover:bg-red-700"
          onClick={() => route.push("/department")}
        >
          <BackwardIcon />
        </Button>
      </div>

      <Stack direction={{ xs: "column", sm: "row" }} spacing={2} mb={4}>
        <TextField
          label="Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          fullWidth
        />
        <TextField
          label="Location"
          value={location}
          onChange={(e) => setLocation(e.target.value)}
          fullWidth
        />
        <Button
          variant="contained"
          onClick={handleSubmit}
          sx={{ minWidth: 120 }}
        >
          {editingId ? "Update" : "Create"}
        </Button>
      </Stack>

      {/* <Stack spacing={2}>
        {departments.map((dept) => (
          <Card
            key={dept.id}
            sx={{
              "&:hover": { boxShadow: 6 },
              transition: "0.3s"
            }}
          > */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {departments.map((dept: any) => (
          <Card key={dept.id} className="w-full">
            <CardContent>
              <Typography variant="h6">{dept.name}</Typography>
              <Typography color="text.secondary">{dept.location}</Typography>
            </CardContent>
            <CardActions>
              <Button size="small" onClick={() => handleEdit(dept)}><ModeEdit/></Button>
              <Button className="bg-red-600 text-white p-2 m-2 rounded-lg" size="small" color="error" onClick={() => openConfirm(dept)}><DeleteIcon /></Button>
            </CardActions>
          </Card>
        ))}
      </div>
      {/* </Card>
        ))}
      </Stack> */}

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