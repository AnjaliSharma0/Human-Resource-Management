import { Body, Controller, Get, Post, Request, UseGuards } from "@nestjs/common";
import { AuthService } from "./auth.service";
import { JwtAuthGuard } from "./jwt-auth.guard";

@Controller("auth")
export class AuthController{
    constructor(private authService:AuthService){}

    @Post("register")
    register(@Body() body:any){
        return this.authService.register(body)
    }

    @Post("login")
    login(@Body() body:any){
        return this.authService.login(body)
    }

    @Post("activate")
    activate(@Body() body:{token:string, password:string}){
    return this.authService.activateEmployee(body);
    }

    // @Get('profile')
    // // @UseGuards(JwtAuthGuard)
    // getProfile(@Request() req){
    //    return req.user;
    // }
}