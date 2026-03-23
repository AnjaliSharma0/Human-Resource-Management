import { Injectable } from "@nestjs/common"
import { InjectRepository } from "@nestjs/typeorm"
import { Goal } from "./goal.entity"
import { Repository } from "typeorm"
import { Review } from "./review.entity"
import { Employee } from "../employee/entities/employee-entity"
import { PerformanceGateway } from "./performance.gateway"

@Injectable()
export class PerformanceService {

constructor(
@InjectRepository(Goal) private goalRepo: Repository<Goal>,
@InjectRepository(Review) private reviewRepo: Repository<Review>,
@InjectRepository(Employee) private userRepo: Repository<Employee>,
private gateway: PerformanceGateway 
){}

async createGoal(employeeId:number,data:any){

const employee = await this.userRepo.findOne({where:{id:employeeId}})

const goal = this.goalRepo.create({
...data,
employee
})

return this.goalRepo.save(goal)

}

getGoals(){
return this.goalRepo.find({relations:["employee"]})
}

// async addReview(employeeId:number,data:any){

// const employee = await this.userRepo.findOne({where:{id:employeeId}})

// const review = this.reviewRepo.create({
// ...data,
// employee
// })

// return this.reviewRepo.save(review)

// }

getReviews(){
return this.reviewRepo.find({relations:["employee"]})
}
async addReview(employeeId: number, reviewerId: number, data: any) {
  const employee = await this.userRepo.findOne({ where: { id: employeeId } });
  const reviewer = await this.userRepo.findOne({ where: { id: reviewerId } });

  if (!employee || !reviewer) {
    throw new Error("Employee or Reviewer not found");
  }

  const review = this.reviewRepo.create({
    ...data,
    employee,
    reviewer,
  });

  const saved = await this.reviewRepo.save(review);

  // ✅ CORRECT
  this.gateway.emitUpdate();

  return saved;
}

async updateGoalStatus(goalId: number, status: string) {
  const goal = await this.goalRepo.findOne({ where: { id: goalId } });
  if (!goal) throw new Error("Goal not found");

  goal.status = status;
  const saved = await this.goalRepo.save(goal);

  // notify frontend
  this.gateway.emitUpdate();

  return saved;
}
}