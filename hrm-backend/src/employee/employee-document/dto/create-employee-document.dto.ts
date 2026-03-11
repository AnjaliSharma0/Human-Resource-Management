import { IsString } from "class-validator";

export class CreateEmployeeDocumentDto {

  @IsString()
  documentName: string;

}