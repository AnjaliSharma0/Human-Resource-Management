import { InjectRepository } from "@nestjs/typeorm";
import { User } from "../../dto/users/user-entity.dto";
import { Repository } from "typeorm";

export class UserService{
    constructor(@InjectRepository(User) private userRepo:Repository<User>){}

    create(userData: Partial<User>){
        const user = this.userRepo.create(userData)
        return this.userRepo.save(user)
    }

    findByEmail(email:string){
        return this.userRepo.findOne({where :{email}})
    }
}