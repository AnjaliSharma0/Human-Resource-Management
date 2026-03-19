import { Body, Controller, Get, Param, Patch, Post, Req, UseGuards } from "@nestjs/common";
import { JobRequisitionService } from "./job-recuigition-service";
import { Roles } from "src/common/decorators/role.decorator";
import { CreateJobRequisitionDto } from "./dto/job-requition-dto";
import { AuthGuard } from "@nestjs/passport";
import { RequisitionStatus } from "./entity/job-requisition-entity";

@Controller('job-requisition')
@UseGuards(AuthGuard('jwt'))
export class JobRequisitionController {
    constructor(private service: JobRequisitionService) {}

    @Post()
    //@Roles('Admin')
    create(@Body() dto: CreateJobRequisitionDto, @Req() req) {
        return this.service.create(dto, req.user.id);
    }

    @Patch(':id/approve')
    //@Roles('Admin')
    approve(@Param('id') id: number, @Req() req) {
        return this.service.approve(id, req.user);
    }

    @Get()
    findAll() {
        return this.service.findAll();
    }

    @Get(':id')
    findOne(@Param('id') id: number) {
        return this.service.findOne(id);
    }
    @Patch(":id/status")
  updateStatus(
    @Param("id") id: number,
    @Body() body: { status: RequisitionStatus },
    @Req() req
  ) {
    return this.service.updateStatus(+id, body.status, req.user.id);
  }
}