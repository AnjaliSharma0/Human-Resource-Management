import { PartialType } from '@nestjs/mapped-types';
import { CreateOfferLetterDto } from './create-offer-letter.dto';


export class UpdateOfferLetterDto extends PartialType(CreateOfferLetterDto) {}