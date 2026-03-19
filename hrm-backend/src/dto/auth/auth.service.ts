import { BadRequestException, Injectable, UnauthorizedException } from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import { UserService } from "../../dto/users/users-service";
import bcrypt from "bcrypt"
import { EmailService } from "../../employee/employee-invitation/email-service";
import { InjectRepository } from "@nestjs/typeorm";
import { Employee } from "../../employee/entities/employee-entity";
import { Repository } from "typeorm";
import { User } from "../users/user-entity.dto";
@Injectable()
export class AuthService {
    constructor(
        private emailService: EmailService,
        private userService: UserService,
        private jwtService: JwtService,

        @InjectRepository(Employee)
        private employeeRepo: Repository<Employee>,

        @InjectRepository(User)
        private userRepo: Repository<User>,
    ) { }
    //regsiter logic
    async register(data: any) {
        const hash = await bcrypt.hash(data.password, 10)

        const user = await this.userService.create({
            ...data,
            password: hash
        })
        return user
    }

    async activateEmployee(data: { token: string; password: string }) {

        if (!data?.token) {
        throw new BadRequestException("Activation token is required");
    }
        const employee = await this.employeeRepo.findOne({
            where: { activationToken: data.token }
        })

        if (!employee) {
            throw new UnauthorizedException("Invalid token")
        }
        if (employee.status === "Active") {
  throw new BadRequestException("Account already activated");
}

        const hash = await bcrypt.hash(data.password, 10)

        await this.userRepo.update(
            { email: employee.email },
            { password: hash }
        )

        employee.status = "Active"
        employee.activationToken = null

        await this.employeeRepo.save(employee)

        return { message: "Account activated" }
    }
    async login(data: any) {
        const user = await this.userService.findByEmail(data.email)

        if (!user) {
            throw new UnauthorizedException("Invalid Credentials.")
        }

        const match = await bcrypt.compare(data.password, user.password)

        if (!match) {
            throw new UnauthorizedException("Invalid expressions.")
        }
  const employee = await this.employeeRepo.findOne({
    where: { user: { id: user.id } },
  });
        const payload = {
            id: user.id,
            email: user.email,
            role: user.role,
            employeeId: employee?.id
        }
        return {
            access_token: this.jwtService.sign(payload)
        }
    }
}