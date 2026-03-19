
import { Injectable, NotFoundException, BadRequestException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository, LessThanOrEqual, MoreThanOrEqual, Between } from "typeorm";

import { Leave } from "./leave.entity";
import { Employee } from "src/employee/entities/employee-entity";
import { ApplyLeaveDto, ApplyLeaveWithEmployeeId } from "./dto/leave.dto";
import { LeaveType } from "./holiday/leave-type";
import { LeaveBalance } from "./holiday/leave-balance";
import { Holiday } from "./holiday/holiday.entity";
import { CreateLeaveBalanceDto } from "./dto/create-balanceLeave.dto";

@Injectable()
export class LeaveService {
  save(body: Partial<LeaveType>) {
    throw new Error("Method not implemented.");
  }
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
  ) { }

  // Apply leave (employeeId comes from JWT)
async applyLeave(dto: ApplyLeaveWithEmployeeId) {
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

  // Calculate leave days
  const leaveDays = await this.calculateLeaveDays(start, end, dto.duration);

  // ✅ Current year balance
  const currentYear = start.getFullYear();

  let balance = await this.balanceRepo.findOne({
    where: {
      employee: { id: dto.employeeId },
      leaveType: { id: dto.leaveTypeId },
      year: currentYear,
    },
    relations: ["employee", "leaveType"],
  });

  // Auto-create leave balance if missing
  if (!balance) {
    balance = this.balanceRepo.create({
      employee,
      leaveType,
      year: currentYear,
      accrued: 12,       // default value, adjust if needed
      used: 0,
      remainingDays: 12,
    });
    await this.balanceRepo.save(balance);
    console.log(`Created default leave balance for employee ${employee.id}, type ${leaveType.id}, year ${currentYear}`);
  }

  if (balance.remainingDays < leaveDays) throw new BadRequestException("Insufficient leave balance");

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

  // Get all leaves (admin)
  async findAll() {
    return this.leaveRepo.find({ relations: ["employee", "leaveType"], order: { id: "DESC" } });
  }

  // Employee leave history
  async getEmployeeLeaves(employeeId: number) {
    return this.leaveRepo.find({
      where: { employee: { id: employeeId } },
      relations: ["leaveType", "employee"],
      order: { startDate: "DESC" },
    });
  }

  // Approve/reject
  async updateStatus(id: number, status: "approved" | "rejected") {
    const leave = await this.leaveRepo.findOne({ where: { id }, relations: ["employee", "leaveType"] });
    if (!leave) throw new NotFoundException("Leave request not found");

    if (leave.status === "approved" && status === "rejected") {
      const leaveDays = await this.calculateLeaveDays(
        new Date(leave.startDate),
        new Date(leave.endDate),
        leave.duration
      );

      const balance = await this.balanceRepo.findOne({
        where: {
          employee: { id: leave.employee.id },
          leaveType: { id: leave.leaveType.id },
        },
        relations: ["employee", "leaveType"],
      });

      if (balance) {
        balance.remainingDays += leaveDays;
        await this.balanceRepo.save(balance);
      }
    }
    if (status === "approved") {
      const leaveDays = await this.calculateLeaveDays(new Date(leave.startDate), new Date(leave.endDate), leave.duration);

      const balance = await this.balanceRepo.findOne({
        where: { employee: { id: leave.employee.id }, leaveType: { id: leave.leaveType.id } },
        relations: ["employee", "leaveType"],
      });

      if (!balance) throw new BadRequestException("Leave balance not found");
      balance.remainingDays -= leaveDays;
      await this.balanceRepo.save(balance);
    }
     leave.status= status
    return this.leaveRepo.save(leave);
  }

  // Calculate leave days excluding weekends & holidays
  private async calculateLeaveDays(start: Date, end: Date, duration?: string) {
    const holidays = await this.holidayRepo.find({ where: { date: Between(start, end) } });
    let leaveDays = 0;
    let day = new Date(start);

    while (day <= end) {
      const weekDay = day.getDay();
      const isWeekend = weekDay === 0 || weekDay === 6;

      const holidaySet = new Set(
        holidays.map(h => new Date(h.date).toDateString())
      );
      const isHoliday = holidaySet.has(day.toDateString());
      if (!isWeekend && !isHoliday) leaveDays++;
      day.setDate(day.getDate() + 1);
    }

    if (duration === "first_half" || duration === "second_half") leaveDays -= 0.5;
    return leaveDays;
  }

  // Leave calendar
  async getLeaveCalendar() {
    const leaves = await this.leaveRepo.find({ where: { status: "approved" }, relations: ["employee", "leaveType"] });
    const holidays = await this.holidayRepo.find();
    return { leaves, holidays };
  }

  // Admin creates leave balance
  async createLeaveBalance(dto: CreateLeaveBalanceDto) {

    const employee = await this.employeeRepo.findOne({
      where: { id: dto.employeeId }
    });

    if (!employee) throw new NotFoundException("Employee not found");

    const leaveType = await this.typeRepo.findOne({
      where: { id: dto.leaveTypeId }
    });


    if (!leaveType) throw new NotFoundException("Leave type not found");

    const accruedValue = Number(dto.accrued);
    if (isNaN(accruedValue)) throw new BadRequestException("Accrued must be a number");

    const existing = await this.balanceRepo.findOne({
      where: {
        employee: { id: dto.employeeId },
        leaveType: { id: dto.leaveTypeId },
        year: dto.year,
      }
    });

    if (existing) throw new BadRequestException("Leave balance already exists for this year");

    const balance = this.balanceRepo.create({
      employee,
      leaveType,
      accrued: accruedValue,
      used: 0,
      remainingDays: accruedValue,
      year: dto.year,
    });
    return this.balanceRepo.save(balance);
   
  }

  async getEmployeeBalance(employeeId: number) {
    return this.balanceRepo.find({
      where: { employee: { id: employeeId } },
      relations: ["leaveType"]
    });
  }

  
}