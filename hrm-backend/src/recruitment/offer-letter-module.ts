import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { OfferLetter } from './entity/offerletter-entity';
import { Candidate } from './entity/candidate.entity';
import { OfferLetterService } from './offer-letter-service';
import { OfferLetterController } from './offer-letter-controller';


@Module({
  imports: [TypeOrmModule.forFeature([OfferLetter, Candidate])],
  providers: [OfferLetterService],
  controllers: [OfferLetterController],
})
export class OfferLetterModule {}