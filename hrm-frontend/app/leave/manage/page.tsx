// "use client";

// import LeaveTable from "@/app/components/leave/LeaveTable";
// import { leaveApi } from "@/app/src/services/leave";
// import { useEffect, useState } from "react";
// import toast from "react-hot-toast";

// export default function LeaveManagePage() {
//   const [leaves, setLeaves] = useState<any[]>([]);
//   const [role, setRole] = useState<string>("employee");

//   useEffect(() => {
//     const storedRole = localStorage.getItem("role");
//     if (storedRole) setRole(storedRole);

//     fetchLeaves();
//   }, []);

//   const fetchLeaves = async () => {
//     try {
//       const res = await leaveApi.getAllLeaves();
//       setLeaves(res.data);
//     } catch (err) {
//       console.error(err);
//     }
//   };

//   const handleStatus = async (id: number, status: "Approved" | "Rejected") => {
//     try {
//       await leaveApi.updateLeaveStatus(id, status);
//       toast.success(`Leave ${status.toLowerCase()}!`);
//       fetchLeaves();
//     } catch (err: any) {
//       toast.error(err.response?.data?.message || "Error updating status");
//     }
//   };

//   // Only manager/admin can see this page
//   if (role === "employee") return <p className="p-6 text-red-500">Access denied</p>;

//   return (
//     <div className="p-6">
//       <h2 className="text-xl font-semibold mb-4">Manage Leaves</h2>
//       <LeaveTable
//         leaves={leaves}
//         showActions={true} // manager/admin can approve/reject
//         onAction={handleStatus}
//       />
//     </div>
//   );
// }



"use client";

import { useEffect, useState } from "react";
import Calendar from "react-calendar";
import 'react-calendar/dist/Calendar.css';
import { leaveApi } from "@/app/src/services/leave";
import LeaveTable from "@/app/components/leave/LeaveTable";
import toast from "react-hot-toast";

interface Event {
  id: string | number;
  date: string;
  type: "holiday" | "leave";
  leaveStatus?: "Pending" | "Approved" | "Rejected";
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
        const leaveTypeName = l.leaveType?.name || "Leave";
        const leaveStatus = l.status || "Pending";

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
              e.leaveStatus === "Approved"
                ? "bg-green-500"
                : e.leaveStatus === "Pending"
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
        <div className="mt-6 p-4 border rounded shadow-lg bg-white dark:bg-gray-800">
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
      )}
    </div>
  );
}