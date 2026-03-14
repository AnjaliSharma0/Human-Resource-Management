import { IsNotEmpty, IsDateString, IsString } from 'class-validator';
import { FindOperator } from 'typeorm';

export class ApplyLeaveDto {

  @IsNotEmpty()
  employeeId: number;

   @IsNotEmpty()
  leaveTypeId: number;

  @IsDateString()
  startDate: string;

  @IsDateString()
  endDate: string;

  duration: "full" | "first_half" | "second_half";

  @IsString()
  reason?: string
}