
// "use client";

// import api from "@/app/src/services/api";
// import { useEffect, useState } from "react";
// import toast from "react-hot-toast";

// interface ProfileTabProps {
//   employeeId: string;
//   userRole: "admin" | "manager" | "employee";
// }

// export default function ProfileTab({ employeeId, userRole }: ProfileTabProps) {
//   const [profile, setProfile] = useState<any>(null);
//   const [edit, setEdit] = useState(false);

//   const canEdit = userRole === "employee";

//   const loadProfile = async () => {
//     if (!employeeId) return;
//     try {
//       const res = await api.get(`/employees/${employeeId}/profile`);
//       setProfile(res.data);
//     } catch {
//       toast.error("Failed to load profile");
//     }
//   };

//   useEffect(() => {
//     loadProfile();
//   }, [employeeId]);
// const handleUpdate = async () => {
//   if (!canEdit) return;
//   try {
//     const endpoint = userRole === "employee" ? "/employees/me" : `/employees/${employeeId}`;
//     await api.patch(endpoint, profile);
//     toast.success("Profile updated");
//     setEdit(false);
//   } catch {
//     toast.error("Update failed");
//   }
// };
//   if (!profile) return <p>Loading...</p>;

//   return (
//     <div className="space-y-6">

//       {/* Personal Info */}
//       <div className="bg-white p-6 rounded-xl shadow">
//         <h3 className="text-xl font-bold mb-4 border-b pb-2">Personal Info</h3>
//         <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

//           {/* Name */}
//           <div>
//             <label className="block font-medium text-gray-700">Name</label>
//             <input
//               disabled={!edit}
//               value={`${profile.firstName || ""} ${profile.lastName || ""}`}
//               onChange={(e) => {
//                 const [firstName, lastName] = e.target.value.split(" ");
//                 setProfile({ ...profile, firstName, lastName });
//               }}
//               className="border p-2 rounded w-full focus:ring-indigo-500 focus:border-indigo-500"
//               placeholder="Name"
//             />
//           </div>

//           {/* Email */}
//           <div>
//             <label className="block font-medium text-gray-700">Email</label>
//             <input
//               disabled={!edit}
//               value={profile.email || ""}
//               onChange={(e) => setProfile({ ...profile, email: e.target.value })}
//               className="border p-2 rounded w-full focus:ring-indigo-500 focus:border-indigo-500"
//               placeholder="Email"
//             />
//           </div>

//           {/* Phone */}
//           <div>
//             <label className="block font-medium text-gray-700">Phone</label>
//             <input
//               disabled={!edit}
//               value={profile.phone || ""}
//               onChange={(e) => setProfile({ ...profile, phone: e.target.value })}
//               className="border p-2 rounded w-full focus:ring-indigo-500 focus:border-indigo-500"
//               placeholder="Phone"
//             />
//           </div>

//           {/* Gender */}
//           <div>
//             <label className="block font-medium text-gray-700">Gender</label>
//             <input
//               disabled={!edit}
//               value={profile.gender || ""}
//               onChange={(e) => setProfile({ ...profile, gender: e.target.value })}
//               className="border p-2 rounded w-full focus:ring-indigo-500 focus:border-indigo-500"
//               placeholder="Gender"
//             />
//           </div>

//           {/* Date of Birth */}
//           <div>
//             <label className="block font-medium text-gray-700">Date of Birth</label>
//             <input
//               disabled={!edit}
//               type="date"
//               value={profile.dateOfBirth?.split("T")[0] || ""}
//               onChange={(e) => setProfile({ ...profile, dateOfBirth: e.target.value })}
//               className="border p-2 rounded w-full focus:ring-indigo-500 focus:border-indigo-500"
//               placeholder="Date of Birth"
//             />
//           </div>

//           {/* Address */}
//           <div className="md:col-span-2">
//             <label className="block font-medium text-gray-700">Address</label>
//             <input
//               disabled={!edit}
//               value={profile.address || ""}
//               onChange={(e) => setProfile({ ...profile, address: e.target.value })}
//               className="border p-2 rounded w-full focus:ring-indigo-500 focus:border-indigo-500"
//               placeholder="Address"
//             />
//           </div>
//         </div>
//       </div>

