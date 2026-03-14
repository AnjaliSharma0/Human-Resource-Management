"use client";

import { useEffect, useState } from "react";
import {
Paper,
Typography,
Avatar,
Stack,
Chip,
Collapse,
IconButton,
Select,
MenuItem,
Divider
} from "@mui/material";

import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import ExpandLessIcon from "@mui/icons-material/ExpandLess";
import AccessTimeIcon from "@mui/icons-material/AccessTime";
import GroupsIcon from "@mui/icons-material/Groups";

import CalendarHeatmap from "react-calendar-heatmap";
import "react-calendar-heatmap/dist/styles.css";

import {
BarChart,
Bar,
XAxis,
YAxis,
Tooltip,
ResponsiveContainer
} from "recharts";

import api from "@/app/src/services/api";

export default function EmployeeAttendance(){

const [employees,setEmployees] = useState<any[]>([]);
const [expanded,setExpanded] = useState<number | null>(null);
const [selectedEmployee,setSelectedEmployee] = useState("");

useEffect(()=>{
fetchEmployees();
},[]);

const fetchEmployees = async ()=>{

const res = await api.get("/employees",{
headers:{
Authorization:`Bearer ${localStorage.getItem("token")}`
}
});

setEmployees(res.data);

};

const getStatus = (emp:any)=>{

if(emp.overtimeHours > 0) return {label:"Overtime",color:"error"};
if(emp.totalHours >= 8) return {label:"Present",color:"success"};

return {label:"Late",color:"warning"};

};

const chartData = employees.map((e:any)=>({
name:e.firstName,
hours:e.totalHours
}));

const filteredEmployees = selectedEmployee
? employees.filter(e=>e.id === selectedEmployee)
: employees;

const totalEmployees = employees.length;
const totalHours = employees.reduce((a,b)=>a + (b.totalHours || 0),0);

return(

<div className="p-6 space-y-8 bg-gray-50 min-h-screen">

{/* PAGE HEADER */}

<div className="flex justify-between items-center">

<Typography variant="h4" fontWeight="bold">
Employee Attendance Dashboard
</Typography>

<Select
size="small"
value={selectedEmployee}
onChange={(e)=>setSelectedEmployee(e.target.value)}
>

<MenuItem value="">All Employees</MenuItem>

{employees.map((emp:any)=>(
<MenuItem key={emp.id} value={emp.id}>
EID:{emp.id} - {emp.firstName}
</MenuItem>
))}

</Select>

</div>

{/* STATS CARDS */}

<div className="grid md:grid-cols-3 gap-6">

<Paper className="p-4 flex items-center gap-3">

<Avatar sx={{bgcolor:"#1976d2"}}>
<GroupsIcon/>
</Avatar>

<div>
<Typography variant="body2">Employees</Typography>
<Typography fontWeight="bold">{totalEmployees}</Typography>
</div>

</Paper>

<Paper className="p-4 flex items-center gap-3">

<Avatar sx={{bgcolor:"#2e7d32"}}>
<AccessTimeIcon/>
</Avatar>

<div>
<Typography variant="body2">Total Hours</Typography>
<Typography fontWeight="bold">{totalHours}</Typography>
</div>

</Paper>

</div>

{/* HEATMAP */}
<div className="bg-white rounded-2xl shadow-sm p-6">

{/* Header */}

<div className="flex items-center justify-between mb-6">

<h2 className="text-lg font-semibold text-gray-800">
Attendance Activity
</h2>

<span className="text-sm text-gray-500">
Last 90 days
</span>

</div>

{/* Stats */}

<div className="grid grid-cols-3 gap-4 mb-6">

<div className="bg-gray-50 rounded-lg p-4 text-center">
<p className="text-sm text-gray-500">Employees</p>
<p className="text-xl font-semibold text-gray-800">
{employees.length}
</p>
</div>

<div className="bg-gray-50 rounded-lg p-4 text-center">
<p className="text-sm text-gray-500">Total Hours</p>
<p className="text-xl font-semibold text-gray-800">
{employees.reduce((a,b)=>a+(b.totalHours || 0),0)}
</p>
</div>

<div className="bg-gray-50 rounded-lg p-4 text-center">
<p className="text-sm text-gray-500">Overtime</p>
<p className="text-xl font-semibold text-gray-800">
{employees.reduce((a,b)=>a+(b.overtimeHours || 0),0)}
</p>
</div>

</div>

{/* Heatmap */}

<div className="overflow-x-auto flex justify-center">

<div className="min-w-[700px]">

<CalendarHeatmap
startDate={new Date(new Date().setDate(new Date().getDate()-90))}
endDate={new Date()}
values={employees.map((e:any)=>({
date:e.lastAttendanceDate,
count:e.totalHours
}))}

weekdayLabels={["Sun","Mon","Tue","Wed","Thu","Fri","Sat"]}

classForValue={(value:any)=>{

  if(!value || value.count === 0) return "heatmap-empty";

  if(value.count >= 8) return "heatmap-4";
  if(value.count >= 6) return "heatmap-3";
  if(value.count >= 4) return "heatmap-2";

  return "heatmap-1";

}}


showWeekdayLabels
/>

</div>

</div>

{/* Legend */}

<div className="flex items-center justify-center gap-2 mt-6 text-sm text-gray-500">


<div className="w-4 h-4 rounded heatmap-empty"></div>
<div className="w-4 h-4 rounded heatmap-1"></div>
<div className="w-4 h-4 rounded heatmap-2"></div>
<div className="w-4 h-4 rounded heatmap-3"></div>
<div className="w-4 h-4 rounded heatmap-4"></div>

<span>More</span>

</div>

</div>

{/* EMPLOYEE CARDS */}

<div className="grid lg:grid-cols-3 md:grid-cols-2 gap-6">

{filteredEmployees.map((emp:any)=>{

const status = getStatus(emp);

return(

<Paper
key={emp.id}
className="p-5 rounded-xl hover:shadow-lg transition"
>

<Stack direction="row" spacing={2} alignItems="center">

<Avatar sx={{bgcolor:"#1976d2"}}>
{emp.firstName?.[0]}
</Avatar>

<div className="flex-1">

<Typography fontWeight="bold">
{emp.firstName} {emp.lastName}
</Typography>

<Typography variant="body2" color="text.secondary">
Total Hours: {emp.totalHours}
</Typography>

</div>

<Chip
label={status.label}
color={status.color as any}
size="small"
/>

</Stack>

<Divider sx={{my:2}}/>

<IconButton
onClick={()=>setExpanded(expanded === emp.id ? null : emp.id)}
size="small"
>

{expanded === emp.id ? <ExpandLessIcon/> : <ExpandMoreIcon/>}

</IconButton>

<Collapse in={expanded === emp.id}>

<Stack spacing={1} mt={1}>

{emp.sessions?.map((s:any,idx:number)=>(

<div
key={idx}
className="flex justify-between text-sm bg-gray-100 px-3 py-2 rounded"
>

<span>{new Date(s.clockIn).toLocaleTimeString()}</span>

<span>
{s.clockOut
? new Date(s.clockOut).toLocaleTimeString()
: "Ongoing"}
</span>

</div>

))}

</Stack>

</Collapse>

</Paper>

);

})}

</div>

{/* CHART */}

<Paper className="p-6">

<Typography fontWeight="bold" mb={3}>
Employee Work Hours
</Typography>

<div style={{height:350}}>

<ResponsiveContainer>

<BarChart data={chartData}>

<XAxis dataKey="name"/>

<YAxis/>

<Tooltip/>

<Bar dataKey="hours"/>

</BarChart>

</ResponsiveContainer>

</div>

</Paper>

</div>

);

}