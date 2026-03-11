import { Injectable } from "@nestjs/common"
import { InjectRepository } from "@nestjs/typeorm"
import { Goal } from "./goal.entity"
import { Repository } from "typeorm"
import { Review } from "./review.entity"
import { Employee } from "src/employee/entities/employee-entity"

@Injectable()
export class PerformanceService {

constructor(
@InjectRepository(Goal) private goalRepo: Repository<Goal>,
@InjectRepository(Review) private reviewRepo: Repository<Review>,
@InjectRepository(Employee) private userRepo: Repository<Employee>,
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

async addReview(employeeId:number,data:any){

const employee = await this.userRepo.findOne({where:{id:employeeId}})

const review = this.reviewRepo.create({
...data,
employee
})

return this.reviewRepo.save(review)

}

getReviews(){
return this.reviewRepo.find({relations:["employee"]})
}

}