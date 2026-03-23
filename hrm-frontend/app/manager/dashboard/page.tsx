"use client";

import { useEffect, useState } from "react";
import {
  Paper,
  Typography,
  Button,
  TextField,
  MenuItem,
} from "@mui/material";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import { io } from "socket.io-client";

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

import api from "@/app/src/services/api";

const socket = io("http://localhost:5000"); // 🔹 backend socket URL

export default function ManagerDashboard() {
  const router = useRouter();

  const [team, setTeam] = useState<any[]>([]);
  const [leaves, setLeaves] = useState<any[]>([]);
  const [expenses, setExpenses] = useState<any[]>([]);

  // 🔹 Filters
  const [selectedEmployee, setSelectedEmployee] = useState("");
  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");

  const loadData = async () => {
    try {
      const [emp, leave, exp] = await Promise.all([
        api.get("/employees"),
        api.get("/leave"),
        api.get("/expenses"),
      ]);

      setTeam(emp.data || []);
      setLeaves(leave.data || []);
      setExpenses(exp.data || []);
    } catch (err) {
      toast.error("Failed to load data");
    }
  };

  useEffect(() => {
    loadData();

    // 🔹 Real-time updates
    socket.on("dashboardUpdate", () => {
      loadData();
      toast("Dashboard updated 🔄");
    });

    return () => {
      socket.off("dashboardUpdate");
    };
  }, []);

  // 🔹 Apply Filters
  const filterByDate = (item: any) => {
    if (!fromDate || !toDate) return true;
    const date = new Date(item.createdAt);
    return date >= new Date(fromDate) && date <= new Date(toDate);
  };

  const filterByEmployee = (item: any) => {
    if (!selectedEmployee) return true;
    return item.employee?.id === selectedEmployee;
  };

  const filteredLeaves = leaves.filter(
    (l) =>
      l.status === "pending" &&
      filterByDate(l) &&
      filterByEmployee(l)
  );

  const filteredExpenses = expenses.filter(
    (e) =>
      e.status === "pending" &&
      filterByDate(e) &&
      filterByEmployee(e)
  );

  // 🔹 Charts
  const attendanceData = [
    {
      name: "Present",
      value: team.filter((e) => e.status === "present").length,
    },
    {
      name: "Absent",
      value: team.filter((e) => e.status === "absent").length,
    },
  ];

  const performanceData = team.map((e) => ({
    name: e.firstName,
    score: e.performanceScore || 50,
  }));

  // 🔹 Actions
  const handleLeaveAction = async (id: number, status: string) => {
    try {
      await api.patch(`/leave/${id}`, { status });
      toast.success(`Leave ${status}`);
      loadData();
    } catch {
      toast.error("Action failed");
    }
  };

  const handleExpenseAction = async (id: number, status: string) => {
    try {
      await api.patch(`/expenses/${id}`, { status });
      toast.success(`Expense ${status}`);
      loadData();
    } catch {
      toast.error("Action failed");
    }
  };

  return (
    <div className="p-6 space-y-6">
      <Typography variant="h5" fontWeight="bold">
        Manager Dashboard
      </Typography>

      {/* 🔹 Filters */}
      <Paper className="p-4 flex flex-wrap gap-4">
        <TextField
          select
          label="Employee"
          value={selectedEmployee}
          onChange={(e) => setSelectedEmployee(e.target.value)}
          className="min-w-[180px]"
        >
          <MenuItem value="">All</MenuItem>
          {team.map((e) => (
            <MenuItem key={e.id} value={e.id}>
              {e.firstName}
            </MenuItem>
          ))}
        </TextField>

        <TextField
          type="date"
          label="From"
          InputLabelProps={{ shrink: true }}
          value={fromDate}
          onChange={(e) => setFromDate(e.target.value)}
        />

        <TextField
          type="date"
          label="To"
          InputLabelProps={{ shrink: true }}
          value={toDate}
          onChange={(e) => setToDate(e.target.value)}
        />
      </Paper>

      {/* 🔹 Approvals */}
      <div className="grid md:grid-cols-2 gap-4">

        {/* Leaves */}
        <Paper className="p-4">
          <Typography fontWeight="bold" mb={2}>
            Leave Approvals
          </Typography>

          {filteredLeaves.map((l: any) => (
            <div
              key={l.id}
              className="flex justify-between items-center mb-2 border-b pb-2 cursor-pointer"
              onClick={() => router.push(`/employees/${l.employee?.id}`)}
            >
              <div>
                <p className="font-medium">
                  {l.employee?.firstName}
                </p>
                <p className="text-sm text-gray-500">
                  {l.fromDate} → {l.toDate}
                </p>
              </div>

              <div className="flex gap-2">
                <Button
                  size="small"
                  color="success"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleLeaveAction(l.id, "approved");
                  }}
                >
                  Approve
                </Button>

                <Button
                  size="small"
                  color="error"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleLeaveAction(l.id, "rejected");
                  }}
                >
                  Reject
                </Button>
              </div>
            </div>
          ))}
        </Paper>

        {/* Expenses */}
        <Paper className="p-4">
          <Typography fontWeight="bold" mb={2}>
            Expense Approvals
          </Typography>

          {filteredExpenses.map((e: any) => (
            <div
              key={e.id}
              className="flex justify-between items-center mb-2 border-b pb-2 cursor-pointer"
              onClick={() => router.push(`/employees/${e.employee?.id}`)}
            >
              <div>
                <p className="font-medium">
                  {e.employee?.firstName}
                </p>
                <p className="text-sm text-gray-500">
                  ₹ {e.amount} - {e.category}
                </p>
              </div>

              <div className="flex gap-2">
                <Button
                  size="small"
                  color="success"
                  onClick={(ev) => {
                    ev.stopPropagation();
                    handleExpenseAction(e.id, "approved");
                  }}
                >
                  Approve
                </Button>

                <Button
                  size="small"
                  color="error"
                  onClick={(ev) => {
                    ev.stopPropagation();
                    handleExpenseAction(e.id, "rejected");
                  }}
                >
                  Reject
                </Button>
              </div>
            </div>
          ))}
        </Paper>
      </div>

      {/* 🔹 Charts */}
      <div className="grid md:grid-cols-2 gap-4">

        <Paper className="p-4">
          <Typography fontWeight="bold" mb={2}>
            Team Attendance
          </Typography>

          <ResponsiveContainer width="100%" height={250}>
            <BarChart data={attendanceData}>
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="value" />
            </BarChart>
          </ResponsiveContainer>
        </Paper>

        <Paper className="p-4">
          <Typography fontWeight="bold" mb={2}>
            Performance Summary
          </Typography>

          <ResponsiveContainer width="100%" height={250}>
            <BarChart data={performanceData}>
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="score" />
            </BarChart>
          </ResponsiveContainer>
        </Paper>
      </div>
    </div>
  );
}