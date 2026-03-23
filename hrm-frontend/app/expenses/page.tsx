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
      console.log(data)
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
      formData.append("employeeId", String(Number(userId)));

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

  // ✅ APPROVE
  const approve = async (id: number) => {
    await fetch(`${BASE_URL}/expenses/approve/${id}`, {
      method: "PUT",
      headers: { role },
    });
    fetchExpenses();
  };

  // ✅ REJECT
  const reject = async (id: number) => {
    await fetch(`${BASE_URL}/expenses/reject/${id}`, {
      method: "PUT",
      headers: { role },
    });
    fetchExpenses();
  };

  // ✅ DELETE
  const deleteExpense = async (id: number) => {
    await fetch(`${BASE_URL}/expenses/${id}`, {
      method: "DELETE",
      headers: { role },
    });
    fetchExpenses();
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
  {(role === "admin" || role === "manager" || role === "employee") && (
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
            <br/>
      {/* FILE UPLOAD */}
      <input
      style={{color:"blue"}}
        type="file"
        className="mt-3"
        onChange={(e) => {
          if (e.target.files && e.target.files[0]) {
            setForm({ ...form, receipt: e.target.files[0] });
          }
        }}
      />

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
        <h3 className={`text-sm font-semibold mb-3 ${
          e.status === "approved" ? "text-green-600" :
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
            >
              Approve
            </Button>
            <Button
              variant="outlined"
              color="error"
              onClick={() => reject(e.id)}
            >
              Reject
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
            >
              Approve
            </Button>
            <Button
              variant="outlined"
              color="error"
              onClick={() => reject(e.id)}
            >
              Reject
            </Button>
            <Button
              variant="contained"
              color="error"
              onClick={() => deleteExpense(e.id)}
            >
              Delete
            </Button>
          </div>
        )}
      </Paper>
    ))}
  </div>
</Box>
    // <Box p={3}>
    //   <Typography variant="h5" fontWeight="bold">
    //     Expense Management
    //   </Typography>

    //   {/* CREATE FORM */}
    //   {(role === "admin" || role === "manager" || role === "employee") && (
    //     <Paper sx={{ p: 3, my: 2 }}>
    //       <Typography variant="h6">Create Expense</Typography>

    //       <TextField
    //         label="Amount"
    //         fullWidth
    //         margin="normal"
    //         value={form.amount}
    //         onChange={(e) =>
    //           setForm({ ...form, amount: e.target.value })
    //         }
    //       />

    //       <TextField
    //         label="Description"
    //         fullWidth
    //         margin="normal"
    //         value={form.description}
    //         onChange={(e) =>
    //           setForm({ ...form, description: e.target.value })
    //         }
    //       />

    //       <Select
    //         fullWidth
    //         value={form.category}
    //         displayEmpty
    //         onChange={(e) =>
    //           setForm({ ...form, category: e.target.value })
    //         }
    //       >
    //         <MenuItem value="">Select Category</MenuItem>
    //         <MenuItem value="travel">Travel</MenuItem>
    //         <MenuItem value="food">Food</MenuItem>
    //         <MenuItem value="office">Office</MenuItem>
    //       </Select>

    //       {/* FILE UPLOAD */}
    //       <input
    //         type="file"
    //         style={{ marginTop: 10 }}
    //         onChange={(e) => {
    //           if (e.target.files && e.target.files[0]) {
    //             setForm({
    //               ...form,
    //               receipt: e.target.files[0],
    //             });
    //           }
    //         }}
    //       />

    //       <Button
    //         variant="contained"
    //         sx={{ mt: 2 }}
    //         onClick={createExpense}
    //         disabled={loading}
    //       >
    //         {loading ? "Submitting..." : "Submit Expense"}
    //       </Button>
    //     </Paper>
    //   )}
    //   <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 bg-blue-300 text-center">
    //     {/* LIST */}
    //     {expenses.map((e) => (
    //       <Paper key={e.id} sx={{ p: 2, my: 1 }}>


    //         <h2 className="mb-1 text-bold">
    //           {e.employee?.firstName || "-"}
    //         </h2>

    //         <p className="mb-1 text-gray-600">
    //           {e.description || "-"}
    //         </p>

    //         <p className="mb-1">₹ {e.amount || 0}</p>
    //         <p className="mb-1 text-sm text-gray-500">
    //           Category: {e.category || "-"}
    //         </p>
    //         <h3 className="text-sm text-yellow-500 ">
    //           Status: {e.status || "-"}
    //         </h3>



    //         {e.receiptUrl && (
    //           <a
    //             href={`${BASE_URL}/${e.receiptUrl}`}
    //             target="_blank"
    //           >
    //             View Receipt
    //           </a>
    //         )}


    //         {/* MANAGER */}
    //         {role === "manager" && e.status === "pending" && (
    //           <>
    //             <Button onClick={() => approve(e.id)}>Approve</Button>
    //             <Button onClick={() => reject(e.id)}>Reject</Button>
    //           </>
    //         )}


    //         {/* ADMIN */}
    //         {role === "admin" && (
    //           <>
    //             <Button onClick={() => approve(e.id)}>Approve</Button>
    //             <Button onClick={() => reject(e.id)}>Reject</Button>
    //             <Button
    //               color="error"
    //               onClick={() => deleteExpense(e.id)}
    //             >
    //               Delete
    //             </Button>
    //           </>
    //         )}
    //       </Paper>
    //     ))}
    //   </div>
    // </Box>
  );
}