"use client";

import { useState, useEffect } from "react";
import api from "@/app/src/services/api";
import toast from "react-hot-toast";
import { School, CheckCircle, MessageCircle } from "lucide-react";
import FeedbackModal from "@/app/components/course/EmployeeFeedback";
import SkillMatrixChart from "@/app/components/course/SkillMatrixChart";

/* ================= TYPES ================= */

export interface Employee {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
}

export interface Course {
  status: string;
  id: number;
  title: string;
  description: string;
  startDate: string;
  endDate: string;
  isSelfPaced: boolean;
}

export interface Enrollment {
  employee: any;
  id: number;
  course: Course;
  status: "pending" | "in-progress" | "completed";
  feedback?: string;
}

export interface SkillMatrix {
  employeeName: string;
  skills: string;
  proficiency: "Beginner" | "Intermediate" | "Advanced" | "Completed";
}

/* ================= COMPONENT ================= */

export default function EmployeeTraining() {
  const [employeeId, setEmployeeId] = useState<number | null>(null);
  const [activeTab, setActiveTab] = useState<"courses" | "skills">("courses");
  const [enrollments, setEnrollments] = useState<Enrollment[]>([]);
  const [skills, setSkills] = useState<SkillMatrix[]>([]);
  const [feedbackModalOpen, setFeedbackModalOpen] = useState(false);
  const [selectedEnrollmentId, setSelectedEnrollmentId] = useState<number | null>(null);

  /* ================= GET USER ID ================= */

  useEffect(() => {
    const storedId = typeof window !== "undefined" ? localStorage.getItem("userId") : null;

    if (storedId) {
      setEmployeeId(Number(storedId));
    } else {
      toast.error("User not logged in");
    }
  }, []);

  /* ================= FETCH DATA ================= */

  useEffect(() => {
    if (!employeeId) return;

    fetchEnrollments();
    fetchSkills();
  }, [employeeId]);

  const fetchEnrollments = async () => {
    try {
      const res = await api.get(`/employee/training/my-courses/${employeeId}`);
      setEnrollments(res.data);
    } catch {
      toast.error("Failed to fetch courses");
    }
  };

  const fetchSkills = async () => {
    try {
      const res = await api.get(`admin/skills/employee/${employeeId}`);

      const skillsData = res.data.skills;

      const formattedSkills = skillsData
        ? Object.keys(skillsData).map((key) => ({
            employeeName: res.data.name,
            skills: key,
            proficiency: skillsData[key],
          
          }))
        : [];

      setSkills(formattedSkills);
    } catch {
      toast.error("Failed to fetch skills");
    }
  };

  /* ================= MODAL ================= */

  const openFeedbackModal = (enrollmentId: number) => {
    setSelectedEnrollmentId(enrollmentId);
    setFeedbackModalOpen(true);
  };

  /* ================= UI ================= */

  return (
    <div className="p-4 sm:p-6 lg:p-8 bg-gray-50 min-h-screen">

      <h2 className="text-xl sm:text-2xl md:text-3xl font-bold mb-6">
        Training & Skill Matrix
      </h2>

      {/* TABS */}
      <div className="flex flex-wrap gap-2 border-b mb-6">

        <button
          className={`flex items-center gap-2 px-4 py-2 rounded-t ${
            activeTab === "courses"
              ? "bg-indigo-100 text-indigo-600"
              : "text-gray-500"
          }`}
          onClick={() => setActiveTab("courses")}
        >
          <School className="w-5 h-5" /> My Courses
        </button>

        <button
          className={`flex items-center gap-2 px-4 py-2 rounded-t ${
            activeTab === "skills"
              ? "bg-indigo-100 text-indigo-600"
              : "text-gray-500"
          }`}
          onClick={() => setActiveTab("skills")}
        >
          <CheckCircle className="w-5 h-5" /> My Skills
        </button>

      </div>

      {/* ================= COURSES ================= */}
      {activeTab === "courses" && (
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">

          {enrollments.length === 0 && (
            <p className="text-gray-500 col-span-full text-center">
              No courses assigned yet.
            </p>
          )}

          {enrollments.map((enrollment) => (
            <div
              key={enrollment.id}
              className="bg-white p-5 rounded-xl shadow hover:shadow-lg transition flex flex-col justify-between"
            >

              <div>
                <h3 className="font-bold text-lg">
                  {enrollment.course.title}
                </h3>

                <p className="text-gray-600 mt-2 text-sm">
                  {enrollment.course.description}
                </p>

                <p className="text-xs mt-3 text-gray-500">
                  {enrollment.course.startDate.split("T")[0]} -{" "}
                  {enrollment.course.endDate.split("T")[0]}
                </p>

                <p className="text-xs text-gray-500">
                  {enrollment.course.isSelfPaced
                    ? "Self-Paced"
                    : "Instructor-Led"}
                </p>

                <p className="mt-2 text-sm font-medium">
                  Status:{" "}
                  <span
                    className={`${
                      enrollment.status === "completed"
                        ? "text-green-600"
                        : enrollment.status === "in-progress"
                        ? "text-blue-600"
                        : "text-yellow-600"
                    }`}
                  >
                    {enrollment.status}
                  </span>
                </p>

                {enrollment.feedback && (
                  <p className="text-xs text-gray-500 mt-2">
                    Feedback: {enrollment.feedback}
                  </p>
                )}
              </div>

              {enrollment.status === "pending" && (
                <button
                  className="mt-4 bg-indigo-600 hover:bg-indigo-700 text-white px-3 py-2 rounded flex items-center justify-center gap-2 text-sm"
                  onClick={() => openFeedbackModal(enrollment.id)}
                >
                  <MessageCircle className="w-4 h-4" />
                  Give Feedback
                </button>
              )}

            </div>
          ))}
        </div>
      )}

      {/* ================= SKILLS ================= */}
      {activeTab === "skills" && (
        <>
          {/* DESKTOP TABLE */}
          <div className="hidden sm:block bg-white rounded-xl shadow overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-100">
                <tr>
                  <th className="p-3 text-left">Skill</th>
                  <th className="p-3 text-left">Proficiency</th>
                </tr>
              </thead>

              <tbody>
                {skills.map((skill, idx) => (
                  <tr key={idx} className="border-t">
                    <td className="p-3">{skill.skills}</td>
                    <td className="p-3">
                      <span className="px-2 py-1 rounded bg-indigo-100 text-indigo-600 text-sm">
                        {skill.proficiency}
                      </span>
                    </td>
                  </tr>
                  
                ))}
              </tbody>
            </table>
             
          </div>

          {/* MOBILE CARDS */}
          <div className="sm:hidden space-y-5 grid grid-cols-3">
            {skills.map((skill, idx) => (
              <div key={idx} className="bg-gray-200 hover:bg-gray-400 p-4 rounded shadow w-24 h-24">
                <p className="font-semibold">{skill.skills}</p>
                <p className="text-sm text-indigo-600">
                  {skill.proficiency}
                </p>
              </div>
            ))}
          </div>
          <SkillMatrixChart data={skills} />

          {skills.length === 0 && (
            <p className="text-gray-500 text-center mt-4">
              No skills available
            </p>
          )}
        </>
      )}

      {/* MODAL */}
      {feedbackModalOpen && selectedEnrollmentId !== null && (
        <FeedbackModal
          isOpen={feedbackModalOpen}
          onClose={() => setFeedbackModalOpen(false)}
          enrollmentId={selectedEnrollmentId}
          onSave={fetchEnrollments}
        />
      )}

    </div>
  );
}