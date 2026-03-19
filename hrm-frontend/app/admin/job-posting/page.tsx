// "use client";
import { useEffect, useState } from "react";
import api from "@/app/src/services/api";
import toast from "react-hot-toast";

type AdminJobPostingsProps = {
  data: any[];
};

export default function AdminJobPostings({ data }: AdminJobPostingsProps) {
  const [postings, setPostings] = useState<any[]>([]);

  const fetchPostings = async () => {
    try {
      const res = await api.get("/job-postings");
      setPostings(res.data);
    } catch (err) {
      toast.error("Failed to fetch job postings");
    }
  };

  useEffect(() => {
    fetchPostings();
  }, []);

  return (
    <div className="p-4 sm:p-6 lg:p-8 bg-gray-50 min-h-screen">

      {/* HEADER */}
      <h1 className="text-xl sm:text-2xl md:text-3xl font-bold mb-6">
        Job Postings
      </h1>

      {/* TABLE (DESKTOP) */}
      <div className="hidden md:block overflow-x-auto bg-white rounded-xl shadow">
        <table className="table-auto w-full">

          <thead>
            <tr className="bg-gray-100 text-left">
              <th className="p-3">Title</th>
              <th className="p-3">Department</th>
              <th className="p-3">Start Date</th>
              <th className="p-3">End Date</th>
            </tr>
          </thead>

          <tbody>
            {postings.map((p) => (
              <tr key={p.id} className="border-t hover:bg-gray-50">

                <td className="p-3 font-medium">
                  {p.jobRequisition?.title || "N/A"}
                </td>

                <td className="p-3">
                  {p.jobRequisition?.department || "N/A"}
                </td>

                <td className="p-3">
                  {p.postingStartDate
                    ? new Date(p.postingStartDate).toLocaleDateString()
                    : "-"}
                </td>

                <td className="p-3">
                  {p.postingEndDate
                    ? new Date(p.postingEndDate).toLocaleDateString()
                    : "-"}
                </td>

              </tr>
            ))}
          </tbody>

        </table>
      </div>

      {/* CARDS (MOBILE) */}
      <div className="md:hidden space-y-4">

        {postings.map((p) => (
          <div
            key={p.id}
            className="bg-white p-4 rounded-xl shadow space-y-2"
          >

            <p>
              <span className="font-semibold">Title:</span>{" "}
              {p.jobRequisition?.title || "N/A"}
            </p>

            <p>
              <span className="font-semibold">Department:</span>{" "}
              {p.jobRequisition?.department || "N/A"}
            </p>

            <p>
              <span className="font-semibold">Start Date:</span>{" "}
              {p.postingStartDate
                ? new Date(p.postingStartDate).toLocaleDateString()
                : "-"}
            </p>

            <p>
              <span className="font-semibold">End Date:</span>{" "}
              {p.postingEndDate
                ? new Date(p.postingEndDate).toLocaleDateString()
                : "-"}
            </p>

          </div>
        ))}

      </div>

    </div>
  );
}