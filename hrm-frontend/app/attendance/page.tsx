"use client";

import { useState, useEffect } from "react";
import toast from "react-hot-toast";
import Button from "@mui/material/Button";
import { AccessTime, Login, Logout, History } from "@mui/icons-material";
import { Paper, Typography, Stack, Divider } from "@mui/material";
import AttendanceChart from "../components/AttendanceChart";
import axios from "axios";
type Session = {
  clockIn: string;
  clockOut?: string;
};

type Attendance = {
  id: number;
  date: string;
  sessions: Session[];
  totalHours: number;
  overtimeHours: number;
};

export default function AttendancePanel() {
  const [attendance, setAttendance] = useState<Attendance | null>(null);
  const [timer, setTimer] = useState<string>("00:00:00");
  const [intervalId, setIntervalId] = useState<number | null>(null);
  const [history, setHistory] = useState<Attendance[]>([]);
  const [token, setToken] = useState<string | null>(null);
  const backendUrl = "http://localhost:5000/attendance";

const [role, setRole] = useState<string | null>(null);

useEffect(() => {
  const storedToken = localStorage.getItem("token");
  const storedRole = localStorage.getItem("role");

  setToken(storedToken);
  setRole(storedRole);
}, []);
const fetchAttendance = async () => {
  try {

    const endpoint =
      role === "admin"
        ? `${backendUrl}/all`
        : `${backendUrl}/me`;
    const res = await fetch(endpoint, {
      headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
    });
    if (!res.ok) throw new Error("Unauthorized or server error");
    const data: Attendance[] = await res.json();
    if (!Array.isArray(data)) throw new Error("Invalid attendance data");

    const today = data.find(a => new Date(a.date).toDateString() === new Date().toDateString());
    setAttendance(today || null);
    setHistory(data.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()));

    if (today?.sessions?.length) {
      const lastSession = today.sessions[today.sessions.length - 1];
      if (!lastSession.clockOut) startTimer(new Date(lastSession.clockIn));
    }
  } catch (err: any) {
    console.error(err);
    toast.error(err.message || "Failed to fetch attendance");
  }
};

  useEffect(() => {
    fetchAttendance();
    // cleanup timer on unmount
    return () => stopTimer();
  }, []);

  // -------------------
  // Real-time timer
  // -------------------
  const startTimer = (clockInTime: Date) => {
    if (intervalId) clearInterval(intervalId);

    const id = window.setInterval(() => {
      const now = new Date();
      const diff = now.getTime() - new Date(clockInTime).getTime();
      const hours = Math.floor(diff / (1000 * 3600))
        .toString()
        .padStart(2, "0");
      const minutes = Math.floor((diff % (1000 * 3600)) / (1000 * 60))
        .toString()
        .padStart(2, "0");
      const seconds = Math.floor((diff % (1000 * 60)) / 1000)
        .toString()
        .padStart(2, "0");
      setTimer(`${hours}:${minutes}:${seconds}`);
    }, 1000);
    setIntervalId(id);
  };

  const stopTimer = () => {
    if (intervalId !== null) clearInterval(intervalId);
    setTimer("00:00:00");
    setIntervalId(null);
  };

  // -------------------
  // Punch In
  // -------------------


 useEffect(() => {
    const storedToken = localStorage.getItem("token");
    setToken(storedToken);
  }, []);

// -------------------
// Punch In
// -------------------
const handlePunchIn = async () => {
  try {
    const res = await axios.post(
      `${backendUrl}/punch-in`,
      {}, // replace userId with logged-in employee id
      {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        withCredentials: true, // if your backend uses cookies
      }
    );

    toast.success("Punched in!");
    fetchAttendance();
  } catch (err: any) {
    console.error(err.response || err);
    toast.error(err.response?.data?.message || "Punch in failed");
  }
};

