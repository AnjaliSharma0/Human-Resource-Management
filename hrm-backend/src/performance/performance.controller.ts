import { Body, Controller, Get, Param, Patch, Post } from "@nestjs/common"
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
addReview(@Body() body: any) {
  return this.service.addReview(
    body.employeeId,
    body.reviewerId,
    body
  );
}
@Get("reviews")
getReviews(){
return this.service.getReviews()
}
@Patch("goal/:id")
async updateGoalStatus(
  @Param("id") id: string,
  @Body() body: { status: string }
) {
  return this.service.updateGoalStatus(Number(id), body.status);
}
}