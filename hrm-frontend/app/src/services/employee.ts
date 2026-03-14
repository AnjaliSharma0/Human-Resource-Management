import api from "./api";

// CREATE EMPLOYEE
export const createEmployee = async (data:any) => {
  const res = await api.post("/employees", data);
  return res.data;
};

// GET ALL EMPLOYEES
export const getEmployees = async () => {
  const res = await api.get("/employees");
  return res.data;
};

// GET SINGLE EMPLOYEE
export const getEmployee = async (id:number) => {
  const res = await api.get(`/employees/${id}`);
  return res.data;
};

// UPDATE EMPLOYEE
export const updateEmployee = async (id:number,data:any) => {
  const res = await api.patch(`/employees/${id}`,data);
  return res.data;
};

// DELETE EMPLOYEE
export const deleteEmployee = async (id:number) => {
  const res = await api.delete(`/employees/${id}`);
  return res.data;
};

// GET PROFILE
export const getEmployeeProfile = async (id:number) => {
  const res = await api.get(`/employees/${id}/profile`);
  return res.data;
};

// TEAM MEMBERS
export const getTeamMembers = async (id:number) => {
  const res = await api.get(`/employees/${id}/team`);
  return res.data;
};



// Get logged-in employee info
export const getEmployeeInfo = async () => {
  const response = await api.get("/employees/me");
  return response.data;
};

// Get employees in the same department
export const getDepartmentEmployees = async () => {
  const response = await api.get("/departments");
  return response.data;
};