import { Injectable, Inject, BadRequestException, InternalServerErrorException } from '@nestjs/common';
import { IUserRepository } from 'src/domain/repositories/IUserRepository';
import { ICodeRegisterRepository } from 'src/domain/repositories/ICodeRegisterRepository';
import { RegisterUserDTO } from 'src/interface-adapters/dtos/RegisterUserDTO';
import { hash } from 'bcryptjs';
import { User } from 'src/domain/entities/User';
import { NotificationService } from '../notification.service';
import { UploadService } from '../upload.service';
import { LoggingService } from '../logging.service';

@Injectable()
export class UserRegistrationService {
  constructor(
    @Inject('IUserRepository') private readonly userRepository: IUserRepository,
    @Inject('ICodeRegisterRepository') private readonly codeRegisterRepository: ICodeRegisterRepository,
    private readonly notificationService: NotificationService,
    private readonly uploadService: UploadService,
    private readonly loggingService: LoggingService,
  ) {}

  async register(registerUserDto: RegisterUserDTO, file: Express.Multer.File | null): Promise<{ user: User; message: string }> {
    console.log('Inicio do registro:', registerUserDto);
    try {
      // Verificações de existência de usuário (email, cpf, telefone)
      const existingUserByEmail = await this.userRepository.findUserByEmail(registerUserDto.email);
      if (existingUserByEmail) {
        throw new BadRequestException('Email já existe');
      }

      const existingUserByCPF = await this.userRepository.findUserByCPF(registerUserDto.cpf);
      if (existingUserByCPF) {
        throw new BadRequestException('CPF já existe');
      }

      const existingUserByPhone = await this.userRepository.findUserByPhone(registerUserDto.phone);
      if (existingUserByPhone) {
        throw new BadRequestException('Telefone já existe');
      }

      console.log('Criptografando a senha');
      const hashedPassword = await hash(registerUserDto.password, 8);
      const user = new User(
        '', // ID gerado pelo banco
        registerUserDto.firstName,
        registerUserDto.lastName,
        registerUserDto.cpf,
        registerUserDto.phone,
        registerUserDto.email,
        hashedPassword,
        'pending',
        'user',
        new Date(),
        new Date(),
        '', // createdBy será preenchido após a criação
        '', // updatedBy será preenchido após a criação
        '', // foto será preenchida após o upload
      );

      const createdUser = await this.userRepository.createUser(user);
      console.log('Usuário criado com sucesso:', createdUser);

      // Atualize os campos createdBy e updatedBy
      createdUser.createdBy = createdUser.id;
      createdUser.updatedBy = createdUser.id;

      if (file && file.mimetype.startsWith('image/')) {
        const photoUrl = await this.uploadService.uploadFile(file, createdUser.id);
        createdUser.foto = photoUrl;
      } else if (file) {
        throw new BadRequestException('Formato de arquivo inválido');
      }
    

      // Salve novamente para atualizar os campos createdBy, updatedBy e foto
      await this.userRepository.updateUser(createdUser);

      // Gerar código de verificação e salvar
      await this.deleteExistingCode(createdUser.id);
      const code = Math.floor(100000 + Math.random() * 900000).toString();
      await this.codeRegisterRepository.createCodeRegister({
        userId: createdUser.id,
        code,
      });

      try {
        await this.notificationService.sendSms(registerUserDto.phone, `Seu código de verificação é ${code}`);
        await this.loggingService.logActivity('createUser', createdUser.id, `Usuário ${createdUser.firstName} ${createdUser.lastName} registrado no sistema`);
        return { user: createdUser, message: 'Usuário registrado com sucesso. Código de verificação enviado via SMS.' };
      } catch (error) {
        await this.loggingService.logActivity('createUser', createdUser.id, `Usuário ${createdUser.firstName} ${createdUser.lastName} registrado no sistema. Código de verificação não enviado.`);
        return { user: createdUser, message: 'Usuário registrado com sucesso. Código de verificação não enviado. Verifique o telefone cadastrado.' };
      }
    } catch (error) {
      console.error('Erro durante o registro do usuário:', error);
      throw new InternalServerErrorException(error.message);
    }
  }

  private async deleteExistingCode(userId: string): Promise<void> {
    const existingCode = await this.codeRegisterRepository.findCodeByUserId(userId);
    if (existingCode) {
      await this.codeRegisterRepository.deleteCodeRegisterByUserId(userId);
    }
  }
}
