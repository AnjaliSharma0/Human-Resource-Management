import { Module } from "@nestjs/common";
import { AuthService } from "./auth.service";
import { JwtStrategy } from "./jwt.strategy";
import { AuthController } from "./auth.controller";
import { PassportModule } from "@nestjs/passport";
import { JwtModule } from "@nestjs/jwt";
import { UserModule } from "../users/user.module";
import { ConfigModule, ConfigService } from "@nestjs/config";
import { EmailModule } from "src/employee/employee-invitation/email-module.dto";
import { UserService } from "../users/users-service";
import { TypeOrmModule } from "@nestjs/typeorm";
import { User } from "../users/user-entity.dto";
import { Employee } from "src/employee/entities/employee-entity";

@Module({
    imports:[TypeOrmModule.forFeature([User , Employee]),
        UserModule,
        PassportModule,
        ConfigModule,
        JwtModule.registerAsync({
           imports:[ConfigModule],
           inject:[ConfigService],
           useFactory:(configService: ConfigService)=>({
            secret: configService.get<string>('JWT_SECRET'),
            signOptions:{expiresIn:"1d"}
           })
        }),
        EmailModule
    ],
    providers:[AuthService, JwtStrategy,UserService],
    controllers:[AuthController]
})

export class AuthModule{}