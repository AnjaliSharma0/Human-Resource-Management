 "use client";

import { useEffect, useState } from "react";
import api from "@/app/src/services/api";
import toast from "react-hot-toast";
import CreateJobRequisitionModal from "@/app/components/jobs/CreateJobRequisition";
import { Button } from "@mui/material";

export default function JobRequisitionAdmin() {
  const [data, setData] = useState<any[]>([]);
  const [open, setOpen] = useState(false);
  const [openJobReqModal, setOpenJobReqModal] = useState(false);

  const loadData = async () => {
    try {
      const res = await api.get("/job-requisition");
      setData(res.data);
    } catch (err) {
      toast.error("Failed to load job requisitions");
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const updateStatus = async (id: number, status: string) => {
    try {
      await api.patch(`/job-requisition/${id}/status`, { status });
      toast.success("Status updated");
      loadData();
    } catch {
      toast.error("Failed to update status");
    }
  };

  return (
    <div className="p-4 sm:p-6 lg:p-8 bg-gray-50 min-h-screen">

      {/* HEADER */}
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4 mb-6">

        <h1 className="text-xl sm:text-2xl md:text-3xl font-bold">
          Job Requisitions
        </h1>

        <Button
          variant="contained"
          onClick={() => setOpenJobReqModal(true)}
          className="w-full sm:w-auto"
        >
          Create Job Requisition
        </Button>

      </div>

      {/* TABLE (DESKTOP) */}
      <div className="hidden md:block overflow-x-auto bg-white rounded-xl shadow">

        <table className="w-full">
          <thead className="bg-gray-100 text-left">
            <tr>
              <th className="p-3">Title</th>
              <th className="p-3">Department</th>
              <th className="p-3">Location</th>
              <th className="p-3">Status</th>
              <th className="p-3">Action</th>
            </tr>
          </thead>

          <tbody>
            {data.map((r) => (
              <tr key={r.id} className="border-t hover:bg-gray-50">

                <td className="p-3 font-medium">{r.title}</td>
                <td className="p-3">{r.department}</td>
                <td className="p-3">{r.location}</td>

                <td className="p-3">
                  <span
                    className={`px-2 py-1 rounded text-sm
                      ${r.status === "Approved" ? "bg-green-100 text-green-600" :
                        r.status === "Rejected" ? "bg-red-100 text-red-600" :
                        "bg-yellow-100 text-yellow-600"}
                    `}
                  >
                    {r.status}
                  </span>
                </td>

                <td className="p-3 flex gap-2">

                  <button
                    onClick={() => updateStatus(r.id, "Approved")}
                    className="bg-green-600 hover:bg-green-700 text-white px-3 py-1 rounded text-sm"
                  >
                    Approve
                  </button>

                  <button
                    onClick={() => updateStatus(r.id, "Rejected")}
                    className="bg-red-600 hover:bg-red-700 text-white px-3 py-1 rounded text-sm"
                  >
                    Reject
                  </button>

                </td>

              </tr>
            ))}
          </tbody>
        </table>

      </div>

      {/* MOBILE CARDS */}
      <div className="md:hidden space-y-4">

        {data.map((r) => (
          <div
            key={r.id}
            className="bg-white p-4 rounded-xl shadow space-y-2"
          >

            <p><span className="font-semibold">Title:</span> {r.title}</p>
            <p><span className="font-semibold">Department:</span> {r.department}</p>
            <p><span className="font-semibold">Location:</span> {r.location}</p>

            <p>
              <span className="font-semibold">Status:</span>{" "}
              <span
                className={`px-2 py-1 rounded text-sm
                  ${r.status === "Approved" ? "bg-green-100 text-green-600" :
                    r.status === "Rejected" ? "bg-red-100 text-red-600" :
                    "bg-yellow-100 text-yellow-600"}
                `}
              >
                {r.status}
              </span>
            </p>

            <div className="flex gap-2 pt-2">

              <button
                onClick={() => updateStatus(r.id, "Approved")}
                className="flex-1 bg-green-600 text-white py-1 rounded"
              >
                Approve
              </button>

              <button
                onClick={() => updateStatus(r.id, "Rejected")}
                className="flex-1 bg-red-600 text-white py-1 rounded"
              >
                Reject
              </button>

            </div>

          </div>
        ))}

      </div>

      {/* MODAL */}
      {openJobReqModal && (
        <CreateJobRequisitionModal
          open={openJobReqModal}
          onClose={() => setOpenJobReqModal(false)}
          onCreated={() => {
            loadData();
            setOpenJobReqModal(false);
          }}
        />
      )}

    </div>
  );
}