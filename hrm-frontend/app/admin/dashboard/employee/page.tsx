"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import toast from "react-hot-toast";

import VisibilityIcon from "@mui/icons-material/Visibility";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import AddIcon from "@mui/icons-material/Add";

import api from "@/app/src/services/api";
import DeleteEmployeeModal from "@/app/components/employees/DeleteConfirmModel";
import EditEmployeeModal from "@/app/components/employees/EditModel";
import EmployeeProfileModal from "@/app/components/employees/EmployeeProfileModel";
import AddEmployeeModal from "@/app/components/employees/AddEmployeeForm";
import { useRouter } from "next/navigation";

export default function EmployeePage() {
  const [employees, setEmployees] = useState<any[]>([]);
  const [search, setSearch] = useState("");
  const router = useRouter();

  const [selected, setSelected] = useState<any>(null);
  const [deleteModal, setDeleteModal] = useState<any>(null);
  const [editModal, setEditModal] = useState<any>(null);
  const [showModal, setShowModal] = useState(false);

  // LOAD EMPLOYEES
  const loadEmployees = async () => {
    try {
      const res = await api.get("/employees");
      setEmployees(res.data);
    } catch {
      toast.error("Failed to load employees");
    }
  };

  useEffect(() => {
    loadEmployees();
  }, []);

  // DELETE EMPLOYEE
  const handleDelete = async (id: number) => {
    try {
      await api.delete(`/employees/${id}`);
      toast.success("Employee deleted");
      setDeleteModal(null);
      loadEmployees();
    } catch {
      toast.error("Delete failed");
    }
  };

  // SEARCH FILTER
  const filteredEmployees = employees.filter((emp) =>
    `${emp.firstName} ${emp.lastName}`
      .toLowerCase()
      .includes(search.toLowerCase())
  );

  return (
    <div className="p-4 sm:p-6 md:p-8 bg-gray-50 min-h-screen">
      
      {/* HEADER */}
      <h1 className="text-2xl text-center sm:text-3xl font-bold mb-6 text-gray-800">
        Employee Directory
      </h1>

      {/* SEARCH + ADD */}
      <div className="flex flex-col sm:flex-row gap-4 sm:items-center sm:justify-between mb-6">
        
        <input
          placeholder="Search employees..."
          className="border p-2 rounded-lg w-full sm:w-80 focus:outline-none focus:ring-2 focus:ring-indigo-400"
          onChange={(e) => setSearch(e.target.value)}
        />

        <button
          onClick={() => setShowModal(true)}
          className="flex items-center justify-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg w-md sm:w-auto transition"
        >
          <AddIcon />
          Add Employee
        </button>
      <button  className="flex items-center justify-center
       gap-2 bg-purple-600 hover:bg-purple-700 text-white px-4 
       py-2 rounded-lg w-md sm:w-auto transition" 
       onClick={()=> router.push("/admin/salary-grade-assign")}>
        <AddIcon/>
        Assign Salary Grade</button>
       
      </div>

      {/* EMPLOYEE GRID */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5 m-3">
        {filteredEmployees.map((emp) => (
          <motion.div
            key={emp.id}
            whileHover={{ scale: 1.05 }}
            className="bg-white shadow-md m-2 hover:shadow-xl transition rounded-xl p-5 flex flex-col items-center text-center"
          >
            {/* Avatar */}
            <img
              src={`https://i.pravatar.cc/150?img=${emp.id}`}
              className="w-20 h-20 rounded-full mb-3 cursor-pointer"
              onClick={() =>
                router.push(`/admin/dashboard/employee/${emp.id}`)
              }
            />

            {/* Name */}
            <h2 className="font-semibold text-base sm:text-lg">
              {emp.firstName} {emp.lastName}
            </h2>
            
             
            {/* Email */}
            <p className="text-gray-500 text-xs sm:text-sm truncate w-full">
              {emp.email}
            </p>

            {/* STATUS */}
            <span
              className={`mt-2 text-xs px-3 py-1 rounded-full ${
                emp.status === "Active"
                  ? "bg-green-100 text-green-600"
                  : "bg-yellow-100 text-yellow-600"
              }`}
            >
              {emp.status}
            </span>

            {/* ACTIONS */}
            <div className="flex gap-4 mt-4">
              <button
                onClick={() => setSelected(emp)}
                className="text-blue-600 hover:scale-110 transition"
              >
                <VisibilityIcon fontSize="small" />
              </button>

              <button
                onClick={() => setEditModal(emp)}
                className="text-yellow-600 hover:scale-110 transition"
              >
                <EditIcon fontSize="small" />
              </button>

              <button
                onClick={() => setDeleteModal(emp)}
                className="text-red-600 hover:scale-110 transition"
              >
                <DeleteIcon fontSize="small" />
              </button>
            </div>
          </motion.div>
        ))}
      </div>

      {/* EMPTY STATE */}
      {filteredEmployees.length === 0 && (
        <div className="text-center text-gray-500 mt-10">
          No employees found
        </div>
      )}

      {/* MODALS */}
      {showModal && (
        <AddEmployeeModal
          close={() => setShowModal(false)}
          reload={loadEmployees}
        />
      )}

      {selected && (
        <EmployeeProfileModal
          employee={selected}
          close={() => setSelected(null)}
        />
      )}

      {deleteModal && (
        <DeleteEmployeeModal
          employee={deleteModal}
          close={() => setDeleteModal(null)}
          onDelete={handleDelete}
        />
      )}

      {editModal && (
        <EditEmployeeModal
          employee={editModal}
          close={() => setEditModal(null)}
          reload={loadEmployees}
        />
      )}
    </div>
  );
}