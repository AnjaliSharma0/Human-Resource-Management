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

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async () => {
    const { title, department, location, description } = form;
    if (!title || !department || !location || !description) {
      toast.error("All fields are required");
      return;
    }

    try {
      await api.post("/job-requisition", form);
      toast.success("Job Requisition Created");
      onCreated(); // reload parent data
      onClose(); // close modal
      setForm({ title: "", department: "", location: "", description: "" }); // reset form
    } catch (err: any) {
      console.error(err);
      toast.error("Failed to create requisition");
    }
  };

  return (
    <Dialog open={open} onClose={onClose}>
      <DialogTitle>Create Job Requisition</DialogTitle>
      <DialogContent className="space-y-3">
        <TextField
          fullWidth
          label="Job Title"
          name="title"
          value={form.title}
          onChange={handleChange}
        />
        <TextField
          fullWidth
          label="Department"
          name="department"
          value={form.department}
          onChange={handleChange}
        />
        <TextField
          fullWidth
          label="Location"
          name="location"
          value={form.location}
          onChange={handleChange}
        />
        <TextField
          fullWidth
          label="Description"
          name="description"
          multiline
          rows={4}
          value={form.description}
          onChange={handleChange}
        />
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Cancel</Button>
        <Button onClick={handleSubmit} variant="contained">
          Create
        </Button>
      </DialogActions>
    </Dialog>
  );
}