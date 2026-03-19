// "use client";
import { useEffect, useState } from "react";
import api from "@/app/src/services/api";
import toast from "react-hot-toast";

export default function AdminOfferLetters() {
  const [offers, setOffers] = useState<any[]>([]);

  const fetchOffers = async () => {
    try {
      const res = await api.get("/offer-letters");
      setOffers(res.data);
    } catch {
      toast.error("Failed to fetch offer letters");
    }
  };

  useEffect(() => { fetchOffers(); }, []);

  return (
    <div className="p-4 sm:p-6 lg:p-8 bg-gray-50 min-h-screen">

      {/* HEADER */}
      <h1 className="text-xl sm:text-2xl md:text-3xl font-bold mb-6">
        Offer Letters
      </h1>

      {/* DESKTOP TABLE */}
      <div className="hidden md:block overflow-x-auto bg-white rounded-xl shadow">

        <table className="w-full">
          <thead>
            <tr className="bg-gray-100 text-left">
              <th className="p-3">Candidate</th>
              <th className="p-3">Offer File</th>
              <th className="p-3">Status</th>
            </tr>
          </thead>

          <tbody>
            {offers.map((o) => (
              <tr key={o.id} className="border-t hover:bg-gray-50">

                <td className="p-3 font-medium">
                  {o.candidate?.firstName} {o.candidate?.lastName}
                </td>

                <td className="p-3">
                  <a
                    href={o.offerFileUrl}
                    target="_blank"
                    className="text-blue-600 hover:underline text-sm"
                  >
                    Download
                  </a>
                </td>

                <td className="p-3">
                  <span
                    className={`px-2 py-1 rounded text-sm
                      ${o.status === "Accepted" ? "bg-green-100 text-green-600" :
                        o.status === "Rejected" ? "bg-red-100 text-red-600" :
                        "bg-yellow-100 text-yellow-600"}
                    `}
                  >
                    {o.status}
                  </span>
                </td>

              </tr>
            ))}
          </tbody>
        </table>

      </div>

      {/* MOBILE CARDS */}
      <div className="md:hidden space-y-4">

        {offers.map((o) => (
          <div
            key={o.id}
            className="bg-white p-4 rounded-xl shadow space-y-3"
          >

            <p>
              <span className="font-semibold">Candidate:</span>{" "}
              {o.candidate?.firstName} {o.candidate?.lastName}
            </p>

            <p>
              <span className="font-semibold">Offer File:</span>{" "}
              <a
                href={o.offerFileUrl}
                target="_blank"
                className="text-blue-600 underline text-sm"
              >
                Download
              </a>
            </p>

            <p>
              <span className="font-semibold">Status:</span>{" "}
              <span
                className={`px-2 py-1 rounded text-sm
                  ${o.status === "Accepted" ? "bg-green-100 text-green-600" :
                    o.status === "Rejected" ? "bg-red-100 text-red-600" :
                    "bg-yellow-100 text-yellow-600"}
                `}
              >
                {o.status}
              </span>
            </p>

          </div>
        ))}

      </div>

    </div>
  );
}