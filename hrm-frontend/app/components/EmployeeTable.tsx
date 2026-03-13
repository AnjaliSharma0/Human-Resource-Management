"use client";

import { useEffect,useState } from "react";

import toast from "react-hot-toast";

import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import { deleteEmployee, getEmployees } from "../src/services/employee";

export default function EmployeeTable(){

const [employees,setEmployees]=useState<any[]>([]);

const loadEmployees=async()=>{
const data=await getEmployees();
setEmployees(data);
};

useEffect(()=>{
loadEmployees();
},[]);

const handleDelete=async(id:number)=>{

await deleteEmployee(id);

toast.success("Employee deleted");

loadEmployees();

};

return(

<div className="bg-white p-6 rounded-xl shadow">

<h2 className="text-xl font-bold mb-4">
Employees
</h2>

<table className="w-full">

<thead className="border-b text-left">

<tr>
<th>Name</th>
<th>Email</th>
<th>Role</th>
<th>Actions</th>
</tr>

</thead>

<tbody>

{employees.map((emp)=>(
<tr key={emp.id} className="border-b">

<td>{emp.firstName}</td>

<td>{emp.email}</td>

<td>{emp.role}</td>

<td className="flex gap-3 py-2">

<EditIcon className="text-blue-500 cursor-pointer"/>

<DeleteIcon
className="text-red-500 cursor-pointer"
onClick={()=>handleDelete(emp.id)}
/>

</td>

</tr>
))}

</tbody>

</table>

</div>

);
}