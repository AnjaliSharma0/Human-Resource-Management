import { Injectable } from "@nestjs/common";
import sgMail from "@sendgrid/mail";

@Injectable()
export class EmailService {
  private fromEmail: string;

  constructor() {
    const apiKey = process.env.SENDGRID_API_KEY;
    const fromEmail = process.env.SENDGRID_FROM_EMAIL;

    if (!apiKey) {
      throw new Error("SENDGRID_API_KEY is not defined in .env");
    }

    if (!fromEmail) {
      throw new Error("SENDGRID_FROM_EMAIL is not defined in .env");
    }

    sgMail.setApiKey(apiKey);
    this.fromEmail = fromEmail; // now guaranteed string
  }

  async sendInviteEmail(email: string, token: string) {
    const link = `http://localhost:3000/auth/activate?token=${token}`;

    await sgMail.send({
      to: email,
      from: this.fromEmail, // ✅ no TypeScript error
      subject: "Activate your HRMS account",
      html: `<h3>Welcome to HRMS</h3>
             <p>Click <a href="${link}">here</a> to activate your account</p>`,
    });
  }
}