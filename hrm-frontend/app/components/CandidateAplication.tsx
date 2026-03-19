"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import {
  Edit,
  Delete,
  WorkOutline,
  LocationOn,
  CalendarToday,
  AccessTime,
} from "@mui/icons-material";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
} from "@mui/material";
import toast from "react-hot-toast";
import api from "@/app/src/services/api";
import Loading from "@/app/components/Loading";

type JobPosting = {
  id: number;
  jobRequisition: {
    title: string;
    department: string;
    location: string;
    type: string;
    experience: string;
    salary?: string;
    description: string;
  };
  postingStartDate: string;
  postingEndDate: string;
};

export default function JobPortal() {
  const [jobs, setJobs] = useState<JobPosting[]>([]);
  const [loading, setLoading] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);
  const [applyJobId, setApplyJobId] = useState<number | null>(null);
  const [resumeFile, setResumeFile] = useState<File | null>(null);
  const [search, setSearch] = useState("");
  const router = useRouter();

  const loadData = async () => {
    try {
      const userRes = await api.get("/employees/me");
      setIsAdmin(userRes.data.role === "ADMIN");

      const jobsRes = await api.get("/job-postings");
      setJobs(jobsRes.data);
    } catch (err) {
      console.error(err);
      toast.error("Failed to load job postings");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleDelete = async (id: number) => {
    if (!confirm("Are you sure to delete this job?")) return;
    try {
      await api.delete(`/job-postings/${id}`);
      toast.success("Job deleted successfully");
      loadData();
    } catch {
      toast.error("Failed to delete job");
    }
  };

  const handleApply = async () => {
    if (!applyJobId || !resumeFile) return;
    const formData = new FormData();
    formData.append("jobPostingId", applyJobId.toString());
    formData.append("resume", resumeFile);

    try {
      await api.post("/candidates/apply", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      toast.success("Application submitted!");
      setApplyJobId(null);
      setResumeFile(null);
    } catch (err) {
      console.error(err);
      toast.error("Failed to apply");
    }
  };

  if (loading) return <Loading message="Loading jobs..." size="lg" />;

  const filteredJobs = jobs.filter((job) =>
    job.jobRequisition.title.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="p-4 sm:p-6 lg:p-8 space-y-6 max-w-7xl mx-auto">
      <h1 className="text-3xl font-bold text-center sm:text-left">
        Job Portal
      </h1>

      {/* Search */}
      <div className="mb-6 flex flex-col sm:flex-row gap-2">
        <TextField
          fullWidth
          placeholder="Search jobs..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      {/* Jobs Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredJobs.map((job) => (
          <div
            key={job.id}
            className="bg-white shadow-md rounded-xl p-4 flex flex-col justify-between hover:shadow-lg transition"
          >
            <div>
              <h3 className="font-semibold text-lg truncate">{job.jobRequisition.title}</h3>
              <p className="text-gray-500 truncate">{job.jobRequisition.department}</p>
              <div className="flex flex-wrap gap-2 text-gray-400 text-sm mt-1">
                <div className="flex items-center gap-1">
                  <LocationOn fontSize="small" /> {job.jobRequisition.location}
                </div>
                <div className="flex items-center gap-1">
                  <AccessTime fontSize="small" /> {job.jobRequisition.type}
                </div>
                <div className="flex items-center gap-1">
                  <CalendarToday fontSize="small" />{" "}
                  {new Date(job.postingStartDate).toLocaleDateString()} -{" "}
                  {new Date(job.postingEndDate).toLocaleDateString()}
                </div>
              </div>
              <p className="text-gray-600 mt-2 line-clamp-4">
                {job.jobRequisition.description}
              </p>
            </div>

            <div className="mt-4 flex flex-col sm:flex-row gap-2">
              {!isAdmin && (
                <button
                  onClick={() => setApplyJobId(job.id)}
                  className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg w-full sm:w-auto"
                >
                  Apply
                </button>
              )}

              {isAdmin && (
                <>
                  <button
                    onClick={() => router.push(`/admin/job-postings/edit/${job.id}`)}
                    className="bg-yellow-400 hover:bg-yellow-500 text-white px-4 py-2 rounded-lg flex-1"
                  >
                    <Edit fontSize="small" /> Edit
                  </button>
                  <button
                    onClick={() => handleDelete(job.id)}
                    className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg flex-1"
                  >
                    <Delete fontSize="small" /> Delete
                  </button>
                </>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Apply Modal */}
      <Dialog
        open={!!applyJobId}
        onClose={() => setApplyJobId(null)}
        fullWidth
        maxWidth="sm"
      >
        <DialogTitle>Apply for Job</DialogTitle>
        <DialogContent className="space-y-4">
          <TextField
            fullWidth
            type="file"
            onChange={(e) => {
              const target = e.target as HTMLInputElement;
              setResumeFile(target.files ? target.files[0] : null);
            }}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setApplyJobId(null)}>Cancel</Button>
          <Button variant="contained" onClick={handleApply}>
            Submit
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}