//       {/* Work Info */}
//       <div className="bg-white p-6 rounded-xl shadow">
//         <h3 className="text-xl font-bold mb-4 border-b pb-2">Work Info</h3>
//         <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//           {/* Department */}
//           <div>
//             <label className="block font-medium text-gray-700">Department</label>
//             <input
//               disabled
//               value={profile.department?.name || ""}
//               className="border p-2 rounded w-full bg-gray-100"
//               placeholder="Department"
//             />
//           </div>

//           {/* Designation */}
//           <div>
//             <label className="block font-medium text-gray-700">Designation</label>
//             <input
//               disabled
//               value={profile.designation?.title || ""}
//               className="border p-2 rounded w-full bg-gray-100"
//               placeholder="Designation"
//             />
//           </div>

//           {/* Joining Date */}
//           <div>
//             <label className="block font-medium text-gray-700">Joining Date</label>
//             <input
//               disabled={!edit}
//               type="date"
//               value={profile.joiningDate?.split("T")[0] || ""}
//               onChange={(e) => setProfile({ ...profile, joiningDate: e.target.value })}
//               className="border p-2 rounded w-full focus:ring-indigo-500 focus:border-indigo-500"
//             />
//           </div>

         
//         </div>
//       </div>

//       {/* Edit / Save Buttons */}
//       {canEdit && (
//         <div className="flex justify-end gap-3">
//           {!edit ? (
//             <button
//               onClick={() => setEdit(true)}
//               className="bg-indigo-600 text-white px-6 py-2 rounded shadow hover:bg-indigo-700 transition"
//             >
//               Edit
//             </button>
//           ) : (
//             <button
//               onClick={handleUpdate}
//               className="bg-green-600 text-white px-6 py-2 rounded shadow hover:bg-green-700 transition"
//             >
//               Save
//             </button>
//           )}
//         </div>
//       )}
//     </div>
//   );
// }


"use client";

import api from "@/app/src/services/api";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";

interface ProfileTabProps {
  employeeId: string;
  userRole: "admin" | "manager" | "employee";
}

