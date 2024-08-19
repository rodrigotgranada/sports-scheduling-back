import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { ConfigModule, ConfigService } from '@nestjs/config';

import { RegisterUserUseCase } from '../../../application/use-cases/auth/RegisterUserUseCase';
import { LoginUserUseCase } from '../../../application/use-cases/auth/LoginUserUseCase';
import { AuthController } from '../controllers/auth.controller';
import { AuthService } from 'src/infrastructure/services/auth.service';
import { UserModel, UserSchema } from 'src/infrastructure/database/models/UserModel';
import { CodeRegisterModel, CodeRegisterSchema } from 'src/infrastructure/database/models/CodeRegisterSchema';
import { ResetCodeModel, ResetCodeSchema } from 'src/infrastructure/database/models/ResetCodeModel';
import { UserRepository } from 'src/infrastructure/database/repositories/UserRepository';
import { CodeRegisterRepository } from 'src/infrastructure/database/repositories/CodeRegisterRepository';
import { ResetCodeRepository } from 'src/infrastructure/database/repositories/ResetCodeRepository';
import { NotificationService } from 'src/infrastructure/services/notification.service';
import { EmailService } from 'src/infrastructure/services/email.service';
import { TwilioService } from 'src/infrastructure/services/twilio.service';
import { JwtStrategy } from '../strategies/jwt.strategy';
import { UploadService } from 'src/infrastructure/services/upload.service';
import { DirectoryService } from 'src/infrastructure/services/directory.service';
import { UserRegistrationService } from 'src/infrastructure/services/auth-methods/user-registration.service';
import { AuthenticationService } from 'src/infrastructure/services/auth-methods/authentication.service';
import { PasswordResetService } from 'src/infrastructure/services/auth-methods/password-reset.service';
import { CodeService } from 'src/infrastructure/services/auth-methods/code.service';
import { LoggingService } from 'src/infrastructure/services/logging.service';
import { LogRepository } from 'src/infrastructure/database/repositories/LogRepository';
import { LogModel, LogSchema } from 'src/infrastructure/database/models/LogModel';
import { StatusGateway } from 'src/infrastructure/gateways/status.gateway';

@Module({
  imports: [
    PassportModule.register({ defaultStrategy: 'jwt' }),
    JwtModule.registerAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => ({
        secret: configService.get<string>(`${process.env.JWT_SECRET}`),
        signOptions: { expiresIn: '60m' },
      }),
      inject: [ConfigService],
    }),
    ConfigModule,
    MongooseModule.forFeature([
      { name: UserModel.modelName, schema: UserSchema },
      { name: CodeRegisterModel.modelName, schema: CodeRegisterSchema },
      { name: ResetCodeModel.modelName, schema: ResetCodeSchema },
      { name: LogModel.modelName, schema: LogSchema },
    ]),
  ],
  controllers: [AuthController],
  providers: [
    StatusGateway,
    AuthService,
    RegisterUserUseCase,
    LoginUserUseCase,
    { provide: 'IUserRepository', useClass: UserRepository },
    { provide: 'ICodeRegisterRepository', useClass: CodeRegisterRepository },
    { provide: 'IResetCodeRepository', useClass: ResetCodeRepository },
    NotificationService,
    EmailService,
    TwilioService,
    JwtStrategy,
    DirectoryService,
    UploadService,
    UserRegistrationService, // Adicione UserRegistrationService aqui
    AuthenticationService,   // Adicione AuthenticationService aqui
    PasswordResetService,    // Adicione PasswordResetService aqui
    CodeService,             // Adicione CodeService aqui
    LoggingService,          // Adicione LoggingService aqui
    { provide: 'ILogRepository', useClass: LogRepository }, // Adicione LogRepository aqui
  ],
  exports: [PassportModule, JwtModule],
})
export class AuthModule {}
