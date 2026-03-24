"use client";

import { useState } from "react";
import { Dialog, DialogTitle, DialogContent, DialogActions, Button, TextField } from "@mui/material";
import api from "@/app/src/services/api";
import toast from "react-hot-toast";

type Props = {
  open: boolean;
  onClose: () => void;
  onCreated: () => void;
};

export default function CreateJobRequisitionModal({ open, onClose, onCreated }: Props) {
  const [form, setForm] = useState({
    title: "",
    department: "",
    location: "",
    description: "",
  });
  const [errors, setErrors] = useState<any>({})
  // Handle field change
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });

    // remove error while typing
    setErrors({ ...errors, [name]: "" });
  };

  const validate = () => {
    let newErrors: any = {};

    // Required fields
    if (!form.title.trim()) newErrors.title = "Job title is required";
    if (!form.department.trim()) newErrors.department = "Department is required";
    if (!form.location.trim()) newErrors.location = "Location is required";
    if (!form.description.trim()) newErrors.description = "Description is required";

    // Job Title must contain at least one letter (not just numbers)
    if (form.title && !/[a-zA-Z]/.test(form.title)) {
      newErrors.title = "Job title must contain letters or characters (not numbers)";
    }

    if (form.description && !/[a-zA-Z]/.test(form.description)) {
      newErrors.title = "description must contain letters or characters (not numbers)";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };


  const handleSubmit = async () => {
    if (!validate()) return
    // const { title, department, location, description } = form;
    // if (!title || !department || !location || !description) {
    //   toast.error("All fields are required");
    //   return;
    // }

    try {
      await api.post("/job-requisition", form);
      toast.success("Job Requisition Created");
      onCreated(); // reload parent data
      onClose(); // close modal
      setForm({ title: "", department: "", location: "", description: "" }); // reset form
      setErrors({})
    } catch (err: any) {
      console.error(err);
      toast.error("Failed to create requisition");
    }
  };

  return (

    //   <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm">
    //   <DialogTitle sx={{ pb: 2 }}>
    //     Create Job Requisition
    //   </DialogTitle>

    //   <DialogContent sx={{ display: "flex", flexDirection: "column", gap: 3 }}>

    //     <TextField
    //       fullWidth
    //       label="Job Title"
    //       name="title"
    //       value={form.title}
    //       onChange={handleChange}
    //       error={!!errors.title}
    //       helperText={errors.title}
    //       required
    //     />

    //     <TextField
    //       fullWidth
    //       label="Department"
    //       name="department"
    //       value={form.department}
    //       onChange={handleChange}
    //       error={!!errors.department}
    //       helperText={errors.department}
    //       required
    //     />

    //     <TextField
    //       fullWidth
    //       label="Location"
    //       name="location"
    //       value={form.location}
    //       onChange={handleChange}
    //       error={!!errors.location}
    //       helperText={errors.location}
    //       required
    //     />

    //     <TextField
    //       fullWidth
    //       label="Description"
    //       name="description"
    //       multiline
    //       rows={4}
    //       value={form.description}
    //       onChange={handleChange}
    //       error={!!errors.description}
    //       helperText={errors.description}
    //       required
    //     />
    //   </DialogContent>
    //   <DialogActions sx={{ px: 3, pb: 2, justifyContent: "flex-end", gap: 1 }}>
    //     <Button onClick={onClose} variant="outlined">
    //       Cancel
    //     </Button>
    //     <Button onClick={handleSubmit} variant="contained">
    //       Create
    //     </Button>
    //   </DialogActions>
    // </Dialog>
    <Dialog
      open={open}
      onClose={onClose}
      fullWidth
      maxWidth="sm"
      PaperProps={{
        sx: {
          p: 3, // padding inside the dialog
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          borderRadius: 3,
        },
      }}
    >
      <DialogTitle
        sx={{
          pb: 2,
          textAlign: "center",
          fontWeight: "bold",
          fontSize: "1.5rem",
        }}
      >
        Create Job Requisition
      </DialogTitle>

      <DialogContent
        sx={{
          display: "flex",
          flexDirection: "column",
          gap: 3, // space between fields
          mt: 1,  // space between title and fields
          pt: 2,
        }}
      >
        <TextField
          fullWidth
          label="Job Title"
          name="title"
          value={form.title}
          onChange={handleChange}
          error={!!errors.title}
          helperText={errors.title}
          sx={{ mt: 1 }}
          required
        />

        <TextField
          fullWidth
          label="Department"
          name="department"
          value={form.department}
          onChange={handleChange}
          error={!!errors.department}
          helperText={errors.department}
          required
        />

        <TextField
          fullWidth
          label="Location"
          name="location"
          value={form.location}
          onChange={handleChange}
          error={!!errors.location}
          helperText={errors.location}
          required
        />

        <TextField
          fullWidth
          label="Description"
          name="description"
          multiline
          rows={4}
          value={form.description}
          onChange={handleChange}
          error={!!errors.description}
          helperText={errors.description}
          required
        />
      </DialogContent>

      <DialogActions
        sx={{
          px: 3,
          pb: 2,
          justifyContent: "flex-end",
          gap: 1,
        }}
      >
        <Button onClick={onClose} variant="outlined">
          Cancel
        </Button>
        <Button onClick={handleSubmit} variant="contained">
          Create
        </Button>
      </DialogActions>
    </Dialog>
  );
}