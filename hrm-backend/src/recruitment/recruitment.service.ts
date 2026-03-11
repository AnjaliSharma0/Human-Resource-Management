import { Injectable } from "@nestjs/common"
import { InjectRepository } from "@nestjs/typeorm"
import { Job } from "./job.entity"
import { Repository } from "typeorm"
import { Candidate } from "./candidate.entity"

@Injectable()
export class RecruitmentService{

constructor(
@InjectRepository(Job) private jobRepo:Repository<Job>,
@InjectRepository(Candidate) private candidateRepo:Repository<Candidate>
){}

createJob(data:any){
const job=this.jobRepo.create(data)
return this.jobRepo.save(job)
}

getJobs(){
return this.jobRepo.find()
}

applyCandidate(data:any){
const candidate=this.candidateRepo.create(data)
return this.candidateRepo.save(candidate)
}

getCandidates(){
return this.candidateRepo.find()
}

}