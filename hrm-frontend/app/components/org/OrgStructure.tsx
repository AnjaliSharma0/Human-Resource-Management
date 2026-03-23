
"use client";

import { useState, useEffect } from "react";
import {
  Box,
  Typography,
  Paper,
  Button,
  TextField,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  IconButton,
  MenuItem,
  Select,
  InputLabel,
  FormControl,
  Stack,
} from "@mui/material";
import VisibilityIcon from "@mui/icons-material/Visibility";
import { Edit, Delete, Person } from "@mui/icons-material";
import api from "@/app/src/services/api";
import { useRouter } from "next/navigation";


// ---------- Recursive OrgNode ----------
const OrgNode = ({ employee, employees }: { employee: any; employees: any[] }) => {
  const subs = employees.filter((e) => e.manager?.id === employee.id);



  return (
 <div className="relative ml-0 md:ml-8 mt-4">
      {/* Vertical connector line */}
      {subs.length > 0 && (
        <div className="absolute left-4 top-12 bottom-0 w-px bg-gray-300"></div>
      )}

      {/* Employee Card */}
      <Paper
        className="p-3 mb-3 rounded-xl shadow-sm hover:shadow-lg transition-all duration-200 cursor-pointer bg-white border border-gray-200"
        sx={{ borderLeft: "4px solid #3b82f6" }}
      >
        <div className="flex items-center gap-3">
          {/* Avatar Icon */}
          <div className="bg-blue-100 p-2 rounded-full flex items-center justify-center">
            <Person className="text-blue-600" />
          </div>

          {/* Employee Info */}
          <div className="flex-1">
            <Typography variant="subtitle1" className="font-semibold text-gray-800">
              {employee.firstName} {employee.lastName}
            </Typography>

            <Typography variant="body2" className="text-gray-600">
              {employee.designation?.title}
            </Typography>

            <Typography variant="caption" className="text-gray-400">
              {employee.department?.name} • {employee.department?.location}
            </Typography>

            <Typography variant="caption" className="text-gray-400">
              ({employee.user.role.toUpperCase()})
            </Typography>
          </div>
        </div>
      </Paper>

      {/* Subordinates */}
      {subs.length > 0 && (
        <div className="ml-8 border-l-2 border-gray-300 pl-6">
          {subs.map((sub) => (
            <OrgNode key={sub.id} employee={sub} employees={employees} />
          ))}
        </div>
      )}
    </div>
    // <div className="ml-0 md:ml-8 mt-4 relative">

    //   {/* Vertical Line */}
    //   <div className="absolute left-[-12px] top-0 h-full w-px bg-gray-300"></div>

    //   <Paper
    //     className="p-3 mb-3 rounded-xl shadow-sm hover:shadow-lg transition-all duration-200 cursor-pointer bg-white border border-gray-200"
    //     sx={{ borderLeft: "4px solid #3b82f6" }}
    //   >
    //     <div className="flex items-center gap-3">
    //       <div className="bg-blue-100 p-2 rounded-full">
    //         <Person className="text-blue-600" />
    //       </div>

    //       <div className="flex-1">
    //         <Typography variant="subtitle1" className="font-semibold text-gray-800">
    //           {employee.firstName} {employee.lastName}
    //         </Typography>

    //         <Typography variant="body2" className="text-gray-500">
    //           {employee.designation?.title}
    //         </Typography>

    //         <Typography variant="caption" className="text-gray-400">
    //           {employee.department?.name} • {employee.department?.location}
    //         </Typography>

    //         <Typography variant="caption" className="text-gray-400">
    //           ({employee.user.role.toUpperCase()})
    //         </Typography>
    //       </div>
    //     </div>
    //   </Paper>

    //   {/* Children */}
    //   {subs.length > 0 && (
    //     <div className="ml-6 border-l-2 border-dashed border-gray-300 pl-4">
    //       {subs.map((sub) => (
    //         <OrgNode key={sub.id} employee={sub} employees={employees} />
    //       ))}
    //     </div>
    //   )}
    // </div>
  );

};

