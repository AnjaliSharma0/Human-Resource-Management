import { IsString, IsEmail, IsDateString, IsOptional, IsNumber } from "class-validator";
import { Role } from "src/dto/users/user.role";

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

  @IsOptional() @IsNumber() salaryGradeId?: number; // New
  @IsOptional() role?: Role; // EMPLOYEE or MANAGER
  @IsOptional()
  @IsNumber()
  managerId?: number;
}