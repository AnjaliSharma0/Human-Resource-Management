import { IsString, IsNotEmpty, IsDate, IsBoolean } from "class-validator";

export class CreateTrainingCourseDto {
  @IsString() @IsNotEmpty() title: string;
  @IsString() @IsNotEmpty() description: string;
  @IsDate() startDate: Date;
  @IsDate() endDate: Date;
  @IsBoolean() isSelfPaced: boolean;
   skills: number[];
}