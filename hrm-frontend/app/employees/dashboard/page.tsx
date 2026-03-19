"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { UserCircleIcon } from "@heroicons/react/24/solid";
import api from "@/app/src/services/api";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
} from "@mui/material";
import toast from "react-hot-toast";
import {
  Description,
  Info,
  Person2,
  WorkOutline,
} from "@mui/icons-material";
import Loading from "@/app/components/Loading";

type Tab =
  | "Department Employees"
  | "Job Postings"
  | "My Applications"
  | "Interviews"
  | "Offer Letters";

export default function EmployeeDashboard() {
  const [employees, setEmployees] = useState<any[]>([]);
  const [jobPostings, setJobPostings] = useState<any[]>([]);
  const [myApplications, setMyApplications] = useState<any[]>([]);
  const [interviews, setInterviews] = useState<any[]>([]);
  const [offerLetters, setOfferLetters] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] =
    useState<Tab>("Department Employees");
  const [applyJobId, setApplyJobId] = useState<number | null>(null);
  const [resumeFile, setResumeFile] = useState<File | null>(null);

  const router = useRouter();

  // -------------------- Load Data --------------------
  const loadData = async () => {
    try {
      const userRes = await api.get("/employees/me");
      const myDepartmentId = userRes.data.department?.id;

      const [
        allEmpRes,
        postingsRes,
        appsRes,
        interviewsRes,
        offersRes,
      ] = await Promise.all([
        api.get("/employees"),
        api.get("/job-postings"),
        api.get("/candidates"),
        api.get("/interviews"),
        api.get("/offer-letters"),
      ]);

      const deptEmployees = allEmpRes.data.filter(
        (emp: any) => emp.department?.id === myDepartmentId
      );

      setEmployees(deptEmployees);
      setJobPostings(postingsRes.data);
      setMyApplications(appsRes.data);
      setInterviews(interviewsRes.data);
      setOfferLetters(offersRes.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  // -------------------- Apply Job --------------------
  const handleApplyJob = async () => {
    if (!applyJobId || !resumeFile) return;

    const formData = new FormData();
    formData.append("jobPostingId", applyJobId.toString());
    formData.append("resume", resumeFile);

    try {
      await api.post("/candidates/apply", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      toast.success("Application submitted successfully ✅");
      setApplyJobId(null);
      setResumeFile(null);
      loadData();
    } catch (err) {
      console.error(err);
    }
  };

  const hasApplied = (jobId: number) =>
    myApplications.some((app) => app?.appliedFor?.id === jobId);

  if (loading) return <Loading message="Loading..." size="lg" />;

  return (
    <div className="p-4 md:p-6 max-w-7xl mx-auto space-y-6">
      <h1 className="text-2xl md:text-3xl font-bold">
        Employee Dashboard
      </h1>

      {/* Tabs */}
      <div className="overflow-x-auto">
        <div className="flex space-x-2 md:space-x-4 mb-4 min-w-max">
          {[
            "Department Employees",
            "Job Postings",
            "My Applications",
            "Interviews",
            "Offer Letters",
          ].map((tab) => (
            <button
              key={tab}
              className={`px-4 py-2 text-sm md:text-base rounded whitespace-nowrap ${
                activeTab === tab
                  ? "bg-indigo-500 text-white"
                  : "bg-gray-200 hover:bg-gray-300"
              }`}
              onClick={() => setActiveTab(tab as Tab)}
            >
              {tab}
            </button>
          ))}
        </div>
      </div>

      {/* Department Employees */}
      {activeTab === "Department Employees" && (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {employees.map((emp) => (
            <div
              key={emp.id}
              onClick={() => router.push(`/employee/${emp.id}`)}
              className="bg-white shadow-md rounded-xl p-4 text-center hover:shadow-lg cursor-pointer"
            >
              <UserCircleIcon className="h-14 w-14 mx-auto text-gray-400 mb-2" />
              <h2 className="font-semibold">
                {emp.firstName} {emp.lastName}
              </h2>
              <p className="text-sm text-gray-500">
                {emp.designation?.title}
              </p>
              <p className="text-sm text-gray-500">
                {emp.department?.name}
              </p>
              <p className="text-xs text-gray-400">{emp.email}</p>
            </div>
          ))}
        </div>
      )}

      {/* Job Postings */}
      {activeTab === "Job Postings" && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {jobPostings.map((job) => (
            <div
              key={job.id}
              className="bg-white shadow-md rounded-xl p-4 flex flex-col justify-between hover:shadow-lg"
            >
              <div>
                <h3 className="font-semibold text-lg">
                  {job.jobRequisition.title}
                </h3>
                <p className="text-sm text-gray-500">
                  {job.jobRequisition.department}
                </p>
                <p className="text-xs text-gray-400">
                  {new Date(job.postingStartDate).toLocaleDateString()} -{" "}
                  {new Date(job.postingEndDate).toLocaleDateString()}
                </p>
              </div>

              <div className="mt-4">
                {hasApplied(job.id) ? (
                  <span className="block text-center px-3 py-2 text-xs bg-green-100 text-green-700 rounded-full">
                    Applied
                  </span>
                ) : (
                  <button
                    onClick={() =>
                      router.push(`/admin/candidate/apply/${job.id}`)
                    }
                    className="w-full bg-indigo-600 hover:bg-indigo-700 text-white py-2 rounded-lg text-sm"
                  >
                    Apply
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* My Applications */}
      {activeTab === "My Applications" && (
        <div className="bg-white shadow-lg rounded-xl p-4">
          <div className="flex items-center gap-2 mb-4">
            <WorkOutline className="text-blue-600" />
            <h2 className="text-lg font-semibold">My Applications</h2>
          </div>

          <div className="overflow-x-auto">
            <table className="min-w-[600px] w-full text-sm">
              <thead className="bg-gray-100">
                <tr>
                  <th className="p-3 text-left">Job</th>
                  <th className="p-3 text-left">Description</th>
                  <th className="p-3 text-left">Status</th>
                </tr>
              </thead>

              <tbody>
                {myApplications.map((app) => (
                  <tr key={app.id} className="border-b">
                    <td className="p-3 font-medium">
                      {app?.appliedFor?.jobRequisition?.title}
                    </td>

                    <td className="p-3 text-gray-600">
                      {app?.appliedFor?.jobRequisition?.description}
                    </td>

                    <td className="p-3">
                      <span className="px-2 py-1 rounded text-xs bg-gray-200">
                        {app.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Interviews */}
      {activeTab === "Interviews" && (
        <div className="overflow-x-auto">
          <table className="min-w-[700px] w-full text-sm border">
            <thead className="bg-gray-200">
              <tr>
                <th className="p-2">Job</th>
                <th className="p-2">Interviewer</th>
                <th className="p-2">Date</th>
                <th className="p-2">Mode</th>
                <th className="p-2">Feedback</th>
              </tr>
            </thead>
            <tbody>
              {interviews.map((i) => (
                <tr key={i.id}>
                  <td className="p-2">
                    {i.candidate.jobPosting.jobRequisition.title}
                  </td>
                  <td className="p-2">
                    {i.interviewer.firstName} {i.interviewer.lastName}
                  </td>
                  <td className="p-2">
                    {new Date(i.dateTime).toLocaleString()}
                  </td>
                  <td className="p-2">{i.mode}</td>
                  <td className="p-2">{i.feedback || "-"}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Offer Letters */}
      {activeTab === "Offer Letters" && (
        <div className="overflow-x-auto">
          <table className="min-w-[600px] w-full text-sm border">
            <thead className="bg-gray-200">
              <tr>
                <th className="p-2">Job</th>
                <th className="p-2">File</th>
                <th className="p-2">Status</th>
              </tr>
            </thead>
            <tbody>
              {offerLetters.map((o) => (
                <tr key={o.id}>
                  <td className="p-2">
                    {o.candidate.jobPosting.jobRequisition.title}
                  </td>
                  <td className="p-2">
                    <a
                      href={o.offerFileUrl}
                      target="_blank"
                      className="text-blue-500 underline"
                    >
                      Download
                    </a>
                  </td>
                  <td className="p-2">{o.status}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Apply Modal */}
      <Dialog open={!!applyJobId} onClose={() => setApplyJobId(null)}>
        <DialogTitle>Apply for Job</DialogTitle>
        <DialogContent>
          <TextField
            fullWidth
            type="file"
            inputProps={{ accept: ".pdf,.doc,.docx" }}
            onChange={(e) => {
              const target = e.target as HTMLInputElement;
              setResumeFile(target.files ? target.files[0] : null);
            }}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setApplyJobId(null)}>Cancel</Button>
          <Button variant="contained" onClick={handleApplyJob}>
            Submit
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}