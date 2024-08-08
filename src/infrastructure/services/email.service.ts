import { Injectable, InternalServerErrorException } from '@nestjs/common';
import * as nodemailer from 'nodemailer';

@Injectable()
export class EmailService {
  private transporter: nodemailer.Transporter;

  constructor() {
    this.transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });
  }

  async sendEmail(to: string, subject: string, body: string): Promise<void> {
    const mailOptions = {
      from: process.env.EMAIL_USER,
      to,
      subject,
      text: body,
    };

    try {
      const info = await this.transporter.sendMail(mailOptions);
      console.log(`E-mail enviado: ${info.response}`);
    } catch (error) {
      console.error(`Erro ao enviar e-mail: ${error.message}`);
      throw new InternalServerErrorException('Falha ao enviar e-mail');
    }
  }
}
