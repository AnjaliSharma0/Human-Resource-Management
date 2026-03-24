// "use client";

// import { useState } from "react";
// import { Dialog, DialogTitle, DialogContent, DialogActions, Button, TextField } from "@mui/material";
// import api from "@/app/src/services/api";

// type Props = {
//   open: boolean;
//   onClose: () => void;
//   onCreated: () => void;
// };

// export default function AddJobPostingModal({ open, onClose, onCreated }: Props) {
//   const [jobRequisitionId, setJobRequisitionId] = useState("");
//   const [postingStartDate, setPostingStartDate] = useState("");
//   const [postingEndDate, setPostingEndDate] = useState("");

//   const handleCreate = async () => {
//     if (!jobRequisitionId || !postingStartDate || !postingEndDate) {
//       alert("All fields are required");
//       return;
//     }

//     try {
//       await api.post("/job-postings", {
//         jobRequisitionId: Number(jobRequisitionId),
//         isInternal: true,
//         isExternal: true,
//         postingStartDate,
//         postingEndDate,
//       });
//       onCreated();
//       onClose();
//     } catch (err: any) {
//       console.error(err.response?.data || err);
//       alert("Failed to create job posting");
//     }
//   };

//   return (
//     <Dialog open={open} onClose={onClose}>
//       <DialogTitle>Create Job Posting</DialogTitle>
//       <DialogContent className="space-y-4">
//         <TextField
//           fullWidth
//           label="Job Requisition ID"
//           value={jobRequisitionId}
//           onChange={(e) => setJobRequisitionId(e.target.value)}
//         />
//         <TextField
//           fullWidth
//           type="date"
//           label="Start Date"
//           InputLabelProps={{ shrink: true }}
//           value={postingStartDate}
//           onChange={(e) => setPostingStartDate(e.target.value)}
//         />
//         <TextField
//           fullWidth
//           type="date"
//           label="End Date"
//           InputLabelProps={{ shrink: true }}
//           value={postingEndDate}
//           onChange={(e) => setPostingEndDate(e.target.value)}
//         />
//       </DialogContent>
//       <DialogActions>
//         <Button onClick={onClose}>Cancel</Button>
//         <Button onClick={handleCreate} variant="contained">
//           Create
//         </Button>
//       </DialogActions>
//     </Dialog>
//   );
// }

"use client";

import { useState } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
} from "@mui/material";
import api from "@/app/src/services/api";

type Props = {
  open: boolean;
  onClose: () => void;
  onCreated: () => void;
};

export default function AddJobPostingModal({
  open,
  onClose,
  onCreated,
}: Props) {
  const [form, setForm] = useState({
    jobRequisitionId: "",
    postingStartDate: "",
    postingEndDate: "",
  });

  const [errors, setErrors] = useState<any>({});

  const handleChange = (e: any) => {
    setForm({ ...form, [e.target.name]: e.target.value });

    // remove error when typing
    setErrors({ ...errors, [e.target.name]: "" });
  };

  const validate = () => {
    let newErrors: any = {};

    if (!form.jobRequisitionId)
      newErrors.jobRequisitionId = "Job Requisition ID is required";

    if (!form.postingStartDate)
      newErrors.postingStartDate = "Start date is required";

    if (!form.postingEndDate)
      newErrors.postingEndDate = "End date is required";

    if (
      form.postingStartDate &&
      form.postingEndDate &&
      form.postingEndDate < form.postingStartDate
    ) {
      newErrors.postingEndDate = "End date cannot be before start date";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleCreate = async () => {
    if (!validate()) return;

    try {
      await api.post("/job-postings", {
        jobRequisitionId: Number(form.jobRequisitionId),
        isInternal: true,
        isExternal: true,
        postingStartDate: form.postingStartDate,
        postingEndDate: form.postingEndDate,
      });

      onCreated();
      onClose();

      // reset form
      setForm({
        jobRequisitionId: "",
        postingStartDate: "",
        postingEndDate: "",
      });
      setErrors({});
    } catch (err: any) {
      console.error(err.response?.data || err);
      alert("Failed to create job posting");
    }
  };

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm">
      <DialogTitle sx={{ pb: 2 }}>
        Create Job Posting
      </DialogTitle>

      <DialogContent
        sx={{
          mt:2,
          display: "flex",
          flexDirection: "column",
          gap: 2,
        }}
      >
        <TextField
          fullWidth
          label="Job Requisition ID"
          name="jobRequisitionId"
          value={form.jobRequisitionId}
          onChange={handleChange}
           sx={{ mt: 1 }}
          error={!!errors.jobRequisitionId}
          helperText={errors.jobRequisitionId}
          required
        />

        <TextField
          fullWidth
          type="date"
          label="Start Date"
          name="postingStartDate"
          InputLabelProps={{ shrink: true }}
          value={form.postingStartDate}
          onChange={handleChange}
          error={!!errors.postingStartDate}
          helperText={errors.postingStartDate}
          required
        />

        <TextField
          fullWidth
          type="date"
          label="End Date"
          name="postingEndDate"
          InputLabelProps={{ shrink: true }}
          value={form.postingEndDate}
          onChange={handleChange}
          error={!!errors.postingEndDate}
          helperText={errors.postingEndDate}
          required
        />
      </DialogContent>

      <DialogActions
        sx={{ px: 3, pb: 2, justifyContent: "flex-end", gap: 1 }}
      >
        <Button onClick={onClose} variant="outlined">
          Cancel
        </Button>
        <Button onClick={handleCreate} variant="contained">
          Create
        </Button>
      </DialogActions>
    </Dialog>
  );
}