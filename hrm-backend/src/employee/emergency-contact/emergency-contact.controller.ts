import { Body, Controller, Delete, Get, Param, Post } from "@nestjs/common";
import { EmergencyContactService } from "./emergency-contact.service";
import { CreateEmergencyContactDto } from "../dto/create-emergencyContact.dto";

@Controller("employees")
export class EmergencyContactController {

  constructor(private contactService: EmergencyContactService) {}

  @Post(":id/emergency-contacts")
  create(
    @Param("id") id: string,
    @Body() body: CreateEmergencyContactDto
  ) {
    return this.contactService.create(Number(id), body);
  }

  @Get(":id/emergency-contacts")
  findEmployeeContacts(@Param("id") id: string) {
    return this.contactService.findByEmployee(Number(id));
  }

  @Delete("emergency-contacts/:id")
  remove(@Param("id") id: string) {
    return this.contactService.remove(Number(id));
  }
}