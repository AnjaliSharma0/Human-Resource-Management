import EmployeeTable from "../components/employee/EmployeeTable";
import DashboardLayout from "../components/layout/DashboardLayout";


export default function EmployeesPage() {
  return (
    <DashboardLayout>
      <h2 className="text-2xl font-bold mb-6 text-gray-700">Employees</h2>
      <EmployeeTable />
    </DashboardLayout>
  );
}