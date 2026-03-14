// "use client";

// import { Bar } from "react-chartjs-2";
// import {
// Chart as ChartJS,
// CategoryScale,
// LinearScale,
// BarElement,
// Title,
// Tooltip,
// Legend
// } from "chart.js";

// ChartJS.register(
// CategoryScale,
// LinearScale,
// BarElement,
// Title,
// Tooltip,
// Legend
// );

// export default function AttendanceChart(){

// const data={
// labels:["Mon","Tue","Wed","Thu","Fri"],

// datasets:[
// {
// label:"Attendance",
// data:[90,85,95,80,88]
// }
// ]
// }

// return(

// <div className="bg-white p-5 rounded-xl shadow">

// <h3 className="mb-3 font-semibold">
// Attendance Overview
// </h3>

// <Bar data={data}/>

// </div>

// )

// }


"use client";

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
} from "recharts";

type Props = {
  data: any[];
};

export default function AttendanceChart({ data }: Props) {
  const chartData = data.map((d) => ({
    date: new Date(d.date).toLocaleDateString("en-US", { weekday: "short" }),
    hours: d.totalHours,
  }));

  return (
    <div className="w-full h-80 bg-white rounded-xl shadow p-4">
      <h2 className="text-lg font-semibold mb-4">Weekly Activity</h2>

      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={chartData}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="date" />
          <YAxis />
          <Tooltip />
          <Bar dataKey="hours" radius={[6, 6, 0, 0]} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}