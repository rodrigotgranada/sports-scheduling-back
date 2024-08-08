import { Injectable } from '@nestjs/common';
import * as twilio from 'twilio';

@Injectable()
export class TwilioService {
  private twilioClient: twilio.Twilio;

  constructor() {
    this.twilioClient = twilio(process.env.TWILIO_ACCOUNT_SID, process.env.TWILIO_AUTH_TOKEN);
  }

  async sendSms(to: string, body: string): Promise<void> {
    try {
      await this.twilioClient.messages.create({
        body,
        from: process.env.TWILIO_PHONE_NUMBER,
        to: `+55${to}`,
      });
    } catch (error) {
      throw new Error('Falha ao enviar SMS');
    }
  }
}
