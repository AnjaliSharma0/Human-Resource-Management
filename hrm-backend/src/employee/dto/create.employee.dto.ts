import { IsString, IsEmail, IsDateString, IsOptional, IsNumber } from "class-validator";

export class CreateEmployeeDto {

  @IsString()
  firstName: string;

  @IsString()
  lastName: string;

  @IsEmail()
  email: string;

  @IsString()
  phone: string;

  @IsDateString()
  dateOfBirth: Date;

  @IsString()
  gender: string;

  @IsString()
  address: string;

  @IsDateString()
  joiningDate: Date;

  @IsNumber()
  departmentId: number;

  @IsNumber()
  designationId: number;

  @IsOptional()
  @IsNumber()
  managerId?: number;
}