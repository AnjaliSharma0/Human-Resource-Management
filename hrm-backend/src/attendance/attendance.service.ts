import { BadRequestException, Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository, Between } from "typeorm";
import { Attendance } from "./attendance.entity";
import { Employee } from "../employee/entities/employee-entity";

@Injectable()
export class AttendanceService {

  constructor(
    @InjectRepository(Attendance)
    private repo: Repository<Attendance>,

    @InjectRepository(Employee)
    private employeeRepo: Repository<Employee>
  ) {}

  // --------------------
  // Punch In
  // --------------------

  async punchIn(userId: number) {

    const employee = await this.employeeRepo.findOne({
      where: { user: { id: userId } },
      relations: ["user"]
    });

    if (!employee) throw new Error("Employee not found");

    const today = new Date();
    const start = new Date(today.setHours(0,0,0,0));
    const end = new Date(today.setHours(23,59,59,999));

    let record = await this.repo.findOne({
      where: {
        employee: { id: employee.id },
        date: Between(start, end)
      }
    });

    if (!record) {
      record = this.repo.create({
        employee,
        date: new Date(),
        sessions: []
      });
    }

    const lastSession = record.sessions.at(-1);

    if (lastSession && !lastSession.clockOut) {
      throw new Error("Already punched in");
    }

    record.sessions.push({
      clockIn: new Date()
    });

    return this.repo.save(record);
  }

  // --------------------
  // Punch Out
  // --------------------

  async punchOut(userId: number) {

    const employee = await this.employeeRepo.findOne({
      where: { user: { id: userId } },
      relations: ["user"]
    });

    const today = new Date();
    const start = new Date(today.setHours(0,0,0,0));
    const end = new Date(today.setHours(23,59,59,999));
 if(!employee){
  throw new BadRequestException("Employee not found")
 }
    const record = await this.repo.findOne({
      where: {
        employee: { id: employee.id },
        date: Between(start, end)
      }
    });

    if (!record) throw new Error("No attendance record");

    const lastSession = record.sessions.at(-1);

    if (!lastSession || lastSession.clockOut) {
      throw new Error("No active session");
    }

    lastSession.clockOut = new Date();

    let total = 0;

    record.sessions.forEach(s => {

      if (s.clockOut) {

        const diff =
          new Date(s.clockOut).getTime() -
          new Date(s.clockIn).getTime();

        total += diff / 3600000;

      }

    });

    record.totalHours = Number(total.toFixed(2));

    record.overtimeHours =
      total > 8 ? Number((total - 8).toFixed(2)) : 0;

    return this.repo.save(record);
  }

  // --------------------
  // My Attendance
  // --------------------

  async myAttendance(userId: number) {

    const employee = await this.employeeRepo.findOne({
      where: { user: { id: userId } }
    });

    if(!employee){
  throw new BadRequestException("Employee not found")
 }
    return this.repo.find({
      where: { employee: { id: employee.id } },
      order: { date: "DESC" }
    });

  }

  // --------------------
  // Admin All
  // --------------------

  async allAttendance() {

    return this.repo.find({
      relations: ["employee"],
      order: { date: "DESC" }
    });

  }

}