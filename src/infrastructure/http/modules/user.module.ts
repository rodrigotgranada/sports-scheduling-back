// src/infrastructure/http/modules/user.module.ts
import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { UserModel, UserSchema } from 'src/infrastructure/database/models/UserModel';
import { UserService } from 'src/infrastructure/services/user.service';
import { UserController } from 'src/interface-adapters/controllers/user.controller';
import { UserRepository } from 'src/infrastructure/database/repositories/UserRepository';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: UserModel.modelName, schema: UserSchema }]),
  ],
  controllers: [UserController],
  providers: [
    UserService,
    { provide: 'IUserRepository', useClass: UserRepository },
  ],
})
export class UserModule {}
