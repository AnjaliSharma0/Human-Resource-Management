import { BadRequestException, Injectable, NotFoundException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository, DeepPartial } from "typeorm";

import { Employee } from "../employee/entities/employee-entity";


import * as fs from "fs";
import * as path from "path";
import * as PDFKit from "pdfkit";
import { Parser } from "json2csv";
import { Payroll } from "./payroll.entity";
import { CreatePayrollDto } from "./dto/payroll.dto";

@Injectable()
export class PayrollService {
  constructor(
    @InjectRepository(Payroll) private payrollRepo: Repository<Payroll>,
    @InjectRepository(Employee) private employeeRepo: Repository<Employee>
  ) {
    const uploadPath = path.join(__dirname, '../../uploads');
  if (!fs.existsSync(uploadPath)) {
    fs.mkdirSync(uploadPath, { recursive: true });
  }
  }

  /** Generate payroll for single employee */
  async generate(dto: CreatePayrollDto) {
    const employee = await this.employeeRepo.findOne({
      where: { id: dto.employeeId },
      relations: ["salaryGrade"],
    });
    if (!employee) throw new NotFoundException("Employee not found.");

    const existing = await this.payrollRepo.findOne({
  where: {
    employee: { id: dto.employeeId },
    month: dto.month,
    year: dto.year,
  },
});

if (existing) {
 throw new BadRequestException("Payroll already generated for this month");
}
    const basic = dto.basic ?? employee.salaryGrade?.basic ?? 0;
    const hra = dto.hra ?? employee.salaryGrade?.hra ?? 0;
    const allowances = dto.allowances ?? employee.salaryGrade?.allowances ?? 0;
    const deductions = dto.deductions ?? employee.salaryGrade?.deductions ?? 0;
    const pf = dto.pf ?? (basic * (employee.salaryGrade?.pf_rate ?? 12)) / 100;
    const esi = dto.esi ?? (basic * (employee.salaryGrade?.esi_rate ?? 1.75)) / 100;
    const tax = dto.tax ?? ((basic + hra + allowances) * 0.1);
    const bonus = dto.bonus ?? 0;
    const arrears = dto.arrears ?? 0;

   const gross_salary = basic + hra + allowances + bonus + arrears;

const net_salary =
  gross_salary - deductions - pf - esi - tax;

    const payrollData: DeepPartial<Payroll> = {
      employee,
      month: dto.month,
      year: dto.year,
      basic,
      hra,
      allowances,
      deductions,
      pf,
      esi,
      tax,
      bonus,
      arrears,
      gross_salary,
      net_salary,
      status: "processed",
    };

    const payroll = this.payrollRepo.create(payrollData);
    return this.payrollRepo.save(payroll);
  }

  /** Get payrolls (all) */
  findAll() {
    return this.payrollRepo.find({ relations: ["employee"] });
  }

  /** Get payroll by ID */
  findOne(id: number) {
    return this.payrollRepo.findOne({ where: { id }, relations: ["employee"] });
  }

  /** Get payrolls for an employee */
  // async findByEmployee(employeeId: number) {
  //   const employee = await this.employeeRepo.findOne({ where: { id: employeeId } });
  //   if (!employee) throw new NotFoundException("Employee not found.");
  //   return this.payrollRepo.find({
  //     where: { employee: { id: employeeId } },
  //     relations: ["employee"],
  //   });
  // }

  findByEmployee(employeeId: number) {
  return this.payrollRepo.find({
    where: { employee: { id: employeeId } }, // or employeeId
    relations: ["employee"],
  });
}

  /** Generate payslip PDF for single payroll */
 /** Generate payslip PDF for single payroll */
async generatePayslip(payrollId: number) {
  const payroll = await this.findOne(payrollId);
  if (!payroll) throw new NotFoundException("Payroll not found.");

 const PDFDocument = require("pdfkit");
 const doc = new PDFDocument();

  const filePath = path.join(__dirname, `../../uploads/payslip-${payrollId}.pdf`);
  doc.pipe(fs.createWriteStream(filePath));

  doc.fontSize(20).text("Company Name Pvt Ltd", { align: "center" });
doc.fontSize(16).text("Salary Payslip", { align: "center" });

doc.moveDown();

doc.fontSize(12).text(`Employee: ${payroll.employee.firstName} ${payroll.employee.lastName}`);
doc.text(`Month: ${payroll.month}/${payroll.year}`);

doc.moveDown();

doc.text("EARNINGS", { underline: true });

doc.text(`Basic: ₹${payroll.basic}`);
doc.text(`HRA: ₹${payroll.hra}`);
doc.text(`Allowances: ₹${payroll.allowances}`);
doc.text(`Bonus: ₹${payroll.bonus}`);
doc.text(`Arrears: ₹${payroll.arrears}`);

doc.moveDown();

doc.text("DEDUCTIONS", { underline: true });

doc.text(`PF: ₹${payroll.pf}`);
doc.text(`ESI: ₹${payroll.esi}`);
doc.text(`Tax: ₹${payroll.tax}`);
doc.text(`Other Deductions: ₹${payroll.deductions}`);

doc.moveDown();

doc.text(`Gross Salary: ₹${payroll.gross_salary}`, { bold: true });
doc.text(`Net Salary: ₹${payroll.net_salary}`, { bold: true });

  doc.end();

  return { filePath };
}

  /** Generate bank advice CSV for all payrolls */
  async generateBankAdvice(month: number, year: number) {
    const payrolls = await this.payrollRepo.find({
      where: { month, year },
      relations: ["employee"],
    });

    const fields = ["EmployeeName", "AccountNo", "NetSalary"];
    const data = payrolls.map(p => ({
      EmployeeName: `${p.employee.firstName} ${p.employee.lastName}`,
      AccountNo: p.employee.bankAccountNumber ?? "N/A",
      NetSalary: p.net_salary,
    }));

    const parser = new Parser({ fields });
    const csv = parser.parse(data);

    const filePath = path.join(__dirname, `../../uploads/bank-advice-${month}-${year}.csv`);
    fs.writeFileSync(filePath, csv);

    return { filePath };
  }

async generateAll(month: number, year: number) {
  const employees = await this.employeeRepo.find({ relations: ['salaryGrade'] });
  const payrolls: DeepPartial<Payroll>[] = [];

  for (const emp of employees) {
    if (!emp.salaryGrade) continue;

    const basic = emp.salaryGrade.basic;
    const hra = emp.salaryGrade.hra;
    const allowances = emp.salaryGrade.allowances ?? 0;
    const deductions = emp.salaryGrade.deductions ?? 0;
    const pf = basic * (emp.salaryGrade.pf_rate ?? 12) / 100;
    const esi = basic * (emp.salaryGrade.esi_rate ?? 1.75) / 100;
    const tax = (basic + hra + allowances) * 0.1;
    const bonus = 0;
    const arrears = 0;

    const gross_salary = basic + hra + allowances + bonus + arrears;

    const net_salary =
      gross_salary - deductions - pf - esi - tax;

    payrolls.push({
  employee: emp,
  month,
  year,
  basic,
  hra,
  allowances,
  deductions,
  pf,
  esi,
  tax,
  bonus,
  arrears,
  gross_salary,   // ✅ ADD THIS
  net_salary,
  status: "processed",
});
  }

  return this.payrollRepo.save(payrolls);
}
}