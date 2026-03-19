"use client";
import { useEffect, useState } from "react";
import api from "@/app/src/services/api";
import toast from "react-hot-toast";

export default function AdminInterviews() {
  const [interviews, setInterviews] = useState<any[]>([]);
  const [candidates, setCandidates] = useState<any[]>([]);
  const [interviewers, setInterviewers] = useState<any[]>([]);
  const [form, setForm] = useState({
    candidateId: "",
    interviewerId: "",
    dateTime: "",
    mode: "Online",
    meetingLink: "",
  });

  const fetchInterviews = async () => {
    try {
      const res = await api.get("/interviews");
      setInterviews(res.data);
    } catch {
      toast.error("Failed to fetch interviews");
    }
  };

  const fetchCandidates = async () => {
    try {
      const res = await api.get("/job-applications?status=applied");
      setCandidates(res.data);
    } catch {
      toast.error("Failed to fetch candidates");
    }
  };

  const fetchInterviewers = async () => {
    try {
      const res = await api.get("/employees?role=interviewer");
      setInterviewers(res.data);
    } catch {
      toast.error("Failed to fetch interviewers");
    }
  };

  const scheduleInterview = async () => {
    if (!form.candidateId || !form.interviewerId || !form.dateTime || !form.mode) {
      toast.error("All fields are required");
      return;
    }

    try {
      await api.post("/interviews", {
        candidateId: Number(form.candidateId),
        interviewerId: Number(form.interviewerId),
        dateTime: new Date(form.dateTime).toISOString(),
        mode: form.mode,
        meetingLink: form.meetingLink.trim() || null,
      });

      toast.success("Interview scheduled!");
      setForm({
        candidateId: "",
        interviewerId: "",
        dateTime: "",
        mode: "Online",
        meetingLink: "",
      });

      fetchInterviews();
    } catch (err: any) {
      console.error(err.response?.data || err.message);
      toast.error("Failed to schedule interview");
    }
  };

  useEffect(() => {
    fetchInterviews();
    fetchCandidates();
    fetchInterviewers();
  }, []);

  return (
    <div className="p-4 sm:p-6 lg:p-8 bg-gray-50 min-h-screen space-y-8">

      {/* HEADER */}
      <h1 className="text-xl sm:text-2xl md:text-3xl font-bold">
        Interviews
      </h1>

      {/* FORM */}
      <div className="bg-white p-4 sm:p-6 rounded-xl shadow space-y-4">

        <h2 className="font-semibold text-lg">
          Schedule New Interview
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

          <select
            className="p-2 border rounded-lg w-full"
            value={form.candidateId}
            onChange={e => setForm({ ...form, candidateId: e.target.value })}
          >
            <option value="">Select Candidate</option>
            {candidates.map(c => (
              <option key={c.id} value={c.id}>
                {c.firstName} {c.lastName}
              </option>
            ))}
          </select>

          <select
            className="p-2 border rounded-lg w-full"
            value={form.interviewerId}
            onChange={e => setForm({ ...form, interviewerId: e.target.value })}
          >
            <option value="">Select Interviewer</option>
            {interviewers.map(i => (
              <option key={i.id} value={i.id}>
                {i.firstName} {i.lastName}
              </option>
            ))}
          </select>

          <input
            type="datetime-local"
            className="p-2 border rounded-lg w-full"
            value={form.dateTime}
            onChange={e => setForm({ ...form, dateTime: e.target.value })}
          />

          <select
            className="p-2 border rounded-lg w-full"
            value={form.mode}
            onChange={e => setForm({ ...form, mode: e.target.value })}
          >
            <option value="Online">Online</option>
            <option value="In-Person">In-Person</option>
          </select>

          <input
            type="text"
            placeholder="Meeting Link (optional)"
            className="p-2 border rounded-lg w-full md:col-span-2"
            value={form.meetingLink}
            onChange={e => setForm({ ...form, meetingLink: e.target.value })}
          />

        </div>

        <button
          className="w-full md:w-auto bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition"
          onClick={scheduleInterview}
        >
          Schedule Interview
        </button>

      </div>

      {/* TABLE (DESKTOP) */}
      <div className="hidden md:block overflow-x-auto bg-white rounded-xl shadow">

        <table className="table-auto w-full">
          <thead>
            <tr className="bg-gray-100 text-left">
              <th className="p-3">Candidate</th>
              <th className="p-3">Interviewer</th>
              <th className="p-3">Date</th>
              <th className="p-3">Mode</th>
              <th className="p-3">Meeting Link</th>
              <th className="p-3">Feedback</th>
            </tr>
          </thead>

          <tbody>
            {interviews.map(i => (
              <tr key={i.id} className="border-t hover:bg-gray-50">

                <td className="p-3">
                  {i.candidate.firstName} {i.candidate.lastName}
                </td>

                <td className="p-3">
                  {i.interviewer.firstName} {i.interviewer.lastName}
                </td>

                <td className="p-3">
                  {new Date(i.dateTime).toLocaleString()}
                </td>

                <td className="p-3">
                  <span className="px-2 py-1 rounded bg-gray-100 text-sm">
                    {i.mode}
                  </span>
                </td>

                <td className="p-3">
                  {i.meetingLink ? (
                    <a
                      href={i.meetingLink}
                      target="_blank"
                      className="text-blue-600 underline"
                    >
                      Open
                    </a>
                  ) : "-"}
                </td>

                <td className="p-3">
                  {i.feedback || "-"}
                </td>

              </tr>
            ))}
          </tbody>

        </table>

      </div>

      {/* CARDS (MOBILE) */}
      <div className="md:hidden space-y-4">

        {interviews.map(i => (
          <div
            key={i.id}
            className="bg-white p-4 rounded-xl shadow space-y-2"
          >

            <p><span className="font-semibold">Candidate:</span> {i.candidate.firstName} {i.candidate.lastName}</p>
            <p><span className="font-semibold">Interviewer:</span> {i.interviewer.firstName} {i.interviewer.lastName}</p>
            <p><span className="font-semibold">Date:</span> {new Date(i.dateTime).toLocaleString()}</p>
            <p><span className="font-semibold">Mode:</span> {i.mode}</p>

            <p>
              <span className="font-semibold">Meeting:</span>{" "}
              {i.meetingLink ? (
                <a
                  href={i.meetingLink}
                  target="_blank"
                  className="text-blue-600 underline"
                >
                  Open
                </a>
              ) : "-"}
            </p>

            <p><span className="font-semibold">Feedback:</span> {i.feedback || "-"}</p>

          </div>
        ))}

      </div>

    </div>
  );
}