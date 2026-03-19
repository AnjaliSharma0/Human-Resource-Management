


// // "use client";

// // import { useState, useEffect } from "react";
// // import {
// //   Box,
// //   Typography,
// //   Paper,
// //   Button,
// //   TextField,
// //   Dialog,
// //   DialogTitle,
// //   DialogContent,
// //   DialogActions,
// //   IconButton,
// //   MenuItem,
// //   Select,
// //   InputLabel,
// //   FormControl,
// //   Stack,
// // } from "@mui/material";
// // import { Edit, Delete } from "@mui/icons-material";
// // import { orgApi } from "@/app/src/services/orgApi";
// // import { createEmployee, deleteEmployee, getEmployees, updateEmployee } from "@/app/src/services/employee";
// // import OrgChart from "./OrgChart";

// // export default function OrgStructureDashboard() {
// //   // ---------- States ----------
// //   const [userRole, setUserRole] = useState<string>("employee");
// //   const [hierarchy, setHierarchy] = useState<any[]>([]);
// //   const [departments, setDepartments] = useState<any[]>([]);
// //   const [locations, setLocations] = useState<any[]>([]);
// //   const [businessUnits, setBusinessUnits] = useState<any[]>([]);
// //   const [employees, setEmployees] = useState<any[]>([]);

// //   // Modal states
// //   const [modalOpen, setModalOpen] = useState(false);
// //   const [modalType, setModalType] = useState<"department" | "location" | "bu" | "employee">("department");
// //   const [editingItem, setEditingItem] = useState<any>(null);

// //   // Form input
// //   const [inputName, setInputName] = useState("");
// //   const [formData, setFormData] = useState<any>({});

// //   // ---------- Fetch user role and data ----------
// //   useEffect(() => {
// //     const role = typeof window !== "undefined" ? localStorage.getItem("role") || "employee" : "employee";
// //     setUserRole(role);
// //     fetchAll();
// //   }, []);

// //   const fetchAll = async () => {
// //     try {
// //       const [hRes, dRes, lRes, buRes, eRes] = await Promise.all([
// //         orgApi.getHierarchy(),
// //         orgApi.getDepartments(),
// //         orgApi.getLocations(),
// //         orgApi.getBusinessUnits(),
// //         getEmployees(),
// //       ]);
// //       setHierarchy(hRes?.data || []);
// //       setDepartments(dRes?.data || []);
// //       setLocations(lRes?.data || []);
// //       setBusinessUnits(buRes?.data || []);
// //       setEmployees(eRes?.data || []);
// //     } catch (err) {
// //       console.error("Error fetching org data", err);
// //     }
// //   };

// //   // ---------- CRUD Handlers ----------
// //   const openAddModal = (type: "department" | "location" | "bu" | "employee") => {
// //     setModalType(type);
// //     setEditingItem(null);
// //     setInputName("");
// //     setFormData({});
// //     setModalOpen(true);
// //   };

// //   const openEditModal = (type: "department" | "location" | "bu" | "employee", item: any) => {
// //     setModalType(type);
// //     setEditingItem(item);
// //     setInputName(item.name || "");
// //     setFormData(item);
// //     setModalOpen(true);
// //   };

// //   const handleSave = async () => {
// //     try {
// //       if (modalType === "department") {
// //         if (editingItem) await orgApi.updateDepartment(editingItem.id, { name: inputName });
// //         else await orgApi.createDepartment({ name: inputName });
// //       }
// //       if (modalType === "location") {
// //         if (editingItem) await orgApi.updateLocation(editingItem.id, { name: inputName });
// //         else await orgApi.createLocation({ name: inputName });
// //       }
// //       if (modalType === "bu") {
// //         if (editingItem) await orgApi.updateBusinessUnit(editingItem.id, { name: inputName });
// //         else await orgApi.createBusinessUnit({ name: inputName });
// //       }
// //       if (modalType === "employee") {
// //         if (editingItem) await updateEmployee(editingItem.id, formData);
// //         else await createEmployee(formData);
// //       }
// //       setModalOpen(false);
// //       fetchAll();
// //     } catch (err) {
// //       console.error("Error saving", err);
// //     }
// //   };

// //   const handleDelete = async (type: string, id: number) => {
// //     if (!confirm("Are you sure?")) return;
// //     try {
// //       if (type === "department") await orgApi.deleteDepartment(id);
// //       if (type === "location") await orgApi.deleteLocation(id);
// //       if (type === "bu") await orgApi.deleteBusinessUnit(id);
// //       if (type === "employee") await deleteEmployee(id);
// //       fetchAll();
// //     } catch (err) {
// //       console.error("Error deleting", err);
// //     }
// //   };

