import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { EmailService } from './email.service';
import { TwilioService } from './twilio.service';

@Injectable()
export class NotificationService {
  constructor(
    private readonly emailService: EmailService,
    private readonly twilioService: TwilioService
  ) {}

  async sendEmail(to: string, subject: string, body: string): Promise<void> {
    try {
      await this.emailService.sendEmail(to, subject, body);
      console.log(`Email enviado para ${to} com o assunto ${subject}`);
    } catch (error) {
      console.error(`Erro ao enviar email para ${to}: ${error.message}`);
      throw new InternalServerErrorException('Erro ao enviar o email');
    }
  }

  async sendSms(to: string, body: string): Promise<void> {
    try {
      await this.twilioService.sendSms(to, body);      
      console.log(`SMS enviado para ${to}`);
    } catch (error) {
      console.error(`Erro ao enviar SMS para ${to}: ${error.message}`);
      throw new InternalServerErrorException('Erro ao enviar o SMS');
    }
  }
}
