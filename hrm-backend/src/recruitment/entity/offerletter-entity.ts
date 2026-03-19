import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, CreateDateColumn, JoinColumn } from 'typeorm';
import { Candidate } from './candidate.entity';



export enum OfferStatus {
    SENT = 'Sent',
    ACCEPTED = 'Accepted',
    REJECTED = 'Rejected'
}

@Entity()
export class OfferLetter {
    @PrimaryGeneratedColumn()
    id: number;

    @ManyToOne(() => Candidate  ,{ nullable: false })
    @JoinColumn({ name: 'candidateId' }) 
    candidate: Candidate;

    @Column()
    offerFileUrl: string;

    @Column({ type: 'enum', enum: OfferStatus, default: OfferStatus.SENT })
    status: OfferStatus;

    @CreateDateColumn()
    sentAt: Date;

    @Column({ nullable: true })
    acceptedAt: Date;

@Column()
candidateId: number;
}