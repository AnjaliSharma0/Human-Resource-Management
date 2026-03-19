import { IsDateString, IsEnum, IsNotEmpty, IsNumber, IsOptional, IsString } from 'class-validator';

export enum InterviewMode {
  ONLINE = 'Online',
  OFFLINE = 'Offline',
}

export class ScheduleInterviewDto {
  @IsNumber()
  @IsNotEmpty()
  candidateId: number;

  @IsNumber()
  @IsNotEmpty()
  interviewerId: number;

  @IsDateString()
  @IsNotEmpty()
  dateTime: string;

  @IsEnum(InterviewMode)
  @IsOptional()
  mode?: InterviewMode = InterviewMode.OFFLINE;

  @IsString()
  @IsOptional()
  feedback?: string;
}