"use client";

import { useState } from "react";
import { Dialog, DialogTitle, DialogContent, DialogActions, Button, TextField } from "@mui/material";
import api from "@/app/src/services/api";

type Props = {
  open: boolean;
  onClose: () => void;
  onCreated: () => void;
};

export default function AddJobPostingModal({ open, onClose, onCreated }: Props) {
  const [jobRequisitionId, setJobRequisitionId] = useState("");
  const [postingStartDate, setPostingStartDate] = useState("");
  const [postingEndDate, setPostingEndDate] = useState("");

  const handleCreate = async () => {
    if (!jobRequisitionId || !postingStartDate || !postingEndDate) {
      alert("All fields are required");
      return;
    }

    try {
      await api.post("/job-postings", {
        jobRequisitionId: Number(jobRequisitionId),
        isInternal: true,
        isExternal: true,
        postingStartDate,
        postingEndDate,
      });
      onCreated();
      onClose();
    } catch (err: any) {
      console.error(err.response?.data || err);
      alert("Failed to create job posting");
    }
  };

  return (
    <Dialog open={open} onClose={onClose}>
      <DialogTitle>Create Job Posting</DialogTitle>
      <DialogContent className="space-y-4">
        <TextField
          fullWidth
          label="Job Requisition ID"
          value={jobRequisitionId}
          onChange={(e) => setJobRequisitionId(e.target.value)}
        />
        <TextField
          fullWidth
          type="date"
          label="Start Date"
          InputLabelProps={{ shrink: true }}
          value={postingStartDate}
          onChange={(e) => setPostingStartDate(e.target.value)}
        />
        <TextField
          fullWidth
          type="date"
          label="End Date"
          InputLabelProps={{ shrink: true }}
          value={postingEndDate}
          onChange={(e) => setPostingEndDate(e.target.value)}
        />
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Cancel</Button>
        <Button onClick={handleCreate} variant="contained">
          Create
        </Button>
      </DialogActions>
    </Dialog>
  );
}