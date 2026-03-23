import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { FAQ } from "./faq.entity";
import { Repository } from "typeorm";


@Injectable()
export class FaqService {
  constructor(@InjectRepository(FAQ) private faqRepo: Repository<FAQ>) {}

  getAll() {
    return this.faqRepo.find({ order: { created_at: 'DESC' } });
  }

  create(question: string, answer: string) {
    const faq = this.faqRepo.create({ question, answer });
    return this.faqRepo.save(faq);
  }
  remove(id: number) {
  return this.faqRepo.delete(id);
}
}