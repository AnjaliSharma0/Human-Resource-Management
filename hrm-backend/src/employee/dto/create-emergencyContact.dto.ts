import { IsString } from "class-validator";

export class CreateEmergencyContactDto {

  @IsString()
  name: string;

  @IsString()
  relationship: string;

  @IsString()
  phone: string;

}