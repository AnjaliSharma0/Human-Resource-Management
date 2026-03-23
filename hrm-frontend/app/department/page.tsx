"use client";

import { useEffect, useState } from "react";
import axios from "axios";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import api from "../src/services/api";
import { Button, Dialog, DialogActions, DialogContent, DialogTitle, Typography } from "@mui/material";
import { Delete, ModeEdit } from "@mui/icons-material";

type Department = {
  id: number;
  name: string;
  location: string;
  description:string
};

type Designation = {
  id: number;
  title: string;
  department: Department;
};

export default function DepartmentPage() {

  const router = useRouter();

  const [designations, setDesignations] = useState<Designation[]>([]);
  const [role, setRole] = useState("");


  const [openDialog, setOpenDialog] = useState(false);
  const [selectedDept, setSelectedDept] = useState<any>(null);

  const openConfirm = (desig: any) => {
    setSelectedDept(desig);
    setOpenDialog(true);
  };

  // const confirmDelete = () => {
  //   if (!selectedDept) return;
  //   handleDelete(selectedDept.id);
  //   setOpenDialog(false);
  // };


  useEffect(() => {
    setRole(localStorage.getItem("role") || "");
    fetchDesignations();
  }, []);



  const fetchDesignations = async () => {
    try {

      const res = await api.get("/designations");

      setDesignations(res.data);
       console.log(res.data)
    } catch (err) {
      console.error(err);
      toast.error("Failed to load data");
    }
  };



  const deleteDesignation = async (id: number) => {
    try {

      await api.delete(`/designations/${id}`);

      toast.success("Designation deleted");

      fetchDesignations();

    } catch (err) {
      toast.error("Delete failed");
    }
  };



  // // Hardcoded descriptions
  // const descriptions: Record<string, string> = {
  //   Engineering: "Builds and maintains company software and systems.",
  //   QA: "Ensures product quality through testing and validation.",
  //   HR: "Handles recruitment, employee welfare and HR policies.",
  //   Finance: "Manages company finances and accounting."
  // };



  // Group by department
  const departments: Record<number, {
    name: string
    location: string
    description:string
    designations: Designation[]
  }> = {};

  designations.forEach((d) => {

    const deptId = d.department.id;

    if (!departments[deptId]) {
      departments[deptId] = {
        name: d.department.name,
        location: d.department.location,
        description:d.department.description,
        designations: []
      };
    }

    departments[deptId].designations.push(d);

  });



  return (

    <div className="p-8 space-y-6">

      {/* HEADER */}

      <div className="flex justify-between items-center">

        <h1 className="text-3xl font-bold">
          Departments & Designations
        </h1>

        {role === "admin" && (

          <div className="flex gap-3">

            <button
              onClick={() => router.push("/departments")}
              className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
            >
              + Add Department
            </button>

            <button
              onClick={() => router.push("/designations")}
              className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700"
            >
              + Add Designation
            </button>

          </div>

        )}

      </div>



      {/* STATS */}

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">

        <div className="bg-white p-4 rounded shadow text-center">
          <p className="text-gray-500">Total Departments</p>
          <h2 className="text-2xl font-bold">{Object.keys(departments).length}</h2>
        </div>

        <div className="bg-white p-4 rounded shadow text-center">
          <p className="text-gray-500">Total Designations</p>
          <h2 className="text-2xl font-bold">{designations.length}</h2>
        </div>

        <div className="bg-white p-4 rounded shadow text-center">
          <p className="text-gray-500">Locations</p>
          <h2 className="text-2xl font-bold">
            {new Set(designations.map(d => d.department.location)).size}
          </h2>
        </div>

      </div>



      {/* DEPARTMENT CARDS */}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

        {Object.entries(departments).map(([id, dept]) => (

          <div
            key={id}
            className="bg-white p-6 rounded-xl shadow hover:shadow-lg transition"
          >

            <h2 className="text-xl font-semibold p-4 text-center">
              {dept.name}
            </h2>

            <p className="text-sm text-gray-500">
              📍 Location: {dept.location}
            </p>

          
             <p className="text-gray-600 text-sm mt-2">
               {dept.description || "No description available"}
              </p>
          


            <div className="mt-4">

              <h3 className="font-semibold mb-2">
                Designations
              </h3>

              <ul className="space-y-2">

                {dept.designations.map((d) => (
                  <li
                    key={d.id}
                    className="flex justify-between items-center bg-gray-50 p-2 rounded"
                  >

                    <span>{d.title}</span>

                    {/* ADMIN ACTIONS */}

                    {/* {role === "admin" && (

                      <div className="flex gap-2">

                        <button
                          onClick={() => router.push(`/admin/edit/designations/${d.id}`)}
                          className="text-blue-600 text-sm"
                        >
                          <ModeEdit />
                        </button>
                        <button
                          onClick={() => {
                            setSelectedDept(d);
                            setOpenDialog(true);
                          }}
                          className="text-red-600 text-sm"
                        >
                          <Delete />
                        </button>


                      </div>

                    )} */}

                  </li>
                ))}

              </ul>

            </div>

          </div>

        ))}

        {/* Confirmation Dialog */}
        <Dialog open={openDialog} onClose={() => setOpenDialog(false)}>
          <DialogTitle>Confirm Delete</DialogTitle>
          <DialogContent>
            <Typography>
              Are you sure you want to delete "{selectedDept?.title}"?
            </Typography>
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setOpenDialog(false)}>Cancel</Button>
            <Button
              color="error"
              onClick={() => {
                if (selectedDept) {
                  deleteDesignation(selectedDept.id);
                  setOpenDialog(false);
                }
              }}
            >
              Delete
            </Button>
          </DialogActions>
        </Dialog>

      </div>

    </div>

  );
}