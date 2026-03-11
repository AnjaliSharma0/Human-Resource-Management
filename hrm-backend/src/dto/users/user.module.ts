import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { User } from "./user-entity.dto";

import { UsersController } from "./user.controller";
import { UserService } from "./users-service";


@Module({
    imports:[TypeOrmModule.forFeature([User])],
    providers:[UserService],
    controllers:[UsersController],
    exports:[UserService]
})
export class UserModule{}