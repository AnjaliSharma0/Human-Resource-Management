"use client";

import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from "recharts";

export default function ProjectChart({ hours }: { hours: number }) {
  const data = [
    { name: "Worked Hours", value: hours },
    { name: "Remaining", value: 8 - hours },
  ];

  const COLORS = ["#4F8EF7", "#E5E7EB"];

  return (
    <div className="w-full h-80 bg-white rounded-xl shadow p-4">
      <h2 className="text-lg font-semibold mb-4">Today's Work</h2>

      <ResponsiveContainer>
        <PieChart>
          <Pie
            data={data}
            innerRadius={70}
            outerRadius={100}
            paddingAngle={3}
            dataKey="value"
          >
            {data.map((entry, index) => (
              <Cell key={index} fill={COLORS[index]} />
            ))}
          </Pie>

          <Tooltip />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
}