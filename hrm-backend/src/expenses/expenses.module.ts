import { Module } from "@nestjs/common";
import { ExpensesController } from "./expenses.controller";
import { ExpensesService } from "./expenses.service";
import { TypeOrmModule } from "@nestjs/typeorm";
import { Expense } from "./expenses.entity";
import { Employee } from "src/employee/entities/employee-entity";

@Module({
    imports:[TypeOrmModule.forFeature([Expense, Employee])],
    controllers:[ExpensesController],
    providers:[ExpensesService]
})

export class ExpenseModule{}