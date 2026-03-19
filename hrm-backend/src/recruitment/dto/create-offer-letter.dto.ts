import { IsNotEmpty, IsNumber, IsOptional, IsString } from 'class-validator';

export class CreateOfferLetterDto {
  @IsNumber()
  @IsNotEmpty()
  candidateId: number;

  @IsString()
  @IsNotEmpty()
  offerFileUrl: string;

  @IsOptional()
  @IsString()
  status?: 'Sent' | 'Accepted' | 'Rejected';
}