// ---------- Main Dashboard ----------
export default function OrgStructureDashboard() {
  const [userRole, setUserRole] = useState<string>("employee");
  const [departments, setDepartments] = useState<any[]>([]);
  const [employees, setEmployees] = useState<any[]>([]);
  const [filteredEmployees, setFilteredEmployees] = useState<any[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedDept, setSelectedDept] = useState<number | "">("");
  const [modalOpen, setModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<any>(null);
  const [formData, setFormData] = useState<any>({});
  const [designations, setDesinations] = useState<any[]>([])
  const route = useRouter()
  useEffect(() => {
    const role = typeof window !== "undefined" ? localStorage.getItem("role") || "employee" : "employee";
    setUserRole(role);
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [empRes, deptRes, desigRes] = await Promise.all([api.get("/employees"), api.get("/departments"), api.get("/designations")]);
      setEmployees(empRes.data || []);
      setDepartments(deptRes.data || []);
      setDesinations(desigRes.data || [])
      console.log(desigRes.data)
      setFilteredEmployees(empRes.data || []);
    } catch (err) {
      console.error("Error fetching data", err);
    }
  };

  // ---------- Filter Logic ----------
  useEffect(() => {
    let temp = [...employees];

    // Filter by search
    if (searchTerm.trim() !== "") {
      const term = searchTerm.toLowerCase();
      temp = temp.filter(
        (e) => e.firstName.toLowerCase().includes(term) || e.lastName.toLowerCase().includes(term) || e.email.toLowerCase().includes(term)
      );
    }

    // Filter by department
    if (selectedDept !== "") {
      temp = temp.filter((e) => e.department?.id === selectedDept);
    }

    setFilteredEmployees(temp);
  }, [searchTerm, selectedDept, employees]);

  // ---------- CRUD Modal Handlers ----------
  const openAddModal = () => {
    setEditingItem(null);
    setFormData({});
    setModalOpen(true);
  };

  const openEditModal = (emp: any) => {
    setEditingItem(emp);
    setFormData({
      ...emp,
      departmentId: emp.department?.id,
      managerId: emp.manager?.id,
    });
    setModalOpen(true);
  };

  const handleSave = async () => {
    try {
      if (editingItem) {
        await api.put(`/employees/${editingItem.id}`, formData);
      } else {
        await api.post("/employees", formData);
      }
      setModalOpen(false);
      fetchData();
    } catch (err) {
      console.error("Error saving employee", err);
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm("Are you sure?")) return;
    try {
      await api.delete(`/employees/${id}`);
      fetchData();
    } catch (err) {
      console.error("Error deleting employee", err);
    }
  };

  const topManagers = employees.filter((emp) => emp.user.role === "manager");

  return (
    <Box sx={{ p: { xs: 2, md: 4 }, backgroundColor: "#f3f4f6", minHeight: "100vh" }}
      className="bg-gradient-to-br from-gray-50 to-gray-100 min-h-screen" >
      <Typography variant="h4" gutterBottom textAlign="center" className="font-bold mb-6">
        Org Structure & Analytics
      </Typography>

      {/* Admin Buttons */}
      {userRole === "admin" && (
        <Stack direction={{ xs: "column", sm: "row" }} spacing={2} justifyContent="center" className="mb-6">
          <Button variant="contained" color="primary" onClick={openAddModal}>
            Add Employee
          </Button>
        </Stack>
      )}

      {/* Search + Department Filter */}
      <Stack direction={{ xs: "column", sm: "row" }}
        spacing={2}
        mb={5}
        alignItems="center"
        justifyContent="center"
        className="bg-white p-4 rounded-2xl shadow-sm border border-gray-200">
        <TextField
          label="Search Employee"
          variant="outlined"
          size="small"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        <FormControl size="small" sx={{ minWidth: 180 }}>
          <InputLabel>Filter by Department </InputLabel>
          <Select value={selectedDept} label="Filter by Department " onChange={(e) => setSelectedDept(e.target.value)}>
            <MenuItem value="">All Departments</MenuItem>
            {departments.map((d) => (
              <MenuItem key={d.id} value={d.id}>{d.name}</MenuItem>
            ))}
          </Select>
        </FormControl>
      </Stack>

      <Stack direction={{ xs: "column", md: "row" }} spacing={3} flexWrap="wrap">
        {/* Departments */}
        <Paper sx={{ p: 3, flex: "1 1 250px" }}
          className="shadow-lg rounded-2xl border border-gray-200 bg-white">
          <Typography variant="h6" className="font-semibold mb-3 text-center">Departments</Typography>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 text-center">
            {departments.length > 0 ? (
              departments.map((d) => (
                <div key={d.id} className="mb-4">
                  {/* Department heading */}
                  <Paper className="shadow-lg rounded-2xl border border-gray-200 bg-white p-3 mb-2">
                    <Typography variant="h6">{d.name}</Typography>
                    <Typography variant="caption" className="text-gray-500">{d.location}</Typography>
                  </Paper>

                  {/* List of designations for this department */}
                  {designations
                    .filter((des) => des.department.id === d.id)
                    .map((des) => (
                      <Paper
                        key={des.id}
                        className="ml-4 shadow-sm rounded-xl border border-gray-100 bg-gray-50 p-2 mb-1"
                      >
                        <Typography variant="body2">{des.title}</Typography>
                      </Paper>
                    ))}
                </div>
              ))
            ) : (
              <Typography textAlign="center">No departments</Typography>
            )}
          </div>

        </Paper>
      </Stack>

    
      <Paper
        sx={{ p: 3, flex: "1 1 250px" }}
        className="shadow-lg rounded-2xl border border-gray-200 bg-white"
      >
        <Typography variant="h6" className="font-semibold mb-4 text-center">
          Employees
        </Typography>

        {filteredEmployees.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredEmployees.map((e) => (
              <div
                key={e.id}
                className="p-4 rounded-2xl border border-gray-200 bg-white 
                     shadow-sm hover:shadow-lg hover:-translate-y-1 
                     transition-all duration-300 flex flex-col justify-between"
              >
                {/* Top Section */}
                <div className="flex items-center gap-3 mb-3">
                  <div className="bg-blue-100 p-3 rounded-full">
                    <Person className="text-blue-600" />
                  </div>

                  <div>
                    <Typography className="font-semibold text-gray-800">
                      {e.firstName} {e.lastName}
                    </Typography>

                    <Typography variant="caption" className="text-gray-500">
                      {e.designation?.title}
                    </Typography>

                    <Typography variant="body2" className="text-gray-500 mb-3 px-7">
                      Dept: {e.department?.name}
                    </Typography>
                  </div>
                </div>

                {/* Department */}

                {/* Actions */}
                <div className="flex justify-center items-center mt-auto">
                  <Button
                    size="small"
                    onClick={() => route.push(`/employee/${e.id}`)}
                    className="text-blue-600"
                  >
                    <VisibilityIcon />
                  </Button>

                  {userRole === "admin" && (
                    <div className="flex gap-1">
                      <IconButton onClick={() => openEditModal(e)} size="small">
                        <Edit fontSize="small" />
                      </IconButton>
                      <IconButton onClick={() => handleDelete(e.id)} size="small">
                        <Delete fontSize="small" />
                      </IconButton>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <Typography  textAlign="center">No employees found</Typography>
        )}
      </Paper>

      {/* Hierarchy */}

      <Paper
        sx={{ p: 4, mt: 6, overflowX: "auto" }}
        className="shadow-xl rounded-2xl bg-white border border-gray-200"
      >
        <Typography
          variant="h6"
          textAlign="center"
          className="font-semibold mb-6 text-gray-700"
        >
          Organization Hierarchy
        </Typography>

        <div className="flex justify-center">
          {topManagers.length > 0 ? (
            topManagers.map((manager) => (
              <OrgNode
                key={manager.id}
                employee={manager}
                employees={filteredEmployees}
              />
            ))
          ) : (
            <Typography textAlign="center">No managers found</Typography>
          )}
        </div>
      </Paper>
      {/* Employee Modal */}
      <Dialog open={modalOpen} onClose={() => setModalOpen(false)} fullWidth maxWidth="sm">
        <DialogTitle>{editingItem ? "Edit" : "Add"} Employee</DialogTitle>
        <DialogContent sx={{ display: "flex", flexDirection: "column", gap: 2, mt: 1 }}>
          <TextField label="First Name" fullWidth value={formData.firstName || ""} onChange={e => setFormData({ ...formData, firstName: e.target.value })} />
          <TextField label="Last Name" fullWidth value={formData.lastName || ""} onChange={e => setFormData({ ...formData, lastName: e.target.value })} />
          <TextField label="Email" fullWidth value={formData.email || ""} onChange={e => setFormData({ ...formData, email: e.target.value })} />

          <FormControl fullWidth>
            <InputLabel>Department</InputLabel>
            <Select
              value={formData.departmentId || ""}
              label="Department"
              onChange={e => setFormData({ ...formData, departmentId: +e.target.value })}
            >
              {(departments || []).map(d => (
                <MenuItem key={d.id} value={d.id}>{d.name} ({d.location})</MenuItem>
              ))}
            </Select>
          </FormControl>

          <FormControl fullWidth>
            <InputLabel>Manager</InputLabel>
            <Select
              value={formData.managerId || ""}
              label="Manager"
              onChange={e => setFormData({ ...formData, managerId: +e.target.value })}
            >
              <MenuItem value="">None</MenuItem>
              {topManagers.map(emp => <MenuItem key={emp.id} value={emp.id}>{emp.firstName} {emp.lastName}</MenuItem>)}
            </Select>
          </FormControl>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setModalOpen(false)}>Cancel</Button>
          <Button variant="contained" onClick={handleSave}>{editingItem ? "Update" : "Add"}</Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}