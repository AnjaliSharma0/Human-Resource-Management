import { Body, Controller, Delete, Get, Param, Post, Put } from "@nestjs/common"
import { OrgService } from "./org-service"

@Controller("org")
export class OrgController{

constructor(private service:OrgService){}

@Post("department")
create(@Body() body){
return this.service.create(body)
}

@Get("departments")
getAll(){
return this.service.getAll()
}

@Put("department/:id")
update(@Param("id") id:number,@Body() body){
return this.service.update(id,body)
}

@Delete("department/:id")
delete(@Param("id") id:number){
return this.service.delete(id)
}

}