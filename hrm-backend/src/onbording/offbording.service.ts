import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";

// Entities
import { Offboarding } from "./entity/offbording.entity";
import { ExitInterview } from "./entity/exit-interview.entity";
import { NoDues } from "./entity/no-dues.entity";
import { FinalSettlement } from "./entity/final-settlement.entity";

@Injectable()
export class OffboardingService {
  constructor(
    @InjectRepository(Offboarding)
    private offboardingRepo: Repository<Offboarding>,

    @InjectRepository(ExitInterview)
    private exitRepo: Repository<ExitInterview>,

    @InjectRepository(NoDues)
    private noDuesRepo: Repository<NoDues>,

    @InjectRepository(FinalSettlement)
    private settlementRepo: Repository<FinalSettlement>,
  ) {}

  // =========================
  // 🧾 OFFBOARDING
  // =========================
  createOffboarding(dto: any) {
    return this.offboardingRepo.save(dto);
  }

  getAllOffboarding() {
    return this.offboardingRepo.find();
  }

  // =========================
  // 🎤 EXIT INTERVIEW
  // =========================
  createExitInterview(dto: any) {
    return this.exitRepo.save(dto);
  }

  getExitInterviews() {
    return this.exitRepo.find();
  }

  // =========================
  // 🧾 NO DUES
  // =========================
  getNoDues() {
    return this.noDuesRepo.find();
  }

  approveNoDues(id: number) {
    return this.noDuesRepo.update(id, { cleared: true });
  }

  // (Optional - Admin creates tasks)
  createNoDues(dto: any) {
    return this.noDuesRepo.save(dto);
  }

  // =========================
  // 💰 FINAL SETTLEMENT
  // =========================
  createSettlement(dto: any) {
    return this.settlementRepo.save(dto);
  }

  getSettlements() {
    return this.settlementRepo.find();
  }
}