"use client";

import { useState } from "react";
import { Dialog, DialogTitle, DialogContent, DialogActions, Button, TextField, MenuItem } from "@mui/material";
import api from "@/app/src/services/api";

type Props = {
  open: boolean;
  onClose: () => void;
  onUploaded: () => void;
  candidates: { id: number; firstName: string; lastName: string }[];
};

export default function AdminOfferLetterModal({ open, onClose, onUploaded, candidates }: Props) {
  const [candidateId, setCandidateId] = useState<number | "">("");
  const [file, setFile] = useState<File | null>(null);

  const handleUpload = async () => {
    if (!candidateId || !file) {
      alert("Candidate and file are required");
      return;
    }

    try {
      const formData = new FormData();
      formData.append("candidateId", String(candidateId));
      formData.append("file", file);

      await api.post("/offer-letters", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      onUploaded();
      onClose();
      setCandidateId("");
      setFile(null);
    } catch (err: any) {
      console.error(err.response?.data || err);
      alert("Failed to upload offer letter");
    }
  };

  return (
    <Dialog open={open} onClose={onClose}>
      <DialogTitle>Upload Offer Letter</DialogTitle>
      <DialogContent className="space-y-4">
        <TextField
          select
          fullWidth
          label="Candidate"
          value={candidateId}
          onChange={(e) => setCandidateId(Number(e.target.value))}
        >
          {candidates.map((c) => (
            <MenuItem key={c.id} value={c.id}>
              {c.firstName} {c.lastName}
            </MenuItem>
          ))}
        </TextField>

        <input type="file" onChange={(e) => e.target.files && setFile(e.target.files[0])} />
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Cancel</Button>
        <Button onClick={handleUpload} variant="contained">
          Upload
        </Button>
      </DialogActions>
    </Dialog>
  );
}