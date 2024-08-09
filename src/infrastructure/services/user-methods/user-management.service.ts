// src/infrastructure/services/user-methods/user-management.service.ts
import { Injectable, NotFoundException, InternalServerErrorException } from '@nestjs/common';
import { IUserRepository } from 'src/domain/repositories/IUserRepository';
import { Inject } from '@nestjs/common';
import { CreateUserDTO } from 'src/interface-adapters/dtos/CreateUserDTO';
import { UpdateUserDTO } from 'src/interface-adapters/dtos/UpdateUserDTO';
import { hash } from 'bcryptjs';
import { User } from 'src/domain/entities/User';
import { UploadService } from 'src/infrastructure/services/upload.service';
import { ICodeRegisterRepository } from 'src/domain/repositories/ICodeRegisterRepository';
import { IResetCodeRepository } from 'src/domain/repositories/IResetCodeRepository';
import { NotificationService } from 'src/infrastructure/services/notification.service';

@Injectable()
export class UserManagementService {
  constructor(
    @Inject('IUserRepository') private readonly userRepository: IUserRepository,
    @Inject('ICodeRegisterRepository') private readonly codeRegisterRepository: ICodeRegisterRepository,
    @Inject('IResetCodeRepository') private readonly resetCodeRepository: IResetCodeRepository,
    private readonly uploadService: UploadService,
    private readonly notificationService: NotificationService,
  ) {}

  async createUser(createUserDto: CreateUserDTO, createdBy: string, file?: Express.Multer.File): Promise<User> {
    const hashedPassword = await hash(createUserDto.password, 8);

    const user = new User(
      '',
      createUserDto.firstName,
      createUserDto.lastName,
      createUserDto.cpf,
      createUserDto.phone,
      createUserDto.email,
      hashedPassword,
      createUserDto.isActive ?? 'pending',
      createUserDto.role ?? 'user',
      new Date(),
      new Date(),
      createdBy,
      createdBy,
      createUserDto.foto ?? ''
    );

    const createdUser = await this.userRepository.createUser(user);

    if (file) {
      const photoUrl = await this.uploadService.uploadFile(file, createdUser.id);
      createdUser.foto = photoUrl;
      await this.userRepository.updateUser(createdUser);
    }

    await this.generateAndSendActivationCode(createdUser);

    return createdUser;
  }

  async regenerateActivationCode(user: User): Promise<void> {
    await this.deleteExistingCode(user.id);
    const code = Math.floor(100000 + Math.random() * 900000).toString();
    await this.codeRegisterRepository.createCodeRegister({
      userId: user.id,
      code,
    });

    try {
      await this.notificationService.sendSms(user.phone, `Seu código de verificação é ${code}`);
    } catch (error) {
      console.error('Erro ao enviar SMS:', error.message);
      throw new InternalServerErrorException('Não foi possível enviar o código de verificação via SMS');
    }
  }

  async updateUser(id: string, updateUserDto: UpdateUserDTO, updatedBy: string): Promise<User> {
    const user = await this.userRepository.findUserById(id);
    if (!user) {
      throw new NotFoundException('Usuário não encontrado');
    }
    Object.assign(user, updateUserDto);
    user.updatedBy = updatedBy;
    return this.userRepository.updateUser(user);
  }

  async deleteUserById(id: string): Promise<void> {
    const user = await this.userRepository.findUserById(id);
    if (!user) {
      throw new NotFoundException('Usuário não encontrado');
    }
    await this.userRepository.deleteUserById(id);
  }

  async updateUserPassword(id: string, newPassword: string, updatedBy: string): Promise<User> {
    const user = await this.userRepository.findUserById(id);
    if (!user) {
      throw new NotFoundException('Usuário não encontrado');
    }
    const hashedPassword = await hash(newPassword, 8);
    user.password = hashedPassword;
    user.updatedBy = updatedBy;
    return this.userRepository.updateUser(user);
  }

  async sendResetPasswordCode(user: User): Promise<void> {
    await this.deleteExistingResetCode(user.id);
    const code = Math.floor(100000 + Math.random() * 900000).toString();
    await this.resetCodeRepository.createResetCode({
      userId: user.id,
      code,
    });

    const notifications: Promise<void>[] = [];

    if (user.phone) {
      notifications.push(
        this.notificationService.sendSms(user.phone, `Seu código de redefinição de senha é ${code}`)
      );
    }

    if (user.email) {
      notifications.push(
        this.notificationService.sendEmail(user.email, 'Código de Redefinição de Senha', `Seu código de redefinição de senha é ${code}`)
      );
    }

    try {
      await Promise.all(notifications);
    } catch (error) {
      console.error('Erro ao enviar código de redefinição de senha:', error.message);
      throw new InternalServerErrorException('Não foi possível enviar o código de redefinição via SMS ou Email');
    }
  }

  private async generateAndSendActivationCode(user: User): Promise<void> {
    await this.deleteExistingCode(user.id);
    const code = Math.floor(100000 + Math.random() * 900000).toString();
    await this.codeRegisterRepository.createCodeRegister({
      userId: user.id,
      code,
    });

    try {
      await this.notificationService.sendSms(user.phone, `Seu código de verificação é ${code}`);
    } catch (error) {
      console.error('Erro ao enviar SMS:', error.message);
      throw new InternalServerErrorException('Não foi possível enviar o código de verificação via SMS');
    }
  }

  private async deleteExistingCode(userId: string): Promise<void> {
    const existingCode = await this.codeRegisterRepository.findCodeByUserId(userId);
    if (existingCode) {
      await this.codeRegisterRepository.deleteCodeRegisterByUserId(userId);
    }
  }

  private async deleteExistingResetCode(userId: string): Promise<void> {
    const existingCode = await this.resetCodeRepository.findResetCodeByUserId(userId);
    if (existingCode) {
      await this.resetCodeRepository.deleteResetCodeByUserId(userId);
    }
  }
}
