"use client";

import { useState, useEffect } from "react";
import { School, X } from "lucide-react";
import api from "@/app/src/services/api";
import toast from "react-hot-toast";

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: () => void;
  course?: any; // if editing
}

export default function CourseModal({ isOpen, onClose, onSave, course }: ModalProps) {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [isSelfPaced, setIsSelfPaced] = useState(false);
const [availableSkills, setAvailableSkills] = useState<any[]>([]);
const [skills, setSkills] = useState<number[]>([]);

  useEffect(() => {
    fetchSkills();
    if (course) {
      setTitle(course.title);
      setDescription(course.description);
      setStartDate(course.startDate.split("T")[0]);
      setEndDate(course.endDate.split("T")[0]);
      setIsSelfPaced(course.isSelfPaced);
      setSkills(course.skills?.map((s: any) => s.name) || []);
    } else {
      setTitle(""); setDescription(""); setStartDate(""); setEndDate(""); setIsSelfPaced(false); setSkills([]);
    }
  }, [course]);

  const fetchSkills = async () => {
    const res = await api.get("/admin/skills/matrix");
    setAvailableSkills(res.data);
  };

 const handleSave = async () => {
  if (!title || !description || !startDate || !endDate) {
    toast.error("Please fill all fields");
    return;
  }

  try {
    const payload = {
      title,
      description,
      startDate: new Date(startDate),
      endDate: new Date(endDate),
      isSelfPaced,
      skills, // now IDs
    };

    console.log(payload);

    if (course) {
      await api.patch(`/admin/training/courses/${course.id}`, payload);
      toast.success("Course updated");
    } else {
      await api.post("/training/course", payload); 
      toast.success("Course created");
    }

    onSave();
    onClose();
  } catch (err: any) {
    console.error(err.response?.data); 
    toast.error(err.response?.data?.message || "Failed to save course");
  }
};

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/40 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg w-full max-w-xl p-6 relative shadow-lg">
        <button onClick={onClose} className="absolute top-3 right-3 text-gray-500 hover:text-gray-700">
          <X className="w-5 h-5" />
        </button>
        <h2 className="text-xl font-semibold mb-4 flex items-center gap-2"><School className="w-5 h-5" /> {course ? "Edit" : "Add"} Course</h2>

        <div className="space-y-3">
          <input
            type="text"
            placeholder="Title"
            className="w-full border rounded p-2"
            value={title}
            onChange={e => setTitle(e.target.value)}
          />
          <textarea
            placeholder="Description"
            className="w-full border rounded p-2"
            value={description}
            onChange={e => setDescription(e.target.value)}
          />
          <div className="flex gap-3">
            <input type="date" className="border rounded p-2 flex-1" value={startDate} onChange={e => setStartDate(e.target.value)} />
            <input type="date" className="border rounded p-2 flex-1" value={endDate} onChange={e => setEndDate(e.target.value)} />
          </div>
          <label className="flex items-center gap-2">
            <input type="checkbox" checked={isSelfPaced} onChange={e => setIsSelfPaced(e.target.checked)} />
            Self-Paced
          </label>

          {/* Skills Multi-select */}
                  <div className="flex flex-wrap gap-2">
          {availableSkills.map((skill, i) => (
            <button
              key={i} // index is fine
              type="button"
              className={`px-2 py-1 rounded border ${
                skills.includes(skill.id) ? "bg-indigo-500 text-white" : "bg-gray-100"
              }`}
              onClick={() => {
                if (skills.includes(skill.id)) {
                  setSkills(skills.filter(id => id !== skill.id));
                } else {
                  setSkills([...skills, skill.id]);
                }
              }}
            >
              {skill.name} {/* now this will show the actual skill name */}
            </button>
          ))}
        </div>
                  <button
            onClick={handleSave}
            className="bg-indigo-500 hover:bg-indigo-600 text-white px-4 py-2 rounded mt-2"
          >
            {course ? "Update" : "Create"} Course
          </button>
        </div>
      </div>
    </div>
  );
}