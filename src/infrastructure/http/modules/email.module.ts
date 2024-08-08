// src/infrastructure/http/modules/email.module.ts
import { Module } from '@nestjs/common';
import { EmailService } from '../../services/email.service';
import { EmailController } from 'src/interface-adapters/controllers/email.controller';

@Module({
  providers: [EmailService],
  controllers: [EmailController],
})
export class EmailModule {}
