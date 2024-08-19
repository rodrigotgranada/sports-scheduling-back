import { Injectable, NotFoundException, InternalServerErrorException, Logger, ConflictException } from '@nestjs/common';
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
  private readonly logger = new Logger(UserManagementService.name);

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

    const smsResult = await this.notificationService.sendSms(user.phone, `Seu código de verificação é ${code}`);
    if (!smsResult.success) {
      this.logger.error(`Falha ao enviar código de verificação por SMS: ${smsResult.error}`);
      // Notificar o usuário sobre a falha de envio de SMS, mas continuar o processo
    }
  }

  async updateUser(
    id: string, 
    updateUserDto: UpdateUserDTO, 
    updatedBy: string, 
    file?: Express.Multer.File // O arquivo é opcional aqui também
  ): Promise<User> {
    const user = await this.userRepository.findUserById(id);
    if (!user) {
      throw new NotFoundException('Usuário não encontrado');
    }

    // Verificar se o telefone foi alterado
    if (updateUserDto.phone && updateUserDto.phone !== user.phone) {
      user.isActive = 'pending'; // Alterar status para pending
      user.phone = updateUserDto.phone; // Atualizar o telefone

      // Gerar e enviar novo código de ativação
      await this.regenerateActivationCode(user);
    }

    // Verifique se a senha foi alterada e, em caso afirmativo, criptografe a nova senha
    if (updateUserDto.password) {
      updateUserDto.password = await hash(updateUserDto.password, 8);
    }
  
    Object.assign(user, updateUserDto);
    user.updatedBy = updatedBy;
  
    if (file) {
      const photoUrl = await this.uploadService.uploadFile(file, user.id);
      user.foto = photoUrl;
    }
  
    try {
      return await this.userRepository.updateUser(user);
    } catch (error) {
      if (error.code === 11000 && error.message.includes('cpf')) {
        throw new ConflictException('O CPF informado já está em uso.');
      }
      throw new InternalServerErrorException('Erro ao atualizar o perfil.');
    }
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

    const notifications: string[] = [];

    const smsResult = await this.notificationService.sendSms(user.phone, `Seu código de redefinição de senha é ${code}`);
    if (!smsResult.success) {
      this.logger.error(`Falha ao enviar SMS: ${smsResult.error}`);
      notifications.push('SMS não enviado');
    }

    const emailResult = await this.notificationService.sendEmail(user.email, 'Código de Redefinição de Senha', `Seu código de redefinição de senha é ${code}`);
    if (!emailResult.success) {
      this.logger.error(`Falha ao enviar Email: ${emailResult.error}`);
      notifications.push('Email não enviado');
    }

    if (notifications.length > 0) {
      throw new InternalServerErrorException(`Código de redefinição gerado, mas falha ao enviar: ${notifications.join(', ')}`);
    }
  }

  private async generateAndSendActivationCode(user: User): Promise<void> {
    await this.deleteExistingCode(user.id);
    const code = Math.floor(100000 + Math.random() * 900000).toString();
    await this.codeRegisterRepository.createCodeRegister({
      userId: user.id,
      code,
    });

    const smsResult = await this.notificationService.sendSms(user.phone, `Seu código de verificação é ${code}`);
    if (!smsResult.success) {
      this.logger.error(`Erro ao enviar SMS: ${smsResult.error}`);
      // Notificar o usuário sobre a falha de envio de SMS, mas continuar o processo
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

  async updateUserProfilePhoto(userId: string, file: Express.Multer.File): Promise<User> {
    const user = await this.userRepository.findUserById(userId);
    if (!user) {
      throw new NotFoundException('Usuário não encontrado');
    }
  
    // Utilize o UploadService para armazenar a nova foto
    const photoUrl = await this.uploadService.uploadFile(file, userId);
    user.foto = photoUrl;
  
    return this.userRepository.updateUser(user);
  }
}
