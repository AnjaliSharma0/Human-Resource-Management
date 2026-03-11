import { Injectable } from "@nestjs/common"
import { InjectRepository } from "@nestjs/typeorm"
import { Department } from "./department.entity"
import { Repository } from "typeorm"

@Injectable()
export class OrgService{

constructor(
@InjectRepository(Department) private repo:Repository<Department>
){}

create(data){
const dept=this.repo.create(data)
return this.repo.save(dept)
}

getAll(){
return this.repo.find()
}

update(id,data){
return this.repo.update(id,data)
}

delete(id){
return this.repo.delete(id)
}

}