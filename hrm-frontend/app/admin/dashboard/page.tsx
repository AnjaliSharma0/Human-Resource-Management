"use client";

import { useEffect, useState } from "react";


import PeopleIcon from "@mui/icons-material/People";
import BusinessIcon from "@mui/icons-material/Business";
import EventIcon from "@mui/icons-material/Event";
import ReceiptIcon from "@mui/icons-material/Receipt";

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell
} from "recharts";
import api from "@/app/src/services/api";


export default function AdminDashboard() {

  const [employees,setEmployees] = useState([]);
  const [departments,setDepartments] = useState([]);
  const [leaves,setLeaves] = useState([]);
  const [expenses,setExpenses] = useState([]);

  const COLORS = ["#6366F1","#10B981","#F59E0B","#EF4444"];

  useEffect(()=>{

    const loadData = async()=>{

      const emp = await api.get("/employees");
      const dep = await api.get("/departments");
      const leave = await api.get("/leave");
      const exp = await api.get("/expenses");

      setEmployees(emp.data);
      setDepartments(dep.data);
      setLeaves(leave.data);
      setExpenses(exp.data);

    };

    loadData();

  },[]);

  const roleChart = [
    {
      name:"Admin",
      value:employees.filter((e:any)=>e.role==="admin").length
    },
    {
      name:"Manager",
      value:employees.filter((e:any)=>e.role==="manager").length
    },
    {
      name:"Employee",
      value:employees.filter((e:any)=>e.role==="employee").length
    }
  ];

  const departmentChart = departments.map((d:any)=>({
    name:d.name,
    employees:employees.filter((e:any)=>e.departmentId===d.id).length
  }));


  return (

  <div className="p-6 space-y-8">

  <h1 className="text-3xl font-bold">
  Admin Dashboard
  </h1>


  {/* STAT CARDS */}

  <div className="grid md:grid-cols-4 gap-6">

  <StatCard
  title="Employees"
  value={employees.length}
  icon={<PeopleIcon/>}
  color="bg-indigo-500"
/>

  <StatCard
  title="Departments"
  value={departments.length}
  icon={<BusinessIcon/>}
  color="bg-green-500"
/>

  <StatCard
  title="Leave Requests"
  value={leaves.length}
  icon={<EventIcon/>}
  color="bg-yellow-500"
/>

  <StatCard
  title="Expenses"
  value={expenses.length}
  icon={<ReceiptIcon/>}
  color="bg-red-500"
/>

  </div>


  {/* CHARTS */}

  <div className="grid md:grid-cols-2 gap-6">

  {/* ROLE CHART */}

  <div className="bg-white shadow rounded-xl p-4">

  <h2 className="font-semibold mb-4">
  Employee Roles
  </h2>

  <ResponsiveContainer width="100%" height={300}>

  <PieChart>

  <Pie
  data={roleChart}
  dataKey="value"
  nameKey="name"
  outerRadius={100}
  label
  >

  {roleChart.map((entry,index)=>(
  <Cell key={index} fill={COLORS[index % COLORS.length]}/>
  ))}

  </Pie>

  <Tooltip/>

  </PieChart>

  </ResponsiveContainer>

  </div>


  {/* DEPARTMENT CHART */}

  <div className="bg-white shadow rounded-xl p-4">

  <h2 className="font-semibold mb-4">
  Employees by Department
  </h2>

  <ResponsiveContainer width="100%" height={300}>

  <BarChart data={departmentChart}>

  <XAxis dataKey="name"/>
  <YAxis/>
  <Tooltip/>

  <Bar
  dataKey="employees"
  fill="#6366F1"
  />

  </BarChart>

  </ResponsiveContainer>

  </div>

  </div>

  </div>

  );

}


function StatCard({title,value,icon,color}:any){

return(

<div className={`${color} text-white p-5 rounded-xl shadow flex justify-between items-center`}>

<div>

<p className="text-sm opacity-80">
{title}
</p>

<h2 className="text-3xl font-bold">
{value}
</h2>

</div>

<div className="text-4xl">
{icon}
</div>

</div>

);

}