import { Module } from '@nestjs/common';
import { NotificationService } from '../../services/notification.service';
import { TwilioService } from '../../services/twilio.service';
import { EmailService } from '../../services/email.service';

@Module({
  providers: [NotificationService, TwilioService, EmailService],
  exports: [NotificationService],
})
export class NotificationModule {}
