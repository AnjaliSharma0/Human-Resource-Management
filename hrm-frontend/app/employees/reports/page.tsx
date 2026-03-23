// "use client";

// import { useEffect, useState } from "react";
// import api from "@/app/src/services/api";
// import toast from "react-hot-toast";
// import Loading from "@/app/components/Loading";

// type Attendance = { date?: string; status?: string; totalHours?: number; overtimeHours?: number };
// type Leave = { fromDate?: string; toDate?: string; type?: string; status?: string };
// type Payroll = { month?: string; salary?: number; deductions?: number; netSalary?: number; status?: string };

// export default function EmployeeReports() {
//     const [attendance, setAttendance] = useState<Attendance[]>([]);
//     const [leaves, setLeaves] = useState<Leave[]>([]);
//     const [payroll, setPayroll] = useState<Payroll[]>([]);
//     const [loading, setLoading] = useState(true);

//     useEffect(() => {
//         fetchReports();
//     }, []);

//     const formatDate = (date?: string | Date) => {
//         if (!date) return "-";
//         const d = new Date(date);
//         return isNaN(d.getTime()) ? "-" : d.toLocaleDateString();
//     };

//     const fetchReports = async () => {
//         try {
//             const [attRes, leaveRes, payRes] = await Promise.all([
//                 api.get("/reports/attendance"),
//                 api.get("/reports/leave"),
//                 api.get("/reports/payroll"),
//             ]);

//             const normalizedLeaves = (leaveRes.data || []).map((l: any) => ({
//                 id: l.id, // optional, good for key
//                 fromDate: l.fromDate || l.startDate,
//                 toDate: l.toDate || l.endDate,
//                 type: l.type || l.leaveType?.name || "-",
//                 status: l.status,
//             }));
//             console.log("Leave API response:", leaveRes.data)
//             setAttendance(attRes.data || []);
//             setLeaves(normalizedLeaves)
//             setPayroll(payRes.data || []);
//         } catch (err) {
//             console.error(err);
//             toast.error("Failed to fetch reports");
//         } finally {
//             setLoading(false);
//         }
//     };


//     if (loading) return <Loading message="Loading..." size="lg"/>

//     return (
//         <div className="p-6 space-y-8">
//             <h1 className="text-2xl font-bold">My Reports</h1>

//             {/* Attendance */}
//             <div className="bg-white shadow rounded-2xl p-4">
//                 <h2 className="text-xl font-semibold mb-3">Attendance</h2>
//                 <table className="w-full text-sm">
//                     <thead>
//                         <tr className="text-left border-b">
//                             <th>Date</th>
//                             <th>Status</th>
//                             <th>Total Hours</th>
//                             <th>Overtime</th>
//                         </tr>
//                     </thead>
//                     <tbody>
//                         {attendance.length ? (
//                             attendance.map((a, i) => (
//                                 <tr key={i} className="border-b">
//                                     <td>{formatDate(a.date)}</td>
//                                     <td>{a.status || "-"}</td>
//                                     <td>{a.totalHours ?? 0}</td>
//                                     <td>{a.overtimeHours ?? 0}</td>
//                                 </tr>
//                             ))
//                         ) : (
//                             <tr>
//                                 <td colSpan={4} className="text-center py-2">
//                                     No attendance data
//                                 </td>
//                             </tr>
//                         )}
//                     </tbody>
//                 </table>
//             </div>

//             {/* Leave */}
//             <div className="bg-white shadow rounded-2xl p-4">
//                 <h2 className="text-xl font-semibold mb-3">Leave</h2>
//                 <table className="w-full text-sm">
//                     <thead>
//                         <tr className="text-left border-b">
//                             <th>From</th>
//                             <th>To</th>
//                             <th>Type</th>
//                             <th>Status</th>
//                         </tr>
//                     </thead>
//                     <tbody>
//                         {leaves.length ? (
//                             leaves.map((l, i) => (
//                                 <tr key={i} className="border-b">
//                                     <td>{formatDate(l.fromDate)}</td>
//                                     <td>{formatDate(l.toDate)}</td>
//                                     <td>{l.type}</td>
//                                     <td>{l.status}</td>
//                                     </tr>
                                
