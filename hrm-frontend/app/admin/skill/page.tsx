// "use client";

// import { useState, useEffect } from "react";
// import toast from "react-hot-toast";
// import { School, CheckCircle, Edit2, Trash2, UserPlus } from "lucide-react";
// import { Course, Employee, Enrollment, SkillMatrix } from "@/app/employees/training/page";
// import EnrollEmployeeModal from "@/app/components/course/EnrollEmployee";
// import api from "@/app/src/services/api";

// export default function AdminTrainingDashboard() {
//   const [activeTab, setActiveTab] = useState<"courses" | "skills">("courses");
//   const [enrollments, setEnrollments] = useState<Enrollment[]>([]);
//   const [skills, setSkills] = useState<SkillMatrix[]>([]);
//   const [employees, setEmployees] = useState<Employee[]>([]);
//   const [courses, setCourses] = useState<Course[]>([]);
//   const [enrollModalOpen, setEnrollModalOpen] = useState(false);

//   useEffect(() => {
//     fetchEnrollments();
//     fetchSkills();
//     fetchEmployees();
//     fetchCourses();
//   }, []);

//   const fetchEnrollments = async () => {
//     try {
//       const res = await api.get("/admin/training/enrollments");
//       setEnrollments(res.data);
//     } catch {
//       toast.error("Failed to fetch enrollments");
//     }
//   };

//   const fetchSkills = async () => {
//     try {
//       const res = await api.get("/admin/skills/matrix");
//       console.log("Skills API:", res.data); // DEBUG
//       setSkills(res.data);
//     } catch {
//       toast.error("Failed to fetch skills");
//     }
//   };

//   const fetchEmployees = async () => {
//     try {
//       const res = await api.get("/employees");
//       setEmployees(res.data);
//     } catch {
//       toast.error("Failed to fetch employees");
//     }
//   };

//   const fetchCourses = async () => {
//     try {
//       const res = await api.get("/training/courses");
//       setCourses(res.data);
//     } catch {
//       toast.error("Failed to fetch courses");
//     }
//   };

//   const handleDeleteEnrollment = async (id: number) => {
//     if (!confirm("Delete this enrollment?")) return;
//     await api.delete(`/admin/training/enrollments/${id}`);
//     fetchEnrollments();
//   };

//   const handleDeleteCourse = async (id: number) => {
//     if (!confirm("Delete this course?")) return;
//     await api.delete(`/training/course/${id}`);
//     fetchCourses();
//   };

//   return (
//     <div className="p-4 sm:p-6 lg:p-8 bg-gray-50 min-h-screen">

//       <h2 className="text-xl sm:text-2xl md:text-3xl font-bold mb-6">
//         Admin Training & Skill Matrix
//       </h2>

//       {/* TABS */}
//       <div className="flex flex-wrap gap-2 border-b mb-6">

//         <button
//           className={`flex items-center gap-2 px-4 py-2 rounded-t ${
//             activeTab === "courses"
//               ? "bg-indigo-100 text-indigo-600"
//               : "text-gray-500"
//           }`}
//           onClick={() => setActiveTab("courses")}
//         >
//           <School className="w-5 h-5" /> Courses
//         </button>

//         <button
//           className={`flex items-center gap-2 px-4 py-2 rounded-t ${
//             activeTab === "skills"
//               ? "bg-indigo-100 text-indigo-600"
//               : "text-gray-500"
//           }`}
//           onClick={() => setActiveTab("skills")}
//         >
//           <CheckCircle className="w-5 h-5" /> Skills
//         </button>

//       </div>

//       {/* ================= COURSES ================= */}
//       {activeTab === "courses" && (
//         <>
//           <div className="flex justify-end mb-4">
//             <button
//               onClick={() => setEnrollModalOpen(true)}
//               className="flex items-center gap-2 bg-indigo-600 text-white px-4 py-2 rounded w-full sm:w-auto"
//             >
//               <UserPlus className="w-5 h-5" /> Enroll Employee
//             </button>
//           </div>

//           {/* ENROLLMENTS TABLE (DESKTOP) */}
//           <div className="hidden md:block bg-white rounded-xl shadow overflow-x-auto">
//             <table className="w-full">
//               <thead className="bg-gray-100">
//                 <tr>
//                   <th className="p-3">Employee</th>
//                   <th className="p-3">Course</th>
//                   <th className="p-3">Status</th>
//                   <th className="p-3">Feedback</th>
//                   <th className="p-3">Action</th>
//                 </tr>
//               </thead>

//               <tbody>
//                 {enrollments.map(e => (
//                   <tr key={e.id} className="border-t">
//                     <td className="p-3">{e.employee.firstName} {e.employee.lastName}</td>
//                     <td className="p-3">{e.course.title}</td>
//                     <td className="p-3">{e.status}</td>
//                     <td className="p-3">{e.feedback || "-"}</td>
//                     <td className="p-3">
//                       <button onClick={() => handleDeleteEnrollment(e.id)}>
//                         <Trash2 className="w-4 h-4 text-red-500" />
//                       </button>
//                     </td>
//                   </tr>
//                 ))}
//               </tbody>
//             </table>
//           </div>

