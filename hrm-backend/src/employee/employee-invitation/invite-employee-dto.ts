import { IsEmail, IsString } from "class-validator";

export class InviteEmployeeDto {

  @IsString()
  firstName: string;

  @IsString()
  lastName: string;

  @IsEmail()
  email: string;
}