
"use client";

import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

interface Leave {
  id: number;
  startDate: string;
  status: string;
}

export default function LeaveAnalytics({ leaves }: { leaves: Leave[] }) {

  const stats = {
    pending: leaves.filter((l) => l.status === "Pending").length,
    approved: leaves.filter((l) => l.status === "Approved").length,
    rejected: leaves.filter((l) => l.status === "Rejected").length,
  };

  const monthlyData: any = {};

  leaves.forEach((l) => {
    const month = new Date(l.startDate).toLocaleString("default", {
      month: "short",
    });

    if (!monthlyData[month]) {
      monthlyData[month] = { month, leaves: 0 };
    }

    monthlyData[month].leaves += 1;
  });

  const chartData = Object.values(monthlyData);

  return (
    <div className="grid gap-6">

      {/* Stats Cards */}
      <div className="grid grid-cols-3 gap-4">

        <div className="p-4 bg-yellow-100 rounded shadow">
          <h3 className="font-semibold">Pending</h3>
          <p className="text-2xl">{stats.pending}</p>
        </div>

        <div className="p-4 bg-green-100 rounded shadow">
          <h3 className="font-semibold">Approved</h3>
          <p className="text-2xl">{stats.approved}</p>
        </div>

        <div className="p-4 bg-red-100 rounded shadow">
          <h3 className="font-semibold">Rejected</h3>
          <p className="text-2xl">{stats.rejected}</p>
        </div>

      </div>

      {/* Leave Chart */}
      <div className="h-80 bg-white p-6 rounded-xl shadow">

        <h3 className="font-semibold mb-4">
          Leave Trend
        </h3>

        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={chartData}>
            <XAxis dataKey="month" />
            <YAxis />
            <Tooltip />
            <Line dataKey="leaves" />
          </LineChart>
        </ResponsiveContainer>

      </div>

    </div>
  );
}

