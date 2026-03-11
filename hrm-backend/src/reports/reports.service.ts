import { Injectable } from "@nestjs/common"
import { InjectRepository } from "@nestjs/typeorm"
import { Attendance } from "src/attendance/attendance.entity"
import { Leave } from "src/leave/leave.entity"
import { Payroll } from "src/payroll/payroll.entity"
import { Repository } from "typeorm"

@Injectable()
export class ReportsService{

constructor(
@InjectRepository(Attendance) private attendanceRepo:Repository<Attendance>,
@InjectRepository(Leave) private leaveRepo:Repository<Leave>,
@InjectRepository(Payroll) private payrollRepo:Repository<Payroll>
){}

attendanceReport(){
return this.attendanceRepo.find({relations:["employee"]})
}

leaveReport(){
return this.leaveRepo.find({relations:["employee"]})
}

payrollReport(){
return this.payrollRepo.find({relations:["employee"]})
}

}