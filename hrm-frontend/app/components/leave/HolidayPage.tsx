"use client";

import { useEffect, useState } from "react";
import { holidayApi } from "@/app/src/services/leave";

export default function EmployeeHolidayPage() {
  const [holidays, setHolidays] = useState<any[]>([]);
  const [search, setSearch] = useState("");

  const fetchHolidays = async () => {
    try {
      const res = await holidayApi.getHolidays();

      const sorted = res.data.sort(
        (a: any, b: any) =>
          new Date(a.date).getTime() - new Date(b.date).getTime()
      );

      setHolidays(sorted);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchHolidays();
  }, []);

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const filteredHolidays = holidays
    .filter((h) =>
      h.name.toLowerCase().includes(search.toLowerCase())
    )
    .sort(
      (a, b) =>
        new Date(a.date).getTime() - new Date(b.date).getTime()
    );

  return (
    <div className="p-6">

      <h1 className="text-2xl font-bold mb-6">
        Company Holidays
      </h1>

      {/* Search */}
      <div className="flex justify-between mb-6">
        <input
          placeholder="Search holiday..."
          className="border p-2 rounded w-[250px]"
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      {/* Table */}
      <table className="w-full border">

        <thead>
          <tr className="bg-gray-100">
            <th className="p-3 border">Holiday</th>
            <th className="p-3 border">Date</th>
            <th className="p-3 border">Status</th>
          </tr>
        </thead>

        <tbody>
          {filteredHolidays.map((h) => {

            const holidayDate = new Date(h.date);
            holidayDate.setHours(0, 0, 0, 0);

            let badge = "bg-gray-100 text-gray-600";
            let label = "Past";

            if (holidayDate.getTime() === today.getTime()) {
              badge = "bg-blue-100 text-blue-600";
              label = "Today";
            } 
            else if (holidayDate > today) {
              badge = "bg-green-100 text-green-600";
              label = "Upcoming";
            }

            return (
              <tr key={h.id} className="hover:bg-gray-50">

                <td className="p-3 border font-medium">
                  {h.name}
                </td>

                <td className="p-3 border">
                  {holidayDate.toLocaleDateString()}
                </td>

                <td className="p-3 border">
                  <span className={`px-2 py-1 rounded text-xs ${badge}`}>
                    {label}
                  </span>
                </td>

              </tr>
            );
          })}
        </tbody>

      </table>

      {filteredHolidays.length === 0 && (
        <p className="text-center text-gray-500 mt-4">
          No holidays found
        </p>
      )}

    </div>
  );
}