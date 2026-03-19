import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, CreateDateColumn } from 'typeorm';

import { Employee } from '../../employee/entities/employee-entity';
import { Candidate } from './candidate.entity';


export enum InterviewStatus {
    SCHEDULED = 'Scheduled',
    COMPLETED = 'Completed',
    CANCELLED = 'Cancelled'
}

@Entity()
export class Interview {
    @PrimaryGeneratedColumn()
    id: number;

    @ManyToOne(() => Candidate)
    candidate: Candidate;

    @ManyToOne(() => Employee)
    interviewer: Employee;

    @Column()
    dateTime: Date;

    @Column({ default: 'Offline' })
    mode: string; // Offline / Online

    @Column({ nullable: true })
    feedback: string;

    @Column({ type: 'enum', enum: InterviewStatus, default: InterviewStatus.SCHEDULED })
    status: InterviewStatus;

    @CreateDateColumn()
    createdAt: Date;
}