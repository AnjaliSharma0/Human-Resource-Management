// "use client";
// import { useEffect, useState } from "react";
// import api from "@/app/src/services/api";
// import toast from "react-hot-toast";

// export default function EmployeeOffers() {
//   const [offers, setOffers] = useState<any[]>([]);

//   const fetchOffers = async () => {
//     try {
//       const res = await api.get("/offer-letters"); // filtered by employeeId
//       setOffers(res.data);
//     } catch {
//       toast.error("Failed to fetch offers");
//     }
//   };

//   useEffect(() => { fetchOffers(); }, []);

//   return (
//     <div className="p-4">
//       <h1 className="text-2xl font-bold mb-4">My Offer Letters</h1>
//       <table className="table-auto w-full bg-white shadow rounded">
//         <thead>
//           <tr className="bg-gray-200">
//             <th className="p-2">Job</th>
//             <th className="p-2">Offer File</th>
//             <th className="p-2">Status</th>
//           </tr>
//         </thead>
//         <tbody>
//           {offers.map(o => (
//             <tr key={o.id} className="border-b">
//               <td className="p-2">{o.candidate.appliedFor.title}</td>
//               <td className="p-2">
//                 <a href={o.offerFileUrl} target="_blank" className="text-blue-500 underline">Download</a>
//               </td>
//               <td className="p-2">{o.status}</td>
//             </tr>
//           ))}
//         </tbody>
//       </table>
//     </div>
//   );
// }

"use client";
import { useEffect, useState } from "react";
import api from "@/app/src/services/api";
import toast from "react-hot-toast";

export default function AdminOfferLetters() {
  const [offers, setOffers] = useState<any[]>([]);
  const [candidates, setCandidates] = useState<any[]>([]);
  const [selectedCandidate, setSelectedCandidate] = useState("");
  const [file, setFile] = useState<File | null>(null);

  // Fetch existing offer letters
  const fetchOffers = async () => {
    try {
      const res = await api.get("/offer-letters");
      setOffers(res.data);
    } catch {
      toast.error("Failed to fetch offer letters");
    }
  };

  // Fetch candidates who can receive offer letters
  const fetchCandidates = async () => {
    try {
      const res = await api.get("/job-applications?status=selected");
      setCandidates(res.data);
    } catch {
      toast.error("Failed to fetch candidates");
    }
  };

  // Handle file upload
  const uploadOffer = async () => {
    if (!selectedCandidate || !file) {
      toast.error("Please select candidate and file");
      return;
    }

    try {
      const formData = new FormData();
      formData.append("candidateId", selectedCandidate);
      formData.append("file", file);

      await api.post("/offer-letters", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      toast.success("Offer letter uploaded!");
      setFile(null);
      setSelectedCandidate("");
      fetchOffers();
    } catch {
      toast.error("Failed to upload offer letter");
    }
  };

  useEffect(() => {
    fetchOffers();
    fetchCandidates();
  }, []);

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">Offer Letters</h1>

      {/* Upload Form */}
      <div className="mb-6 p-4 bg-gray-50 rounded shadow">
        <h2 className="font-semibold mb-2">Upload Offer Letter</h2>
        <div className="flex flex-col gap-2">
          <select
            className="p-2 border rounded"
            value={selectedCandidate}
            onChange={e => setSelectedCandidate(e.target.value)}
          >
            <option value="">Select Candidate</option>
            {candidates.map(c => (
              <option key={c.id} value={c.id}>
                {c.firstName} {c.lastName}
              </option>
            ))}
          </select>

          <input
            type="file"
            className="p-2 border rounded"
            onChange={e => e.target.files && setFile(e.target.files[0])}
          />

          <button
            className="p-2 bg-blue-600 text-white rounded"
            onClick={uploadOffer}
          >
            Upload Offer
          </button>
        </div>
      </div>

      {/* Offer Letters Table */}
      <table className="table-auto w-full bg-white shadow rounded">
        <thead>
          <tr className="bg-gray-200">
            <th className="p-2">Candidate</th>
            <th className="p-2">Offer File</th>
            <th className="p-2">Status</th>
          </tr>
        </thead>
        <tbody>
          {offers.map(o => (
            <tr key={o.id} className="border-b">
              <td className="p-2">{o.candidate.firstName} {o.candidate.lastName}</td>
              <td className="p-2">
                <a href={o.offerFileUrl} target="_blank" className="text-blue-500 underline">
                  Download
                </a>
              </td>
              <td className="p-2">{o.status}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}