"use client";

import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts";

export default function PayrollCharts({ payrolls }: any) {

  const data = payrolls.map((p:any)=>({
    month: p.month,
    salary: p.netSalary
  }));

  return (
    <div className="h-80 bg-white p-6 rounded-xl shadow">

      <h2 className="font-bold mb-4">
        Payroll Trend
      </h2>

      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={data}>
          <XAxis dataKey="month"/>
          <YAxis/>
          <Tooltip/>
          <Line dataKey="salary"/>
        </LineChart>
      </ResponsiveContainer>

    </div>
  );
}