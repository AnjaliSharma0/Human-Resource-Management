"use client";

import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import api from "@/app/src/services/api";

export default function EditEmployeeModal({ employee, close, reload }: any) {

const [form,setForm] = useState({
firstName: employee.firstName || "",
lastName: employee.lastName || "",
email: employee.email || "",
phone: employee.phone || "",
dateOfBirth: employee.dateOfBirth?.slice(0,10) || "",
gender: employee.gender || "Male",
address: employee.address || "",
joiningDate: employee.joiningDate?.slice(0,10) || "",
status: employee.status || "Active",
 department: employee.department || "",
  designation: employee.designation || ""
});


const [departments, setDepartments] = useState([]);
const [designations, setDesignations] = useState([]);

useEffect(() => {
  const fetchData = async () => {
    const depRes = await api.get("/departments");
    const desRes = await api.get("/designations");
    setDepartments(depRes.data);
    setDesignations(desRes.data);
  };
  fetchData();
}, []);

const handleChange = (e:any)=>{
setForm({
...form,
[e.target.name]:e.target.value
});
};

const updateEmployee = async()=>{

try{

await api.patch(`/employees/${employee.id}`,form);

toast.success("Employee updated");

reload();
close();

}catch{

toast.error("Update failed");

}

};

return(

<div className="fixed inset-0 bg-black/40 flex justify-center items-center z-50">

<div className="bg-white rounded-xl p-6 w-[500px] shadow-xl">

<h2 className="text-xl font-bold mb-4">
Edit Employee
</h2>


<div className="grid grid-cols-2 gap-3">


<input
name="firstName"
value={form.firstName}
onChange={handleChange}
className="border p-2 rounded"
placeholder="First Name"
/>

<input
name="lastName"
value={form.lastName}
onChange={handleChange}
className="border p-2 rounded"
placeholder="Last Name"
/>

<input
name="email"
value={form.email}
onChange={handleChange}
className="border p-2 rounded"
placeholder="Email"
/>

<input
name="phone"
value={form.phone}
onChange={handleChange}
className="border p-2 rounded"
placeholder="Phone"
/>


<label className="text-sm text-gray-500 col-span-2">
Date of Birth
</label>

<input
type="date"
name="dateOfBirth"
value={form.dateOfBirth}
onChange={handleChange}
className="border p-2 rounded col-span-2"
/>


<select
name="gender"
value={form.gender}
onChange={handleChange}
className="border p-2 rounded"
>

<option value="Male">Male</option>
<option value="Female">Female</option>
<option value="Other">Other</option>

</select>


<select
name="status"
value={form.status}
onChange={handleChange}
className="border p-2 rounded"
>

<option value="Active">Active</option>
<option value="Pending">Pending</option>
<option value="Inactive">Inactive</option>

</select>


<input
name="joiningDate"
type="date"
value={form.joiningDate}
onChange={handleChange}
className="border p-2 rounded col-span-2"
/>


<input
name="address"
value={form.address}
onChange={handleChange}
className="border p-2 rounded col-span-2"
placeholder="Address"
/>

<select
  name="department"
  value={form.department}
  onChange={handleChange}
  className="border p-2 rounded"
>
  <option value="">Select Department</option>
  {departments.map((d:any) => (
    <option key={d.id} value={d.id}>{d.name}</option>
  ))}
</select>

<select
  name="designation"
  value={form.designation}
  onChange={handleChange}
  className="border p-2 rounded"
>
  <option value="">Select Designation</option>
  {designations.map((d:any) => (
    <option key={d.id} value={d.id}>{d.title}</option>
  ))}
</select>

</div>


<div className="flex justify-end gap-3 mt-5">

<button
onClick={close}
className="px-4 py-2 border rounded"
>
Cancel
</button>

<button
onClick={updateEmployee}
className="px-4 py-2 bg-indigo-600 text-white rounded"
>
Update Employee
</button>

</div>

</div>

</div>

);

}