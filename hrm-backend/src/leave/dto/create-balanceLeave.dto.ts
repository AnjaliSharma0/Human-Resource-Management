import { Type } from "class-transformer";
import { IsIn, IsInt, IsNotEmpty, IsNumber, Min } from "class-validator";

export class CreateLeaveBalanceDto {

  @IsNumber()
  employeeId: number;

  @IsNumber()
  leaveTypeId: number;

  @Type(() => Number)
  @IsInt({ message: "Accrued must be an integer" })
  @Min(0, { message: "Accrued cannot be negative" })
  accrued: number;

  @IsNumber()
  year: number;

}