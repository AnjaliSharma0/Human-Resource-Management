import { Controller, Get } from "@nestjs/common"
import { ReportsService } from "./reports.service"

@Controller("reports")
export class ReportsController{

constructor(private service:ReportsService){}

@Get("attendance")
attendance(){
return this.service.attendanceReport()
}

@Get("leave")
leave(){
return this.service.leaveReport()
}

@Get("payroll")
payroll(){
return this.service.payrollReport()
}

}