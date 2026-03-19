import { 
  Body, Controller, Delete, Get, Param, Patch, Post, UploadedFile, UseInterceptors, BadRequestException 
} from "@nestjs/common";
import { OnboardingService } from "./onbording.service";
import { FileInterceptor } from "@nestjs/platform-express";
import { storage } from "../../upload.config";
@Controller()
export class OnboardingController {
  constructor(private service: OnboardingService) {}

  // =========================
  // 🧾 ONBOARDING
  // =========================
  @Post("onboarding")
  create(@Body() dto) {
    return this.service.create(dto);
  }

  @Get("onboarding")
  getAll() {
    return this.service.findAll();
  }

  @Patch("onboarding/:id/status")
  updateStatus(@Param("id") id: number, @Body("status") status: string) {
    return this.service.updateStatus(Number(id), status);
  }

  // =========================
  // 📄 DOCUMENTS
  // =========================


@Post("documents/upload")
@UseInterceptors(FileInterceptor("file", { storage }))
uploadFile(
  @UploadedFile() file: Express.Multer.File,
  @Body() body
) {
  const employeeId = Number(body.employeeId);

  if (!file) throw new BadRequestException("File is required");
  if (!employeeId || isNaN(employeeId))
    throw new BadRequestException("Invalid employeeId");
  if (!body.documentType)
    throw new BadRequestException("documentType is required");

  return this.service.uploadDocument({
    employeeId,
    documentName: file.originalname,
    fileUrl: file.filename, // use saved filename
    documentType: body.documentType,
  });
}

  @Get("documents")
  getDocs(@Body("employeeId") employeeId?: number) {
    return this.service.getDocuments(employeeId);
  }

  @Patch("documents/:id/approve")
  approve(@Param("id") id: number) {
    return this.service.approveDocument(Number(id));
  }

  @Delete("documents/:id")
  delete(@Param("id") id: number) {
    return this.service.deleteDocument(Number(id));
  }

  // =========================
  // ✅ CHECKLIST
  // =========================
  @Post("checklist")
  createChecklist(@Body() dto) {
    return this.service.createChecklist(dto);
  }

  @Get("checklist")
  getChecklist() {
    return this.service.getChecklist();
  }

  @Patch("checklist/:id")
  updateChecklist(@Param("id") id: number, @Body() body) {
    return this.service.updateChecklist(Number(id), body.completed);
  }

  // =========================
  // 📅 ORIENTATION
  // =========================
  @Post("orientation")
  createOrientation(@Body() dto) {
    return this.service.createOrientation(dto);
  }

  @Get("orientation")
  getOrientation() {
    return this.service.getOrientation();
  }
}