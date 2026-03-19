"use client";

import { useState } from "react";
import { Dialog, DialogTitle, DialogContent, DialogActions, Button, TextField, MenuItem } from "@mui/material";
import api from "@/app/src/services/api";

type Candidate = { id: number; firstName: string; lastName: string };
type Employee = { id: number; firstName: string; lastName: string };

type Props = {
  open: boolean;
  onClose: () => void;
  onScheduled: () => void;
  candidates: Candidate[];
  interviewers: Employee[];
};

export default function ScheduleInterviewModal({ open, onClose, onScheduled, candidates, interviewers }: Props) {
  const [candidateId, setCandidateId] = useState<number | "">("");
  const [interviewerId, setInterviewerId] = useState<number | "">("");
  const [dateTime, setDateTime] = useState("");
  const [mode, setMode] = useState("Online");

  const handleSchedule = async () => {
    if (!candidateId || !interviewerId || !dateTime || !mode) {
      alert("All fields are required");
      return;
    }

    try {
      await api.post("/interviews", {
        candidateId,
        interviewerId,
        dateTime,
        mode,
      });
      onScheduled();
      onClose();
      // Reset form
      setCandidateId("");
      setInterviewerId("");
      setDateTime("");
      setMode("Online");
    } catch (err: any) {
      console.error(err.response?.data || err);
      alert("Failed to schedule interview");
    }
  };

  return (
    <Dialog open={open} onClose={onClose}>
      <DialogTitle>Schedule Interview</DialogTitle>
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

        <TextField
          select
          fullWidth
          label="Interviewer"
          value={interviewerId}
          onChange={(e) => setInterviewerId(Number(e.target.value))}
        >
          {interviewers.map((i) => (
            <MenuItem key={i.id} value={i.id}>
              {i.firstName} {i.lastName}
            </MenuItem>
          ))}
        </TextField>

        <TextField
          fullWidth
          type="datetime-local"
          label="Date & Time"
          InputLabelProps={{ shrink: true }}
          value={dateTime}
          onChange={(e) => setDateTime(e.target.value)}
        />

        <TextField
          select
          fullWidth
          label="Mode"
          value={mode}
          onChange={(e) => setMode(e.target.value)}
        >
          {["Online", "Offline"].map((m) => (
            <MenuItem key={m} value={m}>
              {m}
            </MenuItem>
          ))}
        </TextField>
      </DialogContent>

      <DialogActions>
        <Button onClick={onClose}>Cancel</Button>
        <Button onClick={handleSchedule} variant="contained">
          Schedule
        </Button>
      </DialogActions>
    </Dialog>
  );
}