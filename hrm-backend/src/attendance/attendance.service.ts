import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Attendance } from './attendance.entity';
import { Employee } from '../employee/entities/employee-entity';


@Injectable()
export class AttendanceService {
  constructor(
    @InjectRepository(Attendance) private repo: Repository<Attendance>,
    @InjectRepository(Employee) private userRepo: Repository<Employee>,
  ) {}
  
async punchIn(employeeId: number) {
  const employee = await this.userRepo.findOne({ where: { id: employeeId } });
  if (!employee) throw new Error('Employee not found');

  const attendance = this.repo.create({
    employee,
    clockIn: new Date(),
  });

  return this.repo.save(attendance);
}

  async punchOut(attendanceId: number) {
    const record = await this.repo.findOne({ where: { id: attendanceId }, relations: ['employee'] });
    if (!record) throw new Error('Attendance record not found');
    record.clockOut = new Date();
    record.totalHours = (record.clockOut.getTime() - record.clockIn.getTime()) / 1000 / 3600;
    return this.repo.save(record);
  }

  findAll() {
    return this.repo.find({ relations: ['employee'] });
  }
}
