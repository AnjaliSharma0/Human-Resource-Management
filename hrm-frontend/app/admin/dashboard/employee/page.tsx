
"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import toast from "react-hot-toast";

import VisibilityIcon from "@mui/icons-material/Visibility";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";

import api from "@/app/src/services/api";
import DeleteEmployeeModal from "@/app/components/employees/DeleteConfirmModel";
import EditEmployeeModal from "@/app/components/employees/EditModel";
import EmployeeProfileModal from "@/app/components/employees/EmployeeProfileModel";
import AddIcon from "@mui/icons-material/Add";
import AddEmployeeModal from "@/app/components/employees/AddEmployeeForm";
import { useRouter } from "next/navigation";



export default function EmployeePage() {

    const [employees, setEmployees] = useState<any[]>([]);
    const [search, setSearch] = useState("");
    const router = useRouter()
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

        <div className="p-6">

            <h1 className="text-3xl font-bold mb-6">
                Employee Directory
            </h1>
           <div className="flex justify-between">
             <input
                placeholder="Search employees..."
                className="border p-2 rounded-lg mb-6 w-[300px]"
                onChange={(e) => setSearch(e.target.value)}
            />   <button
                onClick={() => setShowModal(true)}
                className="flex items-center gap-2 bg-indigo-600 text-white px-4 py-2 rounded-lg"
            >
                <AddIcon />
                Add Employee
            </button>
           </div>
           


            {/* EMPLOYEE GRID */}

            <div className="grid md:grid-cols-3 lg:grid-cols-4 gap-6">

                {filteredEmployees.map((emp) => (


                    <motion.div
                        key={emp.id}
                        whileHover={{ scale: 1.05 }}
                        className="bg-white shadow-xl rounded-xl p-5 flex flex-col items-center text-center cursor-pointer"

                    >

                        <img
                            src={`https://i.pravatar.cc/150?img=${emp.id}`}
                            className="w-20 h-20 rounded-full mb-3"
                            onClick={() => router.push(`/admin/dashboard/employee/${emp.id}`)}
                        // navigate to details page
                        />

                        <h2 className="font-semibold text-lg">
                            {emp.firstName} {emp.lastName}
                        </h2>

                        <p className="text-gray-500 text-sm">
                            {emp.email}
                        </p>


                        {/* STATUS BADGE */}

                        <span className={`mt-2 text-xs px-3 py-1 rounded-full
                           ${emp.status === "Active"
                                ? "bg-green-100 text-green-600"
                                : "bg-yellow-100 text-yellow-600"
                            }`}>
                            {emp.status}
                        </span>


                        {/* ACTION BUTTONS */}

                        <div className="flex gap-4 mt-4">

                            <button
                                onClick={() => setSelected(emp)}
                                className="text-blue-600"
                            >
                                <VisibilityIcon />
                            </button>

                            <button
                                onClick={() => setEditModal(emp)}
                                className="text-yellow-600"
                            >
                                <EditIcon />
                            </button>

                            <button
                                onClick={() => setDeleteModal(emp)}
                                className="text-red-600"
                            >
                                <DeleteIcon />
                            </button>

                        </div>

                    </motion.div>

                ))}

            </div>

            {showModal && (
                <AddEmployeeModal
                    close={() => setShowModal(false)}
                    reload={loadEmployees}
                />
            )}


            {/* PROFILE MODAL */}

            {selected && (
                <EmployeeProfileModal
                    employee={selected}
                    close={() => setSelected(null)}
                />
            )}



            {/* DELETE MODAL */}

            {deleteModal && (
                <DeleteEmployeeModal
                    employee={deleteModal}
                    close={() => setDeleteModal(null)}
                    onDelete={handleDelete}
                />
            )}



            {/* EDIT MODAL */}

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



// export  function EmployeeDetailsWrapper() {
//   const params = useParams();
//   const employeeId = params?.id;

//   if (!employeeId) return <p>Loading...</p>; // prevent undefined fetch

//   return <EmployeeDetailsPage employeeId={employeeId} isAdmin={true} />;
//}