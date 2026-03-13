import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Attendance } from './attendance.entity';
import { Employee } from 'src/employee/entities/employee-entity';

@Injectable()
export class AttendanceService {
  constructor(
    @InjectRepository(Attendance)
    private readonly repo: Repository<Attendance>,

    @InjectRepository(Employee)
    private readonly userRepo: Repository<Employee>,
  ) {}

  // ---------------------------
  // Punch-in (resumable)
  // ---------------------------
  async punchIn(employeeId: number, image?: string) {
    const employee = await this.userRepo.findOne({ where: { id: employeeId } });
    if (!employee) throw new Error('Employee not found');

    const today = new Date().toISOString().split('T')[0];

    // Use QueryBuilder to find today's attendance
    let record = await this.repo
      .createQueryBuilder('attendance')
      .where('attendance.employeeId = :employeeId', { employeeId })
      .andWhere('attendance.date BETWEEN :start AND :end', {
        start: new Date(`${today}T00:00:00`),
        end: new Date(`${today}T23:59:59`),
      })
      .getOne();

    if (!record) {
      record = this.repo.create({
        employee,
        date: new Date(today),
        sessions: [{ clockIn: new Date() }],
      });
    } else {
      // Add a new session (resumable)
      record.sessions.push({ clockIn: new Date() });
    }

    return this.repo.save(record);
  }

  // ---------------------------
  // Punch-out (resume last session)
  // ---------------------------
  async punchOut(employeeId: number) {
    const today = new Date().toISOString().split('T')[0];

    const record = await this.repo
      .createQueryBuilder('attendance')
      .where('attendance.employeeId = :employeeId', { employeeId })
      .andWhere('attendance.date BETWEEN :start AND :end', {
        start: new Date(`${today}T00:00:00`),
        end: new Date(`${today}T23:59:59`),
      })
      .getOne();

    if (!record || !record.sessions.length) throw new Error('No active session found');

    const lastSession = record.sessions[record.sessions.length - 1];
    if (lastSession.clockOut) throw new Error('Last session already punched out');

    lastSession.clockOut = new Date();

    // Calculate total hours
    let totalHours = 0;
    record.sessions.forEach((s) => {
      if (s.clockOut) {
        totalHours += (new Date(s.clockOut).getTime() - new Date(s.clockIn).getTime()) / (1000 * 3600);
      }
    });
    record.totalHours = parseFloat(totalHours.toFixed(2));

    // Calculate overtime (standard 8 hours)
    const standardHours = 8;
    record.overtimeHours = totalHours > standardHours ? parseFloat((totalHours - standardHours).toFixed(2)) : 0;

    return this.repo.save(record);
  }

  // ---------------------------
  // Get all attendance records (admin)
  // ---------------------------
  async findAll() {
    return this.repo
      .createQueryBuilder('attendance')
      .leftJoinAndSelect('attendance.employee', 'employee')
      .orderBy('attendance.date', 'DESC')
      .getMany();
  }

  // ---------------------------
  // Get attendance for a specific employee
  // ---------------------------
  async findByEmployee(employeeId: number) {
    return this.repo
      .createQueryBuilder('attendance')
      .leftJoinAndSelect('attendance.employee', 'employee')
      .where('attendance.employeeId = :employeeId', { employeeId })
      .orderBy('attendance.date', 'DESC')
      .getMany();
  }
}