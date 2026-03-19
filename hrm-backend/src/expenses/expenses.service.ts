import { Injectable } from "@nestjs/common"
import { InjectRepository } from "@nestjs/typeorm"
import { Repository } from "typeorm"
import { Expense } from "./expenses.entity"
import { Employee } from "../employee/entities/employee-entity"

@Injectable()
export class ExpensesService {

constructor(
@InjectRepository(Expense) private repo: Repository<Expense>,
@InjectRepository(Employee) private userRepo: Repository<Employee>
){}

async create(dto){

const employee=await this.userRepo.findOne({where:{id:dto.employeeId}})
if(!employee){
    throw new Error("Employee not found.")
}
const expense=this.repo.create({
employee,
amount:dto.amount,
description:dto.description
})

return this.repo.save(expense)

}

getAll(){
return this.repo.find({relations:["employee"]})
}

approve(id){

return this.repo.update(id,{status:"approved"})
}

reject(id){

return this.repo.update(id,{status:"rejected"})
}

}