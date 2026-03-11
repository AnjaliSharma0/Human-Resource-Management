import axios from "axios"
const api = axios.create({
baseURL: "http://localhost:5000", //nestjs backend
})

export const setAuthToken=(token:string|null)=>{
  if(token) api.defaults.headers.common["Authorization"]= `Bearer ${token}`;
  else delete api.defaults.headers.common["Authorization"]
}

// Set token after login
setAuthToken(localStorage.getItem("token"));

// Get employees
const employees = await api.get("/employees");

// Create employee
await api.post("/employees", {
  firstName: "Anjali",
  lastName: "Sharma",
  email: "anjali@gmail.com",
  phone: "9876543210",
  dateOfBirth: "1998-05-09",
  gender: "Female",
  address: "Mumbai",
  joiningDate: "2023-12-31",
  departmentId: 2,
  designationId: 1,
  managerId: null,
});
export default api