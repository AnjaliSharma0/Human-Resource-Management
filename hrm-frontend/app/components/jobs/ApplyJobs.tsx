// // "use client";
// // import { useState } from "react";
// // import api from "@/app/src/services/api";
// // import toast from "react-hot-toast";

// // export default function ApplyJob({ jobId }: { jobId: number }) {
// //   const [form, setForm] = useState({
// //     firstName: "",
// //     lastName: "",
// //     email: "",
// //     phone: "",
// //     resume: null as File | null,
// //   });

// //   const handleSubmit = async () => {
// //     const data = new FormData();
// //     data.append("firstName", form.firstName);
// //     data.append("lastName", form.lastName);
// //     data.append("email", form.email);
// //     data.append("phone", form.phone);
// //     if (form.resume) data.append("resume", form.resume);

// //     try {
// //       await api.post(`/candidates/apply/${jobId}`, data, {
// //         headers: { "Content-Type": "multipart/form-data" },
// //       });
// //       toast.success("Applied successfully!");
// //       setForm({ firstName: "", lastName: "", email: "", phone: "", resume: null });
// //     } catch (err) {
// //       toast.error("Application failed");
// //     }
// //   };

// //   return (
// //     <div className="p-4 mt-4 border rounded">
// //       <h2 className="text-xl font-semibold mb-2">Apply for Job</h2>
// //       <input placeholder="First Name" value={form.firstName} onChange={e => setForm({ ...form, firstName: e.target.value })} className="border p-1 m-1"/>
// //       <input placeholder="Last Name" value={form.lastName} onChange={e => setForm({ ...form, lastName: e.target.value })} className="border p-1 m-1"/>
// //       <input placeholder="Email" value={form.email} onChange={e => setForm({ ...form, email: e.target.value })} className="border p-1 m-1"/>
// //       <input placeholder="Phone" value={form.phone} onChange={e => setForm({ ...form, phone: e.target.value })} className="border p-1 m-1"/>
// //       <input type="file" onChange={e => setForm({ ...form, resume: e.target.files?.[0] || null })} className="border p-1 m-1"/>
// //       <button onClick={handleSubmit} className="bg-green-500 text-white p-2 rounded mt-2">Submit</button>
// //     </div>
// //   );
// // }

// "use client";
// import { useState } from "react";
// import api from "@/app/src/services/api";
// import toast from "react-hot-toast";

// export default function ApplyJob({ jobId }: { jobId: number }) {
//   const [form, setForm] = useState({
//     resume: null as File | null,
//   });

//   const handleSubmit = async () => {
//     if (!form.resume) return toast.error("Please select a resume file");

//     const data = new FormData();
//     data.append("resume", form.resume);
//     data.append("jobPostingId", jobId.toString()); // ✅ Required for backend


//     try {
//       await api.post(`/candidates/apply/${jobId}`, data, {
//         headers: { "Content-Type": "multipart/form-data" },
//       });
//       toast.success("Applied successfully!");
//       setForm({ resume: null });
//     } catch (err) {
//       toast.error("Application failed");
//     }
//   };

//   return (
//     <div className="p-4 mt-4 border rounded max-w-md mx-auto">
//       <h2 className="text-xl font-semibold mb-4">Apply for Job</h2>

//       <label className="block mb-2 font-medium">Upload Resume (PDF/DOC)</label>
//       <input
//         type="file"
//         accept=".pdf,.doc,.docx"
//         onChange={e => setForm({ resume: e.target.files?.[0] || null })}
//         className="border p-2 w-full mb-4"
//       />

//       {form.resume && (
//         <p className="mb-4 text-gray-700">
//           Selected file: <span className="font-semibold">{form.resume.name}</span>
//         </p>
//       )}

//       <button
//         onClick={handleSubmit}
//         className="bg-green-500 text-white p-2 rounded w-full"
//       >
//         Submit
//       </button>
//     </div>
//   );
// }


"use client";
import { useState } from "react";
import api from "@/app/src/services/api";
import toast from "react-hot-toast";

interface ApplyJobProps {
  jobId: number;
}

export default function ApplyJob({ jobId }: ApplyJobProps) {
  const [resumeFile, setResumeFile] = useState<File | null>(null);

  const handleSubmit = async () => {
    if (!resumeFile) return toast.error("Please select a resume file");

    const formData = new FormData();
    formData.append("resume", resumeFile);
    formData.append("jobPostingId", jobId.toString()); // ✅ Required for backend

    try {
      await api.post("/candidates/apply", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      toast.success("Applied successfully!");
      setResumeFile(null);
    } catch (err: any) {
      console.log("Error applying:", err);
      toast.error(err?.response?.data?.message || "Application failed");
    }
  };

  return (
    <div className="p-4 mt-4 border rounded max-w-md mx-auto bg-white shadow">
      <h2 className="text-xl font-semibold mb-4">Apply for Job</h2>

      <label className="block mb-2 font-medium">Upload Resume (PDF/DOC)</label>
      <input
        type="file"
        accept=".pdf,.doc,.docx"
        onChange={(e) => setResumeFile(e.target.files?.[0] || null)}
        className="border p-2 w-full mb-4"
      />

      {resumeFile && (
        <p className="mb-4 text-gray-700">
          Selected file: <span className="font-semibold">{resumeFile.name}</span>
        </p>
      )}

      <button
        onClick={handleSubmit}
        className="bg-green-500 text-white p-2 rounded w-full hover:bg-green-600"
      >
        Submit Application
      </button>
    </div>
  );
}