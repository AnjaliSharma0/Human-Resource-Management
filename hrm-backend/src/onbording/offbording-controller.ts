import { Body, Controller, Get, Param, Patch, Post, Req } from "@nestjs/common";
import { OffboardingService } from "./offbording.service";

@Controller()
export class OffboardingController {
  constructor(private service: OffboardingService) {}

  // OFFBOARDING
  @Post("offboarding")
  create(@Body() dto) {
    return this.service.createOffboarding(dto);
  }

  @Get("offboarding")
  getAll() {
    return this.service.getAllOffboarding();
  }

  // EXIT INTERVIEW
  @Post("exit-interview")
createExit(@Req() req, @Body() dto) {
  const user = req.user; // might be undefined
  const employeeId = user?.id ?? dto.employeeId; // fallback to body

  if (!employeeId) throw new Error("Employee ID missing");

  return this.service.createExitInterview({
    ...dto,
    employeeId,
  });
}

  @Get("exit-interview")
  getExit() {
    return this.service.getExitInterviews();
  }
  @Post("no-dues")
createNoDues(@Body() dto, @Req() req) {
  const user = req.user; // logged-in user
  // Attach employeeId if missing (optional depending on your logic)
  if (!dto.employeeId && user.role === "employee") {
    dto.employeeId = user.id;
  }
  return this.service.createNoDues(dto);
}
  // NO DUES
  @Get("no-dues")
  getNoDues() {
    return this.service.getNoDues();
  }

  @Patch("no-dues/:id")
  approve(@Param("id") id: number) {
    return this.service.approveNoDues(Number(id));
  }

  // FINAL SETTLEMENT
  @Post("final-settlement")
  createSettlement(@Body() dto) {
    return this.service.createSettlement(dto);
  }

  @Get("final-settlement")
  getSettlement() {
    return this.service.getSettlements();
  }
}