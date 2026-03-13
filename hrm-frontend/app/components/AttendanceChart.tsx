"use client";

import { Bar } from "react-chartjs-2";
import {
Chart as ChartJS,
CategoryScale,
LinearScale,
BarElement,
Title,
Tooltip,
Legend
} from "chart.js";

ChartJS.register(
CategoryScale,
LinearScale,
BarElement,
Title,
Tooltip,
Legend
);

export default function AttendanceChart(){

const data={
labels:["Mon","Tue","Wed","Thu","Fri"],

datasets:[
{
label:"Attendance",
data:[90,85,95,80,88]
}
]
}

return(

<div className="bg-white p-5 rounded-xl shadow">

<h3 className="mb-3 font-semibold">
Attendance Overview
</h3>

<Bar data={data}/>

</div>

)

}