// //   // ---------- Render List ----------
// //   const renderList = (items: any[] | undefined, type: string) => {
// //     if (!Array.isArray(items) || items.length === 0) return <Typography variant="body2">No data</Typography>;
// //     return items.map((item) => (
// //       <Box key={item.id} sx={{ display: "flex", alignItems: "center", gap: 1, mt: 0.5, flexWrap: "wrap" }}>
// //         <Typography>- {item.name || `${item.firstName || ""} ${item.lastName || ""}`}</Typography>
// //         {userRole === "admin" && (
// //           <>
// //             <IconButton onClick={() => openEditModal(type as any, item)} size="small"><Edit fontSize="small" /></IconButton>
// //             <IconButton onClick={() => handleDelete(type, item.id)} size="small"><Delete fontSize="small" /></IconButton>
// //           </>
// //         )}
// //       </Box>
// //     ));
// //   };

// //   // ---------- Render ----------
// //   return (
// //     <Box sx={{ p: { xs: 2, md: 3 } }}>
// //       <Typography variant="h4" gutterBottom textAlign="center">Org Structure & Analytics</Typography>

// //       {/* Admin Buttons */}
// //       {userRole === "admin" && (
// //         <Stack direction={{ xs: "column", sm: "row" }} spacing={1} sx={{ mb: 3 }} justifyContent="center">
// //           <Button variant="contained" onClick={() => openAddModal("department")}>Add Department</Button>
// //           <Button variant="contained" onClick={() => openAddModal("location")}>Add Location</Button>
// //           <Button variant="contained" onClick={() => openAddModal("bu")}>Add Business Unit</Button>
// //           <Button variant="contained" onClick={() => openAddModal("employee")}>Add Employee</Button>
// //         </Stack>
// //       )}

// //       {/* Lists in responsive Stack */}
// //       <Stack direction={{ xs: "column", md: "row" }} spacing={2} flexWrap="wrap">
// //         <Paper sx={{ p: 2, flex: "1 1 220px" }}>
// //           <Typography variant="h6">Departments</Typography>
// //           {renderList(departments, "department")}
// //         </Paper>
// //         <Paper sx={{ p: 2, flex: "1 1 220px" }}>
// //           <Typography variant="h6">Locations</Typography>
// //           {renderList(locations, "location")}
// //         </Paper>
// //         <Paper sx={{ p: 2, flex: "1 1 220px" }}>
// //           <Typography variant="h6">Business Units</Typography>
// //           {renderList(businessUnits, "bu")}
// //         </Paper>
// //         <Paper sx={{ p: 2, flex: "1 1 220px" }}>
// //           <Typography variant="h6">Employees</Typography>
// //           {renderList(employees, "employee")}
// //         </Paper>
// //       </Stack>

// //       {/* Org Chart */}
// //       <Paper sx={{ p: 2, mt: 3, overflowX: "auto" }}>
// //         <Typography variant="h6" gutterBottom textAlign="center">Employee Hierarchy</Typography>
// //         <OrgChart data={hierarchy || []} />
// //       </Paper>

// //       {/* Modal */}
// //       <Dialog open={modalOpen} onClose={() => setModalOpen(false)} fullWidth maxWidth="sm">
// //         <DialogTitle>{editingItem ? "Edit" : "Add"} {modalType}</DialogTitle>
// //         <DialogContent sx={{ display: "flex", flexDirection: "column", gap: 2, mt: 1 }}>
// //           {(modalType !== "employee") && (
// //             <TextField autoFocus label="Name" fullWidth value={inputName} onChange={(e) => setInputName(e.target.value)} />
// //           )}
// //           {modalType === "employee" && (
// //             <>
// //               <TextField label="First Name" fullWidth value={formData.firstName || ""} onChange={e => setFormData({ ...formData, firstName: e.target.value })} />
// //               <TextField label="Last Name" fullWidth value={formData.lastName || ""} onChange={e => setFormData({ ...formData, lastName: e.target.value })} />
// //               <TextField label="Email" fullWidth value={formData.email || ""} onChange={e => setFormData({ ...formData, email: e.target.value })} />
// //               <FormControl fullWidth>
// //                 <InputLabel>Department</InputLabel>
// //                 <Select value={formData.departmentId || ""} label="Department" onChange={e => setFormData({ ...formData, departmentId: +e.target.value })}>
// //                   {(departments || []).map(d => <MenuItem key={d.id} value={d.id}>{d.name}</MenuItem>)}
// //                 </Select>
// //               </FormControl>
// //               <FormControl fullWidth>
// //                 <InputLabel>Manager</InputLabel>
// //                 <Select value={formData.managerId || ""} label="Manager" onChange={e => setFormData({ ...formData, managerId: +e.target.value })}>
// //                   <MenuItem value="">None</MenuItem>
// //                   {(employees || []).map(emp => <MenuItem key={emp.id} value={emp.id}>{emp.firstName} {emp.lastName}</MenuItem>)}
// //                 </Select>
// //               </FormControl>
// //             </>
// //           )}
// //         </DialogContent>
// //         <DialogActions>
// //           <Button onClick={() => setModalOpen(false)}>Cancel</Button>
// //           <Button variant="contained" onClick={handleSave}>{editingItem ? "Update" : "Add"}</Button>
// //         </DialogActions>
// //       </Dialog>
// //     </Box>
// //   );
// // }

