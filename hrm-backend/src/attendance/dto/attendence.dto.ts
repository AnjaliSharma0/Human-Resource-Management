import { IsNotEmpty } from 'class-validator';

export class AttendanceDto {
  @IsNotEmpty()
  employeeId: number;
}
