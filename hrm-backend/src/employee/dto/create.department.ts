import { IsNotEmpty, IsOptional, IsString } from "class-validator";

export class CreateDepartmentDto {

  @IsString()
  @IsNotEmpty()
  name: string;

  @IsString()
  @IsNotEmpty()
  location: string;

  @IsString()
  @IsOptional()
  description:string
}