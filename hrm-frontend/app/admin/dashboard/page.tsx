"use client";

import { useEffect, useState } from "react";
import PeopleIcon from "@mui/icons-material/People";
import BusinessIcon from "@mui/icons-material/Business";
import EventIcon from "@mui/icons-material/Event";
import ReceiptIcon from "@mui/icons-material/Receipt";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from "recharts";
import { Button } from "@mui/material";
import { useRouter } from "next/navigation";

import api from "@/app/src/services/api";
import LeaveTable from "@/app/components/leave/LeaveTable";
import AdminCandidates from "../candidate/page";
import CreateJobRequisitionModal from "@/app/components/jobs/CreateJobRequisition";
import AddJobPostingModal from "@/app/components/jobs/JobPosting";
import ScheduleInterviewModal from "@/app/components/jobs/AdminInterviews";
import AdminOfferLetterModal from "@/app/components/jobs/AddOfferLetter";

type Tab =
  | "Job Requisitions"
  | "Job Postings"
  | "Candidates"
  | "Interviews"
  | "Offer Letters";

export default function AdminDashboard() {
  const router = useRouter();

  const [employees, setEmployees] = useState<any[]>([]);
  const [departments, setDepartments] = useState<any[]>([]);
  const [leaves, setLeaves] = useState<any[]>([]);
  const [expenses, setExpenses] = useState<any[]>([]);
  const [activeTab, setActiveTab] = useState<Tab>("Job Requisitions");

  const [jobRequisitions, setJobRequisitions] = useState<any[]>([]);
  const [jobPostings, setJobPostings] = useState<any[]>([]);
  const [candidates, setCandidates] = useState<any[]>([]);
  const [interviews, setInterviews] = useState<any[]>([]);
  const [offerLetters, setOfferLetters] = useState<any[]>([]);

  const [openJobReqModal, setOpenJobReqModal] = useState(false);
  const [openJobPostModal, setOpenJobPostModal] = useState(false);
  const [openInterviewModal, setOpenInterviewModal] = useState(false);
  const [openOfferModal, setOpenOfferModal] = useState(false);

  const COLORS = ["#10B981", "#F59E0B", "#EF4444"];

  const loadData = async () => {
    try {
      const [emp, dep, leave, exp] = await Promise.all([
        api.get("/employees"),
        api.get("/departments"),
        api.get("/leave"),
        api.get("/expenses"),
      ]);

      setEmployees(emp.data || []);
      setDepartments(dep.data || []);
      setLeaves(leave.data || []);
      setExpenses(exp.data || []);

      const [reqs, postings, cands, ints, offers] = await Promise.all([
        api.get("/job-requisition"),
        api.get("/job-postings"),
        api.get("/candidates"),
        api.get("/interviews"),
        api.get("/offer-letters"),
      ]);

      setJobRequisitions(reqs.data || []);
      setJobPostings(postings.data || []);
      setCandidates(cands.data || []);
      setInterviews(ints.data || []);
      setOfferLetters(offers.data || []);
    } catch (err) {
      console.error("Error loading dashboard:", err);
    }
  };

  useEffect(() => {
    loadData();
    const interval = setInterval(loadData, 10000);
    return () => clearInterval(interval);
  }, []);

  const departmentChart = departments.map((d) => ({
    name: d.name,
    employees: employees.filter((e) => e.department?.id === d.id).length,
  }));

  const leaveChart = [
    { name: "Approved", value: leaves.filter((l) => l.status?.toLowerCase() === "approved").length },
    { name: "Pending", value: leaves.filter((l) => l.status?.toLowerCase() === "pending").length },
    { name: "Rejected", value: leaves.filter((l) => l.status?.toLowerCase() === "rejected").length },
  ];

  return (
    <div className="p-4 sm:p-6 md:p-8 space-y-8">
      <h1 className="text-2xl sm:text-3xl font-bold">Admin Dashboard</h1>

      {/* STAT CARDS */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
        <StatCard title="Employees" value={employees.length} icon={<PeopleIcon />} color="bg-indigo-500" />
        <StatCard title="Departments" value={departments.length} icon={<BusinessIcon />} color="bg-green-500" />
        <StatCard title="Leaves" value={leaves.length} icon={<EventIcon />} color="bg-yellow-500" />
        <StatCard title="Expenses" value={expenses.length} icon={<ReceiptIcon />} color="bg-red-500" />
      </div>

      {/* CHARTS */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="bg-white p-4 rounded-xl shadow">
          <h2 className="font-semibold mb-2">Employees by Department</h2>
          <ResponsiveContainer width="100%" height={250}>
            <BarChart data={departmentChart}>
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="employees" fill="#6366F1" />
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div className="bg-white p-4 rounded-xl shadow">
          <h2 className="font-semibold mb-2">Leave Status</h2>
          <ResponsiveContainer width="100%" height={250}>
            <PieChart>
              <Pie data={leaveChart} dataKey="value">
                {leaveChart.map((_, i) => (
                  <Cell key={i} fill={COLORS[i]} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>

          <div className="mt-4 overflow-x-auto">
            <LeaveTable
              leaves={leaves}
              employees={employees}
              showActions
              onAction={async (id, status) => {
                await api.patch(`/leave/${id}`, { status });
                loadData();
              }}
            />
          </div>
        </div>
      </div>

      {/* ATS SECTION */}
      <div className="bg-white p-5 rounded-xl shadow">
        {/* HEADER */}
        <div className="flex flex-col sm:flex-row justify-between gap-3 mb-4">
          <h2 className="font-semibold text-lg">Recruitment & ATS</h2>

          <div className="flex flex-wrap gap-2">
            <Button onClick={() => { setActiveTab("Job Requisitions"); setOpenJobReqModal(true); }} variant="contained">+ Req</Button>
            <Button onClick={() => { setActiveTab("Job Postings"); setOpenJobPostModal(true); }} variant="contained">+ Post</Button>
            <Button onClick={() => { setActiveTab("Interviews"); setOpenInterviewModal(true); }} variant="contained">+ Interview</Button>
            <Button onClick={() => { setActiveTab("Offer Letters"); setOpenOfferModal(true); }} variant="contained">+ Offer</Button>
          </div>
        </div>

        {/* TABS */}
        <div className="flex flex-wrap gap-2 mb-4">
          {(["Job Requisitions","Job Postings","Candidates","Interviews","Offer Letters"] as Tab[]).map(tab => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-4 py-1 rounded-full text-sm ${
                activeTab === tab ? "bg-indigo-600 text-white" : "bg-gray-100"
              }`}
            >
              {tab}
            </button>
          ))}
        </div>

        {/* CONTENT */}
        <div className="min-h-[150px]">
          {activeTab === "Job Requisitions" && (
            <GridList data={jobRequisitions} titleKey="title" subKey="department" />
          )}

          {activeTab === "Job Postings" && (
            <GridList data={jobPostings} titleKey="title" subKey="location" />
          )}

          {activeTab === "Candidates" && <AdminCandidates />}

          {activeTab === "Interviews" && (
            <SimpleList data={interviews} />
          )}

          {activeTab === "Offer Letters" && (
            <SimpleList data={offerLetters} />
          )}
        </div>
      </div>

      {/* MODALS */}
      <CreateJobRequisitionModal open={openJobReqModal} onClose={() => setOpenJobReqModal(false)} onCreated={loadData} />
      <AddJobPostingModal open={openJobPostModal} onClose={() => setOpenJobPostModal(false)} onCreated={loadData} />
      <ScheduleInterviewModal open={openInterviewModal} onClose={() => setOpenInterviewModal(false)} onScheduled={loadData} candidates={candidates} interviewers={employees} />
      <AdminOfferLetterModal open={openOfferModal} onClose={() => setOpenOfferModal(false)} onUploaded={loadData} candidates={candidates} />
    </div>
  );
}

// ---------------- COMPONENTS ----------------

function GridList({ data, titleKey, subKey }: any) {
  if (!data.length) return <p className="text-gray-500">No data available</p>;

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
      {data.map((item: any) => (
        <div key={item.id} className="bg-gray-50 p-4 rounded shadow-sm">
          <h3 className="font-semibold">{item[titleKey]}</h3>
          <p className="text-sm text-gray-500">{item[subKey]}</p>
        </div>
      ))}
    </div>
  );
}

function SimpleList({ data }: any) {
  if (!data.length) return <p className="text-gray-500">No records</p>;

  return (
    <div className="space-y-2">
      {data.map((item: any) => (
        <div key={item.id} className="bg-gray-50 p-3 rounded">
          {item.candidate?.firstName || "Record"}
        </div>
      ))}
    </div>
  );
}

function StatCard({ title, value, icon, color }: any) {
  return (
    <div className={`${color} text-white p-4 rounded-xl flex justify-between`}>
      <div>
        <p>{title}</p>
        <h2 className="text-2xl font-bold">{value}</h2>
      </div>
      {icon}
    </div>
  );
}