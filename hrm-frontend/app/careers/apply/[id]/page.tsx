"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { Box, Paper, TextField, Typography, Button } from "@mui/material";
import api from "@/app/src/services/api";
import toast from "react-hot-toast";

export default function JobApplicationPage() {
  const { jobId } = useParams(); // get jobId from URL
  const router = useRouter();

  const [job, setJob] = useState<any>(null);
  const [form, setForm] = useState({
    candidateName: "",
    email: "",
    phone: "",
    resumeFile: null as File | null,
  });

  useEffect(() => {
    if (jobId) {
      api
        .get(`/job-postings/${jobId}`)
        .then((res) => setJob(res.data))
        .catch((err) => console.error(err));
    }
  }, [jobId]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setForm({ ...form, resumeFile: e.target.files[0] });
    }
  };

  const handleSubmit = async () => {
    const { candidateName, email, phone, resumeFile } = form;
    if (!candidateName || !email || !phone || !resumeFile) {
      toast.error("All fields are required");
      return;
    }

    const payload = new FormData();
    payload.append("candidateName", candidateName);
    payload.append("email", email);
    payload.append("phone", phone);
    payload.append("jobPostingId", jobId as string);
    payload.append("resumeFile", resumeFile);

    try {
      await api.post("/candidates/apply", payload, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      toast.success("Application submitted successfully");
      router.push("/candidate/dashboard"); // redirect to candidate dashboard
    } catch (err) {
      console.error(err);
      toast.error("Failed to submit application");
    }
  };

  if (!job) return <Typography>Loading Job Details...</Typography>;

  return (
    <Box className="p-6 max-w-3xl mx-auto space-y-6">
      <Typography variant="h4" fontWeight="bold">
        Apply for: {job.jobRequisition.title}
      </Typography>
      <Typography variant="subtitle1" className="text-gray-500">
        Department: {job.jobRequisition.department}
      </Typography>
      <Typography variant="body2" className="text-gray-600">
        Posting: {new Date(job.postingStartDate).toLocaleDateString()} -{" "}
        {new Date(job.postingEndDate).toLocaleDateString()}
      </Typography>

      <Paper className="p-6 space-y-4">
        <TextField
          fullWidth
          label="Full Name"
          name="candidateName"
          value={form.candidateName}
          onChange={handleChange}
        />
        <TextField
          fullWidth
          label="Email"
          name="email"
          type="email"
          value={form.email}
          onChange={handleChange}
        />
        <TextField
          fullWidth
          label="Phone"
          name="phone"
          value={form.phone}
          onChange={handleChange}
        />

        <Button variant="contained" component="label">
          Upload Resume
          <input type="file" hidden onChange={handleFileChange} />
        </Button>
        {form.resumeFile && <Typography>{form.resumeFile.name}</Typography>}

        <div className="flex justify-end">
          <Button variant="contained" color="primary" onClick={handleSubmit}>
            Submit Application
          </Button>
        </div>
      </Paper>
    </Box>
  );
}