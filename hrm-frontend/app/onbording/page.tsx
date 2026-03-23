"use client";

import { useState } from "react";
import DocumentUpload from "../components/onbording/DocumentUpload";
import ChecklistTracker from "../components/onbording/ChecklistTRcker";
import OrientationScheduler from "../components/onbording/OrientationSchedukar";


const tabs = ["Documents", "Orientation"];

export default function OnboardingPage() {
  const [activeTab, setActiveTab] = useState("Documents");

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Onboarding</h1>

      {/* Tabs */}
      <div className="flex gap-4 border-b mb-4">
        {tabs.map((tab) => (
          <button
            key={tab}
            className={`pb-2 ${activeTab === tab ? "border-b-2 border-blue-500" : ""}`}
            onClick={() => setActiveTab(tab)}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* Content */}
      {activeTab === "Documents" && <DocumentUpload />}
      {activeTab === "Checklist" && <ChecklistTracker />}
      {activeTab === "Orientation" && <OrientationScheduler />}
    </div>
  );
}