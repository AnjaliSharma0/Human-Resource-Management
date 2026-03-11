import { Body, Controller, Get, Param, Post, Put } from "@nestjs/common"
import { ExpensesService } from "./expenses.service"


@Controller("expenses")
export class ExpensesController{

constructor(private service:ExpensesService){}

@Post()
create(@Body() body){
return this.service.create(body)
}

@Get()
getAll(){
return this.service.getAll()
}

@Put("approve/:id")
approve(@Param("id") id:number){
return this.service.approve(id)
}

@Put("reject/:id")
reject(@Param("id") id:number){
return this.service.reject(id)
}

}