// // // Recursive count for subordinates
// // function countSubs(emp: any): number {
// //   if (!emp.subordinates || emp.subordinates.length === 0) return 0;
// //   return emp.subordinates.reduce((acc: number, sub: any) => acc + 1 + countSubs(sub), 0);
// // }


// "use client";

// import { useState, useEffect } from "react";
// import {
//   Box,
//   Typography,
//   Paper,
//   Button,
//   TextField,
//   Dialog,
//   DialogTitle,
//   DialogContent,
//   DialogActions,
//   IconButton,
//   MenuItem,
//   Select,
//   InputLabel,
//   FormControl,
//   Stack,
// } from "@mui/material";
// import { Edit, Delete } from "@mui/icons-material";
// import axios from "axios"; // Use axios to fetch employees and departments

// // ---------- Recursive OrgChart Component ----------
// import { Person } from "@mui/icons-material";
// import api from "@/app/src/services/api";

// const OrgNode = ({ employee, employees }: { employee: any; employees: any[] }) => {
//   const subs = employees.filter((e) => e.manager?.id === employee.id);
//   return (
//     <div className="ml-0 md:ml-4 mt-2 border-l border-gray-300 pl-4">
//       <div className="flex items-center gap-2 p-2 rounded hover:bg-gray-50 transition cursor-pointer">
//         <Person className="text-blue-500" />
//         <span className="font-medium">
//           {employee.firstName} {employee.lastName} - {employee.designation?.title} (
//           {employee.department?.name} - {employee.department?.location})
//         </span>
//       </div>
//       {subs.length > 0 &&
//         subs.map((sub) => <OrgNode key={sub.id} employee={sub} employees={employees} />)}
//     </div>
//   );
// };

// // ---------- Main Component ----------
// export default function OrgStructureDashboard() {
//   const [userRole, setUserRole] = useState<string>("employee");
//   const [departments, setDepartments] = useState<any[]>([]);
//   const [employees, setEmployees] = useState<any[]>([]);
//   const [modalOpen, setModalOpen] = useState(false);
//   const [modalType, setModalType] = useState<"employee">("employee");
//   const [editingItem, setEditingItem] = useState<any>(null);
//   const [formData, setFormData] = useState<any>({});

//   useEffect(() => {
//     const role = typeof window !== "undefined" ? localStorage.getItem("role") || "employee" : "employee";
//     setUserRole(role);
//     fetchData();
//   }, []);

//   const fetchData = async () => {
//     try {
//       const [empRes, deptRes] = await Promise.all([
//         api.get("/employees"),
//         api.get("/departments"),
//       ]);
//       setEmployees(empRes.data || []);
//       setDepartments(deptRes.data || []);
//     } catch (err) {
//       console.error("Error fetching data", err);
//     }
//   };

//   // ---------- CRUD Modal Handlers ----------
//   const openAddModal = () => {
//     setModalType("employee");
//     setEditingItem(null);
//     setFormData({});
//     setModalOpen(true);
//   };

//   const openEditModal = (emp: any) => {
//     setModalType("employee");
//     setEditingItem(emp);
//     setFormData({
//       ...emp,
//       departmentId: emp.department?.id,
//       managerId: emp.manager?.id,
//     });
//     setModalOpen(true);
//   };

//   const handleSave = async () => {
//     try {
//       if (editingItem) {
//         await api.put(`/employees/${editingItem.id}`, formData);
//       } else {
//         await api.post("/employees", formData);
//       }
//       setModalOpen(false);
//       fetchData();
//     } catch (err) {
//       console.error("Error saving employee", err);
//     }
//   };

