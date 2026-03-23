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
  description:string;
}

export default function DepartmentPage() {
  const [departments, setDepartments] = useState<Department[]>([]);
  const [name, setName] = useState("");
  const [location, setLocation] = useState("");
  const [description, setDescription] = useState("");
  const [editingId, setEditingId] = useState<number | null>(null);
  const route = useRouter()
  const [openDialog, setOpenDialog] = useState(false);
  const [selectedDept, setSelectedDept] = useState<Department|null>(null);

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
        await api.patch(`/departments/${editingId}`, { name, location, description });
        toast.success("Department updated");
        route.push("/department")
      } else {
        await api.post("/departments", { name, location, description });
        toast.success("Department created");
        route.push("/designations")
      }
      setName("");
      setLocation("");
      setEditingId(null);
      setDescription("")
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
    setDescription(dept.description || "")
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

  // return (
  //   <Box p={4} sx={{padding: "6px"}}>
  //     <div className="flex justify-between m-4">
  //       <Typography variant="h4" mb={3}>Departments</Typography>
  //       <Button
  //         className="text-white bg-red-600 hover:bg-red-700"
  //         onClick={() => route.push("/department")}
  //       >
  //         <BackwardIcon />
  //       </Button>
  //     </div>

  //     <Stack direction={{ xs: "column", sm: "row" }} spacing={2} mb={4}>
  //       <TextField
  //         label="Name"
  //         value={name}
  //         onChange={(e) => setName(e.target.value)}
  //         fullWidth
  //       />
  //       <TextField
  //         label="Location"
  //         value={location}
  //         onChange={(e) => setLocation(e.target.value)}
  //         fullWidth
  //       />
  //        <TextField
  //         label="Description"
  //         value={description}
  //         onChange={(e) => setDescription(e.target.value)}
  //         fullWidth
  //         multiline
  //         rows={2}
  //       />
  //       <Button
  //         variant="contained"
  //         onClick={handleSubmit}
  //         sx={{ minWidth: 120 }}
  //       >
  //         {editingId ? "Update" : "Create"}
  //       </Button>
  //     </Stack>

  //     {/* <Stack spacing={2}>
  //       {departments.map((dept) => (
  //         <Card
  //           key={dept.id}
  //           sx={{
  //             "&:hover": { boxShadow: 6 },
  //             transition: "0.3s"
  //           }}
  //         > */}
  //     <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
  //       {departments.map((dept: any) => (
  //         <Card key={dept.id} className="w-full">
  //           <CardContent>
  //             <Typography variant="h6">{dept.name}</Typography>
  //             <Typography color="text.secondary">{dept.location}</Typography>
  //           </CardContent>
  //           <Typography className="text-sm text-gray-600 mt-2">
  //             {dept.description || "No description available"}
  //           </Typography>
  //           <CardActions>
  //             <Button size="small" onClick={() => handleEdit(dept)}><ModeEdit/></Button>
  //             <Button className="bg-red-600 text-white p-2 m-2 rounded-lg" size="small" color="error" onClick={() => openConfirm(dept)}><DeleteIcon /></Button>
  //           </CardActions>
  //         </Card>
  //       ))}
  //     </div>
  //     {/* </Card>
  //       ))}
  //     </Stack> */}

  //     <Dialog open={openDialog} onClose={() => setOpenDialog(false)}>
  //       <DialogTitle>Confirm Delete</DialogTitle>
  //       <DialogContent>
  //         <Typography>Are you sure you want to delete "{selectedDept?.name}"?</Typography>
  //       </DialogContent>
  //       <DialogActions>
  //         <Button onClick={() => setOpenDialog(false)}>Cancel</Button>
  //         <Button color="error" onClick={confirmDelete}>Delete</Button>
  //       </DialogActions>
  //     </Dialog>
  //   </Box>
  // );

  return (
  <Box className="bg-gray-100 min-h-screen p-6">

    {/* HEADER */}
    <div className="flex justify-between items-center mb-6">
      <Typography variant="h4" className="font-bold text-gray-800">
        Departments
      </Typography>

      <Button
        variant="contained"
        color="error"
        onClick={() => route.push("/department")}
        className="rounded-lg"
      >
        Back
      </Button>
    </div>

    {/* FORM CARD */}
    <Card className="mb-6 shadow-md rounded-2xl">
      <CardContent>
        <Typography className="mb-4 font-semibold text-gray-700">
          {editingId ? "Edit Department" : "Create Department"}
        </Typography>

        <Stack spacing={2}>
          <TextField
            label="Department Name"
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

          <TextField
            label="Description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            multiline
            rows={3}
            fullWidth
          />

          <Button
            variant="contained"
            onClick={handleSubmit}
            className="bg-blue-600 hover:bg-blue-700 rounded-lg"
          >
            {editingId ? "Update Department" : "Create Department"}
          </Button>
        </Stack>
      </CardContent>
    </Card>

    {/* DEPARTMENT CARDS */}
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
      {departments.map((dept) => (
        <Card
          key={dept.id}
          className="rounded-2xl shadow-md hover:shadow-xl transition duration-300"
        >
          <CardContent>
            <Typography variant="h6" className="font-semibold text-gray-800">
              {dept.name}
            </Typography>

            <Typography className="text-sm text-gray-400 mt-1">
              📍 {dept.location}
            </Typography>

            <Typography className="text-sm text-gray-600 mt-3 leading-relaxed">
              {dept.description || "No description available"}
            </Typography>
          </CardContent>

          <CardActions className="flex justify-end pr-4 pb-3">
            <Button
              size="small"
              onClick={() => handleEdit(dept)}
              className="text-blue-600"
            >
              <ModeEdit fontSize="small" />
            </Button>

            <Button
              size="small"
              onClick={() => openConfirm(dept)}
              className="text-red-600"
            >
              <DeleteIcon fontSize="small" />
            </Button>
          </CardActions>
        </Card>
      ))}
    </div>

    {/* DELETE DIALOG */}
    <Dialog open={openDialog} onClose={() => setOpenDialog(false)}>
      <DialogTitle className="font-semibold">
        Confirm Delete
      </DialogTitle>

      <DialogContent>
        <Typography>
          Are you sure you want to delete{" "}
          <span className="font-semibold text-red-500">
            {selectedDept?.name}
          </span>
          ?
        </Typography>
      </DialogContent>

      <DialogActions>
        <Button onClick={() => setOpenDialog(false)}>Cancel</Button>

        <Button color="error" variant="contained" onClick={confirmDelete}>
          Delete
        </Button>
      </DialogActions>
    </Dialog>
  </Box>
);
}