//           {/* MOBILE CARDS */}
//           <div className="md:hidden space-y-4">
//             {enrollments.map(e => (
//               <div key={e.id} className="bg-white p-4 rounded shadow">
//                 <p><b>{e.employee.firstName} {e.employee.lastName}</b></p>
//                 <p>{e.course.title}</p>
//                 <p>Status: {e.course.status}</p>
//                 <p>{e.feedback || "-"}</p>
//               </div>
//             ))}
//           </div>

//           {/* COURSES TABLE */}
//           <div className="mt-8">
//             <h3 className="text-lg font-semibold mb-4">All Courses</h3>

//             <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
//               {courses.map(c => (
//                 <div key={c.id} className="bg-white p-4 rounded shadow">
//                   <h4 className="font-bold">{c.title}</h4>
//                   <p className="text-sm text-gray-500">
//                     {c.startDate.split("T")[0]} - {c.endDate.split("T")[0]}
//                   </p>
//                   <p className="text-sm">
//                     {c.isSelfPaced ? "Self-Paced" : "Instructor-Led"}
//                   </p>

//                   <div className="flex gap-2 mt-2">
//                     <Edit2 className="w-4 h-4 text-blue-500" />
//                     <Trash2
//                       className="w-4 h-4 text-red-500 cursor-pointer"
//                       onClick={() => handleDeleteCourse(c.id)}
//                     />
//                   </div>
//                 </div>
//               ))}
//             </div>
//           </div>
//         </>
//       )}

//       {/* ================= SKILLS ================= */}
//       {activeTab === "skills" && (
//         <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">

//           {skills.length === 0 && (
//             <p className="text-gray-500">No skills found</p>
//           )}

//           {skills.map((employee,i) => (
//   <div key={i} className="mb-4">
//     <p className="font-bold">{employee.employeeName}</p>

//     <div className="flex flex-wrap gap-2 mt-2">
//       {Object.entries(employee.skills).map(([skillName, level], idx) => (
//         <div key={idx} className="bg-white p-2 rounded shadow">
//           <p className="font-semibold">{skillName}</p>
//           <p className="text-sm text-indigo-600">{level}</p>
//         </div>
//       ))}
//     </div>
//   </div>
// ))}

//         </div>
//       )}

//       {/* MODAL */}
//       {enrollModalOpen && (
//         <EnrollEmployeeModal
//           isOpen={enrollModalOpen}
//           onClose={() => setEnrollModalOpen(false)}
//           onSave={fetchEnrollments}
//         />
//       )}

//     </div>
//   );
// }

"use client";

import { useState, useEffect } from "react";
import toast from "react-hot-toast";
import { 
  School as SchoolIcon, 
  CheckCircle as CheckCircleIcon, 
  Edit as EditIcon, 
  Delete as DeleteIcon 
} from "@mui/icons-material";
import { UserPlus } from "lucide-react"; // for enroll
import { Course, Employee, Enrollment, SkillMatrix } from "@/app/employees/training/page";
import EnrollEmployeeModal from "@/app/components/course/EnrollEmployee";
import api from "@/app/src/services/api";

