import { IsString, IsNumber, IsOptional } from "class-validator";

export class CreateSalaryGradeDto {
  @IsString()
  grade_name: string;

  @IsNumber()
  basic: number;

  @IsNumber()
  hra: number;

  @IsNumber()
  @IsOptional()
  allowances?: number;

  @IsNumber()
  @IsOptional()
  deductions?: number;

  @IsNumber()
  @IsOptional()
  pf_rate?: number;

  @IsNumber()
  @IsOptional()
  esi_rate?: number;
}