//   const handleDelete = async (id: number) => {
//     if (!confirm("Are you sure?")) return;
//     try {
//       await api.delete(`/employees/${id}`);
//       fetchData();
//     } catch (err) {
//       console.error("Error deleting employee", err);
//     }
//   };

//   // ---------- Top-level Managers ----------
//   const topManagers = employees.filter((emp) => emp.user.role === "manager");
//   console.log("manager",topManagers)

//   return (
//     <Box sx={{ p: { xs: 2, md: 3 } }}>
//       <Typography variant="h4" gutterBottom textAlign="center">
//         Org Structure & Analytics
//       </Typography>

//       {userRole === "admin" && (
//         <Stack direction={{ xs: "column", sm: "row" }} spacing={1} sx={{ mb: 3 }} justifyContent="center">
//           <Button variant="contained" onClick={openAddModal}>Add Employee</Button>
//         </Stack>
//       )}

//       <Stack direction={{ xs: "column", md: "row" }} spacing={2} flexWrap="wrap">
//         <Paper sx={{ p: 2, flex: "1 1 220px" }}>
//           <Typography variant="h6">Departments</Typography>
//           {departments.length > 0 ? (
//             departments.map((d) => (
//               <Box key={d.id} sx={{ display: "flex", justifyContent: "space-between", mt: 0.5 }}>
//                 <Typography>- {d.name} ({d.location})</Typography>
//               </Box>
//             ))
//           ) : (
//             <Typography>No departments</Typography>
//           )}
//         </Paper>

//         <Paper sx={{ p: 2, flex: "1 1 220px" }}>
//           <Typography variant="h6">Employees</Typography>
//           {employees.length > 0 ? (
//             employees.map((e) => (
//               <Box key={e.id} sx={{ display: "flex", justifyContent: "space-between", mt: 0.5 }}>
//                 <Typography>- {e.firstName} {e.lastName}</Typography>
//                 {userRole === "admin" && (
//                   <>
//                     <IconButton onClick={() => openEditModal(e)} size="small"><Edit fontSize="small" /></IconButton>
//                     <IconButton onClick={() => handleDelete(e.id)} size="small"><Delete fontSize="small" /></IconButton>
//                   </>
//                 )}
//               </Box>
//             ))
//           ) : (
//             <Typography>No employees</Typography>
//           )}
//         </Paper>
//       </Stack>

//       <Paper sx={{ p: 2, mt: 3, overflowX: "auto" }}>
//         <Typography variant="h6" gutterBottom textAlign="center">
//           Employee Hierarchy
//         </Typography>
//         {topManagers.map((manager) => (
//           <OrgNode key={manager.id} employee={manager} employees={employees} />
//         ))}
//       </Paper>

//       {/* Employee Modal */}
//       <Dialog open={modalOpen} onClose={() => setModalOpen(false)} fullWidth maxWidth="sm">
//         <DialogTitle>{editingItem ? "Edit" : "Add"} Employee</DialogTitle>
//         <DialogContent sx={{ display: "flex", flexDirection: "column", gap: 2, mt: 1 }}>
//           <TextField label="First Name" fullWidth value={formData.firstName || ""} onChange={e => setFormData({ ...formData, firstName: e.target.value })} />
//           <TextField label="Last Name" fullWidth value={formData.lastName || ""} onChange={e => setFormData({ ...formData, lastName: e.target.value })} />
//           <TextField label="Email" fullWidth value={formData.email || ""} onChange={e => setFormData({ ...formData, email: e.target.value })} />

//           <FormControl fullWidth>
//             <InputLabel>Department</InputLabel>
//             <Select
//               value={formData.departmentId || ""}
//               label="Department"
//               onChange={e => setFormData({ ...formData, departmentId: +e.target.value })}
//             >
//               {(departments || []).map(d => <MenuItem key={d.id} value={d.id}>{d.name} ({d.location})</MenuItem>)}
//             </Select>
//           </FormControl>

//           <FormControl fullWidth>
//             <InputLabel>Manager</InputLabel>
//             <Select
//               value={formData.managerId || ""}
//               label="Manager"
//               onChange={e => setFormData({ ...formData, managerId: +e.target.value })}
//             >
//               <MenuItem value="">None</MenuItem>
//               {(topManagers || []).map(emp => <MenuItem key={emp.id} value={emp.id}>{emp.firstName} {emp.lastName}</MenuItem>)}
//             </Select>
//           </FormControl>
//         </DialogContent>
//         <DialogActions>
//           <Button onClick={() => setModalOpen(false)}>Cancel</Button>
//           <Button variant="contained" onClick={handleSave}>{editingItem ? "Update" : "Add"}</Button>
//         </DialogActions>
//       </Dialog>
//     </Box>
//   );
// }

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
import { Edit, Delete, Person } from "@mui/icons-material";
import api from "@/app/src/services/api";

