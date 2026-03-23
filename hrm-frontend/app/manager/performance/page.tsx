"use client";

import { useEffect, useState } from "react";
import {
  Paper,
  Typography,
  TextField,
  MenuItem,
  Button,
} from "@mui/material";
import { io } from "socket.io-client";
import toast from "react-hot-toast";

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

import api from "@/app/src/services/api";

const socket = io("http://localhost:5000");

export default function ManagerPerformancePage() {
  const [team, setTeam] = useState<any[]>([]);
  const [reviews, setReviews] = useState<any[]>([]);

  const [selectedEmployee, setSelectedEmployee] = useState("");
  const [rating, setRating] = useState(5);
  const [feedback, setFeedback] = useState("");

  const [loading, setLoading] = useState(true);

  // ✅ Load Data
  const loadData = async () => {
    try {
      const [empRes, reviewRes] = await Promise.all([
        api.get("/employees"), // 👈 manager team only
        api.get("/performance/reviews"),
      ]);

      setTeam(empRes.data || []);
      setReviews(reviewRes.data || []);
    } catch (err) {
      toast.error("Failed to load performance data");
    } finally {
      setLoading(false);
    }
  };

  // ✅ Initial Load + Socket
  useEffect(() => {
    loadData();

    socket.on("performanceUpdated", () => {
      loadData();
      toast("Performance updated 🔄");
    });

    return () => {
      socket.off("performanceUpdated");
    };
  }, []);

  // ✅ Submit Review
  const handleSubmit = async () => {
    if (!selectedEmployee) {
      return toast.error("Select employee");
    }

    try {
      await api.post("/performance/review", {
        employeeId: Number(selectedEmployee),
        reviewerId: 1, // ⚠️ replace with logged-in user id
        rating,
        feedback,
      });

      toast.success("Review submitted");
      setFeedback("");
    } catch (err) {
      toast.error("Failed to submit review");
    }
  };

  // ✅ Chart Data (average rating per employee)
  const chartData = team.map((emp) => {
    const empReviews = reviews.filter(
      (r) => r.employee?.id === emp.id
    );

    const avg =
      empReviews.reduce((sum, r) => sum + r.rating, 0) /
      (empReviews.length || 1);

    return {
      name: emp.firstName,
      rating: Number(avg.toFixed(1)),
    };
  });

  if (loading) {
    return <p className="p-6">Loading performance...</p>;
  }

  return (
    <div className="p-6 space-y-6">

      <Typography variant="h5" fontWeight="bold">
        Performance Management
      </Typography>

      {/* 🔹 Review Form */}
      <Paper className="p-4 space-y-4">
        <Typography fontWeight="bold">
          Give Feedback to Employee
        </Typography>

        <TextField
          select
          fullWidth
          label="Select Employee"
          value={selectedEmployee}
          onChange={(e) => setSelectedEmployee(e.target.value)}
        >
          {team.map((emp) => (
            <MenuItem key={emp.id} value={emp.id}>
              {emp.firstName} {emp.lastName}
            </MenuItem>
          ))}
        </TextField>

        <TextField
          type="number"
          fullWidth
          label="Rating (1–10)"
          value={rating}
          onChange={(e) => setRating(Number(e.target.value))}
          inputProps={{ min: 1, max: 10 }}
        />

        <TextField
          fullWidth
          label="Feedback"
          multiline
          rows={3}
          value={feedback}
          onChange={(e) => setFeedback(e.target.value)}
        />

        <Button variant="contained" onClick={handleSubmit}>
          Submit Review
        </Button>
      </Paper>

      {/* 🔹 Performance Chart */}
      <Paper className="p-4">
        <Typography fontWeight="bold" mb={2}>
          Team Performance (Live)
        </Typography>

        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={chartData}>
            <XAxis dataKey="name" />
            <YAxis domain={[0, 10]} />
            <Tooltip />
            <Bar dataKey="rating" />
          </BarChart>
        </ResponsiveContainer>
      </Paper>

      {/* 🔹 Review List */}
      <Paper className="p-4">
        <Typography fontWeight="bold" mb={2}>
          Recent Reviews
        </Typography>

        {reviews.slice(0, 5).map((r) => (
          <div
            key={r.id}
            className="border-b py-2 flex justify-between"
          >
            <div>
              <p className="font-medium">
                {r.employee?.firstName}
              </p>
              <p className="text-sm text-gray-500">
                {r.feedback}
              </p>
            </div>

            <span className="font-bold">
              ⭐ {r.rating}
            </span>
          </div>
        ))}
      </Paper>

    </div>
  );
}