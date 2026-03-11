import { IsString, IsDateString, IsOptional } from "class-validator";

export class CreateHistoryDto {

  @IsString()
  companyName: string;

  @IsString()
  designation: string;

  @IsDateString()
  startDate: Date;

  @IsOptional()
  @IsDateString()
  endDate?: Date;

  @IsOptional()
  @IsString()
  description?: string;
}