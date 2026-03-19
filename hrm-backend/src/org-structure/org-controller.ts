import { Controller, Get, Post, Body, Param } from '@nestjs/common';
import { EmployeeNode, OrgStructureService } from './org-service';
import { Department } from 'src/employee/entities/department-entity';
import { BusinessUnit } from './buisness-unit.entity';
import { CreateLocationDto } from './location.dto';


@Controller('org')
export class OrgStructureController {
  constructor(private readonly orgService: OrgStructureService) {}

  // ---------------- Departments ----------------
  @Get('departments')
  getDepartments() {
    return this.orgService.findAllDepartments();
  }

  @Get('departments/:id')
  getDepartment(@Param('id') id: number) {
    return this.orgService.findDepartmentById(id);
  }

  @Post('departments')
  createDepartment(@Body() body: Partial<Department>) {
    return this.orgService.createDepartment(body);
  }

  // ---------------- Locations ----------------
  @Get('locations')
  getLocations() {
    return this.orgService.findAllLocations();
  }

 @Post('locations')
createLocation(@Body() body: CreateLocationDto) {
  return this.orgService.createLocation(body);
}

  // ---------------- Business Units ----------------
  @Get('business-units')
  getBusinessUnits() {
    return this.orgService.findAllBusinessUnits();
  }

  @Post('business-units')
  createBusinessUnit(@Body() body: Partial<BusinessUnit>) {
    return this.orgService.createBusinessUnit(body);
  }

  // ---------------- Org Chart ----------------
   @Get('hierarchy')
  getHierarchy(): Promise<EmployeeNode[]> {
    return this.orgService.getOrgHierarchy();
  }
}