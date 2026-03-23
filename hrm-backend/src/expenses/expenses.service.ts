import { Injectable } from "@nestjs/common"
import { InjectRepository } from "@nestjs/typeorm"
import { Repository } from "typeorm"
import { Expense } from "./expenses.entity"
import { Employee } from "../employee/entities/employee-entity"
import { CreateExpenseDto } from "./dto/create-expense.dto"

@Injectable()
export class ExpensesService {

constructor(
@InjectRepository(Expense) private repo: Repository<Expense>,
@InjectRepository(Employee) private userRepo: Repository<Employee>
){}

async create(dto: CreateExpenseDto) {
  const employee = await this.userRepo.findOne({
    where: { id: dto.employeeId },
  });

  if (!employee) {
    throw new Error("Employee not found.");
  }

  const expense = this.repo.create({
    employee,
    amount: dto.amount,
    description: dto.description,
    category: dto.category,
    receiptUrl: dto.receiptUrl,
    status: "pending",
  });

  return this.repo.save(expense);
}

getAll(){
return this.repo.find({relations:["employee"]})
}
approve(id: number, role: string) {
  if (role === "manager") {
    return this.repo.update(id, { status: "manager_approved" });
  }

  if (role === "admin") {
    return this.repo.update(id, { status: "approved" });
  }

  throw new Error("Unauthorized");
}

reject(id: number, role: string) {
  if (role === "manager" || role === "admin") {
    return this.repo.update(id, { status: "rejected" });
  }

  throw new Error("Unauthorized");
}

async validateLimit(category, amount) {
  if (category === "travel" && amount > 5000) {
    throw new Error("Travel limit exceeded");
  }
}
delete(id: number) {
  return this.repo.delete(id);
}

}