// src/infrastructure/http/modules/twilio.module.ts
import { Module } from '@nestjs/common';
import { TwilioService } from '../../services/twilio.service';
import { TwilioController } from 'src/interface-adapters/controllers/twilio.controller';

@Module({
  providers: [TwilioService],
  controllers: [TwilioController],
})
export class TwilioModule {}
