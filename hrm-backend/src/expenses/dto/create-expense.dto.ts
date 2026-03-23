
import { PartialType } from "@nestjs/mapped-types";
import {
  IsNumber,
  IsString,
  IsOptional,
  IsEnum,
  IsNotEmpty,
} from "class-validator";

export enum ExpenseCategory {
  TRAVEL = "travel",
  FOOD = "food",
  OFFICE = "office",
  OTHER = "other",
}

export class CreateExpenseDto {
  @IsNumber()
  employeeId: number;

  @IsNumber()
  amount: number;

  @IsString()
  @IsNotEmpty()
  description: string;

  @IsEnum(ExpenseCategory)
  category: ExpenseCategory;

  @IsOptional()
  @IsString()
  receiptUrl?: string;
}


export class UpdateExpenseDto extends PartialType(CreateExpenseDto) {}