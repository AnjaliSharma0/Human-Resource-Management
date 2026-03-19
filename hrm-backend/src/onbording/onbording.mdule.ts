import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";

// ✅ Offboarding Entities
import { Offboarding } from "./entity/offbording.entity";
import { ExitInterview } from "./entity/exit-interview.entity";
import { NoDues } from "./entity/no-dues.entity";
import { FinalSettlement } from "./entity/final-settlement.entity";

// ✅ Onboarding Entities
import { Onboarding } from "./entity/onboarding.entity";

import { Orientation } from "./entity/orientation.entity";

// ✅ Controllers

import { OnboardingController } from "./onbording.controller";

// ✅ Services
import { OffboardingService } from "./offbording.service";
import { OnboardingService } from "./onbording.service";
import { PreJoiningDoc } from "./entity/pre-joining-doc.entity";
import { Checklist } from "./entity/chceklist.entity";
import { OffboardingController } from "./offbording-controller";

@Module({
  imports: [
    TypeOrmModule.forFeature([
      // 🔴 Offboarding
      Offboarding,
      ExitInterview,
      NoDues,
      FinalSettlement,

      // 🔵 Onboarding
      Onboarding,
      PreJoiningDoc,
      Checklist,
      Orientation,
    ]),
  ],
  controllers: [
    OffboardingController,
    OnboardingController,
  ],
  providers: [
    OffboardingService,
    OnboardingService,
  ],
  exports: [
    OffboardingService,
    OnboardingService,
  ],
})
export class HrModule {}