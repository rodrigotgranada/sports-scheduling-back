// src/interface-adapters/controllers/email.controller.ts
import { Controller, Post, Body } from '@nestjs/common';
import { EmailService } from 'src/infrastructure/services/email.service';

@Controller('email')
export class EmailController {
  constructor(private readonly emailService: EmailService) {}

  @Post('send')
  sendEmail(@Body() sendEmailDto) {
    return this.emailService.sendEmail(sendEmailDto.to, sendEmailDto.subject, sendEmailDto.text);
  }
}
