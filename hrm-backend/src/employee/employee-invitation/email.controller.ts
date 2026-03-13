import { Controller, Get, Query } from "@nestjs/common";
import { EmailService } from "./email-service";


@Controller("email")
export class EmailController {
  constructor(private readonly emailService: EmailService) {}

  @Get("send")
  async sendTestEmail(
    @Query("email") email: string,
    @Query("token") token: string
  ) {
    await this.emailService.sendInviteEmail(email, token);

    return {
      message: "Email sent successfully",
    };
  }
}