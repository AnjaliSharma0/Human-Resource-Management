
// "use client";
// import { useState } from "react";
// import api from "@/app/src/services/api";
// import toast from "react-hot-toast";

// interface ApplyJobProps {
//   jobId: number;
// }

// export default function ApplyJob({ jobId }: ApplyJobProps) {
//   const [resumeFile, setResumeFile] = useState<File | null>(null);
//   const [errors, setError]= useState<any>({})
 

//     const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
//     const file = e.target.files?.[0];

//     if (!file) {
//       setResumeFile(null);
//       setError("Resume is required");
//       return;
//     }

//     const allowedTypes = [
//       "application/pdf",
//       "application/msword",
//       "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
//     ];

//     if (!allowedTypes.includes(file.type)) {
//       setError("Only PDF or DOC/DOCX files are allowed");
//       setResumeFile(null);
//       return;
//     }

//     // Optional: file size validation (e.g., 2MB)
//     const maxSize = 2 * 1024 * 1024;
//     if (file.size > maxSize) {
//       setError("File size must be less than 2MB");
//       setResumeFile(null);
//       return;
//     }

//     setResumeFile(file);
//     setError("");
//   };


//   const handleSubmit = async () => {
//     if (!resumeFile) return toast.error("Please select a resume file");

//     const formData = new FormData();
//     formData.append("resume", resumeFile);
//     formData.append("jobPostingId", jobId.toString()); // ✅ Required for backend

//     try {
//       await api.post("/candidates/apply", formData, {
//         headers: { "Content-Type": "multipart/form-data" },
//       });
//       toast.success("Applied successfully!");
//       setResumeFile(null);
//     } catch (err: any) {
//       console.log("Error applying:", err);
//       toast.error(err?.response?.data?.message || "Application failed");
//     }
//   };

//   return (
//     <div className="p-4 mt-4 border rounded max-w-md mx-auto bg-white shadow">
//       <h2 className="text-xl font-semibold mb-4">Apply for Job</h2>

//       <label className="block mb-2 font-medium">Upload Resume (PDF/DOC)</label>
//       <input
//         type="file"
//         accept=".pdf,.doc,.docx"
//         onChange={handleFileChange}
//         className="border p-2 w-full mb-4"
//         required
//       />

//       {resumeFile && (
//         <p className="mb-4 text-gray-700">
//           Selected file: <span className="font-semibold">{resumeFile.name}</span>
//         </p>
//       )}

//        {/* Error Message */}
//       {errors && (
//         <p className="text-red-500 text-sm mb-3">{errors}</p>
//       )}
//        {resumeFile && !errors && (
//         <p className="mb-3 text-gray-700">
//           Selected file:{" "}
//           <span className="font-semibold">{resumeFile.name}</span>
//         </p>
//       )}
//       <button
//         onClick={handleSubmit}
//         disabled={!resumeFile}
//         className={`p-2 rounded w-full text-white ${
//           resumeFile
//             ? "bg-green-500 hover:bg-green-600"
//             : "bg-gray-400 cursor-not-allowed"
//         }`}
//       >
//         Submit Application
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
  const [resumeUrl, setResumeUrl] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = async () => {
    if (!resumeUrl) {
      setError("Resume URL is required");
      return;
    }

    try {
      await api.post("/candidates/apply", {
        resumeUrl,
        jobPostingId: jobId,
      });
      toast.success("Applied successfully!");
      setResumeUrl("");
      setError("");
    } catch (err: any) {
      console.log("Error applying:", err);
      toast.error(err?.response?.data?.message || "Application failed");
    }
  };

  return (
    <div className="p-4 mt-4 border rounded max-w-md mx-auto bg-white shadow">
      <h2 className="text-xl font-semibold mb-4">Apply for Job</h2>

      <label className="block mb-2 font-medium">Resume URL (OneDrive, Google Drive, etc.)</label>
      <input
        type="url"
        placeholder="Paste your resume URL here"
        value={resumeUrl}
        onChange={(e) => setResumeUrl(e.target.value)}
        className="border p-2 w-full mb-4"
        required
      />

      {error && <p className="text-red-500 text-sm mb-3">{error}</p>}

      <button
        onClick={handleSubmit}
        className={`p-2 rounded w-full text-white ${
          resumeUrl ? "bg-green-500 hover:bg-green-600" : "bg-gray-400 cursor-not-allowed"
        }`}
      >
        Submit Application
      </button>
    </div>
  );
}