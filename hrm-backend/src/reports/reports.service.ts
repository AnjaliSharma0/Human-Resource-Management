import { Injectable, BadRequestException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Attendance } from "src/attendance/attendance.entity";
import { Employee } from "src/employee/entities/employee-entity";
import { Leave } from "src/leave/leave.entity";
import { Payroll } from "src/payroll/payroll.entity";
import { Repository } from "typeorm";

@Injectable()
export class ReportsService {
  constructor(
    @InjectRepository(Attendance)
    private attendanceRepo: Repository<Attendance>,
    @InjectRepository(Leave)
    private leaveRepo: Repository<Leave>,
    @InjectRepository(Payroll)
    private payrollRepo: Repository<Payroll>,
    @InjectRepository(Employee)
    private employeeRepo: Repository<Employee>
  ) {}

  private async getEmployee(userId: number) {
    const employee = await this.employeeRepo.findOne({
      where: { user: { id: userId } },
    });
    if (!employee) throw new BadRequestException("Employee not found");
    return employee;
  }

 async attendanceReport(userId: number) {
  const employee = await this.getEmployee(userId);

  const records = await this.attendanceRepo.find({
    where: { employee: { id: employee.id } },
    order: { date: "DESC" },
    select: ["date", "sessions", "totalHours", "overtimeHours"] as (keyof Attendance)[],
  });

  // Map derived status
  return records.map(r => ({
    date: r.date,
    status: r.sessions.length
      ? r.sessions.every(s => s.clockIn && s.clockOut)
        ? "Present"
        : "Partial"
      : "Absent",
    totalHours: r.totalHours,
    overtimeHours: r.overtimeHours,
  }));
}

  async leaveReport(userId: number) {
  // 1️⃣ Find employee
  const employee = await this.employeeRepo.findOne({
    where: { id: userId }, // <-- use Employee.id directly
  });

  if (!employee) throw new BadRequestException("Employee not found");

  // 2️⃣ Fetch leaves for this employee
  const leaves = await this.leaveRepo.find({
    where: { employee: { id: employee.id } },
    order: { startDate: "DESC" },
    relations: ["leaveType"],
  });

  // 3️⃣ Normalize for frontend
  return leaves.map(l => ({
    id: l.id,
    fromDate: new Date(l.startDate).toISOString(),
toDate: new Date(l.endDate).toISOString(),
    type: l.leaveType?.name || "-",
    status: l.status,
  }));
}

  async payrollReport(userId: number) {
    const employee = await this.getEmployee(userId);
    const payrolls = await this.payrollRepo.find({
      where: { employee: { id: employee.id } },
      order: { year: "DESC", month: "DESC" },
      select: [
        "month",
        "year",
        "basic",
        "hra",
        "allowances",
        "deductions",
        "pf",
        "esi",
        "tax",
        "bonus",
        "arrears",
        "net_salary",
        "status",
      ],
    });

    // map net_salary → netSalary for frontend
    return payrolls.map(p => ({
      month: `${p.month}-${p.year}`,
      salary: Number(p.basic) + Number(p.hra) + Number(p.allowances),
      deductions:
        Number(p.deductions) + Number(p.pf) + Number(p.esi) + Number(p.tax),
      netSalary: Number(p.net_salary) + Number(p.bonus) + Number(p.arrears),
      status: p.status,
    }));
  }
}