export default function AdminTrainingDashboard() {
  const [activeTab, setActiveTab] = useState<"courses" | "skills">("courses");
  const [enrollments, setEnrollments] = useState<Enrollment[]>([]);
  const [skills, setSkills] = useState<SkillMatrix[]>([]);
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [courses, setCourses] = useState<Course[]>([]);
  const [enrollModalOpen, setEnrollModalOpen] = useState(false);

  useEffect(() => {
    fetchEnrollments();
    fetchSkills();
    fetchEmployees();
    fetchCourses();
  }, []);

  const fetchEnrollments = async () => {
    try {
      const res = await api.get("/admin/training/enrollments");
      setEnrollments(res.data);
    } catch {
      toast.error("Failed to fetch enrollments");
    }
  };

  const fetchSkills = async () => {
    try {
      const res = await api.get("/admin/skills/matrix");
      setSkills(res.data);
    } catch {
      toast.error("Failed to fetch skills");
    }
  };

  const fetchEmployees = async () => {
    try {
      const res = await api.get("/employees");
      setEmployees(res.data);
    } catch {
      toast.error("Failed to fetch employees");
    }
  };

  const fetchCourses = async () => {
    try {
      const res = await api.get("/training/courses");
      setCourses(res.data);
    } catch {
      toast.error("Failed to fetch courses");
    }
  };

  const handleDeleteEnrollment = async (id: number) => {
    if (!confirm("Delete this enrollment?")) return;
    await api.delete(`/admin/training/enrollments/${id}`);
    fetchEnrollments();
  };

  const handleDeleteCourse = async (id: number) => {
    if (!confirm("Delete this course?")) return;
    await api.delete(`/training/course/${id}`);
    fetchCourses();
  };

  return (
    <div className="p-4 sm:p-6 lg:p-8 bg-gray-50 min-h-screen">

      <h2 className="text-2xl sm:text-3xl font-bold mb-6 text-gray-800">
        Admin Training & Skill Matrix
      </h2>

      {/* TABS */}
      <div className="flex flex-wrap gap-2 border-b mb-6">
        <button
          className={`flex items-center gap-2 px-4 py-2 rounded-t font-medium transition ${
            activeTab === "courses"
              ? "bg-indigo-100 text-indigo-600 shadow"
              : "text-gray-500 hover:text-indigo-600"
          }`}
          onClick={() => setActiveTab("courses")}
        >
          <SchoolIcon fontSize="small" /> Courses
        </button>

        <button
          className={`flex items-center gap-2 px-4 py-2 rounded-t font-medium transition ${
            activeTab === "skills"
              ? "bg-indigo-100 text-indigo-600 shadow"
              : "text-gray-500 hover:text-indigo-600"
          }`}
          onClick={() => setActiveTab("skills")}
        >
          <CheckCircleIcon fontSize="small" /> Skills
        </button>
      </div>

      {/* ================= COURSES & ENROLLMENTS ================= */}
      {activeTab === "courses" && (
        <>
          <div className="flex justify-end mb-4">
            <button
              onClick={() => setEnrollModalOpen(true)}
              className="flex items-center gap-2 bg-indigo-600 text-white px-4 py-2 rounded shadow hover:bg-indigo-700 transition w-full sm:w-auto"
            >
              <UserPlus className="w-5 h-5" /> Enroll Employee
            </button>
          </div>

          {/* ENROLLMENTS TABLE (DESKTOP) */}
          <div className="hidden md:block bg-white rounded-xl shadow overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-100">
                <tr>
                  <th className="p-3 text-left">Employee</th>
                  <th className="p-3 text-left">Course</th>
                  <th className="p-3 text-left">Status</th>
                  <th className="p-3 text-left">Feedback</th>
                  <th className="p-3 text-left">Action</th>
                </tr>
              </thead>
              <tbody>
                {enrollments.map(e => (
                  <tr key={e.id} className="border-t hover:bg-gray-50 transition">
                    <td className="p-3">{e.employee.firstName} {e.employee.lastName}</td>
                    <td className="p-3">{e.course.title}</td>
                    <td className="p-3 capitalize">{e.status}</td>
                    <td className="p-3">{e.feedback || "-"}</td>
                    <td className="p-3">
                      <DeleteIcon
                        className="text-red-500 cursor-pointer hover:text-red-600 transition"
                        fontSize="small"
                        onClick={() => handleDeleteEnrollment(e.id)}
                      />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* MOBILE CARDS */}
          <div className="md:hidden space-y-4">
            {enrollments.map(e => (
              <div key={e.id} className="bg-white p-4 rounded-2xl shadow">
                <p className="font-semibold">{e.employee.firstName} {e.employee.lastName}</p>
                <p className="text-gray-600">{e.course.title}</p>
                <p className="capitalize text-sm text-indigo-600">Status: {e.status}</p>
                <p className="text-sm">{e.feedback || "-"}</p>
              </div>
            ))}
          </div>

          {/* COURSES GRID */}
          <div className="mt-8">
            <h3 className="text-lg font-semibold mb-4">All Courses</h3>
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {courses.map(c => (
                <div key={c.id} className="bg-white p-4 rounded-2xl shadow flex flex-col justify-between hover:shadow-lg transition">
                  <div>
                    <h4 className="font-bold text-gray-800">{c.title}</h4>
                    <p className="text-sm text-gray-500">
                      {c.startDate.split("T")[0]} - {c.endDate.split("T")[0]}
                    </p>
                    <p className="text-sm mt-1">
                      {c.isSelfPaced ? "Self-Paced" : "Instructor-Led"}
                    </p>
                  </div>

                  <div className="flex gap-2 mt-2">
                    <EditIcon className="text-blue-500 cursor-pointer hover:text-blue-600 transition" fontSize="small" />
                    <DeleteIcon
                      className="text-red-500 cursor-pointer hover:text-red-600 transition"
                      fontSize="small"
                      onClick={() => handleDeleteCourse(c.id)}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </>
      )}

      {/* ================= SKILLS ================= */}
      {activeTab === "skills" && (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {skills.length === 0 && <p className="text-gray-500">No skills found</p>}

          {skills.map((employee,i) => (
            <div key={i} className="bg-white p-4 rounded-2xl shadow">
              <p className="font-bold text-gray-800">{employee.employeeName}</p>
              <div className="flex flex-wrap gap-2 mt-2">
                {Object.entries(employee.skills).map(([skillName, level], idx) => (
                  <div key={idx} className="bg-indigo-50 p-2 rounded shadow text-center min-w-[80px]">
                    <p className="font-semibold text-sm">{skillName}</p>
                    <p className="text-sm text-indigo-600">{level}</p>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* ENROLL MODAL */}
      {enrollModalOpen && (
        <EnrollEmployeeModal
          isOpen={enrollModalOpen}
          onClose={() => setEnrollModalOpen(false)}
          onSave={fetchEnrollments}
        />
      )}
    </div>
  );
}