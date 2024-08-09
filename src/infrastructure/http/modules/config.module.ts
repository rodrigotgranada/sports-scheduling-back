// src/infrastructure/http/modules/config.module.ts
import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ConfigService } from 'src/infrastructure/services/config.service';
import { ConfigRepository } from 'src/infrastructure/database/repositories/ConfigRepository';
import { ConfigModel, ConfigSchema } from 'src/infrastructure/database/models/ConfigModel';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: ConfigModel.modelName, schema: ConfigSchema }]),
  ],
  providers: [
    ConfigService,
    { provide: 'IConfigRepository', useClass: ConfigRepository },
  ],
  exports: [ConfigService],
})
export class ConfigModule {}