//                             ))
//                         ) : (
//                             <tr>
//                                 <td colSpan={4} className="text-center py-2">
//                                     No leave data
//                                 </td>
//                             </tr>
//                         )}
//                     </tbody>
//                 </table>
//             </div>

//             {/* Payroll */}
//             <div className="bg-white shadow rounded-2xl p-4">
//                 <h2 className="text-xl font-semibold mb-3">Payroll</h2>
//                 <table className="w-full text-sm">
//                     <thead>
//                         <tr className="text-left border-b">
//                             <th>Month</th>
//                             <th>Salary</th>
//                             <th>Deductions</th>
//                             <th>Net Salary</th>
//                             <th>Status</th>
//                         </tr>
//                     </thead>
//                     <tbody>
//                         {payroll.length ? (
//                             payroll.map((p, i) => (
//                                 <tr key={i} className="border-b">
//                                     <td>{p.month}</td>
//                                     <td>₹{p.salary ?? 0}</td>
//                                     <td>₹{p.deductions ?? 0}</td>
//                                     <td className="text-green-600 font-semibold">₹{p.netSalary ?? 0}</td>
//                                     <td>{p.status || "-"}</td>
//                                 </tr>
//                             ))
//                         ) : (
//                             <tr>
//                                 <td colSpan={5} className="text-center py-2">
//                                     No payroll data
//                                 </td>
//                             </tr>
//                         )}
//                     </tbody>
//                 </table>
//             </div>
//         </div>
//     );
// }


"use client";

import { useEffect, useState } from "react";
import api from "@/app/src/services/api";
import toast from "react-hot-toast";
import Loading from "@/app/components/Loading";

import { ResponsiveContainer, LineChart, Line, XAxis, YAxis, Tooltip, BarChart, Bar, PieChart, Pie, Cell, Legend } from "recharts";

type Attendance = { date?: string; status?: string; totalHours?: number; overtimeHours?: number };
type Leave = { fromDate?: string; toDate?: string; type?: string; status?: string };
type Payroll = { month?: string; salary?: number; deductions?: number; netSalary?: number; status?: string };

const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042"];

