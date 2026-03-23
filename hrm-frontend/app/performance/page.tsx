"use client";

import { useEffect, useState } from "react";
import api from "@/app/src/services/api";
import toast from "react-hot-toast";
import { CheckCircle, Star } from "lucide-react";
import { io } from "socket.io-client";
import { BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid, ResponsiveContainer } from "recharts";
import {
  TextField,
  MenuItem,
  Button,
  Paper,
  Typography,
} from "@mui/material";

// ✅ socket
const socket = io("http://localhost:5000");

// Types
type Goal = {
  status: string; id: number; title: string; description: string; completed: boolean 
};
type Review = {
  id: number;
  goalId: number;
  feedback: string;
  rating: number;
  employee: {
    id: number;
    firstName: string;
    lastName: string;
  };
  createdAt: string;
};
type Employee = { id: number; firstName: string; lastName: string };

export default function PerformancePage() {
  const [role, setRole] = useState<"admin" | "employee" | "manager">("employee");
  const [employeeId, setEmployeeId] = useState<number>(0);
  const [employeeName, setEmployeeName] = useState<string>("You");

  const [goals, setGoals] = useState<Goal[]>([]);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [employees, setEmployees] = useState<Employee[]>([]);

  const [newGoal, setNewGoal] = useState({ title: "", description: "" });
  const [newReview, setNewReview] = useState({ goalId: 0, comment: "", rating: 0, employeeId: 0 });

  const [loading, setLoading] = useState(true);

  // ✅ Load role
  useEffect(() => {
    const storedRole = localStorage.getItem("role") as any;
    const storedEmployeeId = Number(localStorage.getItem("userId") || 0);
    const storedFirstName = localStorage.getItem("firstName") || "You";
    const storedLastName = localStorage.getItem("lastName") || "";

    if (storedRole) setRole(storedRole);
    setEmployeeId(storedEmployeeId);
    setEmployeeName(`${storedFirstName} ${storedLastName}`);

    if (storedRole === "employee") {
      setNewReview((prev) => ({ ...prev, employeeId: storedEmployeeId }));
    }
  }, []);

  // ✅ Fetch
  const fetchGoals = async () => {
    try {
      const res = await api.get("/performance/goals");
      setGoals(res.data);
    } catch {
      toast.error("Failed to fetch goals");
    }
  };

  const fetchReviews = async () => {
    try {
      const res = await api.get("/performance/reviews");
      setReviews(res.data);
      console.log("reviwsw", res.data)
    } catch {
      toast.error("Failed to fetch reviews");
    }
  };

  const fetchEmployees = async () => {
    try {
      const res = await api.get("/employees");
      setEmployees(res.data);
    } catch {}
  };

  const loadAll = async () => {
    setLoading(true);
    await Promise.all([fetchGoals(), fetchReviews(), fetchEmployees()]);
    setLoading(false);
  };

          useEffect(() => {
        loadAll();

  const handler = () => {
    loadAll();
    toast("Live update 🔄");
  };

  socket.on("performanceUpdated", handler);

  return () => {
    socket.off("performanceUpdated", handler); // ✅ correct
  };
}, [role]);

  // ✅ Create Goal (Admin only)
  const handleCreateGoal = async () => {
    if (!newGoal.title || !newGoal.description) {
      toast.error("Fill all fields");
      return;
    }

    try {
      await api.post("/performance/goal", newGoal);
      toast.success("Goal created!");
      setNewGoal({ title: "", description: "" });
      loadAll();
    } catch {
      toast.error("Failed");
    }
  };

  // ✅ Complete Goal
 const handleCompleteGoal = async (goalId: number) => {
  try {
    await api.patch(`/performance/goal/${goalId}`, { status: "completed" });
    toast.success("Goal marked as completed!");
    loadAll();
  } catch {
    toast.error("Failed to mark completed");
  }
};

  // ✅ Post Review (Admin + Manager)
  const handlePostReview = async () => {
    if (!newReview.goalId || !newReview.comment || !newReview.rating || !newReview.employeeId) {
      toast.error("Fill all fields");
      return;
    }

    try {
      await api.post("/performance/review", {
        goalId: newReview.goalId,
        feedback: newReview.comment,
        rating: newReview.rating,
        employeeId: newReview.employeeId,
      });

      toast.success("Review added!");
      setNewReview({
        goalId: 0,
        comment: "",
        rating: 0,
        employeeId: role === "employee" ? employeeId : 0,
      });

      loadAll();
    } catch {
      toast.error("Failed");
    }
  };
const chartData = goals.map((goal) => {
  const goalReviews = reviews.filter((r) => r.goalId === goal.id);
  console.log("goal rviews", goalReviews)
  const avgRating =
    goalReviews.reduce((sum, r) => sum + r.rating, 0) / (goalReviews.length || 1);
  return {
    name: goal.title,
    rating: Number(avgRating.toFixed(1)),
  };
}); 
const visibleReviews = role === "employee"
  ? reviews.filter(r => r.employee.id === employeeId)
  : reviews;
  console.log("visibleReviews", visibleReviews);
console.log("employeeId from localStorage:", employeeId);
console.log("All review employee IDs:", reviews.map(r => r.employee.id));
  if (loading) return <p className="p-6">Loading...</p>;

  return (
    <div className="p-6 md:p-10 bg-gradient-to-br from-gray-50 to-gray-100 min-h-screen space-y-8 text-center m-3">

      <Typography variant="h4" fontWeight="bold">
        🚀 Performance Dashboard
      </Typography>

      {/* ✅ ADMIN + MANAGER */}
      {(role === "admin" || role === "manager") && (
        <div className="space-y-6">

          {/* Create Goal (Admin only) */}
          {role === "admin" && (
            <Paper className="p-5 flex flex-col md:flex-row gap-3 shadow-lg rounded-xl">
              <TextField
                label="Goal Title"
                fullWidth
                value={newGoal.title}
                onChange={(e) => setNewGoal({ ...newGoal, title: e.target.value })}
              />
              <TextField
                label="Description"
                fullWidth
                value={newGoal.description}
                onChange={(e) => setNewGoal({ ...newGoal, description: e.target.value })}
              />
              <Button variant="contained" onClick={handleCreateGoal}>
                Create
              </Button>
            </Paper>
          )}

          {/* Review Section */}
          <Paper className="p-5 flex flex-col md:flex-row gap-3 shadow-lg rounded-xl">
            <TextField
              select
              label="Employee"
              value={newReview.employeeId}
              onChange={(e) =>
                setNewReview({ ...newReview, employeeId: Number(e.target.value) })
              }
              fullWidth
            >
              <MenuItem value={0}>Select</MenuItem>
              {employees.map((e) => (
                <MenuItem key={e.id} value={e.id}>
                  {e.firstName} {e.lastName}
                </MenuItem>
              ))}
            </TextField>

            <TextField
              select
              label="Goal"
              value={newReview.goalId}
              onChange={(e) =>
                setNewReview({ ...newReview, goalId: Number(e.target.value) })
              }
              fullWidth
            >
              <MenuItem value={0}>Select</MenuItem>
              {goals.map((g) => (
                <MenuItem key={g.id} value={g.id}>
                  {g.title}
                </MenuItem>
              ))}
            </TextField>

            <TextField
              label="Feedback"
              fullWidth
              value={newReview.comment}
              onChange={(e) =>
                setNewReview({ ...newReview, comment: e.target.value })
              }
            />

            <TextField
              type="number"
              label="Rating"
              value={newReview.rating}
              onChange={(e) =>
                setNewReview({ ...newReview, rating: Number(e.target.value) })
              }
              inputProps={{ min: 1, max: 10 }}
            />

            <Button variant="contained" color="success" onClick={handlePostReview}>
              Submit
            </Button>
          </Paper>
        </div>
      )}

      {/* ✅ GOALS */}
      <Typography variant="h5" fontWeight="bold">
        🎯 Goals
      </Typography>

      <div className="grid md:grid-cols-3 gap-6">
  {goals.map((goal) => (
    <Paper
      key={goal.id}
      className="p-5 rounded-xl shadow-md hover:shadow-xl transition-all duration-300"
    >
      <h3 className="text-lg font-bold">{goal.title}</h3>
      <p className="text-gray-600">{goal.description}</p>

      <div className="mt-3 h-2 bg-gray-200 rounded">
       <div className="mt-3 w-full h-2 bg-gray-200 rounded">
  <div
    className={`h-2 rounded transition-all duration-500 ${
      goal.status === "completed" ? "bg-green-500" : "bg-blue-500"
    }`}
    style={{ width: goal.status === "completed" ? "100%" : "50%" }} // width must be string with '%'
  />
</div>
      </div>

      {goal.status === "completed" && (
        <div className="text-green-600 mt-2 flex items-center gap-1">
          <CheckCircle size={16} /> Completed
        </div>
      )}

      {role === "employee" && goal.status !== "completed" && (
        <Button
          className="mt-3"
          variant="outlined"
          onClick={() => handleCompleteGoal(goal.id)}
        >
          Mark Done
        </Button>
      )}
    </Paper>
  ))}
</div>
      {/* ✅ REVIEWS */}
      <Typography variant="h5" fontWeight="bold">
        ⭐ Reviews
      </Typography>

      {/* <div className="grid md:grid-cols-3 gap-6">
        {reviews
          .filter((r) => role !== "employee" || r.employeeId === employeeId)
          .map((r) => {
            const goal = goals.find((g) => g.id === r.goalId);

            return (
              <Paper
                key={r.id}
                className="p-5 rounded-xl shadow-md hover:shadow-xl transition"
              >
                <h4 className="font-bold">{goal?.title}</h4>
                <p className="text-gray-600">{r.feedback}</p>

                <div className="flex items-center gap-2 mt-2 text-yellow-500">
                  <Star size={16} />
                  {r.rating}/10
                </div>
              </Paper>
            );
          })}
      </div> */}

     <div className="grid md:grid-cols-3 gap-6">
  {visibleReviews.map((r) => {
    const goal = goals.find((g) => g.id === r.goalId);
    const employee = r.employee; // already comes from API

    return (
      <Paper key={r.id} className="p-5 rounded-xl shadow-md hover:shadow-xl transition">
        <h4 className="font-bold">{goal?.title}</h4>
        {role !== "employee" && (
          <p className="text-gray-500 text-sm mb-1">
            Employee: {employee?.firstName} {employee?.lastName}
          </p>
        )}
        <p className="text-gray-600">{r.feedback}</p>
        <div className="flex items-center gap-2 mt-2 text-yellow-500">
          <Star size={16} /> {r.rating}/10
        </div>
      </Paper>
    );
  })}
  <ResponsiveContainer width="100%" height={300}>
  <BarChart data={chartData} margin={{ top: 20, right: 30, left: 0, bottom: 0 }}>
    <CartesianGrid strokeDasharray="3 3" />
    <XAxis dataKey="name" />
    <YAxis domain={[0, 10]} />
    <Tooltip />
    <Bar dataKey="rating" fill="#4ade80" /> {/* green bars */}
  </BarChart>
</ResponsiveContainer>
</div>
    </div>
  );
}