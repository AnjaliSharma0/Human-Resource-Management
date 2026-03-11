import { Body, Controller, Get, Post } from "@nestjs/common"
import { RecruitmentService } from "./recruitment.service"

@Controller("recruitment")
export class RecruitmentController{

constructor(private service:RecruitmentService){}

@Post("job")
createJob(@Body() body:any){
return this.service.createJob(body)
}

@Get("jobs")
getJobs(){
return this.service.getJobs()
}

@Post("candidate")
apply(@Body() body:any){
return this.service.applyCandidate(body)
}

@Get("candidates")
getCandidates(){
return this.service.getCandidates()
}

}