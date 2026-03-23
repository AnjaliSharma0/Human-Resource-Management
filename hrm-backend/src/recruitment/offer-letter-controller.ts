import { Controller, Post, Body, Param, Get, Patch, UseGuards, UseInterceptors, UploadedFile, Delete } from '@nestjs/common';
import { RolesGaurd } from 'src/common/guard/role.guard';
import { OfferLetterService } from './offer-letter-service';
import { CreateOfferLetterDto } from './dto/create-offer-letter.dto';

import { OfferStatus } from './entity/offerletter-entity';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { extname } from 'path';

@UseGuards(RolesGaurd)
@Controller('offer-letters')
export class OfferLetterController {
  constructor(private service: OfferLetterService) {}

  @Post()
  create(@Body() dto: CreateOfferLetterDto) {
    return this.service.create(dto);
  }

  @Post('upload')
  @UseInterceptors(
    FileInterceptor('offerFile', {
      storage: diskStorage({
        destination: './uploads',
        filename: (req, file, callback) => {
          const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
          const ext = extname(file.originalname);
          callback(null, `${file.fieldname}-${uniqueSuffix}${ext}`);
        },
      }),
      limits: { fileSize: 10 * 1024 * 1024 }, // 10MB
    }),
  )
  uploadOffer(
    @UploadedFile() file: Express.Multer.File,
    @Body('candidateId') candidateId: string,
  ) {
    return this.service.uploadOffer(file, candidateId);
  }

  @Get()
  findAll() {
    return this.service.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: number) {
    return this.service.findOne(+id);
  }

  @Patch(':id/status')
  updateStatus(@Param('id') id: number, @Body('status') status: OfferStatus) {
    return this.service.updateStatus(+id, status);
  }
  @Delete(':id')
deleteOffer(@Param('id') id: number) {
  return this.service.deleteOffer(+id);
}
}