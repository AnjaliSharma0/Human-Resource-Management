import { Injectable, UnauthorizedException } from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import { UserService } from "src/dto/users/users-service";
import bcrypt from "bcrypt"
@Injectable()
export class AuthService{
    constructor(private userService:UserService,
        private jwtService: JwtService
    ){}
    //regsiter logic
    async register(data:any){
        const hash= await bcrypt.hash(data.password, 10)

        const user= await this.userService.create({
              ...data,
              password: hash
        })
        return user
    }


    async login (data:any){
        const user = await this.userService.findByEmail(data.email)

        if(!user){
            throw new UnauthorizedException("Invalid Credentials.")
        }

        const match = await bcrypt.compare(data.password, user.password)

        if(!match) 
        {
            throw new UnauthorizedException("Invalid expressions.")
        }

        const payload = {
           id: user.id,
           email:user.email,
           role: user.role
        }
        return {
            access_token: this.jwtService.sign(payload)
        }
    }
}