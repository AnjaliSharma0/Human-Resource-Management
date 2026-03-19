import { Controller, Get, Post, Query, Body } from '@nestjs/common';
import { IntegrationsService } from './integration.service';


@Controller('integrations')
export class IntegrationsController {
  constructor(private readonly service: IntegrationsService) {}

  @Get('status')
  getStatus() {
    return this.service.getAllStatus();
  }

  @Get('slack/auth')
  redirectToSlack() {
    return this.service.getSlackAuthUrl();
  }

  @Get('slack/callback')
  slackCallback(@Query('code') code: string) {
    return this.service.handleSlackCallback(code);
  }

  @Post('payroll/sync')
  syncPayroll() {
    return this.service.syncPayroll();
  }

  @Post('epfo/export')
  exportEPFO() {
    return this.service.exportEPFO();
  }

  @Post('lms/sync')
  syncLMS() {
    return this.service.syncLMS();
  }
}