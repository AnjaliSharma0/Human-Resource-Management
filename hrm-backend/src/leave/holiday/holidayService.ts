import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository, Between } from "typeorm";
import { Holiday } from "./holiday.entity";

@Injectable()
export class HolidayService {

  constructor(
    @InjectRepository(Holiday)
    private holidayRepo: Repository<Holiday>
  ) {}

  create(data: { name: string; date: Date }) {
    const holiday = this.holidayRepo.create(data);
    return this.holidayRepo.save(holiday);
  }

  findAll() {
    return this.holidayRepo.find({ order: { date: "ASC" } });
  }

  getBetween(start: Date, end: Date) {
    return this.holidayRepo.find({
      where: {
        date: Between(start, end),
      },
    });
  }

}