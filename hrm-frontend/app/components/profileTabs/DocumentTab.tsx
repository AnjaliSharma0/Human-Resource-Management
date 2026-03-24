
"use client";

import api from "@/app/src/services/api";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import UploadDocumentModal from "./UploadDocument";

interface Document {
    id: number;
    documentName: string;
    filePath: string;
}

export default function DocumentsTab({ employeeId }: any) {
    const [docs, setDocs] = useState<Document[]>([]);
    const [showModal, setShowModal] = useState(false);

    const BASE_URL = process.env.NEXT_PUBLIC_API_URL 

    // Load documents from API
    const loadDocs = async () => {
        if (!employeeId) return;
        try {
            const res = await api.get(`/employees/${employeeId}/documents`);
            setDocs(res.data);
        } catch (err) {
            console.error(err);
            toast.error("Failed to load documents");
        }
    };

    useEffect(() => {
        loadDocs();
    }, [employeeId]);

    // Delete a document
    const deleteDoc = async (id: number) => {
        try {
            await api.delete(`/employees/documents/${id}`);
            toast.success("Document deleted");
            loadDocs(); // refresh list after deletion
        } catch (err) {
            console.error(err);
            toast.error("Failed to delete document");
        }
    };

    return (
        <div>
            <div className="flex justify-between mb-4">
                <h3 className="font-semibold text-lg">Documents</h3>
                <button
                    onClick={() => setShowModal(true)}
                    className="bg-indigo-600 text-white px-3 py-1 rounded"
                >
                    Upload
                </button>
            </div>

            {docs.length === 0 ? (
                <p className="text-gray-500">No documents found.</p>
            ) : (
                <div className="space-y-2">
                    {docs.map((doc) => {
                        const fileUrl = doc.filePath.replace(/\\/g, "/"); // handle Windows paths
                        return (
                            <div
                                key={doc.id}
                                className="border p-3 rounded flex justify-between items-center"
                            >
                                <span>{doc.documentName}</span>
                                <div className="flex gap-2">
                                    {/* <a
                                        href={`${BASE_URL}/${fileUrl.replace(/\\/g, "/")}`} // ✅ fixed
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="text-blue-500 underline"
                                    >
                                        View
                                    </a> */}
                                    {/* <a
                                        href={`${process.env.NEXT_PUBLIC_API_URL}/${doc.filePath.replace(/\\/g, "/")}`}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="text-blue-500 underline"
                                        >
                                        View
                                        </a> */}
                                    <button
                                        onClick={() => deleteDoc(doc.id)}
                                        className="text-red-500"
                                    >
                                        Delete
                                    </button>
                                </div>
                            </div>
                        );
                    })}
                </div>
            )}

            {showModal && (
                <UploadDocumentModal
                    employeeId={employeeId}
                    close={() => setShowModal(false)}
                    reload={loadDocs} // reload after upload
                />
            )}
        </div>
    );
}