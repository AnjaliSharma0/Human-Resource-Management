"use client";

import { useState, useEffect } from "react";
import { X, Check, UserPlus } from "lucide-react";
import api from "@/app/src/services/api";
import toast from "react-hot-toast";

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: () => void;
}

export default function EnrollEmployeeModal({ isOpen, onClose, onSave }: ModalProps) {
  const [employees, setEmployees] = useState<any[]>([]);
  const [courses, setCourses] = useState<any[]>([]);
  const [selectedEmployee, setSelectedEmployee] = useState<number | null>(null);
  const [selectedCourse, setSelectedCourse] = useState<number | null>(null);
  const [status, setStatus] = useState<"pending" | "in-progress" | "completed">("pending");

  useEffect(() => {
    if (isOpen) {
      fetchEmployees();
      fetchCourses();
      setSelectedEmployee(null);
      setSelectedCourse(null);
      setStatus("pending");
    }
  }, [isOpen]);

  const fetchEmployees = async () => {
    const res = await api.get("/employees");
    setEmployees(res.data);
  };

  const fetchCourses = async () => {
    const res = await api.get("/training/courses");
    setCourses(res.data);
  };

  const handleEnroll = async () => {
    if (!selectedEmployee || !selectedCourse) {
      toast.error("Please select both employee and course");
      return;
    }
    try {
      await api.post("/training/enroll", {
        employeeId: selectedEmployee,
        courseId: selectedCourse,
        status,
      });
      toast.success("Employee enrolled successfully");
      onSave();
      onClose();
    } catch (err) {
      toast.error("Failed to enroll employee");
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/40 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg w-full max-w-md p-6 relative shadow-lg">
        <button onClick={onClose} className="absolute top-3 right-3 text-gray-500 hover:text-gray-700">
          <X className="w-5 h-5" />
        </button>
        <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
          <UserPlus className="w-5 h-5" /> Enroll Employee
        </h2>

        <div className="space-y-3">
          <select
            className="w-full border rounded p-2"
            value={selectedEmployee || ""}
            onChange={e => setSelectedEmployee(Number(e.target.value))}
          >
            <option value="">Select Employee</option>
            {employees.map(emp => (
              <option key={emp.id} value={emp.id}>{emp.firstName} {emp.lastName}</option>
            ))}
          </select>

          <select
            className="w-full border rounded p-2"
            value={selectedCourse || ""}
            onChange={e => setSelectedCourse(Number(e.target.value))}
          >
            <option value="">Select Course</option>
            {courses.map(course => (
              <option key={course.id} value={course.id}>{course.title}</option>
            ))}
          </select>

          <select
            className="w-full border rounded p-2"
            value={status}
            onChange={e => setStatus(e.target.value as any)}
          >
            <option value="pending">Pending</option>
            <option value="in-progress">In Progress</option>
            <option value="completed">Completed</option>
          </select>

          <button
            onClick={handleEnroll}
            className="bg-indigo-500 hover:bg-indigo-600 text-white px-4 py-2 rounded w-full flex items-center justify-center gap-2"
          >
            <Check className="w-4 h-4" /> Enroll
          </button>
        </div>
      </div>
    </div>
  );
}