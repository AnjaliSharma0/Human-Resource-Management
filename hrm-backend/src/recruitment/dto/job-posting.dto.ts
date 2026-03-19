import { IsBoolean, IsDateString, IsNotEmpty, IsNumber } from 'class-validator';

export class CreateJobPostingDto {
  @IsNumber()
  @IsNotEmpty()
  jobRequisitionId: number;

  @IsBoolean()
  isInternal: boolean;

  @IsBoolean()
  isExternal: boolean;

  @IsDateString()
  postingStartDate: string;

  @IsDateString()
  postingEndDate: string;
}