export default function EmployeeReports() {
    const [attendance, setAttendance] = useState<Attendance[]>([]);
    const [leaves, setLeaves] = useState<Leave[]>([]);
    const [payroll, setPayroll] = useState<Payroll[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchReports();
    }, []);

    const formatDate = (date?: string | Date) => {
        if (!date) return "-";
        const d = new Date(date);
        return isNaN(d.getTime()) ? "-" : d.toLocaleDateString();
    };

    const fetchReports = async () => {
        try {
            const [attRes, leaveRes, payRes] = await Promise.all([
                api.get("/reports/attendance"),
                api.get("/reports/leave"),
                api.get("/reports/payroll"),
            ]);

            const normalizedLeaves = (leaveRes.data || []).map((l: any) => ({
                
                id: l.id,
                fromDate: l.fromDate || l.startDate,
                toDate: l.toDate || l.endDate,
                type: l.type || l.leaveType?.name || "-",
                status: l.status,
            }));

            setAttendance(attRes.data || []);
            setLeaves(normalizedLeaves);
            setPayroll(payRes.data || []);
        } catch (err) {
            console.error(err);
            toast.error("Failed to fetch reports");
        } finally {
            setLoading(false);
        }
    };
            const formatStatus = (a: Attendance) => {
            if (a.totalHours === 0) return "Absent";
            return a.status || "-";
            };
                if (loading) return <Loading message="Loading..." size="lg"/>;

    // Analytics data
    const attendanceChartData = attendance.map(a => ({ date: formatDate(a.date), hours: a.totalHours || 0 }));
    const leaveTypeCount: Record<string, number> = {};
    leaves.forEach(l => { leaveTypeCount[l.type || "Unknown"] = (leaveTypeCount[l.type || "Unknown"] || 0) + 1 });
    const leaveChartData = Object.keys(leaveTypeCount).map(key => ({ name: key, value: leaveTypeCount[key] }));

    const payrollChartData = payroll.map(p => ({ month: p.month || "-", netSalary: p.netSalary || 0 }));

    return (
        <div className="p-6 space-y-12">

            <h1 className="text-3xl font-bold text-center">📊 My Reports</h1>

            {/* Attendance */}
            <div className="bg-white shadow rounded-2xl p-6 space-y-4">
                <h2 className="text-xl font-semibold">Attendance</h2>
                <table className="w-full text-sm border-collapse">
                    <thead>
                        <tr className="border-b text-left">
                            <th>Date</th>
                            <th>Status</th>
                            <th>Total Hours</th>
                            <th>Overtime</th>
                        </tr>
                    </thead>
                    <tbody>
                        {attendance.length ? attendance.map((a, i) => (
                            <tr key={i} className="border-b">
                                <td>{formatDate(a.date)}</td>
                                <td>{formatStatus(a)}</td>
                                <td>{a.totalHours ?? 0}</td>
                                <td>{a.overtimeHours ?? 0}</td>
                            </tr>
                        )) : <tr><td colSpan={4} className="text-center py-2">No attendance data</td></tr>}
                    </tbody>
                </table>

                {/* Attendance Chart */}
                {attendance.length > 0 && (
                    <ResponsiveContainer width="100%" height={250}>
                        <LineChart data={attendanceChartData}>
                            <XAxis dataKey="date"/>
                            <YAxis/>
                            <Tooltip/>
                            <Line type="monotone" dataKey="hours" stroke="#8884d8" strokeWidth={2}/>
                        </LineChart>
                    </ResponsiveContainer>
                )}
            </div>

            {/* Leave */}
            <div className="bg-white shadow rounded-2xl p-6 space-y-4">
                <h2 className="text-xl font-semibold">Leave</h2>
                <table className="w-full text-sm border-collapse">
                    <thead>
                        <tr className="border-b text-left">
                            <th>From</th>
                            <th>To</th>
                            <th>Type</th>
                            <th>Status</th>
                        </tr>
                    </thead>
                    <tbody>
                        {leaves.length ? leaves.map((l, i) => (
                            <tr key={i} className="border-b">
                                <td>{formatDate(l.fromDate)}</td>
                                <td>{formatDate(l.toDate)}</td>
                                <td>{l.type}</td>
                                <td>{l.status}</td>
                            </tr>
                        )) : <tr><td colSpan={4} className="text-center py-2">No leave data</td></tr>}
                    </tbody>
                </table>

                {/* Leave Chart */}
                {leaves.length > 0 && (
                    <ResponsiveContainer width="100%" height={250}>
                        <PieChart>
                            <Pie
                                data={leaveChartData}
                                dataKey="value"
                                nameKey="name"
                                cx="50%"
                                cy="50%"
                                outerRadius={80}
                                label
                            >
                                {leaveChartData.map((entry, index) => (
                                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]}/>
                                ))}
                            </Pie>
                            <Legend />
                            <Tooltip/>
                        </PieChart>
                    </ResponsiveContainer>
                )}
            </div>

            {/* Payroll */}
            <div className="bg-white shadow rounded-2xl p-6 space-y-4">
                <h2 className="text-xl font-semibold">Payroll</h2>
                <table className="w-full text-sm border-collapse">
                    <thead>
                        <tr className="border-b text-left">
                            <th>Month</th>
                            <th>Salary</th>
                            <th>Deductions</th>
                            <th>Net Salary</th>
                            <th>Status</th>
                        </tr>
                    </thead>
                    <tbody>
                        {payroll.length ? payroll.map((p, i) => (
                            <tr key={i} className="border-b">
                                <td>{p.month}</td>
                                <td>₹{p.salary ?? 0}</td>
                                <td>₹{p.deductions ?? 0}</td>
                                <td className="text-green-600 font-semibold">₹{p.netSalary ?? 0}</td>
                                <td>{p.status || "-"}</td>
                            </tr>
                        )) : <tr><td colSpan={5} className="text-center py-2">No payroll data</td></tr>}
                    </tbody>
                </table>

                {/* Payroll Chart */}
                {payroll.length > 0 && (
                    <ResponsiveContainer width="100%" height={250}>
                        <BarChart data={payrollChartData}>
                            <XAxis dataKey="month"/>
                            <YAxis/>
                            <Tooltip/>
                            <Bar dataKey="netSalary" fill="#82ca9d" />
                        </BarChart>
                    </ResponsiveContainer>
                )}
            </div>
        </div>
    );
}