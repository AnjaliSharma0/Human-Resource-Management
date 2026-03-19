import { Controller, Post, Body, Param, Get, Patch, UseGuards, Req, UseInterceptors, UploadedFile, BadRequestException } from '@nestjs/common';
import { CandidateService } from './candidate-service';
import { CandidateStatus } from './entity/candidate.entity';
import { AuthGuard } from '@nestjs/passport';
import { FileInterceptor } from '@nestjs/platform-express';


// @UseGuards(RolesGaurd)
@Controller('candidates')
export class CandidateController {
  constructor(private service: CandidateService) {}

  
@Post("apply")
@UseGuards(AuthGuard("jwt"))
@UseInterceptors(FileInterceptor("resume", { dest: './uploads/' }))
apply(
  @Body("jobPostingId") jobPostingId: number,
  @UploadedFile() file: Express.Multer.File,
  @Req() req
) {
  if (!file) {
    throw new BadRequestException("Resume file is required");
  }
  return this.service.apply(jobPostingId, file, req.user.id);
}

  @Get()
  //@Roles('Admin')
  findAll() {
    return this.service.findAll();
  }

  @Get(':id')
  //@Roles('Admin', 'Employee')
  findOne(@Param('id') id: number) {
    return this.service.findOne(+id);
  }

  @Patch(':id/status')
  //@Roles('Admin')
  updateStatus(@Param('id') id: number, @Body('status') status: CandidateStatus) {
    return this.service.updateStatus(+id, status);
  }
// @Post("apply")
// @UseInterceptors(FileInterceptor("resume"))
// apply(
//   @Body("jobPostingId") jobPostingId: number,
//   @UploadedFile() file: Express.Multer.File
// ) {
//   return this.service.apply(jobPostingId, file);
// }



}