// -------------------
// Punch Out
// -------------------
const handlePunchOut = async () => {
  try {
    const res = await axios.post(
      `${backendUrl}/punch-out`,
      { }, // replace userId with logged-in employee id
      {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        withCredentials: true,
      }
    );

    toast.success("Punched out!");
    stopTimer();
    fetchAttendance();
  } catch (err: any) {
    console.error(err.response || err);
    toast.error(err.response?.data?.message || "Punch out failed");
  }
};

const handleEditAttendance = async (id: number) => {
  const newClockIn = prompt("Enter new Clock In time (HH:mm)");
  const newClockOut = prompt("Enter new Clock Out time (HH:mm)");

  if (!newClockIn || !newClockOut) return;

  try {
    await axios.patch(
      `${backendUrl}/${id}`,
      {
        clockIn: newClockIn,
        clockOut: newClockOut,
      },
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    toast.success("Attendance updated");
    fetchAttendance();
  } catch (err: any) {
    console.error(err);
    toast.error(err.response?.data?.message || "Update failed");
  }
};

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <Typography variant="h4" gutterBottom>
        Attendance Panel
      </Typography>

      {/* Punch In / Punch Out Buttons */}
      <Stack direction="row" spacing={2} mb={4}>
        <Button
          variant="contained"
          color="success"
          startIcon={<Login />}
          onClick={handlePunchIn}
          disabled={Boolean(attendance?.sessions?.length && !attendance.sessions.at(-1)?.clockOut)}
         
        >
          Punch In
        </Button>
        <Button
          variant="contained"
          color="error"
          startIcon={<Logout />}
          onClick={handlePunchOut}
        //   disabled={Boolean(attendance?.sessions?.length && !attendance.sessions.at(-1)?.clockOut)}
        >
          Punch Out
        </Button>
      </Stack>

      {/* Real-time Timer */}
      {attendance?.sessions?.length && !attendance.sessions.at(-1)?.clockOut && (
        <Paper sx={{ p: 2, mb: 4 }} elevation={2}>
          <Stack direction="row" alignItems="center" spacing={1}>
            <AccessTime />
            <Typography variant="h6">
              Current Session Timer: {timer}
            </Typography>
          </Stack>
        </Paper>
      )}

      {/* Total Hours & Overtime */}
      {attendance && (
        <Paper sx={{ p: 2, mb: 4 }} elevation={2}>
          <Typography variant="body1">
            <strong>Total Hours Today:</strong> {attendance.totalHours.toFixed(2)} h
          </Typography>
          <Typography variant="body1">
            <strong>Overtime Today:</strong> {attendance.overtimeHours.toFixed(2)} h
          </Typography>
        </Paper>
      )}

      {/* Multi-day Attendance History */}
      <Paper sx={{ p: 2 }} elevation={2}>
        <Stack direction="row" alignItems="center" spacing={1} mb={2}>
          <History />
          <Typography variant="h6">Attendance History</Typography>
        </Stack>
        <Divider sx={{ mb: 2 }} />
        {history.length ? (
          <Stack spacing={2}>
            {history.map((a) => (
              <Paper key={a.id} sx={{ p: 2 }} variant="outlined">
                <Typography variant="subtitle1">
                  {new Date(a.date).toDateString()}
                </Typography>
                <Typography variant="body2">
                  Total Hours: {a.totalHours.toFixed(2)} h | Overtime: {a.overtimeHours.toFixed(2)} h
                </Typography>
                  {role === "admin" && (
  <Button
    variant="outlined"
    size="small"
    onClick={() => handleEditAttendance(a.id)}
  >
    Edit
  </Button>
)}
         
                     <Stack mt={1} spacing={0.5}>
                  {a.sessions.map((s, idx) => (
                    <Typography key={idx} variant="body2">
                      {new Date(s.clockIn).toLocaleTimeString()} -{" "}
                      {s.clockOut ? new Date(s.clockOut).toLocaleTimeString() : "Ongoing"}
                    </Typography>

                    
                  ))}
                </Stack>
              </Paper>
            ))}
          </Stack>
        ) : (
          <Typography>No attendance history</Typography>
        )}
      </Paper>
      <AttendanceChart/>
    </div>
  );
}