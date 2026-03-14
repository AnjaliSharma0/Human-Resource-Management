// /app/components/LeaveTable.tsx
"use client";

interface LeaveTableProps {
  leaves: any[];
  showActions?: boolean;
  onAction?: (id: number, status: "Approved" | "Rejected") => void;
}

export default function LeaveTable({ leaves, showActions = false, onAction }: LeaveTableProps) {
  return (
    <table className="min-w-full border rounded">
      <thead>
        <tr className="bg-gray-100 dark:bg-gray-700">
          <th className="p-2">Employee</th>
          <th className="p-2">Type</th>
          <th className="p-2">Start</th>
          <th className="p-2">End</th>
          <th className="p-2">Status</th>
          {showActions && <th className="p-2">Actions</th>}
        </tr>
      </thead>
      <tbody>
        {leaves.map((l) => (
          <tr key={l.id} className="border-t">
            <td className="p-2">{l.employee?.firstName} {l.employee?.lastName || '-'}</td>
            <td className="p-2">{l.leaveType.name}</td>
            <td className="p-2">{l.startDate}</td>
            <td className="p-2">{l.endDate}</td>
            <td
              className={`p-2 ${
                l.status === "Approved"
                  ? "text-green-600"
                  : l.status === "Rejected"
                  ? "text-red-600"
                  : "text-yellow-600"
              }`}
            >
              {l.status}
            </td>
            {showActions && (
              <td className="p-2 flex gap-2">
                {l.status === "Pending" && onAction && (
                  <>
                    <button
                      onClick={() => onAction(l.id, "Approved")}
                      className="bg-green-500 text-white p-1 rounded hover:bg-green-600"
                    >
                      Approve
                    </button>
                    <button
                      onClick={() => onAction(l.id, "Rejected")}
                      className="bg-red-500 text-white p-1 rounded hover:bg-red-600"
                    >
                      Reject
                    </button>
                  </>
                )}
              </td>
            )}
          </tr>
        ))}
      </tbody>
    </table>
  );
}