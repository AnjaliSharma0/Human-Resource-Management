
"use client";

import LeaveCard from "@/app/components/leave/LeaveCard";
import { leaveApi } from "@/app/src/services/leave";
import { useEffect, useState } from "react";


export default function LeaveBalancePage() {
  const [balances, setBalances] = useState<any[]>([]);

  useEffect(() => {
    const fetchBalances = async () => {
      const res = await leaveApi.getLeaveBalance(1); // logged-in employeeId
      setBalances(res.data);
    };
    fetchBalances();
  }, []);

  return (
    <div className="p-6">
      <h2 className="text-xl font-semibold mb-4">Leave Balance</h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {balances.map((b) => (
          <div
            key={b.id}
            className="p-4 border rounded shadow flex flex-col items-center"
          >
            <h3 className="font-semibold">{b.leaveType.name}</h3>
            <p>Accrued: {b.accrued}</p>
            <p>Used: {b.used}</p>
            <p className="font-bold">Remaining: {b.remainingDays}</p>
          </div>
        ))}
      </div>
     
    </div>
  );
}