// "use client"
// import { useEffect } from "react";
// import { useRouter } from "next/navigation";

// import PeopleIcon from "@mui/icons-material/People";
// import AccessTimeIcon from "@mui/icons-material/AccessTime";
// import EventNoteIcon from "@mui/icons-material/EventNote";
// import PaidIcon from "@mui/icons-material/Paid";
// import { getToken } from "./utils/auth";
// import DashboardLayout from "./components/layout/DashboardLayout";


// export default function Home() {
//   const router = useRouter();

//   useEffect(() => {
//     if (!getToken()) router.push("/"); // redirect to landing if not logged in
//   }, [router]);

//   const stats = [
//     { title: "Employees", value: 120, icon: <PeopleIcon className="text-white" />, color: "bg-blue-500" },
//     { title: "Attendance Today", value: 95, icon: <AccessTimeIcon className="text-white" />, color: "bg-green-500" },
//     { title: "Leaves Pending", value: 8, icon: <EventNoteIcon className="text-white" />, color: "bg-yellow-500" },
//     { title: "Payroll Processed", value: 110, icon: <PaidIcon className="text-white" />, color: "bg-purple-500" },
//   ];

//   return (
//     <DashboardLayout>

//       <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mt-6">
//         {stats.map((stat) => (
//           <div key={stat.title} className={`flex items-center justify-between p-6 rounded-2xl shadow-lg transform hover:scale-105 transition-all duration-300 ${stat.color}`}>
//             <div>
//               <p className="text-white text-sm font-medium">{stat.title}</p>
//               <p className="text-white text-2xl font-bold mt-1">{stat.value}</p>
//             </div>
//             <div className="p-3 rounded-full bg-white/20">{stat.icon}</div>
//           </div>
//         ))}
//       </div>
//     </DashboardLayout>
//   );
// }

"use client";

import { useRouter } from "next/navigation";
import InfoIcon from "@mui/icons-material/Info";

import { getToken } from "./utils/auth";
import DashboardLayout from "./components/layout/DashboardLayout";

import { Card, Typography, Box, Divider } from "@mui/material";

export default function Home() {

 

  return (
    <DashboardLayout>
      <Box className="p-6">
        {/* Welcome Header */}
        <Box className="mb-6 bg-white rounded-2xl shadow-lg p-6">
          <Typography variant="h4" fontWeight="bold" className="text-gray-800">
            Welcome to HRMS Dashboard
          </Typography>
          <Typography variant="body1" className="text-gray-600 mt-2 flex items-center gap-2">
            <InfoIcon fontSize="small" className="text-blue-500" />
            This platform helps you manage employees, attendance, leaves, and payroll efficiently.
          </Typography>
        </Box>

        {/* Explanation / Quick Links */}
        <Box className="mt-8 grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card className="p-6 rounded-2xl shadow-lg hover:shadow-xl transition-shadow duration-300">
            <Typography variant="h6" fontWeight="bold" className="text-gray-800 mb-2">
              Employee Management
            </Typography>
            <Divider className="mb-2" />
            <Typography variant="body2" className="text-gray-600">
              Create, view, and update employee profiles including personal, job, and contact details. Track employment history and maintain documents securely.
            </Typography>
          </Card>

          <Card className="p-6 rounded-2xl shadow-lg hover:shadow-xl transition-shadow duration-300">
            <Typography variant="h6" fontWeight="bold" className="text-gray-800 mb-2">
              Attendance & Leave
            </Typography>
            <Divider className="mb-2" />
            <Typography variant="body2" className="text-gray-600">
              Monitor attendance, clock-in/out times, approve or reject leaves, and generate reports to keep your workforce on track.
            </Typography>
          </Card>

          <Card className="p-6 rounded-2xl shadow-lg hover:shadow-xl transition-shadow duration-300">
            <Typography variant="h6" fontWeight="bold" className="text-gray-800 mb-2">
              Payroll
            </Typography>
            <Divider className="mb-2" />
            <Typography variant="body2" className="text-gray-600">
              Process salaries, generate pay slips, and manage deductions & bonuses in a streamlined and secure way.
            </Typography>
          </Card>

          <Card className="p-6 rounded-2xl shadow-lg hover:shadow-xl transition-shadow duration-300">
            <Typography variant="h6" fontWeight="bold" className="text-gray-800 mb-2">
              Reports & Analytics
            </Typography>
            <Divider className="mb-2" />
            <Typography variant="body2" className="text-gray-600">
              Get insights about workforce trends, attendance, leave patterns, and payroll summary to make data-driven decisions.
            </Typography>
          </Card>
        </Box>
      </Box>
    </DashboardLayout>
  );
}