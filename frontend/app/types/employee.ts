export interface EmployeeProfileDto {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  dateOfBirth: string;
  gender: string;
  address: string;
  joiningDate: string;
  status: string;
  department?: { id: number; name: string };
  designation?: { id: number; title: string };
  manager?: { id: number; firstName: string; lastName: string };
  emergencyContacts: { name: string; relationship: string; phone: string }[];
  documents: { documentName: string; filePath: string }[];
  history: { companyName: string; designation: string; startDate: string; endDate: string; description: string }[];
}