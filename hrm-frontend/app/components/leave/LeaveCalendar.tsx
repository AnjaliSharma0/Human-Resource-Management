"use client";

import { useEffect, useState } from "react";
import Calendar from "react-calendar";
import 'react-calendar/dist/Calendar.css';
import { leaveApi } from "@/app/src/services/leave";
import LeaveTable from "./LeaveTable";
import toast from "react-hot-toast";

interface Event {
  id: number;
  date: string;
  type: "holiday" | "leave";
  leaveStatus?: "Pending" | "Approved" | "Rejected";
  leaveType?: string;
  employee?: { firstName: string; lastName: string; id: number };
  holidayName?: string;
}

export default function LeaveCalendar() {
  const [events, setEvents] = useState<Event[]>([]);
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [role, setRole] = useState<string>("employee");


//    const [events, setEvents] = useState<any[]>([]);
//   const [selectedDate, setSelectedDate] = useState<Date | null>(null);
//   const [role, setRole] = useState<string | null>(null); // null until loaded

  useEffect(() => {
    // only run in client
    const storedRole = localStorage.getItem("role");
    if (storedRole) setRole(storedRole);

    const fetchCalendar = async () => {
      try {
        const res = await leaveApi.getLeaveCalendar();
        setEvents(res.data);
      } catch (err) {
        console.error(err);
      }
    };

    fetchCalendar();
  }, []);


  const fetchCalendar = async () => {
    try {
      const res = await leaveApi.getLeaveCalendar(); // returns all leaves + holidays
      setEvents(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  const handleAction = async (id: number, status: "Approved" | "Rejected") => {
    try {
      await leaveApi.updateLeaveStatus(id, status);
      toast.success(`Leave ${status.toLowerCase()}!`);
      fetchCalendar();
    } catch (err: any) {
      toast.error(err.response?.data?.message || "Error updating status");
    }
  };

  const tileContent = ({ date, view }: any) => {
    if (view !== "month") return null;

    // const dayEvents = events.filter(
    //   (e) => new Date(e.date).toDateString() === date.toDateString()
    // );

    // if (!dayEvents.length) return null;

    // ensure events is always array
    const dayEvents = Array.isArray(events)
      ? events.filter(
          (e) => new Date(e.date).toDateString() === date.toDateString()
        )
      : [];

    if (!dayEvents.length) return null;

    return (
      <div className="flex flex-wrap gap-1 mt-1">
        {dayEvents.map((e) => {
          if (e.type === "holiday") {
            return (
              <span
                key={e.id}
                className="text-xs bg-red-500 text-white px-1 rounded"
                title={e.holidayName}
              >
                🎉
              </span>
            );
          } else {
            const color =
              e.leaveStatus === "Approved"
                ? "bg-green-500"
                : e.leaveStatus === "Pending"
                ? "bg-yellow-400"
                : "bg-red-500";

            return (
              <span
                key={e.id}
                className={`text-xs px-1 rounded text-white ${color} cursor-pointer`}
                onClick={() => setSelectedDate(date)}
                title={`${e.employee?.firstName} ${e.employee?.lastName} - ${e.leaveStatus}`}
              >
                {e.leaveType?.[0] || "L"}
              </span>
            );
          }
        })}
      </div>
    );
  };

  // Get events for selected date
  const selectedEvents = selectedDate
    ? events.filter(
        (e) => new Date(e.date).toDateString() === selectedDate.toDateString() && e.type === "leave"
      )
    : [];

  return (
    <div className="p-6">
      <h2 className="text-xl font-semibold mb-4">Leave Calendar</h2>

      <Calendar
        tileContent={tileContent}
        onClickDay={(value) => setSelectedDate(value)}
      />

      {selectedDate && selectedEvents.length > 0 && (
        <div className="mt-4 p-4 border rounded shadow bg-white dark:bg-gray-800">
          <h3 className="font-semibold mb-2">
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
            }))}
            showActions={role !== "employee"}
            onAction={handleAction}
          />
        </div>
      )}
    </div>
  );
}