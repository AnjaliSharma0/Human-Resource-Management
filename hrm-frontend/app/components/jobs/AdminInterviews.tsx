"use client";

import { useState } from "react";
import { Dialog, DialogTitle, DialogContent, DialogActions, Button, TextField, MenuItem } from "@mui/material";
import api from "@/app/src/services/api";
import toast from "react-hot-toast";

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
  const [form, setForm] = useState({
    candidateId: "",
    interviewerId: "",
    dateTime: "",
    mode: "Online",
  });
  const [mode, setMode] = useState("Online");
  const [errors, setErrors] = useState<any>({});

 const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
  const { name, value } = e.target;

  setForm({
    ...form,
    [name]: name === "candidateId" || name === "interviewerId" ? Number(value) : value,
  });

  // clear error while typing
  setErrors({ ...errors, [name]: "" });
};

  const validate = () => {
    let newErrors: any = {};

    if (!form.candidateId)
      newErrors.candidateId = "Candidate is required";

    if (!form.interviewerId)
      newErrors.interviewerId = "Interviewer is required";

    if (!form.dateTime)
      newErrors.dateTime = "Date & Time is required";

    if (!form.mode) newErrors.mode = "Mode is required";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };
  const handleSchedule = async () => {
  if (!validate()) return;

  try {
    await api.post("/interviews", {
      candidateId: Number(form.candidateId),   // convert string to number
      interviewerId: Number(form.interviewerId),
      dateTime: form.dateTime,
      mode: form.mode,
    });
    toast.success("Scheduled successfully.");
    onScheduled();
    onClose();
    setForm({
      candidateId: "",
      interviewerId: "",
      dateTime: "",
      mode: "Online",
    });
    setErrors({});
  } catch (err: any) {
    console.error(err.response?.data || err);
    toast.error("Failed to schedule interview");
  }
// };
//   const handleSchedule = async () => {
//     if (!validate()) {
//       return
//     }

//     try {
//       await api.post("/interviews", {
//         candidateId,
//         interviewerId,
//         dateTime,
//         mode,
//       });
//       toast.success("Scheduled successfully.")
//       onScheduled();
//       onClose();
//       // Reset form
//       setCandidateId("");
//       setInterviewerId("");
//       setDateTime("");
//       setMode("Online");

//     } catch (err: any) {
//       console.error(err.response?.data || err);
//       toast.error("Failed to schedule interview");
//     }
};

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm">
      <DialogTitle>Schedule Interview</DialogTitle>
      <DialogContent sx={{
        mt: 1,
        px: 3,
        display: "flex",
        flexDirection: "column",
        gap: 2.5,
      }}>
        <TextField
          select
          fullWidth
          label="Candidate"
          name="candidateId" // important for handleChange
          value={form.candidateId} // bind to form
          onChange={handleChange}
          error={!!errors.candidateId}
          helperText={errors.candidateId}
          sx={{ mt: 1 }}
        >
          {candidates.map((c) => (
            <MenuItem key={c.id} value={c.id}>
              {c.id}
            </MenuItem>
          ))}
        </TextField>

        <TextField
          select
          fullWidth
          label="Interviewer"
          name="interviewerId"
          value={form.interviewerId}
          onChange={handleChange}
          error={!!errors.interviewerId}
          helperText={errors.interviewerId}
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
          name="dateTime"
          value={form.dateTime}
          onChange={handleChange}
          error={!!errors.dateTime}
          helperText={errors.dateTime}
        />

        <TextField
          select
          fullWidth
          label="Mode"
          name="mode"
          value={form.mode}
          onChange={handleChange}
          error={!!errors.mode}
          helperText={errors.mode}
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