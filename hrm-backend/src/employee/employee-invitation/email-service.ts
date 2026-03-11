import { Injectable } from "@nestjs/common";
import * as nodemailer from "nodemailer";

@Injectable()
export class EmailService {

  private transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: "yourgmail@gmail.com",
      pass: "your-app-password"
    }
  });

  async sendInviteEmail(email: string, token: string) {

    const link = `http://localhost:5000/set-password?token=${token}`;

    await this.transporter.sendMail({
      to: email,
      subject: "Activate your HRMS account",
      html: `
        <h3>Welcome to HRMS</h3>
        <p>Click below to set your password:</p>
        <a href="${link}">${link}</a>
      `
    });

  }
}