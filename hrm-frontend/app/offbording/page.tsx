"use client";

import { useState } from "react";
import useRole from "../src/hook/userole";
import NoDuesTable from "../components/offbording/NoduesTable";
import ExitInterviewForm from "../components/offbording/ExitInterview";
import SettlementCalculator from "../components/offbording/FinalSettlement";


const tabs = [
  { key: "Exit Interview", label: "Exit Interview" },
  { key: "No Dues", label: "No Dues Clearance" },
  { key: "Settlement", label: "Final Settlement" },
];

export default function OffboardingPage() {
  const [activeTab, setActiveTab] = useState("Exit Interview");
  const role = useRole();

  return (
    <div className="p-4 sm:p-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center mb-6 gap-2">
        <h1 className="text-2xl sm:text-3xl font-bold">Offboarding</h1>

        {/* Role Badge */}
        <span className="text-sm px-3 py-1 bg-gray-100 rounded w-fit">
          Role: {role || "Loading..."}
        </span>
      </div>

      {/* Tabs */}
      <div className="overflow-x-auto">
        <div className="flex gap-4 border-b min-w-max">
          {tabs.map((tab) => (
            <button
              key={tab.key}
              className={`pb-2 px-2 text-sm sm:text-base transition ${
                activeTab === tab.key
                  ? "border-b-2 border-red-500 font-semibold text-red-600"
                  : "text-gray-500 hover:text-black"
              }`}
              onClick={() => setActiveTab(tab.key)}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Content */}
      <div className="mt-6 bg-white shadow-sm rounded-xl p-4 sm:p-6 min-h-[300px]">
        {activeTab === "Exit Interview" && <ExitInterviewForm />}
        {activeTab === "No Dues" && <NoDuesTable />}
        {activeTab === "Settlement" && <SettlementCalculator />}
      </div>
    </div>
  );
}