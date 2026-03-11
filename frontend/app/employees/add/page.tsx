import EmployeeForm from "@/app/components/employee/EmployeeForm";
import DashboardLayout from "@/app/components/layout/DashboardLayout";


export default function AddEmployeePage() {
  return (
    <DashboardLayout>
      <h2 className="text-2xl font-bold mb-6 text-gray-700">Add Employee</h2>
      <EmployeeForm />
    </DashboardLayout>
  );
}