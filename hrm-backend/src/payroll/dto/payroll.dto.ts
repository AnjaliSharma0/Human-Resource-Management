import { IsNotEmpty, IsNumber, IsOptional, Min, Max } from 'class-validator';

export class CreatePayrollDto {
  @IsNotEmpty()
  @IsNumber()
  employeeId: number;

  @IsNotEmpty()
  @Min(1)
  @Max(12)
  month: number; // numeric month (1-12)

  @IsNotEmpty()
  @IsNumber()
  year: number; // payroll year

  @IsNotEmpty()
  @IsNumber()
  basic: number;

  @IsNotEmpty()
  @IsNumber()
  hra: number;

  @IsOptional()
  @IsNumber()
  allowances?: number = 0;

@IsNumber()
  @IsOptional()  // ← this is the key
  tax?: number;

  @IsNotEmpty()
  @IsNumber()
  deductions: number;

  @IsOptional()
  @IsNumber()
  pf?: number;

  @IsOptional()
  @IsNumber()
  esi?: number;

  @IsOptional()
  @IsNumber()
  bonus?: number = 0;

  @IsOptional()
  @IsNumber()
  arrears?: number = 0;
}