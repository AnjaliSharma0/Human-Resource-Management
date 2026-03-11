import { Module } from "@nestjs/common";
import { IntegrationService } from "./integration.service";
import { IntegrationsController } from "./integration.controller";

@Module({
    providers:[IntegrationService],
    controllers:[IntegrationsController]
})
export class IntegrationModule{}