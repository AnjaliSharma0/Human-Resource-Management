import { Employee } from '../../employee/entities/employee-entity';
import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, CreateDateColumn, UpdateDateColumn } from 'typeorm';


export enum RequisitionStatus {
    DRAFT = 'Draft',
    PENDING_APPROVAL = 'PendingApproval',
    APPROVED = 'Approved',
    REJECTED = 'Rejected'
}

@Entity()
export class JobRequisition {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    title: string;

    @Column()
    department: string;

    @Column()
    location: string;

    @Column('text')
    description: string;

    @Column({ type: 'enum', enum: RequisitionStatus, default: RequisitionStatus.DRAFT })
    status: RequisitionStatus;

    @ManyToOne(() => Employee, { nullable: false })
    createdBy: Employee;

    @ManyToOne(() => Employee, { nullable: true })
    approvedBy: Employee;

    @CreateDateColumn()
    createdAt: Date;

    @UpdateDateColumn()
    updatedAt: Date;
}