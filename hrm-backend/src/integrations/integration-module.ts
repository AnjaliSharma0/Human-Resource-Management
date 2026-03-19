import { Module } from "@nestjs/common";

import { IntegrationsController } from "./integration.controller";
import { IntegrationsService } from "./integration.service";

@Module({
    providers:[IntegrationsService],
    controllers:[IntegrationsController]
})
export class IntegrationModule{}