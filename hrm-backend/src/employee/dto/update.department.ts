import { PartialType } from "@nestjs/mapped-types";
import { CreateDepartmentDto } from "./create.department";


export class UpdateDepartmentDto extends PartialType(CreateDepartmentDto) {}