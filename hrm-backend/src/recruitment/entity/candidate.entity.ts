import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, CreateDateColumn } from 'typeorm';
import { JobPosting } from './job-posting-entity';
import { Employee } from 'src/employee/entities/employee-entity';


export enum CandidateStatus {
    APPLIED = 'Applied',
    IN_REVIEW = 'InReview',
    INTERVIEW = 'Interview',
    OFFERED = 'Offered',
    REJECTED = 'Rejected'
}

@Entity()
export class Candidate {
    @PrimaryGeneratedColumn()
    id: number;
    

    // @Column()
    // firstName: string;

    // @Column()
    // lastName: string;

    // @Column()
    // email: string;

    // @Column()

    // phone: string;
    @ManyToOne(() => Employee, { nullable: false })
employee: Employee;

    @Column({ nullable: true })
    resumeUrl: string;

    @ManyToOne(() => JobPosting)
    appliedFor: JobPosting;

    @Column({ type: 'enum', enum: CandidateStatus, default: CandidateStatus.APPLIED })
    status: CandidateStatus;

    @CreateDateColumn()
    appliedAt: Date;
}