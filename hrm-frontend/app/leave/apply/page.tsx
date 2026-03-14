"use client";

import LeaveForm from "@/app/components/leave/LeaveForm";
import { leaveApi } from "@/app/src/services/leave";
import Link from "next/link";
import { useState } from "react";
import toast from "react-hot-toast";


export default function ApplyLeavePage() {
    const [form, setForm] = useState({
        leaveTypeId: "",
        startDate: "",
        endDate: "",
        reason: "",
        duration: ""
    });




    return (
<div>
           <LeaveForm
  leaveTypes={[
    { id: 1, name: "Sick" },
    { id: 2, name: "Casual" }
  ]}
  onSubmit={async (data) => {

    const payload = {
      employeeId: 1, // get from logged in user later
      leaveTypeId: Number(data.leaveTypeId),
      startDate: data.startDate,
      endDate: data.endDate,
      reason: data.reason,
      duration: data.duration || "full"
    };

    console.log(payload);

    await leaveApi.applyLeave(payload);
    toast.success("Leave applied!");
  }}
/>

<div className="flex gap-4 mt-4">

  <Link
    href="/leave/balance"
    className="text-blue-600 underline"
  >
    View Leave Balance
  </Link>

  <Link
    href="/leave/history"
    className="text-blue-600 underline"
  >
    View Leave History
  </Link>

</div>
        </div>
    );
}