import { Controller, Post, Body, Param, Get, Patch, UseGuards } from '@nestjs/common';
import { RolesGaurd } from 'src/common/guard/role.guard';
import { OfferLetterService } from './offer-letter-service';
import { CreateOfferLetterDto } from './dto/create-offer-letter.dto';
import { Roles } from 'src/common/decorators/role.decorator';
import { OfferStatus } from './entity/offerletter-entity';


@UseGuards(RolesGaurd)
@Controller('offer-letters')
export class OfferLetterController {
  constructor(private service: OfferLetterService) {}

  @Post()
  //@Roles('Admin')
  create(@Body() dto: CreateOfferLetterDto) {
    return this.service.create(dto);
  }

  @Get()
  //@Roles('Admin', 'Employee')
  findAll() {
    return this.service.findAll();
  }

  @Get(':id')
//   @Roles('Admin', 'Employee')
  findOne(@Param('id') id: number) {
    return this.service.findOne(+id);
  }

  @Patch(':id/status')
  //@Roles('Admin', 'Employee')
  updateStatus(@Param('id') id: number, @Body('status') status: OfferStatus) {
    return this.service.updateStatus(+id, status);
  }
}