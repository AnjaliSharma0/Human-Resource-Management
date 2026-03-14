"use client";

interface LeaveCardProps {
  leaveType: string;
  accrued: number;
  used: number;
  remaining: number;
}

export default function LeaveCard({ leaveType, accrued, used, remaining }: LeaveCardProps) {
  return (
    <div className="p-4 border rounded shadow flex flex-col items-center bg-white dark:bg-gray-800">
      <h3 className="font-semibold text-lg">{leaveType}</h3>
      <p>Accrued: {accrued}</p>
      <p>Used: {used}</p>
      <p className="font-bold text-blue-600">Remaining: {remaining}</p>
    </div>
  );
}