"use client";
import { useEffect, useState } from "react";
import api from "@/app/src/services/api";
import toast from "react-hot-toast";
import ApplyJob from "@/app/components/jobs/ApplyJobs";


type JobPosting = {
  id: number;
  jobRequisition: { title: string; department: string; location: string };
  postingStartDate: string;
  postingEndDate: string;
};

export default function Jobs() {
  const [jobs, setJobs] = useState<JobPosting[]>([]);
  const [selectedJob, setSelectedJob] = useState<number | null>(null);

  const fetchJobs = async () => {
    try {
      const res = await api.get("/job-postings");
      setJobs(res.data);
    } catch (err) {
      toast.error("Failed to fetch jobs");
    }
  };

  useEffect(() => {
    fetchJobs();
  }, []);

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">Open Job Postings</h1>
      <ul>
        {jobs.map((job) => (
          <li key={job.id} className="border p-2 my-2">
            <strong>{job.jobRequisition.title}</strong> - {job.jobRequisition.department} - {job.jobRequisition.location}
            <button
              className="ml-4 bg-blue-500 text-white px-2 py-1 rounded"
              onClick={() => setSelectedJob(job.id)}
            >
              Apply
            </button>
          </li>
        ))}
      </ul>

      {selectedJob && <ApplyJob jobId={selectedJob} />}
    </div>
  );
}