// import { CanActivate, ExecutionContext, Injectable } from "@nestjs/common";
// import { Reflector } from "@nestjs/core";


// @Injectable()
// export class RolesGaurd implements CanActivate{
//     constructor(private reflector:Reflector){}

//     canActivate(context: ExecutionContext): boolean{
//         const requiredRoles=this.reflector.get<string[]>('roles', context.getHandler())

//         if(!requiredRoles){
//             return true
//         }
//         const request = context.switchToHttp().getRequest()
//         const user= request.user
//         return requiredRoles.includes(user.role)
//     }
// }

import { CanActivate, ExecutionContext, Injectable } from "@nestjs/common";
import { Reflector } from "@nestjs/core";

@Injectable()
export class RolesGaurd implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const requiredRoles = this.reflector.get<string[]>('roles', context.getHandler());
    if (!requiredRoles) return true; // No roles required, allow access

    const request = context.switchToHttp().getRequest();
    const user = request.user;

    if (!user || !user.role) return false; // no user in request -> deny

    return requiredRoles.includes(user.role);
  }
}