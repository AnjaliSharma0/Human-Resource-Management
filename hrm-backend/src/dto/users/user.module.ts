import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { User } from "./user-entity.dto";
import { UserService } from "src/dto/users/users-service";
import { UsersController } from "./user.controller";

@Module({
    imports:[TypeOrmModule.forFeature([User])],
    providers:[UserService],
    controllers:[UsersController],
    exports:[UserService]
})
export class UserModule{}