export default function ProfileTab({ employeeId, userRole }: ProfileTabProps) {
  const [profile, setProfile] = useState<any>(null);
  const [edit, setEdit] = useState(false);

  const canEdit = userRole === "employee";

  const loadProfile = async () => {
    if (!employeeId) return;
    try {
      const res = await api.get(`/employees/${employeeId}/profile`);
      setProfile(res.data);
    } catch {
      toast.error("Failed to load profile");
    }
  };

  useEffect(() => {
    loadProfile();
  }, [employeeId]);

  const handleUpdate = async () => {
    if (!canEdit) return;
    try {
      const endpoint =
        userRole === "employee"
          ? "/employees/me"
          : `/employees/${employeeId}`;
      await api.patch(endpoint, profile);
      toast.success("Profile updated");
      setEdit(false);
    } catch {
      toast.error("Update failed");
    }
  };

  if (!profile) return <p className="p-4">Loading...</p>;

  return (
    <div className="space-y-6">

      {/* 🔹 Personal Info */}
      <div className="bg-white/80 backdrop-blur-lg p-4 sm:p-6 rounded-2xl shadow-md hover:shadow-lg transition">
        <h3 className="text-lg sm:text-xl font-bold mb-4 border-b pb-2 text-gray-800">
          Personal Info
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">

          {/* Name */}
          <div>
            <label className="block text-sm font-medium text-gray-600 mb-1">
              Name
            </label>
            <input
              disabled={!edit}
              value={`${profile.firstName || ""} ${profile.lastName || ""}`}
              onChange={(e) => {
                const [firstName, lastName] = e.target.value.split(" ");
                setProfile({ ...profile, firstName, lastName });
              }}
              className="w-full border border-gray-200 p-2.5 rounded-lg text-sm
              focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500
              transition disabled:bg-gray-100"
              placeholder="Name"
            />
          </div>

          {/* Email */}
          <div>
            <label className="block text-sm font-medium text-gray-600 mb-1">
              Email
            </label>
            <input
              disabled={!edit}
              value={profile.email || ""}
              onChange={(e) =>
                setProfile({ ...profile, email: e.target.value })
              }
              className="w-full border border-gray-200 p-2.5 rounded-lg text-sm
              focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500
              transition disabled:bg-gray-100"
              placeholder="Email"
            />
          </div>

          {/* Phone */}
          <div>
            <label className="block text-sm font-medium text-gray-600 mb-1">
              Phone
            </label>
            <input
              disabled={!edit}
              value={profile.phone || ""}
              onChange={(e) =>
                setProfile({ ...profile, phone: e.target.value })
              }
              className="w-full border border-gray-200 p-2.5 rounded-lg text-sm
              focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500
              transition disabled:bg-gray-100"
              placeholder="Phone"
            />
          </div>

          {/* Gender */}
          <div>
            <label className="block text-sm font-medium text-gray-600 mb-1">
              Gender
            </label>
            <input
              disabled={!edit}
              value={profile.gender || ""}
              onChange={(e) =>
                setProfile({ ...profile, gender: e.target.value })
              }
              className="w-full border border-gray-200 p-2.5 rounded-lg text-sm
              focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500
              transition disabled:bg-gray-100"
              placeholder="Gender"
            />
          </div>

          {/* DOB */}
          <div>
            <label className="block text-sm font-medium text-gray-600 mb-1">
              Date of Birth
            </label>
            <input
              disabled={!edit}
              type="date"
              value={profile.dateOfBirth?.split("T")[0] || ""}
              onChange={(e) =>
                setProfile({ ...profile, dateOfBirth: e.target.value })
              }
              className="w-full border border-gray-200 p-2.5 rounded-lg text-sm
              focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500
              transition disabled:bg-gray-100"
            />
          </div>

          {/* Address */}
          <div className="sm:col-span-2">
            <label className="block text-sm font-medium text-gray-600 mb-1">
              Address
            </label>
            <input
              disabled={!edit}
              value={profile.address || ""}
              onChange={(e) =>
                setProfile({ ...profile, address: e.target.value })
              }
              className="w-full border border-gray-200 p-2.5 rounded-lg text-sm
              focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500
              transition disabled:bg-gray-100"
              placeholder="Address"
            />
          </div>
        </div>
      </div>

      {/* 🔹 Work Info */}
      <div className="bg-white/80 backdrop-blur-lg p-4 sm:p-6 rounded-2xl shadow-md hover:shadow-lg transition">
        <h3 className="text-lg sm:text-xl font-bold mb-4 border-b pb-2 text-gray-800">
          Work Info
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">

          {/* Department */}
          <div>
            <label className="block text-sm font-medium text-gray-600 mb-1">
              Department
            </label>
            <input
              disabled
              value={profile.department?.name || ""}
              className="w-full border p-2.5 rounded-lg text-sm bg-gray-100"
            />
          </div>

          {/* Designation */}
          <div>
            <label className="block text-sm font-medium text-gray-600 mb-1">
              Designation
            </label>
            <input
              disabled
              value={profile.designation?.title || ""}
              className="w-full border p-2.5 rounded-lg text-sm bg-gray-100"
            />
          </div>

          {/* Joining Date */}
          <div>
            <label className="block text-sm font-medium text-gray-600 mb-1">
              Joining Date
            </label>
            <input
              disabled={!edit}
              type="date"
              value={profile.joiningDate?.split("T")[0] || ""}
              onChange={(e) =>
                setProfile({ ...profile, joiningDate: e.target.value })
              }
              className="w-full border border-gray-200 p-2.5 rounded-lg text-sm
              focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500
              transition disabled:bg-gray-100"
            />
          </div>

        </div>
      </div>

      {/* 🔹 Buttons */}
      {canEdit && (
        <div className="flex flex-col sm:flex-row justify-end gap-3">
          {!edit ? (
            <button
              onClick={() => setEdit(true)}
              className="w-full sm:w-auto bg-indigo-600 text-white px-6 py-2.5 rounded-xl
              shadow hover:bg-indigo-700 hover:scale-105 active:scale-95 transition"
            >
              Edit
            </button>
          ) : (
            <button
              onClick={handleUpdate}
              className="w-full sm:w-auto bg-green-600 text-white px-6 py-2.5 rounded-xl
              shadow hover:bg-green-700 hover:scale-105 active:scale-95 transition"
            >
              Save
            </button>
          )}
        </div>
      )}

    </div>
  );
}