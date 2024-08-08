import { Controller, Post, Body } from '@nestjs/common';
import { TwilioService } from 'src/infrastructure/services/twilio.service';

@Controller('twilio')
export class TwilioController {
  constructor(private readonly twilioService: TwilioService) {}

  @Post('send-sms')
  async sendSms(@Body() sendSmsDto: { to: string; body: string }) {
    return this.twilioService.sendSms(sendSmsDto.to, sendSmsDto.body);
  }
}
