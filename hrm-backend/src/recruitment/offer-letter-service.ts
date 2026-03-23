import { BadRequestException, Body, Injectable, NotFoundException, UploadedFile } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { CreateOfferLetterDto } from './dto/create-offer-letter.dto';
import { OfferLetter, OfferStatus } from './entity/offerletter-entity';
import { Candidate } from './entity/candidate.entity';


@Injectable()
export class OfferLetterService {
  constructor(
    @InjectRepository(OfferLetter) private repo: Repository<OfferLetter>,
    @InjectRepository(Candidate) private candidateRepo: Repository<Candidate>,
  ) {}

 async create(dto: CreateOfferLetterDto) {
  const candidate = await this.candidateRepo.findOne({ where: { id: dto.candidateId } });
  if (!candidate) throw new NotFoundException('Candidate not found');

  // Ensure status is of type OfferStatus
  const status: OfferStatus = dto.status ? dto.status as OfferStatus : OfferStatus.SENT;

  const offer = this.repo.create({
    candidateId: candidate.id,
    offerFileUrl: dto.offerFileUrl,
    status,
  });

  return this.repo.save(offer);
}

  findAll() {
    return this.repo.find({ relations: ['candidate'] });
  }

  findOne(id: number) {
    return this.repo.findOne({ where: { id }, relations: ['candidate'] });
  }

  async updateStatus(id: number, status: OfferStatus) {
    const offer = await this.findOne(id);
    if (!offer) throw new NotFoundException('Offer Letter not found');
    offer.status = status;
    if (status === OfferStatus.ACCEPTED) offer.acceptedAt = new Date();
    return this.repo.save(offer);
  }

  async uploadOffer(
    @UploadedFile() file:Express.Multer.File,
    @Body('candidateId') candidateId:string,
  ){
    if(!file) throw new Error('File missing')
      if(!candidateId) throw new Error('Candidate missing')

      const offerFileUrl = `/uploads/${file.filename}`

      const offer= this.repo.create({
        candidateId:Number(candidateId),
        offerFileUrl,
        status: OfferStatus.SENT,
      })
      
  return this.repo.save(offer);
  }
  async deleteOffer(id:number){
    const offer = await this.findOne(id);
    if(!offer)  throw new BadRequestException("Offer not found")
      return this.repo.remove(offer)
  }

}