"use client";

import { useEffect, useState } from "react";
import { getEmployeeInfo, getDepartmentEmployees } from "@/app/src/services/employee";
import ProfileTab from "@/app/components/profileTabs/ProfileTab";
import DocumentsTab from "@/app/components/profileTabs/DocumentTab";
import ContactsTab from "@/app/components/profileTabs/ContactTab";
import HistoryTab from "@/app/components/profileTabs/HistoryTab";
import { UserCircleIcon } from "@heroicons/react/24/solid";

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

  if (loading) return <p className="p-6 text-gray-600">Loading dashboard...</p>;
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

      {/* --- Department Colleagues --- */}
      <div>
        <h2 className="text-xl font-bold mb-4">Your Colleagues</h2>
        {departmentEmployees.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
            {departmentEmployees.map(emp => (
              <div key={emp.id} className="bg-white p-4 rounded-xl shadow hover:shadow-lg transition cursor-pointer">
                <div className="flex items-center space-x-4">
                  <UserCircleIcon className="h-12 w-12 text-gray-400" />
                  <div>
                    <h3 className="font-semibold">{emp.firstName} {emp.lastName}</h3>
                    <p className="text-sm text-gray-500">{emp.designation}</p>
                  </div>
                </div>
                <p className="text-sm text-gray-400 mt-2">{emp.email}</p>
                {emp.department && <p className="text-sm text-gray-400">{emp.department}</p>}
              </div>
            ))}
          </div>
        ) : (
          <p className="text-gray-500">No other employees in your department.</p>
        )}
      </div>
    </div>
  );
}