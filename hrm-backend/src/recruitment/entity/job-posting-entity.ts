import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, CreateDateColumn, UpdateDateColumn } from 'typeorm';
import { JobRequisition } from './job-requisition-entity';


@Entity()
export class JobPosting {
    @PrimaryGeneratedColumn()
    id: number;

    @ManyToOne(() => JobRequisition)
    jobRequisition: JobRequisition;

    @Column({ default: false })
    isInternal: boolean;

    @Column({ default: false })
    isExternal: boolean;

    @Column()
    postingStartDate: Date;

    @Column()
    postingEndDate: Date;

    @CreateDateColumn()
    createdAt: Date;

    @UpdateDateColumn()
    updatedAt: Date;
}