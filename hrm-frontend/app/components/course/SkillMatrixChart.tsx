"use client";

import React from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  ResponsiveContainer,
  CartesianGrid
} from "recharts";

export type SkillMatrix = {
  employeeName: string;
  skills: string;
  proficiency: "Beginner" | "Intermediate" | "Advanced" | "Completed";
};

interface Props {
  data: SkillMatrix[];
}

const proficiencyMap: Record<string, number> = {
  Beginner: 1,
  Intermediate: 2,
  Advanced: 3,
  Completed: 4
};

const revProficiencyMap: Record<number, string> = {
  1: "Beginner",
  2: "Intermediate",
  3: "Advanced",
  4: "Completed"
};

const colors = [
  "#4f46e5", // indigo
  "#16a34a", // green
  "#f59e0b", // amber
  "#dc2626", // red
  "#0ea5e9"  // blue
];

export default function SkillMatrixChart({ data }: Props) {
  // Transform data into grouped chart format
  const chartData: any[] = [];

  data.forEach((item) => {
    const existing = chartData.find((d) => d.name === item.skills);
    if (existing) {
      existing[item.employeeName] = proficiencyMap[item.proficiency];
    } else {
      chartData.push({
        name: item.skills,
        [item.employeeName]: proficiencyMap[item.proficiency]
      });
    }
  });

  // Unique employee names for bars
  const employeeNames = Array.from(new Set(data.map((d) => d.employeeName)));

  return (
    <div className="bg-white p-4 rounded shadow">
      <h3 className="text-lg font-semibold mb-4">Skill Matrix Chart</h3>
      <ResponsiveContainer width="100%" height={400}>
        <BarChart data={chartData} margin={{ top: 20, right: 30, left: 0, bottom: 5 }}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="name" />
          <YAxis
            tickFormatter={(val) => revProficiencyMap[val as number] || val}
            domain={[0, 4]}
            ticks={[1, 2, 3, 4]}
          />
          <Tooltip
  formatter={(val) => {
    if (val === undefined || val === null) return "-"; // fallback
    return revProficiencyMap[val as number] || val;
  }}
/>
          <Legend />
          {employeeNames.map((emp, idx) => (
            <Bar
              key={emp}
              dataKey={emp}
              fill={colors[idx % colors.length]}
            />
          ))}
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}