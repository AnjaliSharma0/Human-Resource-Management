import { Injectable, BadRequestException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";

// Entities
import { Onboarding } from "./entity/onboarding.entity";
import { Orientation } from "./entity/orientation.entity";
import { PreJoiningDoc } from "./entity/pre-joining-doc.entity";
import { Checklist } from "./entity/chceklist.entity";

@Injectable()
export class OnboardingService {
  constructor(
    @InjectRepository(Onboarding)
    private onboardingRepo: Repository<Onboarding>,

    @InjectRepository(PreJoiningDoc)
    private docRepo: Repository<PreJoiningDoc>,

    @InjectRepository(Checklist)
    private checklistRepo: Repository<Checklist>,

    @InjectRepository(Orientation)
    private orientationRepo: Repository<Orientation>,
  ) {}

  // =========================
  // 🧾 ONBOARDING
  // =========================
  async create(dto: Partial<Onboarding>) {
    return this.onboardingRepo.save(dto);
  }

  async findAll() {
    return this.onboardingRepo.find({
      relations: ["employee"], // keep if relation exists
    });
  }

  async updateStatus(id: number, status: string) {
    return this.onboardingRepo.update(id, { status });
  }

  // =========================
  // 📄 DOCUMENTS
  // =========================
  async uploadDocument(dto: {
    employeeId: number;
    documentName: string;
    fileUrl: string;
    documentType: string;
  }) {
    const { employeeId, fileUrl, documentName, documentType } = dto;

    if (!employeeId || !fileUrl || !documentName || !documentType) {
      throw new BadRequestException(
        "Missing required fields: employeeId, documentName, fileUrl, documentType",
      );
    }

    // Save document
    return this.docRepo.save({
      employeeId,
      documentName,
      fileUrl,
      documentType,
      isVerified: false, // default false
    });
  }

  async getDocuments(employeeId?: number) {
    if (employeeId) {
      return this.docRepo.find({ where: { employeeId } });
    }
    return this.docRepo.find();
  }

  async approveDocument(id: number) {
    return this.docRepo.update(id, { isVerified: true });
  }

  async deleteDocument(id: number) {
    return this.docRepo.delete(id);
  }

  // =========================
  // ✅ CHECKLIST
  // =========================
  async createChecklist(dto: Partial<Checklist>) {
    return this.checklistRepo.save(dto);
  }

  async getChecklist() {
    return this.checklistRepo.find();
  }

  async updateChecklist(id: number, completed: boolean) {
    return this.checklistRepo.update(id, { completed });
  }

  // =========================
  // 📅 ORIENTATION
  // =========================
  async createOrientation(dto: Partial<Orientation>) {
    return this.orientationRepo.save(dto);
  }

  async getOrientation() {
    return this.orientationRepo.find();
  }
}