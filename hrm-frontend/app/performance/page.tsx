"use client";

import { useEffect, useState } from "react";
import api from "@/app/src/services/api";
import toast from "react-hot-toast";
import { CheckCircle, Star } from "lucide-react";

// Types
type Goal = { id: number; title: string; description: string; completed: boolean };
type Review = { id: number; goalId: number; feedback: string; rating: number; employeeId: number };
type Employee = { id: number; firstName: string; lastName: string };

export default function PerformancePage() {
  const [role, setRole] = useState<"admin" | "employee">("employee");
  const [employeeId, setEmployeeId] = useState<number>(0);
  const [employeeName, setEmployeeName] = useState<string>("You");
  const [goals, setGoals] = useState<Goal[]>([]);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [newGoal, setNewGoal] = useState({ title: "", description: "" });
  const [newReview, setNewReview] = useState({ goalId: 0, comment: "", rating: 0, employeeId: 0 });

  // Load role and employee info
  useEffect(() => {
    const storedRole = localStorage.getItem("role");
    const storedEmployeeId = Number(localStorage.getItem("employeeId") || 0);
    const storedFirstName = localStorage.getItem("firstName") || "You";
    const storedLastName = localStorage.getItem("lastName") || "";

    if (storedRole === "admin" || storedRole === "employee") setRole(storedRole);
    setEmployeeId(storedEmployeeId);
    setEmployeeName(`${storedFirstName} ${storedLastName}`);

    if (storedRole === "employee") setNewReview((prev) => ({ ...prev, employeeId: storedEmployeeId }));
  }, []);

  // Fetch data
  const fetchGoals = async () => {
    try { const res = await api.get("/performance/goals"); setGoals(res.data); } 
    catch (err) { console.error(err); toast.error("Failed to fetch goals"); }
  };
  const fetchReviews = async () => {
    try { const res = await api.get("/performance/reviews"); setReviews(res.data); } 
    catch (err) { console.error(err); toast.error("Failed to fetch reviews"); }
  };
  const fetchEmployees = async () => {
    try { const res = await api.get("/employees"); setEmployees(res.data); } 
    catch (err) { console.error(err); }
  };

  useEffect(() => {
    fetchGoals();
    fetchReviews();
    fetchEmployees();
  }, [role]);

  // Admin: Create Goal
  const handleCreateGoal = async () => {
    if (!newGoal.title || !newGoal.description) { toast.error("Please fill all fields"); return; }
    try { await api.post("/performance/goal", newGoal); toast.success("Goal created!"); setNewGoal({ title: "", description: "" }); fetchGoals(); } 
    catch (err) { console.error(err); toast.error("Failed to create goal"); }
  };

  // Employee: Mark Goal Completed
  const handleCompleteGoal = async (goalId: number) => {
    try { await api.post("/performance/goal", { id: goalId, completed: true }); toast.success("Goal marked as completed!"); fetchGoals(); } 
    catch (err) { console.error(err); toast.error("Failed to complete goal"); }
  };

  // Post Review
  const handlePostReview = async () => {
    if (!newReview.goalId || !newReview.comment || !newReview.rating || !newReview.employeeId) { toast.error("Please fill all review fields"); return; }
    try {
      await api.post("/performance/review", {
        goalId: newReview.goalId,
        feedback: newReview.comment,
        rating: newReview.rating,
        employeeId: newReview.employeeId,
      });
      toast.success("Review posted!");
      setNewReview({ goalId: 0, comment: "", rating: 0, employeeId: role === "employee" ? newReview.employeeId : 0 });
      fetchReviews();
    } catch (err) { console.error(err); toast.error("Failed to post review"); }
  };

  return (
    <div className="p-4 md:p-8 bg-gray-50 min-h-screen">
      <h1 className="text-3xl font-bold mb-6 text-gray-800">Performance Dashboard</h1>

      {/* Admin Section */}
      {role === "admin" && (
        <div className="mb-10 space-y-6">
          {/* Create Goal */}
          <div className="bg-white rounded-lg shadow p-5 flex flex-col md:flex-row md:items-center md:space-x-4 space-y-3 md:space-y-0">
            <input className="border p-2 rounded w-full md:w-1/3" placeholder="Goal Title" value={newGoal.title} onChange={(e) => setNewGoal({ ...newGoal, title: e.target.value })} />
            <input className="border p-2 rounded w-full md:flex-1" placeholder="Goal Description" value={newGoal.description} onChange={(e) => setNewGoal({ ...newGoal, description: e.target.value })} />
            <button className="bg-blue-600 text-white px-5 py-2 rounded hover:bg-blue-700 transition" onClick={handleCreateGoal}>Create Goal</button>
          </div>

          {/* Post Review */}
          <div className="bg-white rounded-lg shadow p-5 flex flex-col md:flex-row md:items-center md:space-x-4 space-y-3 md:space-y-0">
            <select className="border p-2 rounded w-full md:w-1/4" value={newReview.employeeId} onChange={(e) => setNewReview({ ...newReview, employeeId: Number(e.target.value) })}>
              <option value={0}>Select Employee</option>
              {employees.map((emp) => (<option key={emp.id} value={emp.id}>{emp.firstName} {emp.lastName}</option>))}
            </select>

            <select className="border p-2 rounded w-full md:w-1/4" value={newReview.goalId} onChange={(e) => setNewReview({ ...newReview, goalId: Number(e.target.value) })}>
              <option value={0}>Select Goal</option>
              {goals.map((g) => (<option key={g.id} value={g.id}>{g.title}</option>))}
            </select>

            <input className="border p-2 rounded w-full md:flex-1" placeholder="Review Comment" value={newReview.comment} onChange={(e) => setNewReview({ ...newReview, comment: e.target.value })} />
            <input type="number" className="border p-2 w-full md:w-24 rounded" placeholder="Rating" value={newReview.rating} onChange={(e) => setNewReview({ ...newReview, rating: Number(e.target.value) })} />
            <button className="bg-green-600 text-white px-5 py-2 rounded hover:bg-green-700 transition" onClick={handlePostReview}>Post Review</button>
          </div>
        </div>
      )}

      {/* Goals Section */}
      <h2 className="text-2xl font-semibold mb-4 text-gray-700 border-b pb-2">Goals</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-10">
        {goals.map((goal) => (
          <div key={goal.id} className="bg-white shadow hover:shadow-lg transition rounded-lg p-5 flex flex-col justify-between">
            <div>
              <h3 className="text-xl font-bold mb-2 text-gray-800">{goal.title}</h3>
              <p className="text-gray-600 mb-4">{goal.description}</p>
              <div className="w-full bg-gray-200 h-3 rounded mb-3">
                <div className={`h-3 rounded ${goal.completed ? "bg-green-500" : "bg-blue-500"}`} style={{ width: goal.completed ? "100%" : "50%" }} />
              </div>
              {goal.completed && <span className="text-green-600 font-semibold flex items-center gap-1"><CheckCircle size={16}/> Completed</span>}
            </div>
            {role === "employee" && !goal.completed && <button className="mt-4 bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition" onClick={() => handleCompleteGoal(goal.id)}>Mark Completed</button>}
          </div>
        ))}
      </div>

      {/* Reviews Section */}
      <h2 className="text-2xl font-semibold mb-4 text-gray-700 border-b pb-2">Reviews</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {reviews.filter((review) => role === "admin" || review.employeeId === employeeId).map((review) => {
          const goal = goals.find((g) => g.id === review.goalId);
          const employee = role === "admin"
            ? employees.find((e) => e.id === review.employeeId)
            : { firstName: employeeName, lastName: "" };
          const isOwnReview = review.employeeId === employeeId;

          return (
            <div key={review.id} className={`bg-white rounded-lg shadow hover:shadow-lg transition p-5 flex flex-col ${isOwnReview && role === "employee" ? "bg-blue-50" : "bg-white"}`}>
              <div className="flex justify-between items-center mb-2">
                <h4 className="font-bold text-gray-800">{goal?.title || `Goal ID: ${review.goalId}`}</h4>
                {isOwnReview && <span className="bg-blue-200 text-blue-800 text-xs font-semibold px-2 py-0.5 rounded">Your Review</span>}
              </div>
              {role === "admin" && <span className="text-gray-500 mb-2">Employee: {employee ? `${employee.firstName} ${employee.lastName}` : "Unknown"}</span>}
              <p className="text-gray-700 mb-2">{review.feedback}</p>
              <span className="flex items-center text-gray-500 font-semibold gap-1">
                Rating: {review.rating} <Star size={16} className="text-yellow-500"/>
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}