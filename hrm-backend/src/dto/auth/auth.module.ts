import { Module } from "@nestjs/common";
import { AuthService } from "./auth.service";
import { JwtStrategy } from "./jwt.strategy";
import { AuthController } from "./auth.controller";
import { PassportModule } from "@nestjs/passport";
import { JwtModule } from "@nestjs/jwt";
import { UserModule } from "../users/user.module";
import { ConfigModule, ConfigService } from "@nestjs/config";

@Module({
    imports:[
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
        })
    ],
    providers:[AuthService, JwtStrategy],
    controllers:[AuthController]
})

export class AuthModule{}