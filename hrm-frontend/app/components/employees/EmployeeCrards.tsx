"use client";

import { useEffect, useState } from "react";

import toast from "react-hot-toast";

import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import PersonAddIcon from "@mui/icons-material/PersonAdd";
import api from "@/app/src/services/api";

interface Employee {
  id: number;
  name: string;
  email: string;
  role: string;
  department?: string;
}

export default function EmployeeCards() {

  const [employees,setEmployees] = useState<Employee[]>([]);
  const [role,setRole] = useState("");

  useEffect(() => {

    const r = localStorage.getItem("role") || "employee";
    setRole(r);

    loadEmployees();

  },[]);


  const loadEmployees = async () => {

    try{

      const res = await api.get("/employees");

      setEmployees(res.data);

    }catch(err){

      toast.error("Failed to load employees");

    }

  };

  const deleteEmployee = async(id:number)=>{

    try{

      await api.delete(`/employees/${id}`);

      toast.success("Employee deleted");

      loadEmployees();

    }catch{

      toast.error("Delete failed");

    }

  };

  return (

    <div>

      {/* Add Employee Button */}
      {role === "admin" && (

        <div className="flex justify-end mb-6">

          <button
            className="flex items-center gap-2 bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700"
          >
            <PersonAddIcon/>
            Add Employee
          </button>

        </div>

      )}

      {/* Employee Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">

        {employees.map((emp)=>(
          
          <div
            key={emp.id}
            className="bg-white rounded-xl shadow-md p-6 hover:shadow-lg transition"
          >

            <div className="flex items-center gap-4">

              <div className="bg-indigo-500 text-white rounded-full w-12 h-12 flex items-center justify-center text-lg font-bold">

                {emp.name.charAt(0)}

              </div>

              <div>

                <h3 className="font-semibold text-lg">{emp.name}</h3>

                <p className="text-gray-500 text-sm">{emp.email}</p>

              </div>

            </div>

            <div className="mt-4 text-sm text-gray-600">

              <p>Role: {emp.role}</p>
              <p>Department: {emp.department || "N/A"}</p>

            </div>

            {/* Actions */}
            {(role === "admin" || role === "manager") && (

              <div className="flex gap-3 mt-4">

                <button className="text-blue-600 hover:text-blue-800">
                  <EditIcon/>
                </button>

                {role === "admin" && (

                  <button
                    onClick={()=>deleteEmployee(emp.id)}
                    className="text-red-600 hover:text-red-800"
                  >
                    <DeleteIcon/>
                  </button>

                )}

              </div>

            )}

          </div>

        ))}

      </div>

    </div>

  );

}