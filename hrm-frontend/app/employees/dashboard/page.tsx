"use client";

import { getDepartmentEmployees, getEmployeeInfo } from "@/app/src/services/employee";
import { useEffect, useState } from "react";


export default function DashboardPage() {
  const [myInfo, setMyInfo] = useState<any>(null);
  const [departmentEmployees, setDepartmentEmployees] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const me = await getEmployeeInfo();
        const deptEmps = await getDepartmentEmployees();
        setMyInfo(me);
        // Filter out self
        setDepartmentEmployees(deptEmps.filter((emp: { id: any; }) => emp.id !== me.id));
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  if (loading) return <p className="p-6">Loading...</p>;

  return (
    <div className="p-6 space-y-6">
      {/* My Info */}
      {myInfo && (
        <div className="bg-blue-50 p-6 rounded-lg shadow-md">
          <h2 className="text-xl font-bold mb-2">My Profile</h2>
          <p><strong>Name:</strong> {myInfo.firstName} {myInfo.lastName}</p>
          <p><strong>Email:</strong> {myInfo.email}</p>
          <p><strong>Department:</strong> {myInfo.department}</p>
          <p><strong>Designation:</strong> {myInfo.designation}</p>
          <p><strong>Joining Date:</strong> {new Date(myInfo.joiningDate).toLocaleDateString()}</p>
        </div>
      )}

      {/* Department Employees */}
      <div>
        <h2 className="text-xl font-bold mb-4">Department Colleagues</h2>
        {departmentEmployees.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
            {departmentEmployees.map(emp => (
             <div>
  <h3 className="font-semibold">{emp.firstName} {emp.lastName}</h3>
  <p className="text-sm text-gray-500">{emp.designation}</p>
  <p className="text-sm text-gray-400">{emp.email}</p>
  {emp.department && <p className="text-sm text-gray-400">{emp.department}</p>}
</div>
            ))}
          </div>
        ) : (
          <p>No other employees in your department.</p>
        )}
      </div>
    </div>
  );
}