import { Body, Controller, Get, Post } from "@nestjs/common"
import { PerformanceService } from "./performance.service"

@Controller("performance")
export class PerformanceController{

constructor(private service:PerformanceService){}

@Post("goal")
createGoal(@Body() body:any){
return this.service.createGoal(body.employeeId,body)
}

@Get("goals")
getGoals(){
return this.service.getGoals()
}

@Post("review")
addReview(@Body() body:any){
return this.service.addReview(body.employeeId,body)
}

@Get("reviews")
getReviews(){
return this.service.getReviews()
}

}