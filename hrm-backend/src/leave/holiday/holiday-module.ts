import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { Holiday } from "./holiday.entity";
import { HolidayService } from "./holidayService";
import { HolidayController } from "./holiday-controller";


@Module({
  imports: [TypeOrmModule.forFeature([Holiday])],
  providers: [HolidayService],
  controllers: [HolidayController],
  exports: [TypeOrmModule],
})
export class HolidayModule {}