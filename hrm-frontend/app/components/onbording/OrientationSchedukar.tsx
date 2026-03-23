// "use client";

// import { useEffect, useState } from "react";
// import api from "@/app/src/services/api";
// import RoleGuard from "@/app/src/hook/rolegaurd";


// export default function OrientationScheduler() {
//   const [list, setList] = useState([]);

//   const fetchData = async () => {
//     const res = await api.get("/orientation");
//     setList(res.data);
//   };

//   useEffect(() => {
//     fetchData();
//   }, []);

//   const createOrientation = async () => {
//     await api.post("/orientation", {
//       date: new Date(),
//       trainer: "HR Team",
//       meetingLink: "Zoom Link",
//     });
//     fetchData();
//   };

//   return (
//     <div>
//       <RoleGuard allowed={["admin"]}>
//         <button className="mb-4 bg-blue-500 text-white px-4 py-2 rounded">
//           Schedule
//         </button>
//       </RoleGuard>

//       <div className="grid gap-3 md:grid-cols-2">
//         {list.map((o: any) => (
//           <div key={o.id} className="p-3 border rounded">
//             <p className="font-medium">{o.trainer}</p>
//             <p className="text-sm">{new Date(o.date).toDateString()}</p>
//           </div>
//         ))}
//       </div>
//     </div>
//   );
// }

"use client";

import { useEffect, useState } from "react";
import api from "@/app/src/services/api";
import RoleGuard from "@/app/src/hook/rolegaurd";
import toast from "react-hot-toast";

export default function OrientationScheduler() {
  const [list, setList] = useState<any[]>([]);
  const [date, setDate] = useState("");
  const [trainer, setTrainer] = useState("");
  const [meetingLink, setMeetingLink] = useState("");

  const fetchData = async () => {
    try {
      const res = await api.get("/orientation");
      setList(res.data);
    } catch {
      toast.error("Failed to fetch orientations");
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const createOrientation = async () => {
    if (!date || !trainer || !meetingLink) {
      toast.error("Please fill all fields");
      return;
    }
   
    try {
      await api.post("/orientation", { date, trainer, meetingLink });
      toast.success("Orientation scheduled!");
      setDate("");
      setTrainer("");
      setMeetingLink("");
      fetchData();
    } catch {
      toast.error("Failed to schedule");
    }
  };

  return (
    <div className="space-y-6">
      {/* Admin Form */}
      <RoleGuard allowed={["admin"]}>
        <div className="p-4 border rounded space-y-3">
          <h3 className="font-semibold">Schedule New Orientation</h3>
          <input
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            className="border px-2 py-1 rounded w-full"
          />
          <input
            type="text"
            placeholder="Trainer Name"
            value={trainer}
            onChange={(e) => setTrainer(e.target.value)}
            className="border px-2 py-1 rounded w-full"
          />
          <input
            type="text"
            placeholder="Meeting Link"
            value={meetingLink}
            onChange={(e) => setMeetingLink(e.target.value)}
            className="border px-2 py-1 rounded w-full"
          />
          <button
            onClick={createOrientation}
            className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition"
          >
            Schedule Orientation
          </button>
        </div>
      </RoleGuard>

      {/* Orientation List */}
      <div className="grid gap-4 md:grid-cols-2">
        {list.map((o) => (
          <div
            key={o.id}
            className="p-4 border rounded flex flex-col justify-between hover:shadow-md transition bg-white shadow-lg"
          >
            <div>
              <p className="font-semibold text-gray-800">Trainer: {o.trainer}</p>
              <p className="text-gray-500">Date: {new Date(o.date).toLocaleDateString()}</p>
              <p className="text-blue-600">
                <a href={o.meetingLink} target="_blank" rel="noreferrer"  className="mt-2 bg-green-500 text-white px-3 py-1 rounded hover:bg-green-600 transition">
                  Join Meeting
                </a>
              </p>
            </div>

            {/* Optional: Employee can mark attendance */}
            <RoleGuard allowed={["employee"]}>
              {/* <button
                onClick={() => toast.success("Marked as attended")}
                className="mt-2 bg-green-500 text-white px-3 py-1 rounded hover:bg-green-600 transition"
              >
                Mark Attendance
              </button> */}
            </RoleGuard>
          </div>
        ))}
      </div>
    </div>
  );
}