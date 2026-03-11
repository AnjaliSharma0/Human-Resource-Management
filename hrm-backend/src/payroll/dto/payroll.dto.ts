import { IsNotEmpty, IsNumber } from 'class-validator';

export class CreatePayrollDto {
  @IsNotEmpty() employeeId: number;
  @IsNotEmpty() month: string;
  @IsNumber() basic: number;
  @IsNumber() hra: number;
  @IsNumber() tax: number;
  @IsNumber() deductions: number;
}