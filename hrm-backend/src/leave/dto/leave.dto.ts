import { IsNotEmpty, IsDateString } from 'class-validator';

export class ApplyLeaveDto {
  @IsNotEmpty()
  employeeId: number;

  @IsNotEmpty()
  type: string;

  @IsDateString()
  startDate: string;

  @IsDateString()
  endDate: string;
}