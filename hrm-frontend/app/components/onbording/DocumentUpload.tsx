"use client";

import { useEffect, useState } from "react";
import api from "@/app/src/services/api";
import toast from "react-hot-toast";
import useRole from "@/app/src/hook/userole";
import RoleGuard from "@/app/src/hook/rolegaurd";

const DOCUMENT_TYPES = [
  "Aadhaar Card",
  "PAN Card",
  "Bank Passbook",
  "Resume",
  "Educational Certificates",
  "Experience Letters",
];

export default function DocumentUpload() {
  const [docs, setDocs] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const role = useRole();

  const fetchDocs = async () => {
    try {
      setLoading(true);
      const res = await api.get("/documents");
      setDocs(res.data);
    } catch {
      toast.error("Failed to fetch documents");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDocs();
  }, []);

  const uploadDoc = async (file: File, documentType: string) => {
    if (!file || !documentType) {
      toast.error("File and document type are required");
      return;
    }

    const employeeId = localStorage.getItem("userId");
    if (!employeeId) {
      toast.error("Employee ID not found");
      return;
    }

    const formData = new FormData();
    formData.append("file", file);
    formData.append("employeeId", employeeId);
    formData.append("documentType", documentType);

    try {
      await api.post("/documents/upload", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      toast.success("Uploaded successfully");
      fetchDocs();
    } catch (err: any) {
      console.error(err.response?.data || err);
      toast.error("Upload failed: " + (err.response?.data?.message || ""));
    }
  };

  const approveDoc = async (id: number) => {
    try {
      await api.patch(`/documents/${id}/approve`);
      toast.success("Approved");
      fetchDocs();
    } catch {
      toast.error("Approval failed");
    }
  };

  const deleteDoc = async (id: number) => {
    try {
      await api.delete(`/documents/${id}`);
      toast.success("Deleted");
      fetchDocs();
    } catch {
      toast.error("Delete failed");
    }
  };

  return (
    <div className="w-full">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-3">
        <h2 className="text-xl font-semibold">📄 Documents</h2>
      </div>

      <RoleGuard allowed={["employee"]}>
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3 mb-6">
          {DOCUMENT_TYPES.map((type) => (
            <label
              key={type}
              className="cursor-pointer border rounded-lg p-4 flex flex-col items-center justify-center bg-gray-50 hover:bg-gray-100 transition"
            >
              <p className="font-medium mb-2">{type}</p>
              <input
                type="file"
                className="hidden"
                onChange={(e: any) => {
                  if (e.target.files?.[0]) uploadDoc(e.target.files[0], type);
                }}
              />
              <span className="text-sm text-gray-500 mt-1">Click to upload</span>
            </label>
          ))}
        </div>
      </RoleGuard>

      {loading ? (
        <div className="text-center py-10 text-gray-500">Loading documents...</div>
      ) : docs.length === 0 ? (
        <div className="text-center py-16 border rounded-lg bg-gray-50">
          <p className="text-gray-500 text-lg">📭 No documents uploaded yet</p>
          <p className="text-sm text-gray-400 mt-2">
            Upload your documents to get started
          </p>
        </div>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {docs.map((doc) => (
            <div
              key={doc.id}
              className="p-4 border rounded-xl shadow-sm bg-white hover:shadow-md transition flex flex-col justify-between"
            >
              <div>

                <p className="font-semibold text-gray-800 truncate">{doc.documentName}</p>
                <p className="text-sm text-gray-500">{doc.documentType}</p>
                  <p className="text-sm text-gray-600 mt-1">
    Uploaded by: EmpId: {doc.employeeName || doc.employeeId || "Unknown"}
  </p>
                <p className="text-sm mt-1">
                  Status:{" "}
                  <span
                    className={doc.isVerified ? "text-green-600" : "text-yellow-600 font-medium"}
                  >
                    {doc.isVerified ? "Approved" : "Pending"}
                  </span>
                </p>
              </div>

              <div className="mt-4 flex flex-wrap gap-2">
                {/* {doc.fileUrl && (
                  <a
                    href={`http://localhost:5000/uploads/${doc.fileUrl}`}
                    target="_blank"
                    rel="noreferrer"
                    className="px-3 py-1 text-sm bg-gray-100 rounded hover:bg-gray-200"
                  >
                    View
                  </a>
                )} */}

                <RoleGuard allowed={["manager","admin"]}>
                  {!doc.isVerified && (
                    <button
                      onClick={() => approveDoc(doc.id)}
                      className="px-3 py-1 text-sm bg-green-500 text-white rounded hover:bg-green-600"
                    >
                      Approve
                    </button>
                  )}
                </RoleGuard>

                <RoleGuard allowed={["admin","employee"]}>
                  <button
                    onClick={() => deleteDoc(doc.id)}
                    className="px-3 py-1 text-sm bg-red-500 text-white rounded hover:bg-red-600"
                  >
                    Delete
                  </button>
                </RoleGuard>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}