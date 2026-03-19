"use client";

import { useState, useEffect } from "react";
import api from "@/app/src/services/api";
import toast from "react-hot-toast";

// Icons
import { School, Edit, Trash2, CheckCircle, List } from "lucide-react";
import CourseModal from "@/app/components/course/CourseModel";
import EnrollEmployeeModal from "@/app/components/course/EnrollEmployee";
import Loading from "@/app/components/Loading";
import { People } from "@mui/icons-material";

type Role = "admin" | "employee";

/* ================= TYPES ================= */

interface TrainingCourse {
  id: number;
  title: string;
  description: string;
  startDate: string;
  endDate: string;
  isSelfPaced: boolean;
}

interface Enrollment {
  id: number;
  employee: { id: number; firstName: string; lastName: string };
  course: { id: number; title: string };
  status: "pending" | "in-progress" | "completed";
  feedback?: string;
}

/* ================= COMPONENT ================= */

export default function TrainingDashboard() {
  const [role, setRole] = useState<Role | null>(null);
  const [employeeId, setEmployeeId] = useState<number | null>(null);

  const [activeTab, setActiveTab] = useState("courses");
  const [modalOpen, setModalOpen] = useState(false);
  const [editingCourse, setEditingCourse] = useState<any>(null);
  const [enrollModalOpen, setEnrollModalOpen] = useState(false);

  const [courses, setCourses] = useState<TrainingCourse[]>([]);
  const [enrollments, setEnrollments] = useState<Enrollment[]>([]);
  const [skillMatrix, setSkillMatrix] = useState<any[]>([]);
  const [deleteId, setDeleteId] = useState<number | null>(null);
  const [employees, setEmployees] = useState<any[]>([]);

  /* ================= INIT ================= */

  useEffect(() => {
    const storedRole = localStorage.getItem("role") as Role;
    const storedUserId = localStorage.getItem("userId");
    if (storedRole) setRole(storedRole);
    if (storedUserId) setEmployeeId(Number(storedUserId));
  }, []);

  useEffect(() => {
    if (!role) return;

    if (role === "admin") {
      fetchCourses();
      fetchEnrollments();
      fetchSkillMatrix();
      fetchEmployees();
      setActiveTab("courses");
    } else {
      fetchMyCourses();
      fetchMySkills();
      setActiveTab("my-courses");
    }
  }, [role]);

  /* ================= API ================= */

  const fetchEmployees = async () => {
    const res = await api.get("/employees");
    setEmployees(res.data);
  };

  const fetchCourses = async () => {
    const res = await api.get("/training/courses");
    setCourses(res.data);
  };

  const fetchEnrollments = async () => {
    const res = await api.get("/admin/training/enrollments");
    setEnrollments(res.data);
  };

  const fetchSkillMatrix = async () => {
    const res = await api.get("/admin/skills/matrix");
    setSkillMatrix(res.data);
  };

  const fetchMyCourses = async () => {
    if (!employeeId) return;
    const res = await api.get(`/employee/training/my-courses/${employeeId}`);
    setCourses(res.data.map((e: any) => e.course));
  };

  const fetchMySkills = async () => {
    if (!employeeId) return;
    const res = await api.get(`/admin/skills/employee/${employeeId}`);
    setSkillMatrix([res.data]);
  };

  const deleteCourse = async (id: number) => {
    try {
      await api.delete(`/training/course/${id}`);
      toast.success("Course deleted");
      fetchCourses();
    } catch {
      toast.error("Failed to delete");
    }
  };

  const updateStatus = async (id: number, status: string) => {
    try {
      await api.patch(`/training/enrollment/${id}/status`, { status });
      toast.success("Status updated");
      fetchEnrollments();
    } catch {
      toast.error("Failed to update status");
    }
  };

  /* ================= TABS ================= */

  const tabs =
    role === "admin"
      ? [
          { key: "courses", label: "Courses", icon: <School className="w-4 h-4" /> },
          { key: "enrollments", label: "Enrollments", icon: <List className="w-4 h-4" /> },
          { key: "employees", label: "Employees", icon: <People className="w-4 h-4" /> },
        ]
      : [
          { key: "my-courses", label: "My Courses", icon: <School className="w-4 h-4" /> },
          { key: "skills", label: "My Skills", icon: <CheckCircle className="w-4 h-4" /> },
        ];

  if (!role) return <Loading message="Loading..." size="md" />;

  return (
    <div className="p-4 sm:p-6 lg:p-8 bg-gray-50 min-h-screen">

      {/* HEADER */}
      <h1 className="text-xl sm:text-2xl font-bold mb-4">
        Training Dashboard
      </h1>

      {/* TABS */}
      <div className="flex flex-wrap gap-2 mb-6">
        {tabs.map((tab) => (
          <button
            key={tab.key}
            onClick={() => setActiveTab(tab.key)}
            className={`flex items-center gap-2 px-4 py-2 rounded-md text-sm ${
              activeTab === tab.key
                ? "bg-indigo-100 text-indigo-600"
                : "bg-white text-gray-600 border"
            }`}
          >
            {tab.icon}
            {tab.label}
          </button>
        ))}
      </div>

      {/* ADMIN COURSES */}
      {activeTab === "courses" && role === "admin" && (
        <>
          <div className="mb-4 flex flex-col sm:flex-row justify-between gap-2">
            <div />
            <button
              className="bg-indigo-600 text-white px-4 py-2 rounded w-full sm:w-auto"
              onClick={() => {
                setEditingCourse(null);
                setModalOpen(true);
              }}
            >
              Add Course
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
            {courses.map((course) => (
              <div
                key={course.id}
                className="bg-white p-5 rounded-xl shadow hover:shadow-lg transition"
              >
                <h3 className="font-semibold text-lg">{course.title}</h3>

                <p className="text-gray-600 text-sm mt-2 line-clamp-3">
                  {course.description}
                </p>

                <p className="text-xs mt-3 text-gray-500">
                  {course.isSelfPaced
                    ? "Self-Paced"
                    : `${course.startDate} → ${course.endDate}`}
                </p>

                <div className="flex justify-end gap-3 mt-4">
                  <Edit
                    className="cursor-pointer text-blue-500"
                    onClick={() => {
                      setEditingCourse(course);
                      setModalOpen(true);
                    }}
                  />
                  <Trash2
                    className="cursor-pointer text-red-500"
                    onClick={() => setDeleteId(course.id)}
                  />
                </div>
              </div>
            ))}
          </div>
        </>
      )}

      {/* ENROLLMENTS */}
      {activeTab === "enrollments" && role === "admin" && (
        <>
          <div className="mb-4 flex justify-end">
            <button
              className="bg-indigo-600 text-white px-4 py-2 rounded w-full sm:w-auto"
              onClick={() => setEnrollModalOpen(true)}
            >
              Enroll Employee
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {enrollments.map((e) => (
              <div key={e.id} className="bg-white p-5 rounded-xl shadow">

                <h4 className="font-semibold">
                  {e.employee.firstName} {e.employee.lastName}
                </h4>

                <p className="text-gray-500 text-sm">
                  {e.course.title}
                </p>

                <select
                  value={e.status}
                  onChange={(event) =>
                    updateStatus(e.id, event.target.value)
                  }
                  className="border mt-3 p-2 rounded w-full text-sm"
                >
                  <option value="pending">Pending</option>
                  <option value="in-progress">In Progress</option>
                  <option value="completed">Completed</option>
                </select>
              </div>
            ))}
          </div>
        </>
      )}

      {/* EMPLOYEE COURSES */}
      {activeTab === "my-courses" && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {courses.map((course) => (
            <div key={course.id} className="bg-white p-5 rounded-xl shadow">
              <h3 className="font-semibold">{course.title}</h3>
              <p className="text-gray-600 text-sm">{course.description}</p>
            </div>
          ))}
        </div>
      )}

      {/* SKILLS */}
      {activeTab === "skills" && (
        <>
          {/* Desktop */}
          <div className="hidden sm:block bg-white rounded shadow overflow-x-auto">
            <table className="w-full">
              <tbody>
                {Object.entries(skillMatrix[0]?.skills || {}).map(
                  ([skill, status]) => (
                    <tr key={skill} className="border-t">
                      <td className="p-3">{skill}</td>
                      <td className="p-3">{String(status)}</td>
                    </tr>
                  )
                )}
              </tbody>
            </table>
          </div>

          {/* Mobile */}
          <div className="sm:hidden space-y-3">
            {Object.entries(skillMatrix[0]?.skills || {}).map(
              ([skill, status]) => (
                <div key={skill} className="bg-white p-4 rounded shadow">
                  <p className="font-semibold">{skill}</p>
                  <p className="text-sm text-indigo-600">
                    {String(status)}
                  </p>
                </div>
              )
            )}
          </div>
        </>
      )}

      {/* EMPLOYEES */}
      {activeTab === "employees" && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
          {employees.map((emp) => (
            <div key={emp.id} className="bg-white p-5 rounded-xl shadow">
              <h3 className="font-semibold">
                {emp.firstName} {emp.lastName}
              </h3>
              <p className="text-gray-600 text-sm">{emp.email}</p>
            </div>
          ))}
        </div>
      )}

      {/* DELETE MODAL */}
      {deleteId && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg w-[90%] max-w-sm">
            <h3 className="font-semibold mb-3">Confirm Delete</h3>
            <div className="flex justify-end gap-2">
              <button onClick={() => setDeleteId(null)}>Cancel</button>
              <button
                className="bg-red-500 text-white px-3 py-1 rounded"
                onClick={async () => {
                  await deleteCourse(deleteId);
                  setDeleteId(null);
                }}
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MODALS */}
      <CourseModal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        onSave={fetchCourses}
        course={editingCourse}
      />

      <EnrollEmployeeModal
        isOpen={enrollModalOpen}
        onClose={() => setEnrollModalOpen(false)}
        onSave={fetchEnrollments}
      />
    </div>
  );
}