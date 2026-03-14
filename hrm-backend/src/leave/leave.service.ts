import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository, LessThanOrEqual, MoreThanOrEqual, Between } from "typeorm";

import { Leave } from "./leave.entity";
import { Employee } from "src/employee/entities/employee-entity";
import { ApplyLeaveDto } from "./dto/leave.dto";
import { LeaveType } from "./holiday/leave-type";
import { LeaveBalance } from "./holiday/leave-balance";
import { Holiday } from "./holiday/holiday.entity";

@Injectable()
export class LeaveService {
  constructor(
    @InjectRepository(Leave)
    private leaveRepo: Repository<Leave>,

    @InjectRepository(Employee)
    private employeeRepo: Repository<Employee>,

    @InjectRepository(LeaveType)
    private typeRepo: Repository<LeaveType>,

    @InjectRepository(LeaveBalance)
    private balanceRepo: Repository<LeaveBalance>,

    @InjectRepository(Holiday)
    private holidayRepo: Repository<Holiday>,
  ) {}

  // ---------------- APPLY LEAVE ----------------
  async applyLeave(dto: ApplyLeaveDto) {
    const employee = await this.employeeRepo.findOne({ where: { id: dto.employeeId } });
    if (!employee) throw new NotFoundException("Employee not found");

    const leaveType = await this.typeRepo.findOne({ where: { id: dto.leaveTypeId } });
    if (!leaveType) throw new NotFoundException("Leave type not found");

    const start = new Date(dto.startDate);
    const end = new Date(dto.endDate);
    if (start > end) throw new BadRequestException("Start date cannot be after end date");

    // Check overlapping leave
    const overlap = await this.leaveRepo.findOne({
      where: {
        employee: { id: dto.employeeId },
        startDate: LessThanOrEqual(end),
        endDate: MoreThanOrEqual(start),
      },
    });
    if (overlap) throw new BadRequestException("Leave overlaps with existing leave");

    // Calculate days to apply
    const leaveDays = await this.calculateLeaveDays(start, end, dto.duration);

    // Check balance
    const balance = await this.balanceRepo.findOne({
      where: { employee: { id: dto.employeeId }, leaveType: { id: dto.leaveTypeId } },
      relations: ["employee", "leaveType"],
    });
    if (!balance || balance.remainingDays < leaveDays) {
      throw new BadRequestException("Insufficient leave balance");
    }

    const leave = this.leaveRepo.create({
      employee,
      leaveType,
      startDate: start,
      endDate: end,
      duration: dto.duration || "full",
      reason: dto.reason,
      status: "pending",
    });

    return this.leaveRepo.save(leave);
  }

  // ---------------- GET ALL LEAVES ----------------
  async findAll() {
    return this.leaveRepo.find({
      relations: ["employee", "leaveType"],
      order: { id: "DESC" },
    });
  }

  // ---------------- GET EMPLOYEE LEAVE HISTORY ----------------
  async getEmployeeLeaves(employeeId: number) {
    return this.leaveRepo.find({
      where: { employee: { id: employeeId } },
      relations: ["leaveType"],
      order: { startDate: "DESC" },
    });
  }

  // ---------------- APPROVE / REJECT LEAVE ----------------
  async updateStatus(id: number, status: "approved" | "rejected") {
    const leave = await this.leaveRepo.findOne({
      where: { id },
      relations: ["employee", "leaveType"],
    });
    if (!leave) throw new NotFoundException("Leave request not found");

    leave.status = status;

    if (status === "approved") {
      const leaveDays = await this.calculateLeaveDays(
        new Date(leave.startDate),
        new Date(leave.endDate),
        leave.duration
      );

      const balance = await this.balanceRepo.findOne({
        where: { employee: { id: leave.employee.id }, leaveType: { id: leave.leaveType.id } },
        relations: ["employee", "leaveType"],
      });
      if (!balance) throw new BadRequestException("Leave balance not found");

      balance.remainingDays -= leaveDays;
      await this.balanceRepo.save(balance);
    }

    return this.leaveRepo.save(leave);
  }

  // ---------------- CALCULATE LEAVE DAYS ----------------
  private async calculateLeaveDays(start: Date, end: Date, duration: string) {
    const holidays = await this.holidayRepo.find({
      where: { date: Between(start, end) },
    });

    let leaveDays = 0;
    let day = new Date(start);

    while (day <= end) {
      const weekDay = day.getDay();
      const isWeekend = weekDay === 0 || weekDay === 6;
      const isHoliday = holidays.some(
        (h) => h.date.toDateString() === day.toDateString()
      );

      if (!isWeekend && !isHoliday) leaveDays++;
      day.setDate(day.getDate() + 1);
    }

    // Half-day adjustment
    if (duration === "first_half" || duration === "second_half") {
      leaveDays -= 0.5;
    }

    return leaveDays;
  }

  // ---------------- LEAVE CALENDAR ----------------
  async getLeaveCalendar() {
    const leaves = await this.leaveRepo.find({
      where: { status: "approved" },
      relations: ["employee", "leaveType"],
    });

    const holidays = await this.holidayRepo.find();

    return {
      leaves,
      holidays,
    };
  }
}