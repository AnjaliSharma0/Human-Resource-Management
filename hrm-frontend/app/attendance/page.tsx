"use client";

import { useEffect, useState, useRef } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from "recharts";

type Session = {
  clockIn: string;
  clockOut?: string;
};

type Attendance = {
  id: number;
  employee: {
    id: number;
    firstName: string;
    lastName: string;
  };
  date: string;
  sessions: Session[];
  totalHours: number;
  overtimeHours: number;
};

export default function AttendanceDashboard() {
  const [attendance, setAttendance] = useState<Attendance | null>(null);
  const [history, setHistory] = useState<Attendance[]>([]);
  const [timer, setTimer] = useState<string>("00:00:00");
  const [role, setRole] = useState<string>("");
  const [userId, setUserId] = useState<string>("");
  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const backend = "http://localhost:5000/attendance";

  const isRunning = Boolean(
    attendance?.sessions?.length &&
    !attendance.sessions[attendance.sessions.length - 1]?.clockOut
  );

  const startTimer = (clockIn: string) => {
    if (intervalRef.current) clearInterval(intervalRef.current);

    intervalRef.current = setInterval(() => {
      const diff = Date.now() - new Date(clockIn).getTime();
      const h = Math.floor(diff / 3600000).toString().padStart(2, "0");
      const m = Math.floor((diff % 3600000) / 60000)
        .toString()
        .padStart(2, "0");
      const s = Math.floor((diff % 60000) / 1000).toString().padStart(2, "0");

      setTimer(`${h}:${m}:${s}`);
    }, 1000);
  };

  const fetchAttendance = async (token: string, role: string) => {
    try {
      const endpoint = role === "admin" ? "/all" : "/me";
      const res = await axios.get(`${backend}${endpoint}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      setHistory(res.data);
       console.log(res.data)
      if (role !== "admin") {
        const today = res.data.find(
          (a: Attendance) =>
            new Date(a.date).toDateString() === new Date().toDateString()
        );
        setAttendance(today);
       
        if (today?.sessions?.length) {
          const last = today.sessions.at(-1);
          if (last && !last.clockOut) startTimer(last.clockIn);
        }
      }
    } catch (err) {
      console.error(err);
      toast.error("Cannot load attendance");
    }
  };

  useEffect(() => {
    const token = localStorage.getItem("token");
    const storedRole = localStorage.getItem("role") || "";
    const storedUserId = localStorage.getItem("userId") || "";
    setRole(storedRole);
    setUserId(storedUserId);
    if (token && storedRole) {
      fetchAttendance(token, storedRole);
    }
  }, []);

  const punchIn = async () => {
    if (role === "admin") return;
    const token = localStorage.getItem("token");
    if (!token) return;

    await axios.post(`${backend}/punch-in`, {}, { headers: { Authorization: `Bearer ${token}` } });
    toast.success("Punched In");
    fetchAttendance(token, role);
  };

  const punchOut = async () => {
    if (role === "admin") return;
    const token = localStorage.getItem("token");
    if (!token) return;

    await axios.post(`${backend}/punch-out`, {}, { headers: { Authorization: `Bearer ${token}` } });
    toast.success("Punched Out");
    // ✅ stop timer
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
    }
    setTimer("00:00:00");
    fetchAttendance(token, role);
  };

  // Helper functions
  const isLate = (sessions: Session[]) => {
    const firstSession = sessions[0];
    if (!firstSession) return true;
    return new Date(firstSession.clockIn).getHours() > 10;
  };

  const isMissingEveningPunch = (sessions: Session[]) => {
    const lastSession = sessions.at(-1);
    if (!lastSession) return true;
    if (!lastSession.clockOut) return true;
    return new Date(lastSession.clockOut).getHours() < 19;
  };

  const getTotalLoggedTime = (sessions: Session[]) => {
    let total = 0;
    sessions.forEach((s) => {
      const start = new Date(s.clockIn).getTime();
      const end = s.clockOut ? new Date(s.clockOut).getTime() : Date.now();
      total += end - start;
    });
    const h = Math.floor(total / 3600000);
    const m = Math.floor((total % 3600000) / 60000);
    return `${h}h ${m}m`;
  };

  // Analytics
  const totalEmployees = history.length;
  const currentlyPunchedIn = history.filter((a) =>
    a.sessions.length && !a.sessions.at(-1)?.clockOut
  );
  const lateToday = history.filter((a) => isLate(a.sessions));
  const missingEveningPunch = history.filter((a) => isMissingEveningPunch(a.sessions));

  const chartData = [
    { name: "On Time", value: totalEmployees - lateToday.length },
    { name: "Late", value: lateToday.length },
  ];

  const COLORS = ["#4ade80", "#facc15"]; // green for on time, yellow for late

  return (
    <div className="p-8 space-y-8">
      <h1 className="text-4xl font-bold text-gray-800 mb-6">Attendance Dashboard</h1>

      {role !== "admin" && (
        <div className="flex gap-4 mb-6">

          <button
            onClick={punchIn}
            disabled={isRunning}
            className={`px-6 py-2 rounded-lg text-white font-medium
      ${isRunning ? "bg-gray-400 cursor-not-allowed" : "bg-green-600 hover:bg-green-700"}`}
          >
            Punch In
          </button>

          <button
            onClick={punchOut}
            disabled={!isRunning}
            className={`px-6 py-2 rounded-lg text-white font-medium
      ${!isRunning ? "bg-gray-400 cursor-not-allowed" : "bg-red-600 hover:bg-red-700"}`}
          >
            Punch Out
          </button>

          <div className="ml-4 text-lg font-semibold text-gray-700">
            Timer: {timer}
          </div>

        </div>
      )}
      {/* Analytics cards */}
      {/* <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white p-6 rounded-xl shadow hover:shadow-lg transition text-center">
          <p className="text-gray-500">Total Employees</p>
          <h2 className="text-2xl font-bold">{totalEmployees}</h2>
        </div>
        <div className="bg-white p-6 rounded-xl shadow hover:shadow-lg transition text-center">
          <p className="text-gray-500">Currently Punched In</p>
          <h2 className="text-2xl font-bold text-blue-600">{currentlyPunchedIn.length}</h2>
        </div>
        <div className="bg-white p-6 rounded-xl shadow hover:shadow-lg transition text-center">
          <p className="text-gray-500">Late Today</p>
          <h2 className="text-2xl font-bold text-yellow-500">{lateToday.length}</h2>
        </div>
        <div className="bg-white p-6 rounded-xl shadow hover:shadow-lg transition text-center">
          <p className="text-gray-500">Missing Evening Punch</p>
          <h2 className="text-2xl font-bold text-red-500">{missingEveningPunch.length}</h2>
        </div>
      </div> */}

      {/* Pie chart */}
      <div className="bg-white p-6 rounded-xl shadow w-full h-64">
        <h2 className="text-xl font-semibold mb-4">Attendance Status</h2>
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={chartData}
              dataKey="value"
              nameKey="name"
              outerRadius={80}
              fill="#8884d8"
              label
            >
              {chartData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
              ))}
            </Pie>
            <Tooltip />
          </PieChart>
        </ResponsiveContainer>
      </div>

      {/* Currently punched in employees */}
      {currentlyPunchedIn.length > 0 && (
        <div className="bg-blue-50 p-6 rounded-xl shadow space-y-2">
          <h2 className="text-xl font-semibold text-blue-700">Currently Punched In</h2>
          <div className="flex flex-wrap gap-4">
            {currentlyPunchedIn.map((a) => (
              <span key={a.id} className="px-3 py-1 bg-blue-200 text-blue-800 rounded-full font-medium text-sm">
                {a.employee.firstName} (ID: {a.employee.id})
              </span>
            ))}
          </div>
        </div>
      )}
      {role !== "admin" && attendance && (
        <div className="bg-green-50 p-6 rounded-xl shadow">
          <h2 className="text-xl font-semibold mb-2">Today's Attendance</h2>
          <p><strong>Employee ID:</strong> {userId}</p>
          <p><strong>Name:</strong> {attendance.employee.firstName || "You"}</p>
          <p>Date: {new Date(attendance.date).toDateString()}</p>

          <p>Total Hours: {attendance.totalHours}h</p>

          <div className="mt-2">
            {attendance.sessions.map((s, i) => (
              <div key={i}>
                {new Date(s.clockIn).toLocaleTimeString()} -
                {s.clockOut
                  ? new Date(s.clockOut).toLocaleTimeString()
                  : " Running"}
              </div>
            ))}
          </div>
        </div>
      )}
      {/* Attendance history cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {history.map((a) => (
          <div
            key={a.id}
            className={`bg-white p-6 rounded-xl shadow hover:shadow-2xl transition border-l-8
              ${isLate(a.sessions) ? "border-yellow-500" : "border-green-500"}
              ${isMissingEveningPunch(a.sessions) ? "border-red-500" : ""}`}
          >
            <h3 className="text-lg font-semibold text-gray-800">
              {a.employee.firstName || (role !== "admin" ? "You" : "Unknown")}
            </h3>

            <p className="text-sm text-gray-500">
              ID: {userId || (role !== "admin" ? userId : "-")}
            </p>
            <p className="text-sm text-gray-500">{new Date(a.date).toDateString()}</p>
            <p className="font-medium mt-2">Total Logged: {getTotalLoggedTime(a.sessions)}</p>
            <p className="text-gray-700">{a.totalHours}h • OT {a.overtimeHours}h</p>
            <div className="mt-2 space-y-1">
              {a.sessions.length === 0 && <p className="text-red-500 font-medium">Not punched in</p>}
              {a.sessions.map((s, i) => (
                <div key={i} className="text-sm text-gray-700">
                  {new Date(s.clockIn).toLocaleTimeString()} - {s.clockOut ? new Date(s.clockOut).toLocaleTimeString() : <span className="text-green-600 font-medium">Running</span>}
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}