import { Body, Controller, Get, Param, Post, Put } from "@nestjs/common"
import { OnboardingService } from "./onbording.service"

@Controller("onboarding")
export class OnboardingController{

constructor(private service:OnboardingService){}

@Post("task")
create(@Body() body){
return this.service.createTask(body.employeeId,body.taskName)
}

@Get("tasks")
getTasks(){
return this.service.getTasks()
}

@Put("complete/:id")
complete(@Param("id") id:number){
return this.service.completeTask(id)
}

}