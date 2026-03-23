"use client";

import { useEffect, useState } from "react";
import {
  Box,
  Typography,
  Paper,
  Button,
  TextField,
  Select,
  MenuItem,
  Card,
  CardContent,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
} from "@mui/material";
import toast from "react-hot-toast";
import Loading from "../components/Loading";

type Expense = {
  id: number;
  amount: number;
  description: string;
  category: string;
  status: string;
  receiptUrl?: string;

  employee?: {
    id: number;
    firstName: string;
    lastName: string;
  };
};

const BASE_URL = "http://localhost:5000";

export default function ExpensesPage() {
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [role, setRole] = useState<string>("");
  const [userId, setUserId] = useState<string>("");
  const [loading, setLoading] = useState(false)
  const [pageLoading, setPageLoading] = useState(true)
  const [actionLoadingId, setActionLoadingId] = useState<number | null>(null);
  const [deleteId, setDeleteId] = useState<number | null>(null);
  const [deleteLoading, setDeleteLoading] = useState(false);
  const [form, setForm] = useState<{
    amount: string;
    description: string;
    category: string;
    receipt: File | null;
  }>({
    amount: "",
    description: "",
    category: "",
    receipt: null,
  });

  // ✅ SAFE LOCALSTORAGE
  useEffect(() => {
    const r = localStorage.getItem("role") || "";
    const id = localStorage.getItem("userId") || "";

    setRole(r);
    setUserId(id);
    fetchExpenses(r);
  }, []);

  // ✅ FETCH
  const fetchExpenses = async (roleParam = role) => {
    setPageLoading(true)
    try {

      const res = await fetch(`${BASE_URL}/expenses`, {
        headers: {
          role: roleParam,
        },
      });
      const data = await res.json();
      setExpenses(data);
      console.log("expense", data)
    } catch (error: any) {
      console.log(error.message)
    } finally {
      setPageLoading(false)
    }
  };

  // ✅ CREATE
  const createExpense = async () => {

    try {
      if (!form.amount || !form.description || !form.category) {
        alert("Fill all fields");
        return;
      }

      setLoading(true);
      const formData = new FormData();
      formData.append("amount", String(Number(form.amount)));
      formData.append("description", form.description);
      formData.append("category", form.category);
     formData.append("employeeId", String(userId));

      if (form.receipt) {
        formData.append("receipt", form.receipt);
      }

      await fetch(`${BASE_URL}/expenses`, {
        method: "POST",
        headers: {
          role,
        },
        body: formData,
      });

      // reset
      setForm({
        amount: "",
        description: "",
        category: "",
        receipt: null,
      });

      fetchExpenses()

    } catch (error: any) {
      console.log(error.message)
      toast.error("Error while creating expense")
    } finally {
      setLoading(false)
    }
  };
  const approve = async (id: number) => {
    try {
      setActionLoadingId(id);

      await fetch(`${BASE_URL}/expenses/approve/${id}`, {
        method: "PUT",
        headers: { role },
      });

      fetchExpenses();
    } finally {
      setActionLoadingId(null);
    }
  };

  const reject = async (id: number) => {
    try {
      setActionLoadingId(id);

      await fetch(`${BASE_URL}/expenses/reject/${id}`, {
        method: "PUT",
        headers: { role },
      });

      fetchExpenses();
    } finally {
      setActionLoadingId(null);
    }
  };


  const confirmDelete = async () => {
    if (!deleteId) return;

    try {
      setDeleteLoading(true);

      await fetch(`${BASE_URL}/expenses/${deleteId}`, {
        method: "DELETE",
        headers: { role },
      });

      toast.success("Expense deleted");
      setDeleteId(null);
      fetchExpenses();
    } catch (err) {
      toast.error("Failed to delete");
    } finally {
      setDeleteLoading(false);
    }
  };
  if (pageLoading) {
    return <Loading size="sm" message="Loading" />
  }

  return (
    <Box p={4} className="bg-gray-50 min-h-screen">
      <Typography variant="h4" fontWeight="bold" className="mb-6">
        💰 Expense Management
      </Typography>

      {/* CREATE EXPENSE FORM */}
      {( role === "employee") && (
        <Paper className="p-6 max-w-md mx-auto mb-8 shadow-lg rounded-xl bg-white m-auto">
          <Typography variant="h6" fontWeight="bold" className="mb-4">
            📝 Create Expense
          </Typography>

          <TextField
            label="Amount"
            margin="normal"
            value={form.amount}
            onChange={(e) => setForm({ ...form, amount: e.target.value })}
          />
          <br />

          <TextField
            label="Description"
            margin="normal"
            value={form.description}
            onChange={(e) => setForm({ ...form, description: e.target.value })}
          />
          <br />

          <Select
            value={form.category}
            displayEmpty
            onChange={(e) => setForm({ ...form, category: e.target.value })}
          >
            <MenuItem value="">Select Category</MenuItem>
            <MenuItem value="travel">Travel</MenuItem>
            <MenuItem value="food">Food</MenuItem>
            <MenuItem value="office">Office</MenuItem>
          </Select>
          <br />


          <Button
            variant="contained"
            sx={{ mt: 3 }}
            className="bg-indigo-600 hover:bg-indigo-700 text-white font-semibold"
            onClick={createExpense}
            disabled={loading}
          >
            {loading ? "Submitting..." : "Submit Expense"}
          </Button>
        </Paper>
      )}

      {/* EXPENSE LIST */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
        {expenses.map((e) => (
          <Paper
            key={e.id}
            className="p-5 rounded-xl shadow-lg bg-white hover:shadow-xl transition-all duration-300"
          >
            <h2 className="text-lg font-bold mb-1">{e.employee?.firstName || "-"}</h2>
            <p className="text-gray-600 mb-1">{e.description || "-"}</p>
            <p className="mb-1 font-semibold">₹ {e.amount || 0}</p>
            <p className="text-sm text-gray-500 mb-2">Category: {e.category || "-"}</p>
            <h3 className={`text-sm font-semibold mb-3 ${e.status === "approved" ? "text-green-600" :
              e.status === "rejected" ? "text-red-600" : "text-yellow-500"
              }`}>
              Status: {e.status || "-"}
            </h3>

            {e.receiptUrl && (
              <a
                href={`${BASE_URL}/${e.receiptUrl}`}
                target="_blank"
                className="text-blue-600 underline mb-3 block"
              >
                View Receipt
              </a>
            )}

            {/* MANAGER ACTIONS */}
            {role === "manager" && e.status === "pending" && (
              <div className="flex gap-3 mt-2">
                <Button
                  variant="contained"
                  color="success"
                  onClick={() => approve(e.id)}
                  disabled={actionLoadingId === e.id || e.status !== "pending"}
                >
                  {actionLoadingId === e.id ? "Processing..." : "Approve"}
                </Button>

                <Button
                  variant="outlined"
                  color="error"
                  onClick={() => reject(e.id)}
                  disabled={actionLoadingId === e.id || e.status !== "pending"}
                >
                  {actionLoadingId === e.id ? "Processing..." : "Reject"}
                </Button>
              </div>
            )}

            {/* ADMIN ACTIONS */}
            {role === "admin" && (
              <div className="flex gap-3 mt-2 flex-wrap">
                <Button
                  variant="contained"
                  color="success"
                  onClick={() => approve(e.id)}
                  disabled={actionLoadingId === e.id || e.status !== "pending"}
                >
                  {actionLoadingId === e.id ? "Processing..." : "Approve"}
                </Button>

                <Button
                  variant="outlined"
                  color="error"
                  onClick={() => reject(e.id)}
                  disabled={actionLoadingId === e.id || e.status !== "pending"}
                >
                  {actionLoadingId === e.id ? "Processing..." : "Reject"}
                </Button>
                <Button
                  variant="contained"
                  color="error"
                  onClick={() => setDeleteId(e.id)}
                >
                  Delete
                </Button>
              </div>
            )}
          </Paper>
        ))}
      </div>
      <Dialog open={!!deleteId} onClose={() => setDeleteId(null)}>
        <DialogTitle>Confirm Delete</DialogTitle>

        <DialogContent>
          Are you sure you want to delete this expense?
        </DialogContent>

        <DialogActions>
          <Button onClick={() => setDeleteId(null)} disabled={deleteLoading}>
            Cancel
          </Button>

          <Button
            color="error"
            variant="contained"
            onClick={confirmDelete}
            disabled={deleteLoading}
          >
            {deleteLoading ? "Deleting..." : "Delete"}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>

  );
}