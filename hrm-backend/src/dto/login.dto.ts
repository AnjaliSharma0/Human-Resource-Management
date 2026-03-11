import { IsEmail, IsString } from "class-validator"

export class login{
    @IsEmail()
    email:string

    @IsString()
    password:string
}