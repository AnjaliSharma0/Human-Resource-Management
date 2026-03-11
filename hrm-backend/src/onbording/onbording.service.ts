import { Injectable } from "@nestjs/common"
import { InjectRepository } from "@nestjs/typeorm"
import { Repository } from "typeorm"
import { OnboardingTask } from "./onboarding.entity"
import { Employee } from "src/employee/entities/employee-entity"

@Injectable()
export class OnboardingService {

  constructor(
    @InjectRepository(OnboardingTask)
    private repo: Repository<OnboardingTask>,

    @InjectRepository(Employee)
    private userRepo: Repository<Employee>
  ) {}

  async createTask(employeeId: number, taskName: string) {

    const employee = await this.userRepo.findOne({
      where: { id: employeeId }
    });

    if (!employee) {
      throw new Error("Employee not found");
    }

    const task = this.repo.create({
      employee,
      taskName
    });

    return this.repo.save(task);
  }

  getTasks() {
    return this.repo.find({ relations: ["employee"] });
  }

  completeTask(id: number) {
    return this.repo.update(id, { completed: true });
  }
}