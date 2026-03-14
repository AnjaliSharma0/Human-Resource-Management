"use client";

import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from "recharts";

export default function WorkDonutChart({ hours }: any) {

const data = [
{ name: "Worked", value: hours },
{ name: "Remaining", value: Math.max(8 - hours, 0) }
];

const COLORS = ["#4F8EF7","#E5E7EB"];

return (

<div className="bg-white rounded-xl shadow p-4 h-80">

<h2 className="font-semibold mb-4">Today's Work</h2>

<ResponsiveContainer>

<PieChart>

<Pie
data={data}
innerRadius={70}
outerRadius={100}
dataKey="value"
paddingAngle={2}
>

{data.map((entry,index)=>(

<Cell key={index} fill={COLORS[index]} />

))}

</Pie>

<Tooltip />

</PieChart>

</ResponsiveContainer>

</div>

);
}