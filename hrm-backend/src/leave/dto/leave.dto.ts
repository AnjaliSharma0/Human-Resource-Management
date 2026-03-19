import { IsNotEmpty, IsDateString, IsEnum, IsOptional } from 'class-validator';

export class ApplyLeaveDto {
  @IsNotEmpty()
  @IsDateString()
  startDate: string;

  @IsNotEmpty()
  @IsDateString()
  endDate: string;

  @IsNotEmpty()
  leaveTypeId: number;

  @IsOptional()
  @IsEnum(['full', 'first_half', 'second_half'])
  duration?: 'full' | 'first_half' | 'second_half';

  @IsOptional()
  reason?: string;
}

// Service type including employeeId
export interface ApplyLeaveWithEmployeeId extends ApplyLeaveDto {
  employeeId: number;
}