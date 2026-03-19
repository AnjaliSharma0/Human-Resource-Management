"use client";

import { useState, useEffect } from "react";
import api from "@/app/src/services/api";
import toast from "react-hot-toast";
import { MessageCircle } from "lucide-react";
import FeedbackModal from "@/app/components/course/EmployeeFeedback";


interface Course {
  id: number;
  title: string;
  description: string;
  startDate: string;
  endDate: string;
  isSelfPaced: boolean;
  enrollmentId: number;
  status: "pending" | "in-progress" | "completed";
  feedback?: string;
}

export default function MyCourses({ employeeId }: { employeeId: number }) {
  const [courses, setCourses] = useState<Course[]>([]);
  const [feedbackModalOpen, setFeedbackModalOpen] = useState(false);
  const [selectedEnrollmentId, setSelectedEnrollmentId] = useState<number | null>(null);

  useEffect(() => {
    fetchMyCourses();
  }, []);

  const fetchMyCourses = async () => {
    try {
      const res = await api.get(`/employee/training/my-courses/${employeeId}`);
      setCourses(res.data);
    } catch (err) {
      toast.error("Failed to load courses");
    }
  };

  const openFeedbackModal = (enrollmentId: number) => {
    setSelectedEnrollmentId(enrollmentId);
    setFeedbackModalOpen(true);
  };

  return (
    <div className="p-4 w-full">
      <h2 className="text-2xl font-semibold mb-4">My Training Courses</h2>

      {courses.length === 0 && <p className="text-gray-500">No courses assigned yet.</p>}

      <div className="grid md:grid-cols-2 gap-4">
        {courses.map((course) => (
          <div key={course.id} className="border p-4 rounded-lg shadow hover:shadow-md transition flex flex-col justify-between">
            <div>
              <h3 className="font-semibold text-lg">{course.title}</h3>
              <p className="text-gray-600 mt-1">{course.description}</p>
              <p className="text-sm mt-2">
                {course.startDate.split("T")[0]} - {course.endDate.split("T")[0]} |{" "}
                {course.isSelfPaced ? "Self-Paced" : "Instructor-Led"}
              </p>
              <p className="text-sm mt-1 font-medium">
                Status:{" "}
                <span className={`capitalize ${course.status === "completed" ? "text-green-600" : "text-indigo-600"}`}>
                  {course.status}
                </span>
              </p>
              {course.feedback && <p className="text-sm text-gray-500 mt-1">Feedback: {course.feedback}</p>}
            </div>

            {/* Show Feedback button only if in-progress or completed */}
            {course.status !== "pending" && (
              <button
                className="mt-3 bg-indigo-500 hover:bg-indigo-600 text-white px-3 py-1 rounded flex items-center gap-2 self-start"
                onClick={() => openFeedbackModal(course.enrollmentId)}
              >
                <MessageCircle className="w-4 h-4" /> Give Feedback
              </button>
            )}
          </div>
        ))}
      </div>

      {/* Feedback Modal */}
      {selectedEnrollmentId && (
        <FeedbackModal
          isOpen={feedbackModalOpen}
          onClose={() => setFeedbackModalOpen(false)}
          enrollmentId={selectedEnrollmentId}
          onSave={fetchMyCourses}
        />
      )}
    </div>
  );
}