"use client";

import { useEffect, useState } from "react";
import { getEmployeeInfo, getDepartmentEmployees } from "@/app/src/services/employee";
import ProfileTab from "@/app/components/profileTabs/ProfileTab";
import DocumentsTab from "@/app/components/profileTabs/DocumentTab";
import ContactsTab from "@/app/components/profileTabs/ContactTab";
import HistoryTab from "@/app/components/profileTabs/HistoryTab";
import { UserCircleIcon } from "@heroicons/react/24/solid";
import Loading from "@/app/components/Loading";

export default function EmployeeDashboard() {
  const [myInfo, setMyInfo] = useState<any>(null);
  const [departmentEmployees, setDepartmentEmployees] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("profile");

  useEffect(() => {
    const fetchData = async () => {
      try {
        const me = await getEmployeeInfo();
        const deptEmps = await getDepartmentEmployees();
        setMyInfo(me);
        setDepartmentEmployees(deptEmps.filter((emp: any) => emp.id !== me.id));
      } catch (err) {
        console.error("Error fetching data:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

 if (loading) return <Loading message="Loading..." size="lg"/>
  if (!myInfo) return <p className="p-6 text-red-500">Could not fetch employee info</p>;

  return (
    <div className="p-6 space-y-8">

      {/* --- Employee Card --- */}
      <div className="flex items-center bg-blue-50 p-6 rounded-xl shadow-md space-x-6">
        <UserCircleIcon className="h-20 w-20 text-blue-400" />
        <div>
          <h2 className="text-2xl font-bold">{myInfo.firstName} {myInfo.lastName}</h2>
          <p className="text-gray-700">{myInfo.designation?.title || "N/A"} - {myInfo.department?.name || "N/A"} - {myInfo.department?.location}</p>
          <p className="text-gray-500">Joined: {new Date(myInfo.joiningDate).toLocaleDateString()}</p>
        </div>
      </div>

      {/* --- Tabs --- */}
      <div className="bg-white p-4 rounded-xl shadow-md">
        <div className="flex gap-6 border-b mb-4">
          {["profile", "documents", "contacts", "history"].map(tab => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`pb-2 font-semibold border-b-2 ${
                activeTab === tab ? "border-blue-500 text-blue-600" : "border-transparent text-gray-600"
              } transition`}
            >
              {tab.charAt(0).toUpperCase() + tab.slice(1)}
            </button>
          ))}
        </div>

        <div className="mt-4">
          {activeTab === "profile" && <ProfileTab employeeId={myInfo.id} userRole="employee" />}
          {activeTab === "documents" && <DocumentsTab employeeId={myInfo.id} />}
          {activeTab === "contacts" && <ContactsTab employeeId={myInfo.id} />}
          {activeTab === "history" && <HistoryTab employeeId={myInfo.id} userRole="employee" />}
        </div>
      </div>

    </div>
  );
}