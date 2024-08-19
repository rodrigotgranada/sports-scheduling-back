import { Injectable, Logger } from '@nestjs/common';
import { EmailService } from './email.service';
import { TwilioService } from './twilio.service';

@Injectable()
export class NotificationService {
  private readonly logger = new Logger(NotificationService.name);

  constructor(
    private readonly emailService: EmailService,
    private readonly twilioService: TwilioService
  ) {}

  async sendEmail(to: string, subject: string, body: string): Promise<{ success: boolean; error?: string }> {
    try {
      await this.emailService.sendEmail(to, subject, body);
      this.logger.log(`Email enviado para ${to} com o assunto ${subject}`);
      return { success: true };
    } catch (error) {
      this.logger.error(`Erro ao enviar email para ${to}: ${error.message}`);
      return { success: false, error: error.message };
    }
  }

  async sendSms(to: string, body: string): Promise<{ success: boolean; error?: string }> {
    try {
      await this.twilioService.sendSms(to, body);
      this.logger.log(`SMS enviado para ${to}`);
      return { success: true };
    } catch (error) {
      this.logger.error(`Erro ao enviar SMS para ${to}: ${error.message}`);
      return { success: false, error: error.message };
    }
  }
}
