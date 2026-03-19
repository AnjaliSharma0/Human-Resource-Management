"use client";

import { useEffect, useState } from "react";
import api from "@/app/src/services/api";
import toast from "react-hot-toast";
import Loading from "@/app/components/Loading";

type Attendance = { date?: string; status?: string; totalHours?: number; overtimeHours?: number };
type Leave = { fromDate?: string; toDate?: string; type?: string; status?: string };
type Payroll = { month?: string; salary?: number; deductions?: number; netSalary?: number; status?: string };

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
                id: l.id, // optional, good for key
                fromDate: l.fromDate || l.startDate,
                toDate: l.toDate || l.endDate,
                type: l.type || l.leaveType?.name || "-",
                status: l.status,
            }));
            console.log("Leave API response:", leaveRes.data)
            setAttendance(attRes.data || []);
            setLeaves(normalizedLeaves)
            setPayroll(payRes.data || []);
        } catch (err) {
            console.error(err);
            toast.error("Failed to fetch reports");
        } finally {
            setLoading(false);
        }
    };


    if (loading) return <Loading message="Loading..." size="lg"/>

    return (
        <div className="p-6 space-y-8">
            <h1 className="text-2xl font-bold">My Reports</h1>

            {/* Attendance */}
            <div className="bg-white shadow rounded-2xl p-4">
                <h2 className="text-xl font-semibold mb-3">Attendance</h2>
                <table className="w-full text-sm">
                    <thead>
                        <tr className="text-left border-b">
                            <th>Date</th>
                            <th>Status</th>
                            <th>Total Hours</th>
                            <th>Overtime</th>
                        </tr>
                    </thead>
                    <tbody>
                        {attendance.length ? (
                            attendance.map((a, i) => (
                                <tr key={i} className="border-b">
                                    <td>{formatDate(a.date)}</td>
                                    <td>{a.status || "-"}</td>
                                    <td>{a.totalHours ?? 0}</td>
                                    <td>{a.overtimeHours ?? 0}</td>
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td colSpan={4} className="text-center py-2">
                                    No attendance data
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>

            {/* Leave */}
            <div className="bg-white shadow rounded-2xl p-4">
                <h2 className="text-xl font-semibold mb-3">Leave</h2>
                <table className="w-full text-sm">
                    <thead>
                        <tr className="text-left border-b">
                            <th>From</th>
                            <th>To</th>
                            <th>Type</th>
                            <th>Status</th>
                        </tr>
                    </thead>
                    <tbody>
                        {leaves.length ? (
                            leaves.map((l, i) => (
                                <tr key={i} className="border-b">
                                    <td>{formatDate(l.fromDate)}</td>
                                    <td>{formatDate(l.toDate)}</td>
                                    <td>{l.type}</td>
                                    <td>{l.status}</td>
                                    </tr>
                                
                            ))
                        ) : (
                            <tr>
                                <td colSpan={4} className="text-center py-2">
                                    No leave data
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>

            {/* Payroll */}
            <div className="bg-white shadow rounded-2xl p-4">
                <h2 className="text-xl font-semibold mb-3">Payroll</h2>
                <table className="w-full text-sm">
                    <thead>
                        <tr className="text-left border-b">
                            <th>Month</th>
                            <th>Salary</th>
                            <th>Deductions</th>
                            <th>Net Salary</th>
                            <th>Status</th>
                        </tr>
                    </thead>
                    <tbody>
                        {payroll.length ? (
                            payroll.map((p, i) => (
                                <tr key={i} className="border-b">
                                    <td>{p.month}</td>
                                    <td>₹{p.salary ?? 0}</td>
                                    <td>₹{p.deductions ?? 0}</td>
                                    <td className="text-green-600 font-semibold">₹{p.netSalary ?? 0}</td>
                                    <td>{p.status || "-"}</td>
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td colSpan={5} className="text-center py-2">
                                    No payroll data
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
}