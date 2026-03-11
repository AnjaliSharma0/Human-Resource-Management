export interface EmployeeProfileDto {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  dateOfBirth: Date;
  gender: string;
  address: string;
  joiningDate: Date;
  status: string;

  department?: { id: number; name: string };  // ← make optional
  designation?: { id: number; title: string }; // ← make optional
  manager?: { id: number; firstName: string; lastName: string }; // ← make optional

  emergencyContacts: { name: string; relationship: string; phone: string }[];
  documents: { documentName: string; filePath: string }[];
  history: { companyName: string; designation: string; startDate: Date; endDate: Date; description: string }[];
}