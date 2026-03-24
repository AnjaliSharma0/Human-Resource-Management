import { Controller, Post, Body, Param, Get, Patch, UseGuards, Req, UseInterceptors, UploadedFile, BadRequestException, UnauthorizedException } from '@nestjs/common';
import { CandidateService } from './candidate-service';
import { CandidateStatus } from './entity/candidate.entity';
import { AuthGuard } from '@nestjs/passport';
import { FileInterceptor } from '@nestjs/platform-express';
import { ApplyCandidateDto } from './dto/apply-candidate.dto';
import { JwtAuthGuard } from 'src/dto/auth/jwt-auth.guard';


// @UseGuards(RolesGaurd)
@Controller('candidates')
export class CandidateController {
  constructor(private service: CandidateService) {}

  
@Post('apply')
@UseGuards(JwtAuthGuard) // or whatever auth guard you have
async applyCandidate(
  @Body() dto: ApplyCandidateDto,
  @Req() req: any, // or Request type
) {
  const user = req.user; 
  if (!user) throw new UnauthorizedException("User not logged in");

  return this.service.apply(
    dto.jobPostingId,
    user.id,
    dto
  );
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