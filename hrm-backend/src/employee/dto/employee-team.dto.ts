
export interface EmployeeTeamDto {
  id: number;
  firstName: string;
  lastName: string;
  subordinates: EmployeeTeamDto[];
}