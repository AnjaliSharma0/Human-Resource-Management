// "use client";

// import { useState } from "react";
// import { Dialog, DialogTitle, DialogContent, DialogActions, Button, TextField, MenuItem } from "@mui/material";
// import api from "@/app/src/services/api";
// import Loading from "../Loading";

// type Props = {
//   open: boolean;
//   onClose: () => void;
//   onUploaded: () => void;
//   candidates: { id: number; firstName: string; lastName: string }[];
// };

// export default function AdminOfferLetterModal({ open, onClose, onUploaded, candidates }: Props) {
//   const [candidateId, setCandidateId] = useState<number | "">("");
//   const [file, setFile] = useState<File | null>(null);
//   const [loading, setLoading]= useState(false)
//    const handleUpload = async () => {
//     if (!candidateId || !file) {
//       alert("Candidate and file are required");
//       return;
//     }

//     setLoading(true);
//     try {
//     const formData = new FormData();
// formData.append('offerFile', file);
// formData.append('candidateId', candidateId.toString());

// await api.post('/offer-letters/upload', formData, {
//   headers: { 'Content-Type': 'multipart/form-data' },
//       });

//       onUploaded();
//       onClose();
//       setCandidateId("");
//       setFile(null);
//     } catch (err: any) {
//       console.error(err.response?.data || err);
//       alert("Failed to upload offer letter");
//     } finally {
//       setLoading(false);
//     }
//   };

//   // const handleUpload = async () => {
//   //   if (!candidateId || !file) {
//   //     alert("Candidate and file are required");
//   //     return;
//   //   }

//   //   try {
//   //     const formData = new FormData();
//   //     formData.append("candidateId", String(candidateId));
//   //     formData.append("file", file);

//   //     await api.post("/offer-letters", formData, {
//   //       headers: { "Content-Type": "multipart/form-data" },
//   //     });

//   //     onUploaded();
//   //     onClose();
//   //     setCandidateId("");
//   //     setFile(null);
//   //   } catch (err: any) {
//   //     console.error(err.response?.data || err);
//   //     alert("Failed to upload offer letter");
//   //   }
//   // };
 
//   return (
//     <Dialog open={open} onClose={onClose}>
//       <DialogTitle>Upload Offer Letter</DialogTitle>
//       <DialogContent className="space-y-4">
//         <TextField
//           select
//           fullWidth
//           label="Candidate"
//           value={candidateId}
//           onChange={(e) => setCandidateId(Number(e.target.value))}
//         >
//           {candidates.map((c) => (
//             <MenuItem key={c.id} value={c.id}>
//               {c.id} 
//             </MenuItem>
//           ))}
//         </TextField>

//          <input
//           type="file"
//           accept=".pdf,.doc,.docx"
//           onChange={(e) => setFile(e.target.files?.[0] || null)}
//         />
//       </DialogContent>
//       <DialogActions>
//         <Button onClick={onClose}>Cancel</Button>
//         <Button onClick={handleUpload} variant="contained">
//            {loading ? "Uploading..." : "Upload Offer Letter"}
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
  MenuItem,
} from "@mui/material";
import api from "@/app/src/services/api";
import toast from "react-hot-toast";

type Props = {
  open: boolean;
  onClose: () => void;
  onUploaded: () => void;
  candidates: { id: number; firstName: string; lastName: string }[];
};

export default function AdminOfferLetterModal({
  open,
  onClose,
  onUploaded,
  candidates,
}: Props) {
  const [form, setForm] = useState({
    candidateId: "",
  });

  const [file, setFile] = useState<File | null>(null);
  const [errors, setErrors] = useState<any>({});
  const [loading, setLoading] = useState(false);

  const handleChange = (e: any) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    setErrors({ ...errors, [e.target.name]: "" });
  };

  const handleFileChange = (e: any) => {
    const selectedFile = e.target.files?.[0];

    if (!selectedFile) {
      setFile(null);
      setErrors({ ...errors, file: "File is required" });
      return;
    }

    const allowedTypes = [
      "application/pdf",
      "application/msword",
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
    ];

    if (!allowedTypes.includes(selectedFile.type)) {
      setErrors({ ...errors, file: "Only PDF/DOC/DOCX allowed" });
      setFile(null);
      return;
    }

    setFile(selectedFile);
    setErrors({ ...errors, file: "" });
  };

  const validate = () => {
    let newErrors: any = {};

    if (!form.candidateId)
      newErrors.candidateId = "Candidate is required";

    if (!file) newErrors.file = "Offer letter file is required";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleUpload = async () => {
    if (!validate()) return;

    setLoading(true);
    try {
      const formData = new FormData();
      formData.append("offerFile", file!);
      formData.append("candidateId", form.candidateId);

      await api.post("/offer-letters/upload", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      onUploaded();
      onClose();

      setForm({ candidateId: "" });
      toast.success("Uploaded successfully.")
      setFile(null);
      setErrors({});
    } catch (err: any) {
      console.error(err.response?.data || err);
      toast.error("Failed to upload offer letter");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm">
      {/* Title */}
      <DialogTitle sx={{ pb: 1.5 }}>
        Upload Offer Letter
      </DialogTitle>

      {/* Content */}
      <DialogContent
        sx={{
          mt: 1,
          px: 3,
          display: "flex",
          flexDirection: "column",
          gap: 2.5,
        }}
      >
        {/* Candidate */}
        <TextField
          select
          fullWidth
          label="Candidate"
          name="candidateId"
          value={form.candidateId}
          onChange={handleChange}
          error={!!errors.candidateId}
          helperText={errors.candidateId}
          required
           sx={{ mt: 1 }}
        >
          {candidates.map((c) => (
            <MenuItem key={c.id} value={c.id}>
              {c.id}
            </MenuItem>
          ))}
        </TextField>

        {/* File Upload */}
        <div>
          <label className="block mb-1 font-medium">
            Upload Offer Letter
          </label>

          <input
            type="file"
            accept=".pdf,.doc,.docx"
            onChange={handleFileChange}
            className={`border p-2 w-full rounded ${
              errors.file ? "border-red-500" : "border-gray-300"
            }`}
          />

          {/* Error */}
          {errors.file && (
            <p className="text-red-500 text-sm mt-1">
              {errors.file}
            </p>
          )}

          {/* Selected file */}
          {file && !errors.file && (
            <p className="text-sm mt-1 text-gray-600">
              Selected: <b>{file.name}</b>
            </p>
          )}
        </div>
      </DialogContent>

      {/* Actions */}
      <DialogActions
        sx={{
          px: 3,
          pb: 2,
          pt: 1,
          justifyContent: "flex-end",
          gap: 1.5,
        }}
      >
        <Button onClick={onClose} variant="outlined">
          Cancel
        </Button>

        <Button
          onClick={handleUpload}
          variant="contained"
          disabled={loading}
        >
          {loading ? "Uploading..." : "Upload"}
        </Button>
      </DialogActions>
    </Dialog>
  );
}