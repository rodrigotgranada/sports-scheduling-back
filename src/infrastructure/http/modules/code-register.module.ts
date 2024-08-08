// src/infrastructure/http/modules/code-register.module.ts
import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { CodeRegisterSchema } from 'src/infrastructure/database/models/CodeRegisterSchema';
import { CodeRegisterRepository } from 'src/infrastructure/database/repositories/CodeRegisterRepository';
import { CodeRegisterController } from 'src/interface-adapters/controllers/code-register.controller';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: 'CodeRegister', schema: CodeRegisterSchema }])
  ],
  controllers: [CodeRegisterController],
  providers: [CodeRegisterRepository],
})
export class CodeRegisterModule {}
