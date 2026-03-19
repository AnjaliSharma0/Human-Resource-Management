"use client";

import { useEffect, useState } from "react";
import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";
import { leaveApi } from "@/app/src/services/leave";
import toast from "react-hot-toast";
import LeaveTable from "@/app/components/leave/LeaveTable";
import HolidayPage from "@/app/components/leave/LeaveCreate";
import LeaveBalanceAdmin from "@/app/components/leave/LeaveAdminBalance";
import LeaveTypeAdmin from "@/app/components/leave/LeaveType";

interface Event {
  id: string | number;
  leaveId?: number;
  date: string;
  type: "holiday" | "leave";
  leaveStatus?: "pending" | "approved" | "rejected";
  leaveType?: string;
  employee?: { firstName: string; lastName?: string };
  name?: string;
  reason?: string;
}

export default function LeaveCalendarPage() {
  const [leaves, setLeaves] = useState<any[]>([]);
  const [events, setEvents] = useState<Event[]>([]);
  const [selectedLeave, setSelectedLeave] = useState<Event | null>(null);
  const [mounted, setMounted] = useState(false);

  const [tab, setTab] = useState("calendar");

  const [stats, setStats] = useState({
    pending: 0,
    approved: 0,
    rejected: 0,
    total: 0,
  });

  const [employeeFilter, setEmployeeFilter] = useState("");
  const [typeFilter, setTypeFilter] = useState("");

  const [actionLoading, setActionLoading] = useState(false);

  useEffect(() => {
    setMounted(true);
    fetchEvents();
    fetchLeaves();
  }, []);

  const fetchLeaves = async () => {
    try {
      const res = await leaveApi.getAllLeaves();
      const data = res.data || [];

      setLeaves(data);

      setStats({
        total: data.length,
        pending: data.filter((l: any) => l.status === "pending").length,
        approved: data.filter((l: any) => l.status === "approved").length,
        rejected: data.filter((l: any) => l.status === "rejected").length,
      });
    } catch {
      toast.error("Failed to fetch leaves");
    }
  };

  const fetchEvents = async () => {
    try {
      const holidayRes = await leaveApi.getHoliday();

      const holidays: Event[] = (holidayRes.data || []).map((h: any) => ({
        id: h.id,
        type: "holiday",
        date: h.date,
        name: h.name,
      }));

      const leaveRes = await leaveApi.getAllLeaves();

      const leaves: Event[] = (leaveRes.data || []).flatMap((l: any) => {
        const start = new Date(l.startDate);
        const end = new Date(l.endDate);

        const days: Event[] = [];

        for (let d = new Date(start); d <= end; d.setDate(d.getDate() + 1)) {
          days.push({
            id: `${l.id}-${d.getTime()}`,
            leaveId: l.id,
            type: "leave",
            date: new Date(d).toISOString(),
            leaveType: l.leaveType?.name || "Leave",
            leaveStatus: l.status || "pending",
            employee: {
              firstName: l.employee?.firstName || "Employee",
              lastName: l.employee?.lastName || "",
            },
            reason: l.reason,
          });
        }

        return days;
      });

      setEvents([...holidays, ...leaves]);
    } catch {
      toast.error("Failed to fetch events");
      setEvents([]);
    }
  };

  const approveLeave = async () => {
    if (!selectedLeave?.leaveId || actionLoading) return;

    try {
      setActionLoading(true);
      await leaveApi.updateLeaveStatus(selectedLeave.leaveId, "approved");
      toast.success("Leave Approved");

      setSelectedLeave((prev) =>
        prev ? { ...prev, leaveStatus: "approved" } : null
      );

      fetchEvents();
      fetchLeaves();
    } catch {
      toast.error("Failed to approve leave");
    } finally {
      setActionLoading(false);
    }
  };

  const rejectLeave = async () => {
    if (!selectedLeave?.leaveId || actionLoading) return;

    try {
      setActionLoading(true);
      await leaveApi.updateLeaveStatus(selectedLeave.leaveId, "rejected");
      toast.success("Leave Rejected");

      setSelectedLeave((prev) =>
        prev ? { ...prev, leaveStatus: "rejected" } : null
      );

      fetchEvents();
      fetchLeaves();
    } catch {
      toast.error("Failed to reject leave");
    } finally {
      setActionLoading(false);
    }
  };

  const tileContent = ({ date, view }: any) => {
    if (view !== "month") return null;

    const dayEvents = events.filter((e) => {
      const sameDay =
        new Date(e.date).toDateString() === date.toDateString();

      const employeeMatch = e.employee?.firstName
        ?.toLowerCase()
        .includes(employeeFilter.toLowerCase());

      const typeMatch = e.leaveType
        ?.toLowerCase()
        .includes(typeFilter.toLowerCase());

      return sameDay && employeeMatch && typeMatch;
    });

    if (!dayEvents.length) return null;

    return (
      <div className="flex flex-wrap justify-center gap-1 mt-1 text-[10px]">
        {dayEvents.map((e) => {
          if (e.type === "holiday") {
            return (
              <span
                key={e.id}
                className="px-1 rounded text-white bg-blue-500"
                title={e.name}
              >
                🎉
              </span>
            );
          }

          const color =
            e.leaveStatus === "approved"
              ? "bg-green-500"
              : e.leaveStatus === "pending"
              ? "bg-yellow-400"
              : "bg-red-500";

          return (
            <span
              key={e.id}
              className={`px-1 rounded text-white ${color} cursor-pointer`}
              onClick={() => setSelectedLeave(e)}
            >
              {e.employee?.firstName?.[0]}
            </span>
          );
        })}
      </div>
    );
  };

  if (!mounted) return null;

  return (
    <div className="p-4 sm:p-6 md:p-8 max-w-[1400px] mx-auto">

      <h2 className="text-xl sm:text-2xl font-semibold mb-4">
        Leave Management
      </h2>

      {/* Tabs */}
      <div className="flex gap-2 overflow-x-auto pb-2 mb-6">
        {["calendar", "leaveStats", "applications", "leaveTypes", "balance", "holidays"].map((t) => (
          <button
            key={t}
            onClick={() => setTab(t)}
            className={`px-3 py-2 rounded whitespace-nowrap text-sm ${
              tab === t ? "bg-blue-600 text-white" : "bg-gray-200"
            }`}
          >
            {t}
          </button>
        ))}
      </div>

      {/* Calendar */}
      {tab === "calendar" && (
        <div className="bg-white p-4 rounded-xl shadow overflow-x-auto">
          <div className="flex flex-col sm:flex-row gap-3 mb-4">
            <input
              placeholder="Filter by employee"
              value={employeeFilter}
              onChange={(e) => setEmployeeFilter(e.target.value)}
              className="border p-2 rounded w-full"
            />
            <input
              placeholder="Filter by leave type"
              value={typeFilter}
              onChange={(e) => setTypeFilter(e.target.value)}
              className="border p-2 rounded w-full"
            />
          </div>

          <Calendar tileContent={tileContent} />
        </div>
      )}

      {/* Stats */}
      {tab === "leaveStats" && (
        <div className="space-y-6">
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            <Stat title="Total" value={stats.total} />
            <Stat title="Pending" value={stats.pending} bg="bg-yellow-100" />
            <Stat title="Approved" value={stats.approved} bg="bg-green-100" />
            <Stat title="Rejected" value={stats.rejected} bg="bg-red-100" />
          </div>
        </div>
      )}

      {/* Applications */}
      {tab === "applications" && (
        <div className="overflow-x-auto">
          <LeaveTable leaves={leaves} showActions />
        </div>
      )}

      {/* Others */}
      {tab === "leaveTypes" && <LeaveTypeAdmin />}
      {tab === "balance" && <LeaveBalanceAdmin />}
      {tab === "holidays" && <HolidayPage />}

      {/* Modal */}
      {selectedLeave && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center p-4 z-50">
          <div className="bg-white p-6 rounded-xl w-full max-w-md">

            <h3 className="font-semibold mb-3">Leave Request</h3>

            <p><b>Employee:</b> {selectedLeave.employee?.firstName}</p>
            <p><b>Type:</b> {selectedLeave.leaveType}</p>
            <p><b>Status:</b> {selectedLeave.leaveStatus}</p>

            <div className="flex flex-wrap gap-2 mt-4">

              {selectedLeave.leaveStatus === "pending" && (
                <>
                  <button
                    onClick={approveLeave}
                    className="bg-green-500 text-white px-3 py-1 rounded w-full sm:w-auto"
                  >
                    Approve
                  </button>
                  <button
                    onClick={rejectLeave}
                    className="bg-red-500 text-white px-3 py-1 rounded w-full sm:w-auto"
                  >
                    Reject
                  </button>
                </>
              )}

              <button
                onClick={() => setSelectedLeave(null)}
                className="ml-auto text-gray-500"
              >
                Close
              </button>

            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function Stat({ title, value, bg }: any) {
  return (
    <div className={`${bg || "bg-white"} p-4 rounded shadow`}>
      <p className="text-sm">{title}</p>
      <h2 className="text-xl font-bold">{value}</h2>
    </div>
  );
}