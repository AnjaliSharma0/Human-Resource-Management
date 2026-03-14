"use client";

import {
BarChart,
Bar,
XAxis,
YAxis,
Tooltip,
CartesianGrid,
ResponsiveContainer
} from "recharts";

export default function WeeklyActivityChart({ data }: any) {

const chartData = data.map((d: any) => ({
day: new Date(d.date).toLocaleDateString("en-US",{weekday:"short"}),
hours: d.totalHours
}));

return (

<div className="bg-white rounded-xl shadow p-4 h-80">

<h2 className="font-semibold mb-4">Weekly Activity</h2>

<ResponsiveContainer width="100%" height="100%">

<BarChart data={chartData}>

<CartesianGrid strokeDasharray="3 3" />

<XAxis dataKey="day" />

<YAxis />

<Tooltip />

<Bar dataKey="hours" radius={[6,6,0,0]} />

</BarChart>

</ResponsiveContainer>

</div>

);
}