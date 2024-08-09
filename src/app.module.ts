// src/app.module.ts
import { Module, MiddlewareConsumer, RequestMethod } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { AuthModule } from './infrastructure/http/modules/auth.module';
import { UserModule } from './infrastructure/http/modules/user.module';
import { CodeRegisterModule } from './infrastructure/http/modules/code-register.module';
import { EmailModule } from './infrastructure/http/modules/email.module';
import { TwilioModule } from './infrastructure/http/modules/twilio.module';
import { NotificationModule } from './infrastructure/http/modules/notification.module';
import { LogModule } from './infrastructure/http/modules/log.module';
import { ConfigModule as CustomConfigModule } from './infrastructure/http/modules/config.module'; 
import { ConfigController } from './interface-adapters/controllers/config.controller';
import { LogRequestMiddleware } from './common/middleware/log-request.middleware';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    MongooseModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => ({
        uri: configService.get<string>('MONGODB_URI'),
      }),
      inject: [ConfigService],
    }),
    AuthModule,
    UserModule,
    CodeRegisterModule,
    EmailModule,
    TwilioModule,
    NotificationModule,
    LogModule, // Novo módulo de logs
    CustomConfigModule,
  ],
  controllers: [ConfigController],
  providers: [],
})
export class AppModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(LogRequestMiddleware)
      .forRoutes({ path: '*', method: RequestMethod.ALL });
  }
}
