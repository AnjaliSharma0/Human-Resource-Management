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
  AssignmentAdd,
  Description,
  DescriptionOutlined,
  Event,
  Info,
  People,
  Person2,
  WorkOutline,
} from "@mui/icons-material";
import Loading from "@/app/components/Loading";
import { WorkflowIcon } from "lucide-react";

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
  const [resumeUrl, setResumeUrl] = useState<string>("");

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
  if (!applyJobId || !resumeUrl.trim()) {
    toast.error("Please provide a resume URL");
    return;
  }

  try {
    // fetch employee info
    const userRes = await api.get("/employees/me");
    console.log("useres",userRes.data)
    const { firstName, lastName, email, phone } = userRes.data;

    await api.post("/candidates/apply", {
      jobPostingId: applyJobId,
      resumeUrl: resumeUrl.trim(),
      firstName,
      lastName,
      email,
      phone,
    });

    toast.success("Application submitted successfully ✅");
    setApplyJobId(null);
    setResumeUrl("");
    loadData(); // refresh tables
  } catch (err: any) {
    console.error(err);
    toast.error(err?.response?.data?.message || "Failed to submit application ❌");
  }
};


  const handleUpdateOfferStatus = async (offerId: number, status: "accepted" | "rejected") => {
    try {
      await api.patch(`/offer-letters/${offerId}`, { status });
      toast.success(`Offer ${status} successfully ✅`);
      loadData(); // refresh table
    } catch (err) {
      console.error(err);
      toast.error("Failed to update offer status ❌");
    }
  };
  const hasApplied = (jobId: number) =>
    myApplications.some((app) => app?.appliedFor?.id === jobId);

  if (loading) return <Loading message="Loading..." size="lg" />;

  const tabs = [
    { label: "Employees", value: "Department Employees", icon: <People fontSize="small" /> },
    { label: "Jobs", value: "Job Postings", icon: <WorkflowIcon fontSize="small" /> },
    { label: "Applications", value: "My Applications", icon: <AssignmentAdd fontSize="small" /> },
    { label: "Interviews", value: "Interviews", icon: <Event fontSize="small" /> },
    { label: "Offers", value: "Offer Letters", icon: <DescriptionOutlined fontSize="small" /> },
  ];
  return (
    <div className="p-4 md:p-6 max-w-7xl mx-auto space-y-6">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3">
        <h1 className="text-2xl md:text-3xl font-bold text-gray-800">
          Employee Dashboard
        </h1>

        <p className="text-sm text-gray-500">
          Manage jobs, applications & interviews
        </p>
      </div>



      <div className="relative">
        <div
          id="tab-container"
          className="flex gap-2 overflow-x-auto scrollbar-hide py-2 px-1"
        >
          {tabs.map((tab) => (
            <button
              key={tab.value}
              onClick={(e) => {
                setActiveTab(tab.value as Tab);

                // 🔥 auto scroll active tab into view
                (e.currentTarget as HTMLElement).scrollIntoView({
                  behavior: "smooth",
                  inline: "center",
                  block: "nearest",
                });
              }}
              className={`
          relative flex items-center gap-2 px-4 py-2 rounded-full 
          text-sm whitespace-nowrap flex-shrink-0
          transition-all duration-300

          ${activeTab === tab.value
                  ? "text-white scale-105"
                  : "text-gray-600 hover:bg-gray-100"
                }
        `}
            >
              {/* Active Background */}
              {activeTab === tab.value && (
                <span
                  className="absolute inset-0 bg-gradient-to-r 
                       from-indigo-500 to-blue-500 
                       rounded-full shadow-md transition-all duration-300"
                />
              )}

              {/* Content */}
              <span className="relative z-10 flex items-center gap-1 font-medium">
                {tab.icon}
                {tab.label}
              </span>
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
              className="bg-white/80 backdrop-blur border border-gray-200 
             rounded-2xl p-4 text-center 
             hover:shadow-xl hover:-translate-y-1 
             transition-all duration-300 cursor-pointer"
            >
              <div className="w-12 h-12 mx-auto mb-2 rounded-full 
                  bg-gradient-to-tr from-indigo-500 to-blue-500 
                  text-white flex items-center justify-center font-bold shadow">
                {emp.firstName?.charAt(0)}
              </div>

              <h2 className="font-semibold text-gray-800">
                {emp.firstName} {emp.lastName}
              </h2>

              <p className="text-sm text-gray-500">
                {emp.designation?.title}
              </p>

              <p className="text-xs text-gray-400 mt-1">
                {emp.department?.name}
              </p>

              <p className="text-xs text-gray-400 truncate">
                {emp.email}
              </p>
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
              className="bg-white border border-gray-200 rounded-2xl p-4 
             flex flex-col justify-between 
             hover:shadow-lg hover:-translate-y-1 
             transition-all duration-300"
            >
              <div>
                <h3 className="font-semibold text-lg text-gray-800">
                  {job.jobRequisition.title}
                </h3>

                <p className="text-sm text-gray-500">
                  {job.jobRequisition.department}
                </p>

                <p className="text-xs text-gray-400 mt-1">
                  {new Date(job.postingStartDate).toLocaleDateString()} -{" "}
                  {new Date(job.postingEndDate).toLocaleDateString()}
                </p>
              </div>

              <div className="mt-4">
                {hasApplied(job.id) ? (
                  <span className="block text-center px-3 py-2 text-xs 
                       bg-green-100 text-green-700 rounded-full">
                    ✅ Applied
                  </span>
                ) : (
                  <button
                    onClick={() => setApplyJobId(job.id)}
                    className="w-full bg-indigo-600 hover:bg-indigo-700 
                   text-white py-2 rounded-lg text-sm 
                   transition-all duration-200"
                  >
                    Apply Now
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

          <div className="bg-white border border-gray-200 rounded-2xl shadow-sm overflow-hidden">
            <table className="w-full text-sm">
              <thead className="bg-gray-50 text-gray-600 text-xs uppercase">
                <tr className="border-t hover:bg-gray-50 transition">
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
                      <span className={`px-2 py-1 rounded-full text-xs font-medium
                        ${app.status === "selected"
                          ? "bg-green-100 text-green-700"
                          : app.status === "rejected"
                            ? "bg-red-100 text-red-600"
                            : "bg-yellow-100 text-yellow-700"
                        }
                      `}>
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
      {/* Interviews */}
      {activeTab === "Interviews" && (
        <div className="overflow-x-auto">
          {interviews.length === 0 ? (
            <div className="p-4 text-center text-gray-500">
              No interviews are scheduled.
            </div>
          ) : (
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
                    <td className="p-2">{i?.candidate?.jobPosting?.jobRequisition?.title || "-"}</td>
                    <td className="p-2">
                      {i?.interviewer ? `${i.interviewer.firstName} ${i.interviewer.lastName}` : "-"}
                    </td>
                    <td className="p-2">{i.dateTime ? new Date(i.dateTime).toLocaleString() : "-"}</td>
                    <td className="p-2">{i.mode || "-"}</td>
                    <td className="p-2">{i.feedback || "-"}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      )}

      {/* Offer Letters */}
      {activeTab === "Offer Letters" && (
        <div className="overflow-x-auto">
          {offerLetters.length === 0 ? (
            <div className="p-4 text-center text-gray-500">
              No offer letters are available.
            </div>
          ) : (
            <table className="min-w-[600px] w-full text-sm border">
              <thead className="bg-gray-200">
                <tr>
                  <th className="p-2">Job</th>
                  <th className="p-2">File</th>
                  <th className="p-2">Status</th>
                  <th className="p-2">Action</th>
                </tr>
              </thead>
              <tbody>
                {offerLetters.map((o) => (
                  <tr key={o.id}>
                    <td>{o?.candidate?.jobPosting?.jobRequisition?.title || "-"}</td>
                    <td>
                      {o.offerFileUrl ? (
                        <a href={o.offerFileUrl} target="_blank" className="text-blue-500 underline">
                          Download
                        </a>
                      ) : "-"}
                    </td>
                    <td>
                      <span
                        className={`px-2 py-1 rounded-full text-xs font-medium ${o.status === "selected"
                            ? "bg-green-100 text-green-700"
                            : o.status === "rejected"
                              ? "bg-red-100 text-red-600"
                              : "bg-yellow-100 text-yellow-700"
                          }`}
                      >
                        {o.status}
                      </span>
                    </td>
                    <td>
                      {o.status === "sent" ? (
                        <div className="flex gap-2">
                          <button
                            onClick={() => handleUpdateOfferStatus(o.id, "accepted")}
                            className="px-2 py-1 bg-green-600 text-white text-xs rounded hover:bg-green-700"
                          >
                            Accept
                          </button>
                          <button
                            onClick={() => handleUpdateOfferStatus(o.id, "rejected")}
                            className="px-2 py-1 bg-red-600 text-white text-xs rounded hover:bg-red-700"
                          >
                            Reject
                          </button>
                        </div>
                      ) : (
                        <div>No action</div>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      )}

      <Dialog
        open={!!applyJobId}
        onClose={() => setApplyJobId(null)}
        PaperProps={{ className: "rounded-2xl p-2" }}
      >
        <DialogTitle className="font-semibold text-gray-800">
          Apply for Job
        </DialogTitle>

        <DialogContent>
          <TextField
            fullWidth
            type="url"
            placeholder="Paste your resume URL here (OneDrive, Google Drive, etc.)"
            value={resumeUrl}
            onChange={(e) => setResumeUrl(e.target.value)}
            className="mt-2"
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