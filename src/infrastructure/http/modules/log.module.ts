import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { LogModel, LogSchema } from 'src/infrastructure/database/models/LogModel';
import { LoggingService } from 'src/infrastructure/services/logging.service';
import { LogController } from 'src/interface-adapters/controllers/log.controller';
import { LogRepository } from 'src/infrastructure/database/repositories/LogRepository';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: LogModel.modelName, schema: LogSchema }]),
  ],
  controllers: [LogController],
  providers: [
    LoggingService,
    { provide: 'ILogRepository', useClass: LogRepository },
  ],
  exports: [
    LoggingService,  // Exporte o LoggingService para uso em outros módulos
    { provide: 'ILogRepository', useClass: LogRepository },
  ],
})
export class LogModule {}