// ---------- Recursive OrgNode ----------
const OrgNode = ({ employee, employees }: { employee: any; employees: any[] }) => {
  const subs = employees.filter((e) => e.manager?.id === employee.id);

  return (
    <div className="ml-0 md:ml-6 mt-2 border-l border-gray-300 pl-4">
      <Paper className="p-3 mb-1 shadow hover:shadow-lg transition cursor-pointer" sx={{ borderLeft: "4px solid #3b82f6" }}>
        <div className="flex items-center gap-3">
          <Person className="text-blue-500" />
          <div>
            <Typography variant="subtitle1" className="font-medium">
              {employee.firstName} {employee.lastName}
            </Typography>
            <Typography variant="body2" className="text-gray-500">
              {employee.designation?.title} | {employee.department?.name} - {employee.department?.location}
            </Typography>
          </div>
        </div>
      </Paper>

      {subs.length > 0 && subs.map((sub) => <OrgNode key={sub.id} employee={sub} employees={employees} />)}
    </div>
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

  useEffect(() => {
    const role = typeof window !== "undefined" ? localStorage.getItem("role") || "employee" : "employee";
    setUserRole(role);
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [empRes, deptRes] = await Promise.all([api.get("/employees"), api.get("/departments")]);
      setEmployees(empRes.data || []);
      setDepartments(deptRes.data || []);
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
    <Box sx={{ p: { xs: 2, md: 4 }, backgroundColor: "#f3f4f6", minHeight: "100vh" }}>
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
      <Stack direction={{ xs: "column", sm: "row" }} spacing={2} mb={4} alignItems="center" justifyContent="center">
        <TextField
          label="Search Employee"
          variant="outlined"
          size="small"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        <FormControl size="small" sx={{ minWidth: 180 }}>
          <InputLabel>Filter by Department</InputLabel>
          <Select value={selectedDept} label="Filter by Department" onChange={(e) => setSelectedDept(e.target.value)}>
            <MenuItem value="">All Departments</MenuItem>
            {departments.map((d) => (
              <MenuItem key={d.id} value={d.id}>{d.name}</MenuItem>
            ))}
          </Select>
        </FormControl>
      </Stack>

      <Stack direction={{ xs: "column", md: "row" }} spacing={3} flexWrap="wrap">
        {/* Departments */}
        <Paper sx={{ p: 3, flex: "1 1 250px" }} className="shadow-md">
          <Typography variant="h6" className="font-semibold mb-3">Departments</Typography>
          {departments.length > 0 ? (
            departments.map((d) => (
              <Paper key={d.id} className="p-2 mb-2 hover:bg-gray-100 transition cursor-pointer">
                <Typography variant="body1">{d.name}</Typography>
                <Typography variant="caption" className="text-gray-500">{d.location}</Typography>
              </Paper>
            ))
          ) : (
            <Typography>No departments</Typography>
          )}
        </Paper>

        {/* Employees */}
        <Paper sx={{ p: 3, flex: "1 1 250px" }} className="shadow-md">
          <Typography variant="h6" className="font-semibold mb-3">Employees</Typography>
          {filteredEmployees.length > 0 ? (
            filteredEmployees.map((e) => (
              <Paper key={e.id} className="p-2 mb-2 flex justify-between items-center hover:bg-gray-50 transition cursor-pointer">
                <div>
                  <Typography>{e.firstName} {e.lastName}</Typography>
                  <Typography variant="caption" className="text-gray-500">{e.designation?.title} | {e.department?.name}</Typography>
                </div>
                {userRole === "admin" && (
                  <div className="flex gap-1">
                    <IconButton onClick={() => openEditModal(e)} size="small"><Edit fontSize="small" /></IconButton>
                    <IconButton onClick={() => handleDelete(e.id)} size="small"><Delete fontSize="small" /></IconButton>
                  </div>
                )}
              </Paper>
            ))
          ) : (
            <Typography>No employees found</Typography>
          )}
        </Paper>
      </Stack>

      {/* Hierarchy */}
      <Paper sx={{ p: 3, mt: 6, overflowX: "auto" }} className="shadow-md">
        <Typography variant="h6" textAlign="center" className="font-semibold mb-4">Employee Hierarchy</Typography>
        {topManagers.length > 0 ? (
          topManagers.map((manager) => <OrgNode key={manager.id} employee={manager} employees={filteredEmployees} />)
        ) : (
          <Typography textAlign="center">No managers found</Typography>
        )}
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