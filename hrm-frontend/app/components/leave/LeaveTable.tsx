"use client";

interface LeaveTableProps {
  leaves: any[];
  employees?: any[]; // optional to maintain backward compatibility
  showActions?: boolean;
  onAction?: (id: number, status: "approved" | "rejected") => void;
}

export default function LeaveTable({
  leaves,
  employees,
  showActions = false,
  onAction,
}: LeaveTableProps) {
  if (!leaves || leaves.length === 0) {
    return (
      <div className="p-6 text-center text-gray-500 border rounded-lg">
        No leave records found
      </div>
    );
  }

  const formatDate = (date: string) => new Date(date).toLocaleDateString();

  const statusBadge = (status: string) => {
    const s = status?.toLowerCase() || "pending";

    if (s === "approved")
      return (
        <span className="px-2 py-1 text-xs font-semibold text-green-700 bg-green-100 rounded-full">
          Approved
        </span>
      );

    if (s === "rejected")
      return (
        <span className="px-2 py-1 text-xs font-semibold text-red-700 bg-red-100 rounded-full">
          Rejected
        </span>
      );

    return (
      <span className="px-2 py-1 text-xs font-semibold text-yellow-700 bg-yellow-100 rounded-full">
        Pending
      </span>
    );
  };

  // Create a map of employeeId => employeeName only if employees is provided
  const employeeMap: Record<number, string> = {};
  if (employees && employees.length) {
    employees.forEach((e) => {
      employeeMap[e.id] = `${e.firstName} ${e.lastName}`;
    });
  }

  return (
    <div className=" bg-white hover:bg-gray-200 overflow-x-auto border rounded-xl shadow-sm">
      <table className="min-w-full text-sm">
        <thead className="bg-gray-50 text-gray-700 bg-gray-300">
          <tr>
            <th className="px-4 py-3 text-left font-semibold">Employee</th>
            <th className="px-4 py-3 text-left font-semibold">Leave Type</th>
            <th className="px-4 py-3 text-left font-semibold">Start Date</th>
            <th className="px-4 py-3 text-left font-semibold">End Date</th>
            <th className="px-4 py-3 text-left font-semibold">Status</th>
            {showActions && <th className="px-4 py-3 text-left font-semibold">Actions</th>}
          </tr>
        </thead>

        <tbody className="divide-y divide-gray-200">
          {leaves.map((l) => (
            <tr key={l.id} className="hover:bg-gray-50 transition">
              <td className="px-4 py-3 font-medium">
                {employeeMap[l.employeeId] || l.employee?.firstName
                  ? `${l.employee?.firstName || ""} ${l.employee?.lastName || ""}`
                  : "Unknown"}
              </td>
              <td className="px-4 py-3">{l.leaveType?.name || "N/A"}</td>
              <td className="px-4 py-3">{formatDate(l.startDate)}</td>
              <td className="px-4 py-3">{formatDate(l.endDate)}</td>
              <td className="px-4 py-3">{statusBadge(l.status)}</td>

              {showActions && (
                <td className="px-4 py-3">
                  {l.status?.toLowerCase() === "pending" && onAction && (
                    <div className="flex gap-2">
                      <button
                        onClick={() => onAction(l.id, "approved")}
                        className="px-3 py-1 text-xs font-medium text-white bg-green-500 rounded hover:bg-green-600 transition"
                      >
                        Approve
                      </button>
                      <button
                        onClick={() => onAction(l.id, "rejected")}
                        className="px-3 py-1 text-xs font-medium text-white bg-red-500 rounded hover:bg-red-600 transition"
                      >
                        Reject
                      </button>
                    </div>
                  )}
                </td>
              )}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}