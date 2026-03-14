"use client";

import {
Dialog,
DialogTitle,
DialogContent,
DialogActions,
TextField
} from "@mui/material";
import { useState, useEffect, useRef } from "react";
import toast from "react-hot-toast";
import Button from "@mui/material/Button";
import { AccessTime, Login, Logout, History } from "@mui/icons-material";
import { Paper, Typography, Stack, Divider } from "@mui/material";
import AttendanceChart from "../components/AttendanceChart";
import axios from "axios";
import ProjectChart from "../components/ProjectChart";
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
  // const [intervalId, setIntervalId] = useState<number | null>(null);
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const [history, setHistory] = useState<Attendance[]>([]);
  const [token, setToken] = useState<string | null>(null);
  const [editOpen, setEditOpen] = useState(false);
const [editId, setEditId] = useState<number | null>(null);
const [clockIn, setClockIn] = useState("");
const [clockOut, setClockOut] = useState("");
  const backendUrl = "http://localhost:5000/attendance";

const [role, setRole] = useState<string | null>(null);

useEffect(() => {
  const storedToken = localStorage.getItem("token");
  const storedRole = localStorage.getItem("role");

  setToken(storedToken);
  setRole(storedRole);
}, []);

const WORK_LIMIT = 8;

useEffect(() => {
  if (role) {
    fetchAttendance();
  }

  return () => stopTimer();
}, [role]); 
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
  // const startTimer = (clockInTime: Date) => {
  //   if (intervalId) clearInterval(intervalId);

  //   const id = window.setInterval(() => {
  //     const now = new Date();
  //     const diff = now.getTime() - new Date(clockInTime).getTime();
  //     const hours = Math.floor(diff / (1000 * 3600))
  //       .toString()
  //       .padStart(2, "0");
  //     const minutes = Math.floor((diff % (1000 * 3600)) / (1000 * 60))
  //       .toString()
  //       .padStart(2, "0");
  //     const seconds = Math.floor((diff % (1000 * 60)) / 1000)
  //       .toString()
  //       .padStart(2, "0");
  //     setTimer(`${hours}:${minutes}:${seconds}`);
  //   }, 1000);
  //   setIntervalId(id);
  // };
  const startTimer = (clockInTime: Date) => {

  if (timerRef.current) {
    clearInterval(timerRef.current);
  }

  timerRef.current = setInterval(() => {

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
};

  

  const stopTimer = () => {

  if (timerRef.current) {
    clearInterval(timerRef.current);
    timerRef.current = null;
  }

  setTimer("00:00:00");
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

const openEditModal = (id: number) => {
  setEditId(id);
  setEditOpen(true);
};

const saveAttendanceEdit = async () => {
  try {
    await axios.patch(
      `${backendUrl}/${editId}`,
      {
        clockIn,
        clockOut
      },
      {
        headers: {
          Authorization: `Bearer ${token}`
        }
      }
    );

    toast.success("Attendance updated");
    setEditOpen(false);
    fetchAttendance();
  } catch (err: any) {
    toast.error(err.response?.data?.message || "Update failed");
  }
};

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <div className="grid grid-cols-4 gap-4 mb-6">

<div className="bg-white p-4 rounded-xl shadow">
<p className="text-gray-500">Total Hours Today</p>
<h2 className="text-2xl font-bold">
{attendance?.totalHours?.toFixed(2) || 0}h
</h2>
</div>

<div className="bg-white p-4 rounded-xl shadow">
<p className="text-gray-500">Overtime</p>
<h2 className="text-2xl font-bold">
{attendance?.overtimeHours?.toFixed(2) || 0}h
</h2>
</div>

<div className="bg-white p-4 rounded-xl shadow">
<p className="text-gray-500">Sessions</p>
<h2 className="text-2xl font-bold">
{attendance?.sessions?.length || 0}
</h2>
</div>

<div className="bg-white p-4 rounded-xl shadow">
<p className="text-gray-500">Timer</p>
<h2 className="text-2xl font-bold">{timer}</h2>
</div>

</div>
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
        {role === "admin" && (

<Button
variant="contained"
color="primary"
onClick={() => window.location.href = "/admin/employee-attendance"}
>
View Employee Attendance
</Button>

)}
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

      {/* Multi-day Attendance History
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
                        onClick={() => openEditModal(a.id)}
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
      </Paper> */}

      {/* Multi-day Attendance History */}
<Paper sx={{ p: 3 }} elevation={3}>

  <Stack direction="row" alignItems="center" spacing={1} mb={3}>
    <History color="primary" />
    <Typography variant="h6" fontWeight="bold">
      Attendance History
    </Typography>
  </Stack>

  <Divider sx={{ mb: 3 }} />

  {history.length ? (

    <div className="grid md:grid-cols-2 gap-4">

      {history.map((a) => (

        <Paper
          key={a.id}
          elevation={1}
          className="p-4 rounded-xl transition-all duration-300 hover:shadow-xl hover:scale-[1.02] border border-gray-100"
        >

          {/* Header */}
          <Stack
            direction="row"
            justifyContent="space-between"
            alignItems="center"
            mb={1}
          >

            <Stack direction="row" spacing={1} alignItems="center">
              <AccessTime color="action" />

              <Typography fontWeight="bold">
                {new Date(a.date).toDateString()}
              </Typography>
            </Stack>

            {role === "admin" && (
              <Button
                variant="outlined"
                size="small"
                onClick={() => openEditModal(a.id)}
              >
                Edit
              </Button>
            )}

          </Stack>

          {/* Hours */}
          <Stack direction="row" spacing={3} mb={2}>

            <Stack direction="row" spacing={1} alignItems="center">
              <Login fontSize="small" color="success" />
              <Typography variant="body2">
                {a.totalHours.toFixed(2)} h
              </Typography>
            </Stack>

            <Stack direction="row" spacing={1} alignItems="center">
              <Logout fontSize="small" color="error" />
              <Typography variant="body2">
                OT: {a.overtimeHours.toFixed(2)} h
              </Typography>
            </Stack>

          </Stack>

          {/* Sessions */}
          <Stack spacing={0.5}>

            {a.sessions.map((s, idx) => (

              <div
                key={idx}
                className="flex justify-between text-sm bg-gray-50 rounded-lg px-3 py-1"
              >

                <span>
                  {new Date(s.clockIn).toLocaleTimeString()}
                </span>

                <span>
                  {s.clockOut
                    ? new Date(s.clockOut).toLocaleTimeString()
                    : "Ongoing"}
                </span>

              </div>

            ))}

          </Stack>

        </Paper>

      ))}

    </div>

  ) : (

    <Typography color="text.secondary">
      No attendance history
    </Typography>

  )}

</Paper>
   <div className="grid grid-cols-2 gap-6 mt-6">
  <AttendanceChart data={history} />
  <ProjectChart hours={attendance?.totalHours || 0} />
</div>
<Dialog open={editOpen} onClose={() => setEditOpen(false)}>

<DialogTitle>Edit Attendance</DialogTitle>

<DialogContent>

<TextField
label="Clock In"
type="time"
fullWidth
margin="normal"
value={clockIn}
onChange={(e) => setClockIn(e.target.value)}
InputLabelProps={{ shrink: true }}
/>

<TextField
label="Clock Out"
type="time"
fullWidth
margin="normal"
value={clockOut}
onChange={(e) => setClockOut(e.target.value)}
InputLabelProps={{ shrink: true }}
/>

</DialogContent>

<DialogActions>

<Button onClick={() => setEditOpen(false)}>
Cancel
</Button>

<Button variant="contained" onClick={saveAttendanceEdit}>
Save
</Button>

</DialogActions>

</Dialog>
    </div>
  );
}