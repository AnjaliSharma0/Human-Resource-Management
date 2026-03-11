import { IsString, IsNumber } from "class-validator";

export class CreateDesignationDto {

  @IsString()
  title: string;

  @IsNumber()
  departmentId: number;

}