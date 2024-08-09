// src/infrastructure/http/modules/user.module.ts
import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { UserModel, UserSchema } from 'src/infrastructure/database/models/UserModel';
import { ConfigModel, ConfigSchema } from 'src/infrastructure/database/models/ConfigModel';
import { CodeRegisterModel, CodeRegisterSchema } from 'src/infrastructure/database/models/CodeRegisterSchema';
import { ResetCodeModel, ResetCodeSchema } from 'src/infrastructure/database/models/ResetCodeModel'; // Adicionado

import { UserService } from 'src/infrastructure/services/user.service';
import { UserController } from 'src/interface-adapters/controllers/user.controller';
import { UserRepository } from 'src/infrastructure/database/repositories/UserRepository';
import { ConfigService } from 'src/infrastructure/services/config.service';
import { ConfigRepository } from 'src/infrastructure/database/repositories/ConfigRepository';
import { CodeRegisterRepository } from 'src/infrastructure/database/repositories/CodeRegisterRepository';
import { ResetCodeRepository } from 'src/infrastructure/database/repositories/ResetCodeRepository'; // Adicionado

import { LogModule } from './log.module';
import { LoggingService } from 'src/infrastructure/services/logging.service';
import { UploadService } from 'src/infrastructure/services/upload.service';
import { DirectoryService } from 'src/infrastructure/services/directory.service';
import { NotificationService } from 'src/infrastructure/services/notification.service';
import { EmailService } from 'src/infrastructure/services/email.service';
import { TwilioService } from 'src/infrastructure/services/twilio.service';

// Importando os novos serviços
import { UserManagementService } from 'src/infrastructure/services/user-methods/user-management.service';
import { UserStatusService } from 'src/infrastructure/services/user-methods/user-status.service';
import { UserRetrievalService } from 'src/infrastructure/services/user-methods/user-retrieval.service';
import { UploadCleanerService } from 'src/infrastructure/services/checkAndCleanUploads';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: UserModel.modelName, schema: UserSchema },
      { name: ConfigModel.modelName, schema: ConfigSchema },
      { name: CodeRegisterModel.modelName, schema: CodeRegisterSchema },
      { name: ResetCodeModel.modelName, schema: ResetCodeSchema }, // Adicionado
    ]),
    LogModule,
  ],
  controllers: [UserController],
  providers: [
    UserService,
    UserManagementService,
    UserStatusService,
    UserRetrievalService,
    ConfigService,
    UploadService,
    DirectoryService,
    NotificationService,
    EmailService,
    TwilioService,
    { provide: 'IUserRepository', useClass: UserRepository },
    { provide: 'IConfigRepository', useClass: ConfigRepository },
    { provide: 'ICodeRegisterRepository', useClass: CodeRegisterRepository },
    { provide: 'IResetCodeRepository', useClass: ResetCodeRepository }, // Adicionado
    LoggingService,
    UploadCleanerService,
  ],
})
export class UserModule {}
