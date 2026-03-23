

"use client";

import { useEffect, useState } from "react";
import Calendar from "react-calendar";
import 'react-calendar/dist/Calendar.css';
import { leaveApi } from "@/app/src/services/leave";
import LeaveTable from "@/app/components/leave/LeaveTable";
import toast from "react-hot-toast";
import { CheckCircle, Trash2 } from "lucide-react";

interface Event {
  id: string | number;
  date: string;
  type: "holiday" | "leave";
  leaveStatus?: "pending" | "approved" | "rejected";
  leaveType?: string;
  employee?: { firstName: string; lastName?: string };
  name?: string; // holiday name
  reason?: string;
}

export default function LeaveCalendarPage() {
  const [events, setEvents] = useState<Event[]>([]);
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [role, setRole] = useState<string | null>(null);
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
    const storedRole = localStorage.getItem("role");
    if (storedRole) setRole(storedRole);

    fetchEvents();
  }, []);

  const fetchEvents = async () => {
    try {
      // fetch holidays
      const holidayRes = await leaveApi.getHoliday();
      const holidays: Event[] = (holidayRes.data || []).map((h: any) => ({
        id: h.id,
        type: "holiday",
        date: h.date,
        name: h.name,
      }));

      // fetch leaves for admin/manager
      const leaveRes = await leaveApi.getAllLeaves();
      const leaves: Event[] = (leaveRes.data || []).flatMap((l: any) => {
        const employee = {
          firstName: l.employee?.firstName || `Employee ${l.employeeId}`,
          lastName: l.employee?.lastName || "",
        };
        const leaveTypeName = l.leaveType?.name;
        const leaveStatus = l.status || "pending";

        const start = new Date(l.startDate);
        const end = new Date(l.endDate);
        const days: Event[] = [];
        for (let d = new Date(start); d <= end; d.setDate(d.getDate() + 1)) {
          // create unique id per day
          days.push({
            id: l.id + "-" + d.getDate(),
            type: "leave",
            date: new Date(d).toISOString(),
            leaveType: leaveTypeName,
            leaveStatus,
            employee,
            reason: l.reason,
          });
        }
        return days;
      });

      setEvents([...holidays, ...leaves]);
    } catch (err) {
      console.error(err);
      setEvents([]);
    }
  };

  if (!isClient) return null;

  const tileContent = ({ date, view }: any) => {
    if (view !== "month") return null;

    const dayEvents = events.filter(
      (e) => new Date(e.date).toDateString() === date.toDateString()
    );

    if (!dayEvents.length) return null;

    return (
      <div className="flex flex-col items-center text-xs mt-1 space-y-0.5">
        {dayEvents.map((e) => {
          if (e.type === "holiday") {
            return (
              <span
                key={e.id}
                className="px-1 rounded text-white bg-red-500 text-center"
                title={e.name}
              >
                🎉 {e.name}
              </span>
            );
          } else {
            const color =
              e.leaveStatus === "approved"
                ? "bg-green-500"
                : e.leaveStatus === "pending"
                  ? "bg-yellow-400"
                  : "bg-red-500";

            return (
              <span
                key={e.id}
                className={`px-1 rounded text-white ${color} cursor-pointer hover:scale-110 transition-transform`}
                title={`${e.leaveType} - ${e.leaveStatus} - ${e.employee?.firstName} ${e.employee?.lastName}\nReason: ${e.reason}`}
                onClick={() => role !== "employee" && setSelectedDate(new Date(e.date))}
              >
                {e.leaveType?.[0] || "L"}
              </span>
            );
          }
        })}
      </div>
    );
  };

  const selectedEvents = selectedDate
    ? events.filter(
      (e) =>
        new Date(e.date).toDateString() === selectedDate.toDateString() &&
        e.type === "leave"
    )
    : [];

  return (
    <div className="p-6">
      <h2 className="text-2xl font-semibold mb-4">Leave Calendar</h2>

      <Calendar
        tileContent={tileContent}
        onClickDay={(value) => role !== "employee" && setSelectedDate(value)}
      />


{selectedDate && selectedEvents.length > 0 && role !== "employee" && (
  <div className="mt-6 p-6 border border-gray-200 rounded-xl shadow-md bg-white overflow-x-auto">
    <h3 className="text-lg font-semibold mb-4 text-gray-800">
      Leaves on <span className="font-medium text-indigo-600">{selectedDate.toDateString()}</span>
    </h3>

    <table className="min-w-full text-left border-collapse">
      <thead className="bg-gray-50">
        <tr>
          <th className="px-4 py-2 font-medium text-gray-700">Employee</th>
          <th className="px-4 py-2 font-medium text-gray-700">Type</th>
          <th className="px-4 py-2 font-medium text-gray-700">Start</th>
          <th className="px-4 py-2 font-medium text-gray-700">End</th>
          <th className="px-4 py-2 font-medium text-gray-700">Status</th>
          <th className="px-4 py-2 font-medium text-gray-700">Reason</th>
          <th className="px-4 py-2 font-medium text-gray-700">Actions</th>
        </tr>
      </thead>
      <tbody>
        {selectedEvents.map((leave) => (
          <tr key={leave.id} className="hover:bg-gray-50 transition-colors">
            <td className="px-4 py-3 text-gray-700">
              {leave.employee?.firstName} {leave.employee?.lastName || ""}
            </td>
            <td className="px-4 py-3 text-gray-600">{leave.leaveType}</td>
            <td className="px-4 py-3 text-gray-600">{leave.date}</td>
            <td className="px-4 py-3 text-gray-600">{leave.date}</td>
            <td className="px-4 py-3">
              <span
                className={`px-2 py-1 rounded-full text-sm font-medium ${
                  leave.leaveStatus === "approved"
                    ? "bg-green-100 text-green-800"
                    : leave.leaveStatus === "rejected"
                    ? "bg-red-100 text-red-800"
                    : "bg-yellow-100 text-yellow-800"
                }`}
              >
                {leave.leaveStatus}
              </span>
            </td>
            <td className="px-4 py-3 text-gray-600">{leave.reason}</td>
            <td className="px-4 py-3 flex gap-2">
              <button
                onClick={async () => {
                  try {
                    const originalId = leave.id.toString().split("-")[0];
                    await leaveApi.updateLeaveStatus(Number(originalId), "approved");
                    toast.success("Leave approved!");
                    await fetchEvents();
                  } catch {
                    toast.error("Failed to update leave");
                  }
                }}
                className="p-2 rounded-full bg-green-100 text-green-700 hover:bg-green-200 transition"
              >
                <CheckCircle fontSize="small" />
              </button>
              <button
                onClick={async () => {
                  try {
                    const originalId = leave.id.toString().split("-")[0];
                    await leaveApi.updateLeaveStatus(Number(originalId), "rejected");
                    toast.success("Leave rejected!");
                    await fetchEvents();
                  } catch {
                    toast.error("Failed to update leave");
                  }
                }}
                className="p-2 rounded-full bg-red-100 text-red-700 hover:bg-red-200 transition"
              >
                <Trash2 fontSize="small" />
              </button>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  </div>
)}
      {/* {selectedDate && selectedEvents.length > 0 && role !== "employee" && (
        <div className="mt-6 p-4 border-black-6- rounded shadow-lg bg-white shadow-lg">
          <h3 className="font-semibold mb-3">
            Leaves on {selectedDate.toDateString()}
          </h3>
          <LeaveTable
            leaves={selectedEvents.map((e) => ({
              id: e.id,
              employee: e.employee,
              leaveType: { name: e.leaveType },
              startDate: e.date,
              endDate: e.date,
              status: e.leaveStatus,
              reason: e.reason,
            }))}
            showActions={true}
            onAction={async (id, status) => {
              try {
                // convert to string first
                const originalId = id.toString().split("-")[0];
                await leaveApi.updateLeaveStatus(Number(originalId), status);
                toast.success(`Leave ${status.toLowerCase()}!`);
                await fetchEvents(); // refresh calendar
              } catch {
                toast.error("Failed to update leave");
              }
            }}
          />
        </div>
      )} */}
    </div>
  );
}